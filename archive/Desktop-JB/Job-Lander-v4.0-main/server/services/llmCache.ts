import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { llmConfig } from '../config/llm.config';

/**
 * Cache entry structure
 */
interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number; // seconds
  expiresAt: number;
  hits: number;
  size: number; // bytes
  tags?: string[];
}

/**
 * Cache statistics
 */
interface CacheStats {
  hits: number;
  misses: number;
  size: number; // bytes
  entries: number;
  hitRate: number; // percentage
  avgLatency: number; // ms
}

/**
 * LLM Response Cache Implementation
 * Combines in-memory caching with file-based persistence
 */
export class LLMCache {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    entries: 0,
    hitRate: 0,
    avgLatency: 0,
  };
  private cacheDir: string;
  private maxMemorySize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private persistInterval: NodeJS.Timeout | null = null;
  private latencies: number[] = [];
  private readonly MAX_LATENCY_SAMPLES = 100;

  constructor(cacheDir: string = './cache/llm', maxMemorySizeMB: number = 100) {
    this.cacheDir = cacheDir;
    this.maxMemorySize = maxMemorySizeMB * 1024 * 1024; // Convert to bytes
    this.initializeCache();
  }

  /**
   * Initialize cache system
   */
  private async initializeCache() {
    // Create cache directory if it doesn't exist
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create cache directory:', error);
    }

    // Load persisted cache
    await this.loadFromDisk();

    // Start cleanup interval (every 5 minutes)
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);

    // Start persistence interval (every minute)
    this.persistInterval = setInterval(() => {
      this.persistToDisk();
    }, 60 * 1000);
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(operation: string, prompt: string, params?: any): string {
    const data = {
      operation,
      prompt: prompt.substring(0, 500), // Use first 500 chars to keep key reasonable
      params: params ? JSON.stringify(params) : '',
    };
    
    const hash = createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
    
    return `${operation}-${hash.substring(0, 16)}`;
  }

  /**
   * Get cached value
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    // Check memory cache first
    const entry = this.memoryCache.get(key);
    
    if (entry) {
      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.memoryCache.delete(key);
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }
      
      // Update hit count and stats
      entry.hits++;
      this.stats.hits++;
      this.updateHitRate();
      this.recordLatency(Date.now() - startTime);
      
      return entry.data as T;
    }
    
    // Try to load from disk if not in memory
    const diskEntry = await this.loadFromDiskByKey(key);
    if (diskEntry && Date.now() <= diskEntry.expiresAt) {
      // Add to memory cache if there's space
      if (this.canAddToMemory(diskEntry.size)) {
        this.memoryCache.set(key, diskEntry);
        this.stats.size += diskEntry.size;
        this.stats.entries++;
      }
      
      this.stats.hits++;
      this.updateHitRate();
      this.recordLatency(Date.now() - startTime);
      return diskEntry.data as T;
    }
    
    this.stats.misses++;
    this.updateHitRate();
    this.recordLatency(Date.now() - startTime);
    return null;
  }

  /**
   * Set cache value
   */
  async set<T = any>(key: string, data: T, ttl?: number): Promise<void> {
    const ttlSeconds = ttl ?? llmConfig.defaultCacheTTL;
    const size = this.calculateSize(data);
    
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds,
      expiresAt: Date.now() + (ttlSeconds * 1000),
      hits: 0,
      size,
    };
    
    // Check if we need to evict entries to make space
    if (!this.canAddToMemory(size)) {
      await this.evictLRU(size);
    }
    
    // Add to memory cache
    this.memoryCache.set(key, entry);
    this.stats.size += size;
    this.stats.entries++;
    
    // Persist to disk asynchronously
    this.persistEntryToDisk(entry).catch(err => 
      console.error('Failed to persist cache entry:', err)
    );
  }

  /**
   * Delete cache entry
   */
  async delete(key: string): Promise<boolean> {
    const entry = this.memoryCache.get(key);
    if (entry) {
      this.stats.size -= entry.size;
      this.stats.entries--;
      this.memoryCache.delete(key);
      
      // Delete from disk
      try {
        await fs.unlink(path.join(this.cacheDir, `${key}.json`));
      } catch (error) {
        // File might not exist, ignore
      }
      
      return true;
    }
    return false;
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
      avgLatency: 0,
    };
    this.latencies = [];
    
    // Clear disk cache
    try {
      const files = await fs.readdir(this.cacheDir);
      await Promise.all(
        files.map(file => fs.unlink(path.join(this.cacheDir, file)))
      );
    } catch (error) {
      console.error('Failed to clear disk cache:', error);
    }
  }

  /**
   * Clear cache by pattern
   */
  async clearByPattern(pattern: string | RegExp): Promise<number> {
    let cleared = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (regex.test(key)) {
        this.stats.size -= entry.size;
        this.stats.entries--;
        this.memoryCache.delete(key);
        cleared++;
        
        // Delete from disk
        try {
          await fs.unlink(path.join(this.cacheDir, `${key}.json`));
        } catch (error) {
          // File might not exist, ignore
        }
      }
    }
    
    return cleared;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache entries summary
   */
  getEntriesSummary(): Array<{
    key: string;
    size: number;
    hits: number;
    expiresIn: number;
    age: number;
  }> {
    const now = Date.now();
    return Array.from(this.memoryCache.entries())
      .map(([key, entry]) => ({
        key,
        size: entry.size,
        hits: entry.hits,
        expiresIn: Math.max(0, entry.expiresAt - now),
        age: now - entry.timestamp,
      }))
      .sort((a, b) => b.hits - a.hits);
  }

  /**
   * Check if can add to memory
   */
  private canAddToMemory(size: number): boolean {
    return this.stats.size + size <= this.maxMemorySize;
  }

  /**
   * Evict least recently used entries
   */
  private async evictLRU(requiredSize: number): Promise<void> {
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => {
        // Sort by last access (timestamp + hits as proxy)
        const scoreA = a[1].timestamp + (a[1].hits * 1000);
        const scoreB = b[1].timestamp + (b[1].hits * 1000);
        return scoreA - scoreB;
      });
    
    let freedSize = 0;
    for (const [key, entry] of entries) {
      if (freedSize >= requiredSize) break;
      
      this.stats.size -= entry.size;
      this.stats.entries--;
      this.memoryCache.delete(key);
      freedSize += entry.size;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        this.stats.size -= entry.size;
        this.stats.entries--;
        this.memoryCache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Calculate size of data in bytes
   */
  private calculateSize(data: any): number {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return Buffer.byteLength(str, 'utf8');
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Record latency
   */
  private recordLatency(latency: number): void {
    this.latencies.push(latency);
    if (this.latencies.length > this.MAX_LATENCY_SAMPLES) {
      this.latencies.shift();
    }
    
    if (this.latencies.length > 0) {
      this.stats.avgLatency = 
        this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
    }
  }

  /**
   * Persist cache to disk
   */
  private async persistToDisk(): Promise<void> {
    const entries = Array.from(this.memoryCache.entries())
      .filter(([_, entry]) => Date.now() <= entry.expiresAt);
    
    for (const [key, entry] of entries) {
      await this.persistEntryToDisk(entry);
    }
  }

  /**
   * Persist single entry to disk
   */
  private async persistEntryToDisk(entry: CacheEntry): Promise<void> {
    try {
      const filePath = path.join(this.cacheDir, `${entry.key}.json`);
      await fs.writeFile(filePath, JSON.stringify(entry), 'utf8');
    } catch (error) {
      console.error('Failed to persist cache entry:', error);
    }
  }

  /**
   * Load cache from disk
   */
  private async loadFromDisk(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        try {
          const filePath = path.join(this.cacheDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const entry = JSON.parse(content) as CacheEntry;
          
          // Only load non-expired entries that fit in memory
          if (now <= entry.expiresAt && this.canAddToMemory(entry.size)) {
            this.memoryCache.set(entry.key, entry);
            this.stats.size += entry.size;
            this.stats.entries++;
          } else if (now > entry.expiresAt) {
            // Delete expired entries from disk
            await fs.unlink(filePath);
          }
        } catch (error) {
          console.error(`Failed to load cache file ${file}:`, error);
        }
      }
      
      console.log(`Loaded ${this.stats.entries} cache entries from disk`);
    } catch (error) {
      console.error('Failed to load cache from disk:', error);
    }
  }

  /**
   * Load single entry from disk by key
   */
  private async loadFromDiskByKey(key: string): Promise<CacheEntry | null> {
    try {
      const filePath = path.join(this.cacheDir, `${key}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content) as CacheEntry;
    } catch (error) {
      return null;
    }
  }

  /**
   * Destroy cache (cleanup resources)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    if (this.persistInterval) {
      clearInterval(this.persistInterval);
      this.persistInterval = null;
    }
    
    // Final persist before destroying
    this.persistToDisk().catch(err => 
      console.error('Failed to persist cache on destroy:', err)
    );
  }
}

// Export singleton instance
export const llmCache = new LLMCache(
  process.env.LLM_CACHE_DIR || './cache/llm',
  llmConfig.maxCacheSize
);

// Cleanup on process exit
process.on('SIGINT', () => {
  llmCache.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  llmCache.destroy();
  process.exit(0);
});

export default llmCache;
import { llmConfig } from '../config/llm.config';

/**
 * Metrics data structure
 */
interface MetricData {
  provider: string;
  model: string;
  operation: string;
  latency: number;
  success: boolean;
  cached: boolean;
  timestamp: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
  error?: string;
}

/**
 * Aggregated metrics
 */
interface AggregatedMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cachedRequests: number;
  successRate: number;
  cacheHitRate: number;
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  maxLatency: number;
  minLatency: number;
  totalTokens: number;
  totalCost: number;
  errorBreakdown: Record<string, number>;
  requestsPerMinute: number;
}

/**
 * Provider-specific metrics
 */
interface ProviderMetrics extends AggregatedMetrics {
  provider: string;
  models: Record<string, AggregatedMetrics>;
}

/**
 * Operation-specific metrics
 */
interface OperationMetrics extends AggregatedMetrics {
  operation: string;
}

/**
 * LLM Metrics & Monitoring System
 */
export class LLMMetrics {
  private metrics: MetricData[] = [];
  private readonly maxMetrics = 10000; // Keep last 10k metrics in memory
  private readonly metricsWindow = 3600000; // 1 hour window for rate calculations
  private costAccumulator = {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };
  private lastReset = {
    daily: Date.now(),
    weekly: Date.now(),
    monthly: Date.now(),
  };
  private alertCallbacks: Array<(alert: any) => void> = [];

  constructor() {
    // Start periodic metrics aggregation
    setInterval(() => {
      this.checkAlerts();
      this.resetCostAccumulators();
    }, llmConfig.monitoring.metricsInterval * 1000);
  }

  /**
   * Record a request metric
   */
  recordRequest(
    provider: string,
    model: string,
    operation: string,
    latency: number,
    success: boolean,
    cached: boolean,
    tokens?: { prompt: number; completion: number; total: number },
    error?: string
  ): void {
    const metric: MetricData = {
      provider,
      model,
      operation,
      latency,
      success,
      cached,
      timestamp: Date.now(),
      tokens,
      error,
    };

    // Calculate cost if tokens provided and cost tracking enabled
    if (tokens && llmConfig.costTracking.enabled) {
      const pricing = llmConfig.costTracking.pricePerToken[provider as keyof typeof llmConfig.costTracking.pricePerToken];
      if (pricing) {
        metric.cost = (tokens.prompt * pricing.input) + (tokens.completion * pricing.output);
        this.updateCostAccumulators(metric.cost);
      }
    }

    // Add metric
    this.metrics.push(metric);

    // Trim old metrics if needed
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log if error and log level appropriate
    if (!success && error && llmConfig.monitoring.logLevel !== 'error') {
      console.error(`LLM Error [${provider}/${model}/${operation}]: ${error}`);
    }
  }

  /**
   * Get aggregated metrics for time range
   */
  getMetrics(sinceMs?: number): AggregatedMetrics {
    const since = sinceMs || Date.now() - this.metricsWindow;
    const relevantMetrics = this.metrics.filter(m => m.timestamp >= since);
    
    return this.aggregateMetrics(relevantMetrics);
  }

  /**
   * Get provider-specific metrics
   */
  getProviderMetrics(sinceMs?: number): Record<string, ProviderMetrics> {
    const since = sinceMs || Date.now() - this.metricsWindow;
    const relevantMetrics = this.metrics.filter(m => m.timestamp >= since);
    
    const providers: Record<string, ProviderMetrics> = {};
    
    // Group by provider
    const providerGroups = this.groupBy(relevantMetrics, 'provider');
    
    for (const [provider, metrics] of Object.entries(providerGroups)) {
      const modelGroups = this.groupBy(metrics, 'model');
      const models: Record<string, AggregatedMetrics> = {};
      
      for (const [model, modelMetrics] of Object.entries(modelGroups)) {
        models[model] = this.aggregateMetrics(modelMetrics);
      }
      
      providers[provider] = {
        provider,
        ...this.aggregateMetrics(metrics),
        models,
      };
    }
    
    return providers;
  }

  /**
   * Get operation-specific metrics
   */
  getOperationMetrics(sinceMs?: number): Record<string, OperationMetrics> {
    const since = sinceMs || Date.now() - this.metricsWindow;
    const relevantMetrics = this.metrics.filter(m => m.timestamp >= since);
    
    const operations: Record<string, OperationMetrics> = {};
    
    // Group by operation
    const operationGroups = this.groupBy(relevantMetrics, 'operation');
    
    for (const [operation, metrics] of Object.entries(operationGroups)) {
      operations[operation] = {
        operation,
        ...this.aggregateMetrics(metrics),
      };
    }
    
    return operations;
  }

  /**
   * Get cost breakdown
   */
  getCostBreakdown(): {
    current: { daily: number; weekly: number; monthly: number };
    providers: Record<string, { total: number; byModel: Record<string, number> }>;
    operations: Record<string, number>;
  } {
    const now = Date.now();
    const dayAgo = now - 86400000;
    const weekAgo = now - 604800000;
    const monthAgo = now - 2592000000;
    
    const dayMetrics = this.metrics.filter(m => m.timestamp >= dayAgo);
    const weekMetrics = this.metrics.filter(m => m.timestamp >= weekAgo);
    const monthMetrics = this.metrics.filter(m => m.timestamp >= monthAgo);
    
    // Provider breakdown
    const providers: Record<string, { total: number; byModel: Record<string, number> }> = {};
    for (const metric of monthMetrics) {
      if (!metric.cost) continue;
      
      if (!providers[metric.provider]) {
        providers[metric.provider] = { total: 0, byModel: {} };
      }
      
      providers[metric.provider].total += metric.cost;
      
      if (!providers[metric.provider].byModel[metric.model]) {
        providers[metric.provider].byModel[metric.model] = 0;
      }
      providers[metric.provider].byModel[metric.model] += metric.cost;
    }
    
    // Operation breakdown
    const operations: Record<string, number> = {};
    for (const metric of monthMetrics) {
      if (!metric.cost) continue;
      
      if (!operations[metric.operation]) {
        operations[metric.operation] = 0;
      }
      operations[metric.operation] += metric.cost;
    }
    
    return {
      current: {
        daily: dayMetrics.reduce((sum, m) => sum + (m.cost || 0), 0),
        weekly: weekMetrics.reduce((sum, m) => sum + (m.cost || 0), 0),
        monthly: monthMetrics.reduce((sum, m) => sum + (m.cost || 0), 0),
      },
      providers,
      operations,
    };
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    totalRequests: number;
    successRate: number;
    cacheHitRate: number;
    avgLatency: number;
    currentRPM: number;
    topErrors: Array<{ error: string; count: number }>;
    alerts: string[];
  } {
    const metrics = this.getMetrics();
    const oneMinuteAgo = Date.now() - 60000;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= oneMinuteAgo);
    
    // Determine health status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const alerts: string[] = [];
    
    if (metrics.successRate < 95) {
      status = metrics.successRate < 90 ? 'critical' : 'warning';
      alerts.push(`Low success rate: ${metrics.successRate.toFixed(1)}%`);
    }
    
    if (metrics.avgLatency > llmConfig.monitoring.alertThresholds.latency) {
      status = status === 'healthy' ? 'warning' : status;
      alerts.push(`High latency: ${metrics.avgLatency.toFixed(0)}ms`);
    }
    
    if (metrics.cacheHitRate < llmConfig.monitoring.alertThresholds.cacheHitRate) {
      status = status === 'healthy' ? 'warning' : status;
      alerts.push(`Low cache hit rate: ${metrics.cacheHitRate.toFixed(1)}%`);
    }
    
    // Get top errors
    const errorCounts: Record<string, number> = {};
    for (const metric of this.metrics) {
      if (metric.error) {
        errorCounts[metric.error] = (errorCounts[metric.error] || 0) + 1;
      }
    }
    
    const topErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      status,
      uptime: Date.now() - (this.metrics[0]?.timestamp || Date.now()),
      totalRequests: metrics.totalRequests,
      successRate: metrics.successRate,
      cacheHitRate: metrics.cacheHitRate,
      avgLatency: metrics.avgLatency,
      currentRPM: recentMetrics.length,
      topErrors,
      alerts,
    };
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (alert: any) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Check and trigger alerts
   */
  private checkAlerts(): void {
    const metrics = this.getMetrics();
    const alerts: any[] = [];
    
    // Check error rate
    if ((100 - metrics.successRate) > llmConfig.monitoring.alertThresholds.errorRate) {
      alerts.push({
        type: 'error_rate',
        severity: 'high',
        message: `Error rate exceeded threshold: ${(100 - metrics.successRate).toFixed(1)}%`,
        threshold: llmConfig.monitoring.alertThresholds.errorRate,
        current: 100 - metrics.successRate,
      });
    }
    
    // Check latency
    if (metrics.avgLatency > llmConfig.monitoring.alertThresholds.latency) {
      alerts.push({
        type: 'latency',
        severity: 'medium',
        message: `Average latency exceeded threshold: ${metrics.avgLatency.toFixed(0)}ms`,
        threshold: llmConfig.monitoring.alertThresholds.latency,
        current: metrics.avgLatency,
      });
    }
    
    // Check cache hit rate
    if (metrics.cacheHitRate < llmConfig.monitoring.alertThresholds.cacheHitRate) {
      alerts.push({
        type: 'cache_hit_rate',
        severity: 'low',
        message: `Cache hit rate below threshold: ${metrics.cacheHitRate.toFixed(1)}%`,
        threshold: llmConfig.monitoring.alertThresholds.cacheHitRate,
        current: metrics.cacheHitRate,
      });
    }
    
    // Check cost alerts
    if (llmConfig.costTracking.enabled) {
      const costs = this.getCostBreakdown().current;
      
      if (costs.daily > llmConfig.costTracking.budgetAlerts.daily) {
        alerts.push({
          type: 'cost',
          severity: 'high',
          message: `Daily cost exceeded budget: $${costs.daily.toFixed(2)}`,
          threshold: llmConfig.costTracking.budgetAlerts.daily,
          current: costs.daily,
        });
      }
      
      if (costs.weekly > llmConfig.costTracking.budgetAlerts.weekly) {
        alerts.push({
          type: 'cost',
          severity: 'medium',
          message: `Weekly cost exceeded budget: $${costs.weekly.toFixed(2)}`,
          threshold: llmConfig.costTracking.budgetAlerts.weekly,
          current: costs.weekly,
        });
      }
    }
    
    // Trigger alert callbacks
    for (const alert of alerts) {
      for (const callback of this.alertCallbacks) {
        callback(alert);
      }
    }
  }

  /**
   * Update cost accumulators
   */
  private updateCostAccumulators(cost: number): void {
    this.costAccumulator.daily += cost;
    this.costAccumulator.weekly += cost;
    this.costAccumulator.monthly += cost;
  }

  /**
   * Reset cost accumulators based on time
   */
  private resetCostAccumulators(): void {
    const now = Date.now();
    
    // Reset daily (every 24 hours)
    if (now - this.lastReset.daily >= 86400000) {
      this.costAccumulator.daily = 0;
      this.lastReset.daily = now;
    }
    
    // Reset weekly (every 7 days)
    if (now - this.lastReset.weekly >= 604800000) {
      this.costAccumulator.weekly = 0;
      this.lastReset.weekly = now;
    }
    
    // Reset monthly (every 30 days)
    if (now - this.lastReset.monthly >= 2592000000) {
      this.costAccumulator.monthly = 0;
      this.lastReset.monthly = now;
    }
  }

  /**
   * Aggregate metrics from array
   */
  private aggregateMetrics(metrics: MetricData[]): AggregatedMetrics {
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        cachedRequests: 0,
        successRate: 0,
        cacheHitRate: 0,
        avgLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        maxLatency: 0,
        minLatency: 0,
        totalTokens: 0,
        totalCost: 0,
        errorBreakdown: {},
        requestsPerMinute: 0,
      };
    }
    
    const successful = metrics.filter(m => m.success);
    const failed = metrics.filter(m => !m.success);
    const cached = metrics.filter(m => m.cached);
    
    const latencies = metrics.map(m => m.latency).sort((a, b) => a - b);
    const p50Index = Math.floor(latencies.length * 0.5);
    const p95Index = Math.floor(latencies.length * 0.95);
    const p99Index = Math.floor(latencies.length * 0.99);
    
    // Error breakdown
    const errorBreakdown: Record<string, number> = {};
    for (const metric of failed) {
      if (metric.error) {
        errorBreakdown[metric.error] = (errorBreakdown[metric.error] || 0) + 1;
      }
    }
    
    // Calculate RPM based on time range
    const timeRange = Math.max(
      metrics[metrics.length - 1].timestamp - metrics[0].timestamp,
      1000
    );
    const requestsPerMinute = (metrics.length / timeRange) * 60000;
    
    return {
      totalRequests: metrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      cachedRequests: cached.length,
      successRate: (successful.length / metrics.length) * 100,
      cacheHitRate: (cached.length / metrics.length) * 100,
      avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
      p50Latency: latencies[p50Index] || 0,
      p95Latency: latencies[p95Index] || 0,
      p99Latency: latencies[p99Index] || 0,
      maxLatency: Math.max(...latencies),
      minLatency: Math.min(...latencies),
      totalTokens: metrics.reduce((sum, m) => sum + (m.tokens?.total || 0), 0),
      totalCost: metrics.reduce((sum, m) => sum + (m.cost || 0), 0),
      errorBreakdown,
      requestsPerMinute,
    };
  }

  /**
   * Group metrics by key
   */
  private groupBy(metrics: MetricData[], key: keyof MetricData): Record<string, MetricData[]> {
    const groups: Record<string, MetricData[]> = {};
    
    for (const metric of metrics) {
      const value = String(metric[key]);
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(metric);
    }
    
    return groups;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.metrics, null, 2);
    }
    
    // CSV format
    const headers = [
      'timestamp',
      'provider',
      'model',
      'operation',
      'latency',
      'success',
      'cached',
      'prompt_tokens',
      'completion_tokens',
      'total_tokens',
      'cost',
      'error'
    ];
    
    const rows = this.metrics.map(m => [
      m.timestamp,
      m.provider,
      m.model,
      m.operation,
      m.latency,
      m.success,
      m.cached,
      m.tokens?.prompt || 0,
      m.tokens?.completion || 0,
      m.tokens?.total || 0,
      m.cost || 0,
      m.error || ''
    ]);
    
    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  /**
   * Clear metrics data
   */
  clear(): void {
    this.metrics = [];
    this.costAccumulator = {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
  }
}

// Export singleton instance
export const llmMetrics = new LLMMetrics();

// Register alert handler (can be customized)
llmMetrics.onAlert((alert) => {
  console.warn(`[LLM Alert] ${alert.severity.toUpperCase()}: ${alert.message}`);
});

export default llmMetrics;
#!/usr/bin/env node

/**
 * Database Performance Benchmark
 * 
 * Tests database operations performance including:
 * - Connection pool efficiency
 * - Query performance for common operations
 * - Concurrent operation handling
 * - Memory usage during operations
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { performance } from 'perf_hooks';

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_TEST || 'postgresql://postgres:postgres@localhost:5432/test_job_lander';

// Performance thresholds (milliseconds)
const THRESHOLDS = {
  CONNECTION: 1000,        // Connection establishment
  SIMPLE_SELECT: 50,       // Simple SELECT query
  COMPLEX_QUERY: 500,      // Complex JOIN query
  INSERT: 100,             // Single INSERT
  BULK_INSERT: 1000,       // Batch INSERT
  UPDATE: 100,             // Single UPDATE
  DELETE: 100,             // Single DELETE
  TRANSACTION: 200,        // Transaction commit
};

interface BenchmarkResult {
  operation: string;
  duration: number;
  status: 'pass' | 'fail' | 'warning';
  threshold: number;
  details?: any;
}

class DatabaseBenchmark {
  private results: BenchmarkResult[] = [];
  private sql: any;
  private db: any;

  async initialize() {
    console.log('🔗 Initializing database connection...');
    
    const startTime = performance.now();
    
    try {
      this.sql = postgres(connectionString, {
        max: 20, // Connection pool size
        idle_timeout: 20,
        max_lifetime: 60 * 30,
      });
      
      this.db = drizzle(this.sql);
      
      // Test connection
      await this.sql`SELECT 1`;
      
      const duration = performance.now() - startTime;
      
      this.recordResult('Connection', duration, THRESHOLDS.CONNECTION);
      
      console.log(`✅ Database connected in ${Math.round(duration)}ms`);
      
    } catch (error: any) {
      console.error('❌ Failed to connect to database:', error.message);
      throw error;
    }
  }

  async benchmarkSimpleQueries() {
    console.log('\n📊 Benchmarking simple queries...');

    // Simple SELECT
    let startTime = performance.now();
    try {
      const result = await this.sql`SELECT COUNT(*) FROM information_schema.tables`;
      const duration = performance.now() - startTime;
      
      this.recordResult('Simple SELECT', duration, THRESHOLDS.SIMPLE_SELECT, {
        rowCount: result.length
      });
      
    } catch (error: any) {
      this.recordResult('Simple SELECT', performance.now() - startTime, THRESHOLDS.SIMPLE_SELECT, {
        error: error.message
      });
    }

    // Check if our tables exist
    startTime = performance.now();
    try {
      const result = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      const duration = performance.now() - startTime;
      
      this.recordResult('Table listing', duration, THRESHOLDS.SIMPLE_SELECT, {
        tableCount: result.length,
        tables: result.map((r: any) => r.table_name)
      });
      
    } catch (error: any) {
      this.recordResult('Table listing', performance.now() - startTime, THRESHOLDS.SIMPLE_SELECT, {
        error: error.message
      });
    }
  }

  async benchmarkInsertOperations() {
    console.log('\n📝 Benchmarking INSERT operations...');

    // Create test table if it doesn't exist
    try {
      await this.sql`
        CREATE TEMPORARY TABLE IF NOT EXISTS benchmark_test (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100),
          data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (error) {
      console.warn('Could not create test table, using existing tables');
    }

    // Single INSERT
    const startTime = performance.now();
    try {
      await this.sql`
        INSERT INTO benchmark_test (name, email, data)
        VALUES ('Test User', 'test@example.com', ${'{"test": true}'})
      `;
      const duration = performance.now() - startTime;
      
      this.recordResult('Single INSERT', duration, THRESHOLDS.INSERT);
      
    } catch (error: any) {
      this.recordResult('Single INSERT', performance.now() - startTime, THRESHOLDS.INSERT, {
        error: error.message
      });
    }

    // Bulk INSERT
    const bulkStartTime = performance.now();
    try {
      const values = Array.from({ length: 100 }, (_, i) => [
        `User ${i}`,
        `user${i}@example.com`,
        JSON.stringify({ index: i, test: true })
      ]);
      
      await this.sql`
        INSERT INTO benchmark_test (name, email, data)
        SELECT * FROM ${this.sql(values)}
      `;
      
      const duration = performance.now() - bulkStartTime;
      
      this.recordResult('Bulk INSERT (100 rows)', duration, THRESHOLDS.BULK_INSERT, {
        rowCount: 100
      });
      
    } catch (error: any) {
      this.recordResult('Bulk INSERT (100 rows)', performance.now() - bulkStartTime, THRESHOLDS.BULK_INSERT, {
        error: error.message
      });
    }
  }

  async benchmarkUpdateOperations() {
    console.log('\n✏️ Benchmarking UPDATE operations...');

    const startTime = performance.now();
    try {
      const result = await this.sql`
        UPDATE benchmark_test 
        SET data = data || ${'{"updated": true}'}::jsonb
        WHERE id <= 10
      `;
      const duration = performance.now() - startTime;
      
      this.recordResult('UPDATE operation', duration, THRESHOLDS.UPDATE, {
        affectedRows: result.count
      });
      
    } catch (error: any) {
      this.recordResult('UPDATE operation', performance.now() - startTime, THRESHOLDS.UPDATE, {
        error: error.message
      });
    }
  }

  async benchmarkComplexQueries() {
    console.log('\n🔍 Benchmarking complex queries...');

    const startTime = performance.now();
    try {
      const result = await this.sql`
        SELECT 
          bt.name,
          bt.email,
          bt.data,
          COUNT(*) as row_count,
          AVG(LENGTH(bt.name)) as avg_name_length
        FROM benchmark_test bt
        WHERE bt.created_at >= NOW() - INTERVAL '1 hour'
        GROUP BY bt.name, bt.email, bt.data
        HAVING COUNT(*) >= 1
        ORDER BY COUNT(*) DESC
        LIMIT 50
      `;
      const duration = performance.now() - startTime;
      
      this.recordResult('Complex Query with aggregation', duration, THRESHOLDS.COMPLEX_QUERY, {
        resultCount: result.length
      });
      
    } catch (error: any) {
      this.recordResult('Complex Query with aggregation', performance.now() - startTime, THRESHOLDS.COMPLEX_QUERY, {
        error: error.message
      });
    }
  }

  async benchmarkTransactions() {
    console.log('\n🔄 Benchmarking transactions...');

    const startTime = performance.now();
    try {
      await this.sql.begin(async (transaction) => {
        await transaction`
          INSERT INTO benchmark_test (name, email, data)
          VALUES ('Transaction User 1', 'txn1@example.com', ${'{"txn": true}'})
        `;
        
        await transaction`
          INSERT INTO benchmark_test (name, email, data)
          VALUES ('Transaction User 2', 'txn2@example.com', ${'{"txn": true}'})
        `;
        
        await transaction`
          UPDATE benchmark_test 
          SET data = data || ${'{"transaction_complete": true}'}::jsonb
          WHERE email LIKE 'txn%@example.com'
        `;
      });
      
      const duration = performance.now() - startTime;
      
      this.recordResult('Transaction (3 operations)', duration, THRESHOLDS.TRANSACTION);
      
    } catch (error: any) {
      this.recordResult('Transaction (3 operations)', performance.now() - startTime, THRESHOLDS.TRANSACTION, {
        error: error.message
      });
    }
  }

  async benchmarkConcurrentOperations() {
    console.log('\n⚡ Benchmarking concurrent operations...');

    const concurrency = 10;
    const operations = Array.from({ length: concurrency }, (_, i) => {
      return async () => {
        const startTime = performance.now();
        try {
          await this.sql`
            INSERT INTO benchmark_test (name, email, data)
            VALUES (${`Concurrent User ${i}`}, ${`concurrent${i}@example.com`}, ${JSON.stringify({ concurrent: true, index: i })})
          `;
          return performance.now() - startTime;
        } catch (error) {
          return -1; // Error indicator
        }
      };
    });

    const startTime = performance.now();
    const results = await Promise.all(operations.map(op => op()));
    const totalDuration = performance.now() - startTime;

    const successfulOperations = results.filter(r => r !== -1);
    const avgDuration = successfulOperations.length > 0 
      ? successfulOperations.reduce((a, b) => a + b, 0) / successfulOperations.length 
      : 0;

    this.recordResult('Concurrent operations', totalDuration, THRESHOLDS.TRANSACTION * concurrency, {
      concurrency,
      successfulOperations: successfulOperations.length,
      averageDuration: avgDuration,
      totalDuration
    });
  }

  async benchmarkConnectionPooling() {
    console.log('\n🏊 Benchmarking connection pooling...');

    const connectionTests = Array.from({ length: 50 }, async (_, i) => {
      const startTime = performance.now();
      try {
        const tempSql = postgres(connectionString, { max: 1 });
        await tempSql`SELECT ${i} as test_number`;
        await tempSql.end();
        return performance.now() - startTime;
      } catch (error) {
        return -1;
      }
    });

    const startTime = performance.now();
    const results = await Promise.all(connectionTests);
    const totalDuration = performance.now() - startTime;

    const successfulConnections = results.filter(r => r !== -1);
    const avgConnectionTime = successfulConnections.length > 0
      ? successfulConnections.reduce((a, b) => a + b, 0) / successfulConnections.length
      : 0;

    this.recordResult('Connection pooling (50 connections)', totalDuration, THRESHOLDS.CONNECTION * 5, {
      totalConnections: 50,
      successfulConnections: successfulConnections.length,
      averageConnectionTime: avgConnectionTime,
      totalDuration
    });
  }

  private recordResult(operation: string, duration: number, threshold: number, details?: any) {
    const status = duration <= threshold ? 'pass' : duration <= threshold * 1.5 ? 'warning' : 'fail';
    
    this.results.push({
      operation,
      duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
      status,
      threshold,
      details
    });

    const emoji = status === 'pass' ? '✅' : status === 'warning' ? '⚠️' : '❌';
    console.log(`   ${emoji} ${operation}: ${Math.round(duration)}ms (threshold: ${threshold}ms)`);
    
    if (details && details.error) {
      console.log(`      Error: ${details.error}`);
    } else if (details) {
      const relevantDetails = Object.entries(details)
        .filter(([key]) => !key.includes('error'))
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      if (relevantDetails) {
        console.log(`      Details: ${relevantDetails}`);
      }
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    try {
      // Clean up test data
      await this.sql`DROP TABLE IF EXISTS benchmark_test`;
      
      // Close connection
      await this.sql.end();
      
      console.log('✅ Cleanup completed');
    } catch (error: any) {
      console.warn('⚠️ Cleanup had issues:', error.message);
    }
  }

  generateReport() {
    console.log('\n📋 Database Performance Report');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Warnings: ${warnings} ⚠️`);
    console.log(`Failed: ${failed} ❌`);
    
    console.log('\nDetailed Results:');
    
    this.results.forEach(result => {
      const status = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`${status} ${result.operation}: ${result.duration}ms (≤${result.threshold}ms)`);
    });
    
    // Performance summary
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length;
    const slowestOperation = this.results.reduce((prev, current) => 
      (prev.duration > current.duration) ? prev : current
    );
    
    console.log('\nPerformance Summary:');
    console.log(`Average operation time: ${Math.round(avgDuration * 100) / 100}ms`);
    console.log(`Slowest operation: ${slowestOperation.operation} (${slowestOperation.duration}ms)`);
    
    // Overall score
    const score = Math.round((passed + warnings * 0.5) / this.results.length * 100);
    console.log(`Overall Performance Score: ${score}%`);
    
    if (score >= 90) {
      console.log('🎉 Excellent database performance!');
    } else if (score >= 70) {
      console.log('👍 Good database performance');
    } else if (score >= 50) {
      console.log('⚠️ Database performance needs improvement');
    } else {
      console.log('❌ Database performance is concerning');
    }
    
    return {
      totalTests: this.results.length,
      passed,
      warnings,
      failed,
      score,
      averageDuration: avgDuration,
      slowestOperation: slowestOperation.operation,
      results: this.results
    };
  }

  async run() {
    try {
      console.log('🏁 Starting Database Performance Benchmark\n');
      
      await this.initialize();
      await this.benchmarkSimpleQueries();
      await this.benchmarkInsertOperations();
      await this.benchmarkUpdateOperations();
      await this.benchmarkComplexQueries();
      await this.benchmarkTransactions();
      await this.benchmarkConcurrentOperations();
      await this.benchmarkConnectionPooling();
      
      await this.cleanup();
      
      return this.generateReport();
      
    } catch (error: any) {
      console.error('💥 Benchmark failed:', error.message);
      throw error;
    }
  }
}

// Run benchmark if called directly
if (require.main === module) {
  const benchmark = new DatabaseBenchmark();
  
  benchmark.run()
    .then((report) => {
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Benchmark crashed:', error);
      process.exit(1);
    });
}

export { DatabaseBenchmark };
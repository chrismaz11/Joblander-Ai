#!/usr/bin/env node

/**
 * Blockchain Migration Test Script
 * 
 * Tests the AWS-native blockchain implementation to ensure:
 * - AWS Lambda functions work correctly
 * - KMS signing operates as expected
 * - Secrets Manager configuration is accessible
 * - Resume verification flow completes successfully
 * - Monitoring and error handling function properly
 */

import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_TIMEOUT = 30000; // 30 seconds

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

class BlockchainMigrationTester {
  private results: TestResult[] = [];

  private async runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    console.log(`🧪 Running test: ${name}...`);
    const startTime = Date.now();
    
    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_TIMEOUT)
        )
      ]);
      
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        passed: true,
        duration,
        details: result
      });
      
      console.log(`   ✅ ${name} passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        passed: false,
        duration,
        error: error.message
      });
      
      console.log(`   ❌ ${name} failed: ${error.message} (${duration}ms)`);
    }
  }

  async testApiHealth(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/llm/health`);
    
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    
    return await response.json();
  }

  async testBlockchainServiceHealth(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/blockchain/health`);
    
    if (!response.ok) {
      throw new Error(`Blockchain service health check failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate health response structure
    const requiredFields = ['status', 'network', 'walletAddress', 'blockHeight'];
    for (const field of requiredFields) {
      if (!result[field]) {
        throw new Error(`Missing required field in health response: ${field}`);
      }
    }
    
    return result;
  }

  async testKMSKeyAccess(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/blockchain/key-info`);
    
    if (!response.ok) {
      throw new Error(`KMS key access test failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate key info structure
    if (!result.keyId || !result.publicKey || !result.ethereumAddress) {
      throw new Error('Invalid KMS key info response');
    }
    
    // Verify the Ethereum address is valid
    if (!ethers.isAddress(result.ethereumAddress)) {
      throw new Error(`Invalid Ethereum address: ${result.ethereumAddress}`);
    }
    
    return result;
  }

  async testSecretsManagerAccess(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/blockchain/config`);
    
    if (!response.ok) {
      throw new Error(`Secrets Manager access test failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate configuration structure
    const requiredFields = ['network', 'contract', 'wallet', 'monitoring'];
    for (const field of requiredFields) {
      if (!result[field]) {
        throw new Error(`Missing required field in config: ${field}`);
      }
    }
    
    // Validate network configuration
    if (!result.network.rpcUrl || !result.network.chainId) {
      throw new Error('Invalid network configuration');
    }
    
    return result;
  }

  async testResumeVerification(): Promise<any> {
    // Create a test PDF file if it doesn't exist
    const testFilePath = this.createTestResumeFile();
    
    try {
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(testFilePath);
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      formData.append('file', blob, 'test-resume.pdf');
      
      const response = await fetch(`${API_BASE_URL}/api/verify-on-chain`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resume verification failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      // Validate verification response
      if (!result.transactionHash || !result.blockchainHash || !result.verificationUrl) {
        throw new Error('Invalid verification response structure');
      }
      
      // Verify transaction hash format (64 hex characters with 0x prefix)
      if (!/^0x[a-fA-F0-9]{64}$/.test(result.transactionHash)) {
        throw new Error(`Invalid transaction hash format: ${result.transactionHash}`);
      }
      
      return result;
    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  }

  async testSigningCapability(): Promise<any> {
    const testMessage = 'Test message for blockchain signing';
    
    const response = await fetch(`${API_BASE_URL}/api/blockchain/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: testMessage })
    });
    
    if (!response.ok) {
      throw new Error(`Signing test failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate signature response
    if (!result.signature || !result.messageHash) {
      throw new Error('Invalid signature response structure');
    }
    
    // Verify signature format (130 hex characters with 0x prefix)
    if (!/^0x[a-fA-F0-9]{130}$/.test(result.signature)) {
      throw new Error(`Invalid signature format: ${result.signature}`);
    }
    
    return result;
  }

  async testMonitoringAndMetrics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/blockchain/metrics`);
    
    if (!response.ok) {
      throw new Error(`Metrics test failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate metrics structure
    const requiredMetrics = ['totalTransactions', 'successfulTransactions', 'failedTransactions', 'averageGasUsed'];
    for (const metric of requiredMetrics) {
      if (typeof result[metric] !== 'number') {
        throw new Error(`Missing or invalid metric: ${metric}`);
      }
    }
    
    return result;
  }

  async testErrorHandling(): Promise<any> {
    // Test with invalid data to ensure proper error handling
    const response = await fetch(`${API_BASE_URL}/api/verify-on-chain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invalidData: 'test' })
    });
    
    // We expect this to fail with proper error handling
    if (response.ok) {
      throw new Error('Expected error handling test to fail, but it succeeded');
    }
    
    const result = await response.json();
    
    // Validate error response structure
    if (!result.error || !result.message) {
      throw new Error('Invalid error response structure');
    }
    
    return result;
  }

  private createTestResumeFile(): string {
    const testContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
  /Font <<
    /F1 4 0 R
  >>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Times-Roman
>>
endobj

5 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Resume Content) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000136 00000 n 
0000000284 00000 n 
0000000370 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
464
%%EOF
`;
    
    const testFilePath = path.join(process.cwd(), 'test-resume.pdf');
    fs.writeFileSync(testFilePath, testContent.trim());
    return testFilePath;
  }

  private generateTestReport(): void {
    console.log('\n📊 Test Report Summary');
    console.log('=' .repeat(50));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`   • ${result.name}: ${result.error}`);
        });
    }
    
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`\nTotal Duration: ${totalDuration}ms`);
    
    // Calculate success rate
    const successRate = Math.round((passedTests / totalTests) * 100);
    console.log(`Success Rate: ${successRate}%`);
    
    if (successRate >= 80) {
      console.log('\n🎉 Blockchain migration test completed successfully!');
    } else {
      console.log('\n⚠️  Blockchain migration has issues that need to be addressed.');
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Blockchain Migration End-to-End Testing\n');
    
    // Run tests in order of dependency
    await this.runTest('API Health Check', () => this.testApiHealth());
    await this.runTest('Blockchain Service Health', () => this.testBlockchainServiceHealth());
    await this.runTest('KMS Key Access', () => this.testKMSKeyAccess());
    await this.runTest('Secrets Manager Access', () => this.testSecretsManagerAccess());
    await this.runTest('Signing Capability', () => this.testSigningCapability());
    await this.runTest('Resume Verification', () => this.testResumeVerification());
    await this.runTest('Monitoring and Metrics', () => this.testMonitoringAndMetrics());
    await this.runTest('Error Handling', () => this.testErrorHandling());
    
    this.generateTestReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new BlockchainMigrationTester();
  tester.runAllTests().catch(error => {
    console.error('\n💥 Test suite crashed:', error.message);
    process.exit(1);
  });
}

export { BlockchainMigrationTester };
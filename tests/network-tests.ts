/**
 * SVM-Pay Network Testing Script
 * 
 * This file implements a testing script for SVM-Pay functionality
 * across different SVM networks.
 */

import { SVMPay } from '../src/sdk';
import { SVMNetwork, PaymentStatus } from '../src/core/types';
import { SolanaNetworkAdapter } from '../src/network/solana';
import { SonicNetworkAdapter } from '../src/network/sonic';
import { EclipseNetworkAdapter } from '../src/network/eclipse';
import { SoonNetworkAdapter } from '../src/network/soon';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  recipient: 'demo123456789abcdef',
  amount: '1.0',
  label: 'Test Payment',
  message: 'Testing SVM-Pay functionality',
  references: ['test-reference-id'],
};

/**
 * Test results interface
 */
interface TestResult {
  network: SVMNetwork;
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Run tests for a specific network
 * 
 * @param network The network to test
 * @returns Promise that resolves to an array of test results
 */
async function runNetworkTests(network: SVMNetwork): Promise<TestResult[]> {
  console.log(`\n=== Testing ${network} network ===\n`);
  
  const results: TestResult[] = [];
  const svmPay = new SVMPay({ defaultNetwork: network, debug: true });
  
  // Test 1: Create transfer URL
  try {
    console.log('Test 1: Create transfer URL');
    const url = svmPay.createTransferUrl(
      TEST_CONFIG.recipient,
      TEST_CONFIG.amount,
      {
        network,
        label: TEST_CONFIG.label,
        message: TEST_CONFIG.message,
        references: TEST_CONFIG.references,
      }
    );
    
    console.log(`URL: ${url}`);
    
    results.push({
      network,
      test: 'Create transfer URL',
      success: true,
      message: 'Successfully created transfer URL',
      data: { url },
    });
  } catch (error) {
    console.error('Error creating transfer URL:', error);
    
    results.push({
      network,
      test: 'Create transfer URL',
      success: false,
      message: `Error: ${(error as Error).message}`,
    });
  }
  
  // Test 2: Parse URL
  try {
    console.log('\nTest 2: Parse URL');
    const url = svmPay.createTransferUrl(
      TEST_CONFIG.recipient,
      TEST_CONFIG.amount,
      {
        network,
        label: TEST_CONFIG.label,
        message: TEST_CONFIG.message,
        references: TEST_CONFIG.references,
      }
    );
    
    const parsed = svmPay.parseUrl(url);
    console.log('Parsed URL:', parsed);
    
    const isValid = 
      parsed.network === network &&
      parsed.recipient === TEST_CONFIG.recipient &&
      (parsed.type === 'transfer' ? parsed.amount === TEST_CONFIG.amount : true) &&
      parsed.label === TEST_CONFIG.label &&
      parsed.message === TEST_CONFIG.message &&
      parsed.references?.includes(TEST_CONFIG.references[0]);
    
    results.push({
      network,
      test: 'Parse URL',
      success: isValid,
      message: isValid ? 'Successfully parsed URL' : 'URL parsing validation failed',
      data: { parsed },
    });
  } catch (error) {
    console.error('Error parsing URL:', error);
    
    results.push({
      network,
      test: 'Parse URL',
      success: false,
      message: `Error: ${(error as Error).message}`,
    });
  }
  
  // Test 3: Generate reference
  try {
    console.log('\nTest 3: Generate reference');
    const reference = svmPay.generateReference();
    console.log(`Reference: ${reference}`);
    
    results.push({
      network,
      test: 'Generate reference',
      success: true,
      message: 'Successfully generated reference',
      data: { reference },
    });
  } catch (error) {
    console.error('Error generating reference:', error);
    
    results.push({
      network,
      test: 'Generate reference',
      success: false,
      message: `Error: ${(error as Error).message}`,
    });
  }
  
  // Test 4: Process payment (simulated)
  try {
    console.log('\nTest 4: Process payment (simulated)');
    const url = svmPay.createTransferUrl(
      TEST_CONFIG.recipient,
      TEST_CONFIG.amount,
      {
        network,
        label: TEST_CONFIG.label,
        message: TEST_CONFIG.message,
        references: TEST_CONFIG.references,
      }
    );
    
    const request = svmPay.parseUrl(url);
    
    // In a real test, we would process the payment
    // For this simulation, we'll just log the request
    console.log('Payment request:', request);
    
    results.push({
      network,
      test: 'Process payment (simulated)',
      success: true,
      message: 'Successfully simulated payment processing',
      data: { request },
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    
    results.push({
      network,
      test: 'Process payment (simulated)',
      success: false,
      message: `Error: ${(error as Error).message}`,
    });
  }
  
  return results;
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('Starting SVM-Pay network tests...\n');
  
  const networks = [
    SVMNetwork.SOLANA,
    SVMNetwork.SONIC,
    SVMNetwork.ECLIPSE,
    SVMNetwork.SOON,
  ];
  
  const allResults: TestResult[] = [];
  
  for (const network of networks) {
    const results = await runNetworkTests(network);
    allResults.push(...results);
  }
  
  // Print summary
  console.log('\n=== Test Summary ===\n');
  
  const totalTests = allResults.length;
  const passedTests = allResults.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success rate: ${(passedTests / totalTests * 100).toFixed(2)}%`);
  
  // Print failures if any
  if (failedTests > 0) {
    console.log('\nFailed tests:');
    
    allResults
      .filter(r => !r.success)
      .forEach(result => {
        console.log(`- ${result.network}: ${result.test} - ${result.message}`);
      });
  }
  
  return {
    totalTests,
    passedTests,
    failedTests,
    results: allResults,
  };
}

// Run the tests
runAllTests()
  .then(summary => {
    console.log('\nTests completed.');
    
    // Exit with appropriate code
    process.exit(summary.failedTests > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });

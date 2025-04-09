/**
 * SVM-Pay Sonic SVM Network Test
 * 
 * This file implements specific tests for the Sonic SVM network adapter.
 */

import { SVMPay } from '../src/sdk';
import { SVMNetwork, PaymentStatus } from '../src/core/types';
import { SonicNetworkAdapter } from '../src/network/sonic';
import { NetworkAdapterFactory } from '../src/network/adapter';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  recipient: 'demo123456789abcdef',
  amount: '1.0',
  label: 'Sonic Test Payment',
  message: 'Testing SVM-Pay on Sonic SVM',
  references: ['sonic-test-reference-id'],
};

/**
 * Run Sonic-specific tests
 */
async function runSonicTests() {
  console.log('\n=== Sonic SVM Network Specific Tests ===\n');
  
  // Initialize SDK with Sonic network
  const svmPay = new SVMPay({ defaultNetwork: SVMNetwork.SONIC, debug: true });
  
  // Get the Sonic adapter
  const adapter = new SonicNetworkAdapter();
  
  // Test 1: Create transfer transaction
  try {
    console.log('Test 1: Create transfer transaction');
    
    const request = {
      type: 'transfer' as any,
      network: SVMNetwork.SONIC,
      recipient: TEST_CONFIG.recipient,
      amount: TEST_CONFIG.amount,
      label: TEST_CONFIG.label,
      message: TEST_CONFIG.message,
      references: TEST_CONFIG.references,
    };
    
    const transaction = await adapter.createTransferTransaction(request);
    console.log(`Transaction: ${transaction}`);
    
    console.log('✅ Successfully created transfer transaction');
  } catch (error) {
    console.error('❌ Error creating transfer transaction:', error);
  }
  
  // Test 2: Fetch transaction
  try {
    console.log('\nTest 2: Fetch transaction');
    
    const request = {
      type: 'transaction' as any,
      network: SVMNetwork.SONIC,
      recipient: TEST_CONFIG.recipient,
      link: 'https://example.com/transaction',
      label: TEST_CONFIG.label,
      message: TEST_CONFIG.message,
      references: TEST_CONFIG.references,
    };
    
    const transaction = await adapter.fetchTransaction(request);
    console.log(`Transaction: ${transaction}`);
    
    console.log('✅ Successfully fetched transaction');
  } catch (error) {
    console.error('❌ Error fetching transaction:', error);
  }
  
  // Test 3: Submit transaction
  try {
    console.log('\nTest 3: Submit transaction');
    
    const transaction = 'sonic-test-transaction';
    const signature = 'sonic-test-signature';
    
    const txSignature = await adapter.submitTransaction(transaction, signature);
    console.log(`Transaction signature: ${txSignature}`);
    
    console.log('✅ Successfully submitted transaction');
  } catch (error) {
    console.error('❌ Error submitting transaction:', error);
  }
  
  // Test 4: Check transaction status
  try {
    console.log('\nTest 4: Check transaction status');
    
    const signature = 'sonic-test-signature';
    
    const status = await adapter.checkTransactionStatus(signature);
    console.log(`Transaction status: ${status}`);
    
    console.log('✅ Successfully checked transaction status');
  } catch (error) {
    console.error('❌ Error checking transaction status:', error);
  }
  
  console.log('\nSonic SVM network tests completed.');
}

// Run the tests
runSonicTests()
  .then(() => {
    console.log('All Sonic SVM tests completed.');
  })
  .catch(error => {
    console.error('Error running Sonic SVM tests:', error);
  });

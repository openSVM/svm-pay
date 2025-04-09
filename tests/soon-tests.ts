/**
 * SVM-Pay SOON Network Test
 * 
 * This file implements specific tests for the SOON (s00n) network adapter.
 */

import { SVMPay } from '../src/sdk';
import { SVMNetwork, PaymentStatus } from '../src/core/types';
import { SoonNetworkAdapter } from '../src/network/soon';
import { NetworkAdapterFactory } from '../src/network/adapter';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  recipient: 'demo123456789abcdef',
  amount: '1.0',
  label: 'SOON Test Payment',
  message: 'Testing SVM-Pay on SOON',
  references: ['soon-test-reference-id'],
};

/**
 * Run SOON-specific tests
 */
async function runSoonTests() {
  console.log('\n=== SOON Network Specific Tests ===\n');
  
  // Initialize SDK with SOON network
  const svmPay = new SVMPay({ defaultNetwork: SVMNetwork.SOON, debug: true });
  
  // Get the SOON adapter
  const adapter = new SoonNetworkAdapter();
  
  // Test 1: Create transfer transaction
  try {
    console.log('Test 1: Create transfer transaction');
    
    const request = {
      type: 'transfer' as any,
      network: SVMNetwork.SOON,
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
      network: SVMNetwork.SOON,
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
    
    const transaction = 'soon-test-transaction';
    const signature = 'soon-test-signature';
    
    const txSignature = await adapter.submitTransaction(transaction, signature);
    console.log(`Transaction signature: ${txSignature}`);
    
    console.log('✅ Successfully submitted transaction');
  } catch (error) {
    console.error('❌ Error submitting transaction:', error);
  }
  
  // Test 4: Check transaction status
  try {
    console.log('\nTest 4: Check transaction status');
    
    const signature = 'soon-test-signature';
    
    const status = await adapter.checkTransactionStatus(signature);
    console.log(`Transaction status: ${status}`);
    
    console.log('✅ Successfully checked transaction status');
  } catch (error) {
    console.error('❌ Error checking transaction status:', error);
  }
  
  console.log('\nSOON network tests completed.');
}

// Run the tests
runSoonTests()
  .then(() => {
    console.log('All SOON tests completed.');
  })
  .catch(error => {
    console.error('Error running SOON tests:', error);
  });

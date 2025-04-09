/**
 * SVM-Pay Solana Network Test
 * 
 * This file implements specific tests for the Solana network adapter.
 */

import { SVMPay } from '../src/sdk';
import { SVMNetwork, PaymentStatus } from '../src/core/types';
import { SolanaNetworkAdapter } from '../src/network/solana';
import { NetworkAdapterFactory } from '../src/network/adapter';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  recipient: 'demo123456789abcdef',
  amount: '1.0',
  label: 'Solana Test Payment',
  message: 'Testing SVM-Pay on Solana',
  references: ['solana-test-reference-id'],
};

/**
 * Run Solana-specific tests
 */
async function runSolanaTests() {
  console.log('\n=== Solana Network Specific Tests ===\n');
  
  // Initialize SDK with Solana network
  const svmPay = new SVMPay({ defaultNetwork: SVMNetwork.SOLANA, debug: true });
  
  // Get the Solana adapter
  const adapter = new SolanaNetworkAdapter();
  
  // Test 1: Create transfer transaction
  try {
    console.log('Test 1: Create transfer transaction');
    
    const request = {
      type: 'transfer' as any,
      network: SVMNetwork.SOLANA,
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
      network: SVMNetwork.SOLANA,
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
    
    const transaction = 'solana-test-transaction';
    const signature = 'solana-test-signature';
    
    const txSignature = await adapter.submitTransaction(transaction, signature);
    console.log(`Transaction signature: ${txSignature}`);
    
    console.log('✅ Successfully submitted transaction');
  } catch (error) {
    console.error('❌ Error submitting transaction:', error);
  }
  
  // Test 4: Check transaction status
  try {
    console.log('\nTest 4: Check transaction status');
    
    const signature = 'solana-test-signature';
    
    const status = await adapter.checkTransactionStatus(signature);
    console.log(`Transaction status: ${status}`);
    
    console.log('✅ Successfully checked transaction status');
  } catch (error) {
    console.error('❌ Error checking transaction status:', error);
  }
  
  console.log('\nSolana network tests completed.');
}

// Run the tests
runSolanaTests()
  .then(() => {
    console.log('All Solana tests completed.');
  })
  .catch(error => {
    console.error('Error running Solana tests:', error);
  });

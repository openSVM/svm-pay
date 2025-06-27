/**
 * Solana utilities for SVM-Pay CLI
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { isTestMode } from './config';

// Solana RPC endpoints
const SOLANA_RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com'
];

/**
 * Get Solana connection
 */
export function getSolanaConnection(): Connection {
  const endpoint = SOLANA_RPC_ENDPOINTS[0];
  return new Connection(endpoint, 'confirmed');
}

/**
 * Create keypair from private key
 */
export function createKeypairFromPrivateKey(privateKey: string): Keypair {
  try {
    // Handle both base58 and array formats
    let secretKey: Uint8Array;
    
    if (privateKey.startsWith('[') && privateKey.endsWith(']')) {
      // Array format: [1,2,3,...]
      const numbers = JSON.parse(privateKey);
      secretKey = new Uint8Array(numbers);
    } else {
      // Base58 format
      secretKey = bs58.decode(privateKey);
    }
    
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error('Invalid private key format. Please provide a valid base58 string or array format.');
  }
}

/**
 * Get wallet balance in SOL
 */
export async function getWalletBalance(privateKey: string): Promise<number> {
  if (isTestMode()) {
    console.log('TEST MODE: Simulating balance check');
    return 1.5; // Mock balance
  }
  
  try {
    const connection = getSolanaConnection();
    const keypair = createKeypairFromPrivateKey(privateKey);
    
    const balance = await connection.getBalance(keypair.publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    throw new Error(`Failed to get wallet balance: ${error}`);
  }
}

/**
 * Send SOL payment
 */
export async function sendPayment(
  privateKey: string,
  recipientAddress: string,
  amount: number,
  memo?: string
): Promise<string> {
  if (isTestMode()) {
    console.log('TEST MODE: Simulating payment');
    console.log(`Would send ${amount} SOL to ${recipientAddress}`);
    if (memo) console.log(`Memo: ${memo}`);
    return 'test_transaction_signature_' + Date.now();
  }
  
  try {
    const connection = getSolanaConnection();
    const fromKeypair = createKeypairFromPrivateKey(privateKey);
    const toPublicKey = new PublicKey(recipientAddress);
    
    // Create transfer instruction
    // NOTE: Using actual keypair public key (not placeholder) since this is a direct CLI transaction
    // where we have the private key and can determine the actual sender address
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey, // ACTUAL wallet pubkey from provided private key
      toPubkey: toPublicKey,
      lamports: Math.floor(amount * LAMPORTS_PER_SOL)
    });
    
    // Create transaction
    const transaction = new Transaction().add(transferInstruction);
    
    // Add memo if provided
    if (memo) {
      // Note: This would require importing @solana/spl-memo
      // For now, we'll skip the memo functionality
      console.log(`Note: Memo "${memo}" would be added to transaction`);
    }
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromKeypair.publicKey;
    
    // Sign and send transaction
    transaction.sign(fromKeypair);
    const signature = await connection.sendRawTransaction(transaction.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error) {
    throw new Error(`Failed to send payment: ${error}`);
  }
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
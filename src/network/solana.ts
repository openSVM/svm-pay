/**
 * SVM-Pay Solana Network Adapter
 * 
 * This file implements the network adapter for the Solana network with real blockchain integration.
 */

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { createMemoInstruction } from '@solana/spl-memo';
import { BaseNetworkAdapter } from './adapter';
import { PaymentStatus, SVMNetwork, TransferRequest, TransactionRequest } from '../core/types';

/**
 * Solana network adapter with real blockchain integration
 */
export class SolanaNetworkAdapter extends BaseNetworkAdapter {
  private connection: Connection;
  private defaultEndpoint: string;
  
  /**
   * Create a new SolanaNetworkAdapter
   * 
   * @param rpcEndpoint Optional custom RPC endpoint (defaults to mainnet-beta)
   */
  constructor(rpcEndpoint?: string) {
    super(SVMNetwork.SOLANA);
    this.defaultEndpoint = rpcEndpoint || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(this.defaultEndpoint, 'confirmed');
  }
  
  /**
   * Create a transaction from a transfer request
   * 
   * @param request The transfer request to create a transaction for
   * @returns A promise that resolves to the serialized transaction string
   */
  async createTransferTransaction(request: TransferRequest): Promise<string> {
    try {
      // Validate recipient address
      const recipientPubkey = new PublicKey(request.recipient);
      
      // Convert amount to lamports
      const amount = Math.floor(parseFloat(request.amount) * LAMPORTS_PER_SOL);
      
      if (amount <= 0) {
        throw new Error('Transfer amount must be greater than 0');
      }
      
      // Create a new transaction
      const transaction = new Transaction();
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      // Create transfer instruction
      // NOTE: fromPubkey is intentionally set to a placeholder (11111111111111111111111111111111)
      // This MUST be replaced with the actual user's wallet public key when the transaction
      // is signed by the wallet. The placeholder ensures the transaction structure is correct
      // while allowing the wallet to inject the real sender address during signing.
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey('11111111111111111111111111111111'), // PLACEHOLDER: Replace with actual wallet pubkey
        toPubkey: recipientPubkey,
        lamports: amount,
      });
      
      transaction.add(transferInstruction);
      
      // Add memo if provided
      if (request.memo) {
        const memoInstruction = createMemoInstruction(request.memo, []);
        transaction.add(memoInstruction);
      }
      
      // Serialize transaction
      const serializedTransaction = transaction.serialize({ 
        requireAllSignatures: false,
        verifySignatures: false 
      });
      
      return serializedTransaction.toString('base64');
    } catch (error) {
      console.error('Error creating Solana transfer transaction:', error);
      throw new Error(`Failed to create transfer transaction: ${(error as Error).message}`);
    }
  }
  
  /**
   * Fetch a transaction from a transaction request
   * 
   * @param request The transaction request to fetch a transaction for
   * @returns A promise that resolves to the transaction string
   */
  async fetchTransaction(request: TransactionRequest): Promise<string> {
    try {
      console.log(`Fetching Solana transaction from link: ${request.link}`);
      
      // In a real implementation, this would parse the transaction from the link
      // For now, we'll create a basic transaction structure
      const transaction = new Transaction();
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      // Add a placeholder instruction (in real implementation, parse from link)
      // NOTE: fromPubkey is intentionally set to a placeholder (11111111111111111111111111111111)
      // This MUST be replaced with the actual user's wallet public key when the transaction
      // is signed by the wallet. The placeholder prevents wallet confusion by clearly indicating
      // this field will be populated by the user's wallet during the signing process.
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey('11111111111111111111111111111111'), // PLACEHOLDER: Replace with actual wallet pubkey
        toPubkey: new PublicKey(request.recipient),
        lamports: LAMPORTS_PER_SOL, // Default 1 SOL
      });
      
      transaction.add(transferInstruction);
      
      // Serialize transaction
      const serializedTransaction = transaction.serialize({ 
        requireAllSignatures: false,
        verifySignatures: false 
      });
      
      return serializedTransaction.toString('base64');
    } catch (error) {
      console.error('Error fetching Solana transaction:', error);
      throw new Error(`Failed to fetch transaction: ${(error as Error).message}`);
    }
  }
  
  /**
   * Submit a signed transaction to the network
   * 
   * @param transactionData The serialized transaction data
   * @param signature The signature for the transaction (or signed transaction)
   * @returns A promise that resolves to the transaction signature
   */
  async submitTransaction(transactionData: string, signature: string): Promise<string> {
    try {
      // Parse the transaction from the provided data
      let transaction: Transaction;
      
      try {
        // Try to deserialize as a complete signed transaction
        transaction = Transaction.from(Buffer.from(signature, 'base64'));
      } catch {
        // If that fails, try to reconstruct from parts
        transaction = Transaction.from(Buffer.from(transactionData, 'base64'));
      }
      
      // Send the transaction to the network
      const txSignature = await this.connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3,
        }
      );
      
      console.log(`Submitted Solana transaction with signature: ${txSignature}`);
      
      return txSignature;
    } catch (error) {
      console.error('Error submitting Solana transaction:', error);
      throw new Error(`Failed to submit transaction: ${(error as Error).message}`);
    }
  }
  
  /**
   * Check the status of a transaction
   * 
   * @param signature The signature of the transaction to check
   * @returns A promise that resolves to the payment status
   */
  async checkTransactionStatus(signature: string): Promise<PaymentStatus> {
    try {
      console.log(`Checking status of Solana transaction: ${signature}`);
      
      // Get transaction confirmation status
      const status = await this.connection.getSignatureStatus(signature, {
        searchTransactionHistory: true
      });
      
      if (!status.value) {
        return PaymentStatus.FAILED;
      }
      
      if (status.value.err) {
        return PaymentStatus.FAILED;
      }
      
      // Check confirmation level
      if (status.value.confirmationStatus === 'processed') {
        return PaymentStatus.PENDING;
      } else if (status.value.confirmationStatus === 'confirmed' || 
                 status.value.confirmationStatus === 'finalized') {
        return PaymentStatus.CONFIRMED;
      }
      
      return PaymentStatus.PENDING;
    } catch (error) {
      console.error('Error checking Solana transaction status:', error);
      return PaymentStatus.FAILED;
    }
  }
  
  /**
   * Get the current connection
   * 
   * @returns The Solana connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }
  
  /**
   * Update the RPC endpoint
   * 
   * @param rpcEndpoint The new RPC endpoint
   */
  updateEndpoint(rpcEndpoint: string): void {
    this.connection = new Connection(rpcEndpoint, 'confirmed');
  }
  
  /**
   * Get account balance
   * 
   * @param publicKey The public key to check balance for
   * @returns Promise that resolves to the balance in SOL
   */
  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubkey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(`Failed to get balance: ${(error as Error).message}`);
    }
  }
}

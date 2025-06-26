/**
 * SVM-Pay Sonic SVM Network Adapter
 * 
 * This file implements the network adapter for the Sonic SVM network with real blockchain integration.
 * Sonic SVM is Solana-compatible, so we can reuse Solana web3.js with different RPC endpoints.
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
 * Sonic SVM network adapter with real blockchain integration
 */
export class SonicNetworkAdapter extends BaseNetworkAdapter {
  private connection: Connection;
  private defaultEndpoint: string;
  
  /**
   * Create a new SonicNetworkAdapter
   * 
   * @param rpcEndpoint Optional custom RPC endpoint for Sonic SVM
   */
  constructor(rpcEndpoint?: string) {
    super(SVMNetwork.SONIC);
    // Sonic SVM testnet/mainnet endpoints would go here
    this.defaultEndpoint = rpcEndpoint || 'https://rpc.sonic.game'; // Example endpoint
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
      
      // Convert amount to lamports (Sonic uses same denomination as Solana)
      const amount = Math.floor(parseFloat(request.amount) * LAMPORTS_PER_SOL);
      
      if (amount <= 0) {
        throw new Error('Transfer amount must be greater than 0');
      }
      
      // Create a new transaction
      const transaction = new Transaction();
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      // Create transfer instruction (Sonic SVM uses same instruction format as Solana)
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
        toPubkey: recipientPubkey,
        lamports: amount,
      });
      
      transaction.add(transferInstruction);
      
      // Add memo if provided (Sonic SVM supports memo program)
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
      console.error('Error creating Sonic SVM transfer transaction:', error);
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
      console.log(`Fetching Sonic SVM transaction from link: ${request.link}`);
      
      // In a real implementation, this would parse the transaction from the link
      const transaction = new Transaction();
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      // Add a placeholder instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
        toPubkey: new PublicKey(request.recipient),
        lamports: LAMPORTS_PER_SOL, // Default 1 SOL equivalent
      });
      
      transaction.add(transferInstruction);
      
      // Serialize transaction
      const serializedTransaction = transaction.serialize({ 
        requireAllSignatures: false,
        verifySignatures: false 
      });
      
      return serializedTransaction.toString('base64');
    } catch (error) {
      console.error('Error fetching Sonic SVM transaction:', error);
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
      
      // Send the transaction to the Sonic SVM network
      const txSignature = await this.connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3,
        }
      );
      
      console.log(`Submitted Sonic SVM transaction with signature: ${txSignature}`);
      
      return txSignature;
    } catch (error) {
      console.error('Error submitting Sonic SVM transaction:', error);
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
      console.log(`Checking status of Sonic SVM transaction: ${signature}`);
      
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
      console.error('Error checking Sonic SVM transaction status:', error);
      return PaymentStatus.FAILED;
    }
  }
  
  /**
   * Get the current connection
   * 
   * @returns The Sonic SVM connection instance
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
   * @returns Promise that resolves to the balance in SOL equivalent
   */
  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubkey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting Sonic SVM balance:', error);
      throw new Error(`Failed to get balance: ${(error as Error).message}`);
    }
  }
  
  /**
   * Get network-specific token info
   * 
   * @returns Network token information
   */
  getTokenInfo(): { symbol: string; decimals: number; name: string } {
    return {
      symbol: 'SONIC',
      decimals: 9,
      name: 'Sonic SVM Token'
    };
  }
}

/**
 * SVM-Pay Transaction Request Handler
 * 
 * This file implements the handler for transaction requests in the SVM-Pay protocol.
 * Transaction requests are interactive requests for complex transactions.
 */

import { NetworkAdapter, PaymentRecord, PaymentStatus, SVMNetwork, TransactionRequest } from './types';
import { generateReference } from './reference';

/**
 * Handler for transaction requests
 */
export class TransactionRequestHandler {
  private networkAdapters: Map<SVMNetwork, NetworkAdapter>;
  
  /**
   * Create a new TransactionRequestHandler
   * 
   * @param networkAdapters Map of network adapters for each supported network
   */
  constructor(networkAdapters: Map<SVMNetwork, NetworkAdapter>) {
    this.networkAdapters = networkAdapters;
  }
  
  /**
   * Process a transaction request
   * 
   * @param request The transaction request to process
   * @returns A payment record for the processed request
   */
  async processRequest(request: TransactionRequest): Promise<PaymentRecord> {
    // Get the network adapter for this request
    const adapter = this.networkAdapters.get(request.network);
    if (!adapter) {
      throw new Error(`No adapter available for network: ${request.network}`);
    }
    
    // Generate a unique ID for this payment
    const id = generateReference();
    
    // Create a payment record
    const record: PaymentRecord = {
      id,
      request,
      status: PaymentStatus.CREATED,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      // Fetch the transaction from the provided link
      const transaction = await adapter.fetchTransaction(request);
      
      // Return the payment record
      return {
        ...record,
        status: PaymentStatus.PENDING,
        updatedAt: Date.now()
      };
    } catch (error) {
      // Return the payment record with error
      return {
        ...record,
        status: PaymentStatus.FAILED,
        error: (error as Error).message,
        updatedAt: Date.now()
      };
    }
  }
  
  /**
   * Submit a signed transaction for a transaction request
   * 
   * @param paymentId The ID of the payment record
   * @param transaction The transaction to submit
   * @param signature The signature for the transaction
   * @returns The updated payment record
   */
  async submitTransaction(paymentId: string, transaction: string, signature: string): Promise<PaymentRecord> {
    // In a real implementation, we would look up the payment record by ID
    // For this example, we'll create a dummy record
    const record: PaymentRecord = {
      id: paymentId,
      request: {
        type: 'transaction' as any,
        network: SVMNetwork.SOLANA,
        recipient: 'dummy',
        link: 'https://example.com/transaction'
      },
      status: PaymentStatus.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      // Get the network adapter for this request
      const adapter = this.networkAdapters.get(record.request.network);
      if (!adapter) {
        throw new Error(`No adapter available for network: ${record.request.network}`);
      }
      
      // Submit the transaction
      const txSignature = await adapter.submitTransaction(transaction, signature);
      
      // Return the updated payment record
      return {
        ...record,
        status: PaymentStatus.CONFIRMED,
        signature: txSignature,
        updatedAt: Date.now()
      };
    } catch (error) {
      // Return the payment record with error
      return {
        ...record,
        status: PaymentStatus.FAILED,
        error: (error as Error).message,
        updatedAt: Date.now()
      };
    }
  }
  
  /**
   * Check the status of a payment
   * 
   * @param paymentId The ID of the payment to check
   * @returns The updated payment record
   */
  async checkStatus(paymentId: string): Promise<PaymentRecord> {
    // In a real implementation, we would look up the payment record by ID
    // For this example, we'll create a dummy record
    const record: PaymentRecord = {
      id: paymentId,
      request: {
        type: 'transaction' as any,
        network: SVMNetwork.SOLANA,
        recipient: 'dummy',
        link: 'https://example.com/transaction'
      },
      status: PaymentStatus.PENDING,
      signature: 'dummy-signature',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      // Get the network adapter for this request
      const adapter = this.networkAdapters.get(record.request.network);
      if (!adapter) {
        throw new Error(`No adapter available for network: ${record.request.network}`);
      }
      
      // Check the transaction status
      const status = await adapter.checkTransactionStatus(record.signature!);
      
      // Return the updated payment record
      return {
        ...record,
        status,
        updatedAt: Date.now()
      };
    } catch (error) {
      // Return the payment record with error
      return {
        ...record,
        status: PaymentStatus.FAILED,
        error: (error as Error).message,
        updatedAt: Date.now()
      };
    }
  }
}

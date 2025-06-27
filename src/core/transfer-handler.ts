/**
 * SVM-Pay Transfer Request Handler
 * 
 * This file implements the handler for transfer requests in the SVM-Pay protocol.
 * Transfer requests are non-interactive requests for simple token transfers.
 */

import { NetworkAdapter, PaymentRecord, PaymentStatus, SVMNetwork, TransferRequest, RequestType } from './types';
import { generateReference } from './reference';

/**
 * Payment store interface for persisting payment records
 */
interface PaymentStore {
  save(record: PaymentRecord): Promise<void>;
  load(id: string): Promise<PaymentRecord | null>;
  loadByType(type: RequestType): Promise<PaymentRecord[]>;
  update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord>;
  delete(id: string): Promise<boolean>;
}

/**
 * Simple in-memory payment store for transfer handler
 */
class SimpleMemoryPaymentStore implements PaymentStore {
  private payments = new Map<string, PaymentRecord>();
  
  async save(record: PaymentRecord): Promise<void> {
    this.payments.set(record.id, { ...record });
  }
  
  async load(id: string): Promise<PaymentRecord | null> {
    const record = this.payments.get(id);
    return record ? { ...record } : null;
  }
  
  async loadByType(type: RequestType): Promise<PaymentRecord[]> {
    return Array.from(this.payments.values())
      .filter(record => record.request.type === type)
      .map(record => ({ ...record }));
  }
  
  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord> {
    const existing = this.payments.get(id);
    if (!existing) {
      throw new Error(`Payment record not found: ${id}`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    };
    
    this.payments.set(id, updated);
    return { ...updated };
  }
  
  async delete(id: string): Promise<boolean> {
    return this.payments.delete(id);
  }
}

/**
 * Handler for transfer requests
 */
export class TransferRequestHandler {
  private networkAdapters: Map<SVMNetwork, NetworkAdapter>;
  private paymentStore: PaymentStore;
  
  /**
   * Create a new TransferRequestHandler
   * 
   * @param networkAdapters Map of network adapters for each supported network
   * @param paymentStore Optional payment store (defaults to in-memory)
   */
  constructor(networkAdapters: Map<SVMNetwork, NetworkAdapter>, paymentStore?: PaymentStore) {
    this.networkAdapters = networkAdapters;
    this.paymentStore = paymentStore || new SimpleMemoryPaymentStore();
  }
  
  /**
   * Process a transfer request
   * 
   * @param request The transfer request to process
   * @returns A payment record for the processed request
   */
  async processRequest(request: TransferRequest): Promise<PaymentRecord> {
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
      // Save initial record
      await this.paymentStore.save(record);
      
      // Create a transaction for this request
      const _transaction = await adapter.createTransferTransaction(request);
      
      // Update record with pending status
      const updatedRecord = await this.paymentStore.update(id, {
        status: PaymentStatus.PENDING
      });
      
      return updatedRecord;
    } catch (error) {
      // Update record with error
      const errorRecord = await this.paymentStore.update(id, {
        status: PaymentStatus.FAILED,
        error: (error as Error).message
      });
      
      return errorRecord;
    }
  }
  
  /**
   * Submit a signed transaction for a transfer request
   * 
   * @param paymentId The ID of the payment record
   * @param transaction The transaction to submit
   * @param signature The signature for the transaction
   * @returns The updated payment record
   */
  async submitTransaction(paymentId: string, transaction: string, signature: string): Promise<PaymentRecord> {
    // Load the payment record from store
    const record = await this.paymentStore.load(paymentId);
    if (!record) {
      throw new Error(`Payment record not found: ${paymentId}`);
    }
    
    try {
      // Get the network adapter for this request
      const adapter = this.networkAdapters.get(record.request.network);
      if (!adapter) {
        throw new Error(`No adapter available for network: ${record.request.network}`);
      }
      
      // Submit the transaction
      const txSignature = await adapter.submitTransaction(transaction, signature);
      
      // Update the payment record
      const updatedRecord = await this.paymentStore.update(paymentId, {
        status: PaymentStatus.CONFIRMED,
        signature: txSignature
      });
      
      return updatedRecord;
    } catch (error) {
      // Update record with error
      const errorRecord = await this.paymentStore.update(paymentId, {
        status: PaymentStatus.FAILED,
        error: (error as Error).message
      });
      
      return errorRecord;
    }
  }
  
  /**
   * Check the status of a payment
   * 
   * @param paymentId The ID of the payment to check
   * @returns The updated payment record
   */
  async checkStatus(paymentId: string): Promise<PaymentRecord> {
    // Load the payment record from store
    const record = await this.paymentStore.load(paymentId);
    if (!record) {
      throw new Error(`Payment record not found: ${paymentId}`);
    }
    
    try {
      // Get the network adapter for this request
      const adapter = this.networkAdapters.get(record.request.network);
      if (!adapter) {
        throw new Error(`No adapter available for network: ${record.request.network}`);
      }
      
      // Only check if we have a signature
      if (!record.signature) {
        return record; // No signature to check yet
      }
      
      // Check the transaction status
      const status = await adapter.checkTransactionStatus(record.signature);
      
      // Update the payment record
      const updatedRecord = await this.paymentStore.update(paymentId, { status });
      
      return updatedRecord;
    } catch (error) {
      // Update record with error
      const errorRecord = await this.paymentStore.update(paymentId, {
        status: PaymentStatus.FAILED,
        error: (error as Error).message
      });
      
      return errorRecord;
    }
  }
}

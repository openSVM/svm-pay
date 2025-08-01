/**
 * SVM-Pay Transaction Request Handler
 * 
 * This file implements the handler for transaction requests in the SVM-Pay protocol
 * with dynamic payment status handling by ID and type.
 */

import { NetworkAdapter, PaymentRecord, PaymentStatus, SVMNetwork, TransactionRequest, RequestType, TransferRequest } from './types';

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
 * Simple async mutex implementation for concurrency safety
 */
class AsyncMutex {
  private locked = false;
  private waitQueue: Array<() => void> = [];
  
  async acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve();
      } else {
        this.waitQueue.push(resolve);
      }
    });
  }
  
  release(): void {
    if (this.waitQueue.length > 0) {
      const next = this.waitQueue.shift();
      if (next) next();
    } else {
      this.locked = false;
    }
  }
  
  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * In-memory payment store implementation
 * 
 * ⚠️  CONCURRENCY & SCALING LIMITATIONS:
 * This in-memory store includes basic concurrency safety via async mutex but is still
 * NOT suitable for production use beyond demos due to:
 * 
 * 1. LIMITED CONCURRENCY: Basic mutex prevents corruption but reduces throughput
 * 2. NO PERSISTENCE: Data is lost when the process restarts
 * 3. NO SCALING: Limited by single-process memory constraints
 * 4. NO DISTRIBUTION: Cannot share data across multiple instances
 * 
 * FOR PRODUCTION USE, REPLACE WITH:
 * - Database-backed store (PostgreSQL, MongoDB, etc.)
 * - Distributed cache with persistence (Redis with AOF/RDB)
 * - Transaction-safe storage with proper locking mechanisms
 * - Microservice architecture with dedicated payment storage service
 */
class MemoryPaymentStore implements PaymentStore {
  private payments = new Map<string, PaymentRecord>();
  private mutex = new AsyncMutex();
  
  async save(record: PaymentRecord): Promise<void> {
    await this.mutex.withLock(async () => {
      this.payments.set(record.id, { ...record });
    });
  }
  
  async load(id: string): Promise<PaymentRecord | null> {
    return this.mutex.withLock(async () => {
      const record = this.payments.get(id);
      return record ? { ...record } : null;
    });
  }
  
  async loadByType(type: RequestType): Promise<PaymentRecord[]> {
    return this.mutex.withLock(async () => {
      return Array.from(this.payments.values())
        .filter(record => record.request.type === type)
        .map(record => ({ ...record }));
    });
  }
  
  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord> {
    return this.mutex.withLock(async () => {
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
    });
  }
  
  async delete(id: string): Promise<boolean> {
    return this.mutex.withLock(async () => {
      return this.payments.delete(id);
    });
  }
}

/**
 * Payment ID parser for extracting type and network information
 */
class PaymentIdParser {
  // Regex pattern for valid payment ID format
  private static readonly ID_PATTERN = /^([a-zA-Z]+)_([a-zA-Z0-9]+)_(\d+)_([a-zA-Z0-9]+)$/;
  
  /**
   * Parse payment ID to extract metadata with robust validation
   */
  static parse(paymentId: string): {
    id: string;
    type?: RequestType;
    network?: SVMNetwork;
    timestamp?: number;
  } {
    if (!paymentId || typeof paymentId !== 'string') {
      throw new Error('Invalid payment ID: must be a non-empty string');
    }
    
    // Test against expected format: {type}_{network}_{timestamp}_{random}
    const match = this.ID_PATTERN.exec(paymentId);
    
    if (match) {
      const [, typeStr, networkStr, timestampStr] = match;
      
      // Validate type
      const type = typeStr.toUpperCase() as RequestType;
      if (!Object.values(RequestType).includes(type)) {
        console.warn(`Warning: Unknown request type '${typeStr}' in payment ID ${paymentId}`);
      }
      
      // Validate network
      const network = networkStr.toUpperCase() as SVMNetwork;
      if (!Object.values(SVMNetwork).includes(network)) {
        console.warn(`Warning: Unknown network '${networkStr}' in payment ID ${paymentId}`);
      }
      
      // Validate timestamp
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || timestamp <= 0) {
        throw new Error(`Invalid timestamp in payment ID: ${paymentId}`);
      }
      
      return {
        id: paymentId,
        type,
        network,
        timestamp
      };
    }
    
    // Log warning for malformed IDs but don't throw to maintain backward compatibility
    console.warn(`Warning: Payment ID '${paymentId}' does not match expected format. Using as simple ID.`);
    console.warn('Expected format: {type}_{network}_{timestamp}_{random}');
    
    // Fallback for simple IDs
    return { id: paymentId };
  }
  
  /**
   * Generate a structured payment ID with validation
   */
  static generate(type: RequestType, network: SVMNetwork): string {
    if (!type || !network) {
      throw new Error('Type and network are required to generate payment ID');
    }
    
    if (!Object.values(RequestType).includes(type)) {
      throw new Error(`Invalid request type: ${type}`);
    }
    
    if (!Object.values(SVMNetwork).includes(network)) {
      throw new Error(`Invalid network: ${network}`);
    }
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type.toLowerCase()}_${network.toLowerCase()}_${timestamp}_${random}`;
  }
  
  /**
   * Validate payment ID format without parsing
   */
  static isValid(paymentId: string): boolean {
    if (!paymentId || typeof paymentId !== 'string') {
      return false;
    }
    return this.ID_PATTERN.test(paymentId);
  }
}

/**
 * Handler for transaction requests with dynamic status checking
 */
export class TransactionRequestHandler {
  private networkAdapters: Map<SVMNetwork, NetworkAdapter>;
  private paymentStore: PaymentStore;
  
  /**
   * Create a new TransactionRequestHandler
   * 
   * @param networkAdapters Map of network adapters for each supported network
   * @param paymentStore Optional custom payment store (defaults to in-memory)
   */
  constructor(
    networkAdapters: Map<SVMNetwork, NetworkAdapter>, 
    paymentStore?: PaymentStore
  ) {
    this.networkAdapters = networkAdapters;
    this.paymentStore = paymentStore || new MemoryPaymentStore();
    
    // Warn about using in-memory store for anything beyond demos
    if (!paymentStore) {
      console.warn('\n⚠️  SCALING WARNING: Using in-memory payment store (demo only)');
      console.warn('   For production use, provide a persistent PaymentStore implementation');
      console.warn('   that supports concurrency, persistence, and proper scaling.\n');
    }
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
    
    // Generate a structured ID for this payment
    const id = PaymentIdParser.generate(request.type, request.network);
    
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
      
      // Fetch the transaction from the provided link
      const _transaction = await adapter.fetchTransaction(request);
      
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
   * Submit a signed transaction for a transaction request
   * 
   * @param paymentId The ID of the payment record
   * @param transaction The transaction to submit
   * @param signature The signature for the transaction
   * @returns The updated payment record
   */
  async submitTransaction(paymentId: string, transaction: string, signature: string): Promise<PaymentRecord> {
    // Load the payment record
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
   * Check the status of a payment dynamically by ID
   * 
   * @param paymentId The ID of the payment to check
   * @returns The updated payment record
   */
  async checkStatus(paymentId: string): Promise<PaymentRecord> {
    // Load the payment record
    const record = await this.paymentStore.load(paymentId);
    if (!record) {
      throw new Error(`Payment record not found: ${paymentId}`);
    }
    
    // Parse payment ID to determine type and handle accordingly
    const parsedId = PaymentIdParser.parse(paymentId);
    
    if (parsedId.type) {
      return this.checkStatusByType(paymentId, parsedId.type);
    }
    
    // Fallback to generic status check
    return this.checkGenericStatus(record);
  }
  
  /**
   * Check status for multiple payment types dynamically
   * 
   * @param paymentId The ID of the payment to check
   * @param requestType The type of request (transfer, transaction, etc.)
   * @returns The updated payment record
   */
  async checkStatusByType(paymentId: string, requestType: RequestType): Promise<PaymentRecord> {
    const record = await this.paymentStore.load(paymentId);
    if (!record) {
      throw new Error(`Payment record not found: ${paymentId}`);
    }
    
    // Handle different request types with specialized logic
    switch (requestType) {
      case RequestType.TRANSFER:
        return this.checkTransferStatus(record);
      case RequestType.TRANSACTION:
        return this.checkTransactionStatus(record);
      default:
        throw new Error(`Unsupported request type: ${requestType}`);
    }
  }
  
  /**
   * Check status specifically for transfer requests
   * 
   * @param record The payment record to check
   * @returns The updated payment record
   */
  private async checkTransferStatus(record: PaymentRecord): Promise<PaymentRecord> {
    if (record.request.type !== RequestType.TRANSFER) {
      throw new Error('Invalid request type for transfer status check');
    }
    
    // Transfer-specific validation
    const transferRequest = record.request as TransferRequest;
    
    // Validate transfer amount
    const amount = parseFloat(transferRequest.amount);
    if (amount <= 0) {
      return this.paymentStore.update(record.id, {
        status: PaymentStatus.FAILED,
        error: 'Invalid transfer amount'
      });
    }
    
    return this.checkGenericStatus(record);
  }
  
  /**
   * Check status specifically for transaction requests
   * 
   * @param record The payment record to check
   * @returns The updated payment record
   */
  private async checkTransactionStatus(record: PaymentRecord): Promise<PaymentRecord> {
    if (record.request.type !== RequestType.TRANSACTION) {
      throw new Error('Invalid request type for transaction status check');
    }
    
    // Transaction-specific validation
    const transactionRequest = record.request as TransactionRequest;
    
    // Validate transaction link
    if (!transactionRequest.link || !transactionRequest.link.startsWith('http')) {
      return this.paymentStore.update(record.id, {
        status: PaymentStatus.FAILED,
        error: 'Invalid transaction link'
      });
    }
    
    return this.checkGenericStatus(record);
  }
  
  /**
   * Generic status check using network adapter
   * 
   * @param record The payment record to check
   * @returns The updated payment record
   */
  private async checkGenericStatus(record: PaymentRecord): Promise<PaymentRecord> {
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
      return this.paymentStore.update(record.id, { status });
    } catch (error) {
      // Update record with error
      return this.paymentStore.update(record.id, {
        status: PaymentStatus.FAILED,
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Get all payments by type
   * 
   * @param requestType The type of requests to retrieve
   * @returns Array of payment records
   */
  async getPaymentsByType(requestType: RequestType): Promise<PaymentRecord[]> {
    return this.paymentStore.loadByType(requestType);
  }
  
  /**
   * Get payment record by ID
   * 
   * @param paymentId The ID of the payment to retrieve
   * @returns The payment record or null if not found
   */
  async getPayment(paymentId: string): Promise<PaymentRecord | null> {
    return this.paymentStore.load(paymentId);
  }
  
  /**
   * Delete a payment record
   * 
   * @param paymentId The ID of the payment to delete
   * @returns True if deleted, false if not found
   */
  async deletePayment(paymentId: string): Promise<boolean> {
    return this.paymentStore.delete(paymentId);
  }
  
  /**
   * Bulk status check for multiple payments
   * 
   * @param paymentIds Array of payment IDs to check
   * @returns Array of updated payment records
   */
  async bulkCheckStatus(paymentIds: string[]): Promise<PaymentRecord[]> {
    const results: PaymentRecord[] = [];
    
    for (const paymentId of paymentIds) {
      try {
        const updatedRecord = await this.checkStatus(paymentId);
        results.push(updatedRecord);
      } catch (error) {
        // Log error but continue with other payments
        console.error(`Error checking status for payment ${paymentId}:`, error);
      }
    }
    
    return results;
  }
  
  /**
   * Get payment statistics
   * 
   * @returns Statistics about payments
   */
  async getPaymentStats(): Promise<{
    total: number;
    byStatus: Record<PaymentStatus, number>;
    byType: Record<RequestType, number>;
    byNetwork: Record<SVMNetwork, number>;
  }> {
    const allTransfers = await this.paymentStore.loadByType(RequestType.TRANSFER);
    const allTransactions = await this.paymentStore.loadByType(RequestType.TRANSACTION);
    const allPayments = [...allTransfers, ...allTransactions];
    
    const stats = {
      total: allPayments.length,
      byStatus: {} as Record<PaymentStatus, number>,
      byType: {} as Record<RequestType, number>,
      byNetwork: {} as Record<SVMNetwork, number>
    };
    
    // Initialize counters
    Object.values(PaymentStatus).forEach(status => stats.byStatus[status] = 0);
    Object.values(RequestType).forEach(type => stats.byType[type] = 0);
    Object.values(SVMNetwork).forEach(network => stats.byNetwork[network] = 0);
    
    // Count occurrences
    allPayments.forEach(payment => {
      stats.byStatus[payment.status]++;
      stats.byType[payment.request.type]++;
      stats.byNetwork[payment.request.network]++;
    });
    
    return stats;
  }
}

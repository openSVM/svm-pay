/**
 * SVM-Pay Transaction Request Handler
 *
 * This file implements the handler for transaction requests in the SVM-Pay protocol
 * with dynamic payment status handling by ID and type.
 */
import { NetworkAdapter, PaymentRecord, PaymentStatus, SVMNetwork, TransactionRequest, RequestType } from './types';
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
 * Handler for transaction requests with dynamic status checking
 */
export declare class TransactionRequestHandler {
    private networkAdapters;
    private paymentStore;
    /**
     * Create a new TransactionRequestHandler
     *
     * @param networkAdapters Map of network adapters for each supported network
     * @param paymentStore Optional custom payment store (defaults to in-memory)
     */
    constructor(networkAdapters: Map<SVMNetwork, NetworkAdapter>, paymentStore?: PaymentStore);
    /**
     * Process a transaction request
     *
     * @param request The transaction request to process
     * @returns A payment record for the processed request
     */
    processRequest(request: TransactionRequest): Promise<PaymentRecord>;
    /**
     * Submit a signed transaction for a transaction request
     *
     * @param paymentId The ID of the payment record
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @returns The updated payment record
     */
    submitTransaction(paymentId: string, transaction: string, signature: string): Promise<PaymentRecord>;
    /**
     * Check the status of a payment dynamically by ID
     *
     * @param paymentId The ID of the payment to check
     * @returns The updated payment record
     */
    checkStatus(paymentId: string): Promise<PaymentRecord>;
    /**
     * Check status for multiple payment types dynamically
     *
     * @param paymentId The ID of the payment to check
     * @param requestType The type of request (transfer, transaction, etc.)
     * @returns The updated payment record
     */
    checkStatusByType(paymentId: string, requestType: RequestType): Promise<PaymentRecord>;
    /**
     * Check status specifically for transfer requests
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    private checkTransferStatus;
    /**
     * Check status specifically for transaction requests
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    private checkTransactionStatus;
    /**
     * Generic status check using network adapter
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    private checkGenericStatus;
    /**
     * Get all payments by type
     *
     * @param requestType The type of requests to retrieve
     * @returns Array of payment records
     */
    getPaymentsByType(requestType: RequestType): Promise<PaymentRecord[]>;
    /**
     * Get payment record by ID
     *
     * @param paymentId The ID of the payment to retrieve
     * @returns The payment record or null if not found
     */
    getPayment(paymentId: string): Promise<PaymentRecord | null>;
    /**
     * Delete a payment record
     *
     * @param paymentId The ID of the payment to delete
     * @returns True if deleted, false if not found
     */
    deletePayment(paymentId: string): Promise<boolean>;
    /**
     * Bulk status check for multiple payments
     *
     * @param paymentIds Array of payment IDs to check
     * @returns Array of updated payment records
     */
    bulkCheckStatus(paymentIds: string[]): Promise<PaymentRecord[]>;
    /**
     * Get payment statistics
     *
     * @returns Statistics about payments
     */
    getPaymentStats(): Promise<{
        total: number;
        byStatus: Record<PaymentStatus, number>;
        byType: Record<RequestType, number>;
        byNetwork: Record<SVMNetwork, number>;
    }>;
}
export {};
//# sourceMappingURL=transaction-handler.d.ts.map
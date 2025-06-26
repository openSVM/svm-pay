/**
 * SVM-Pay Transaction Request Handler
 *
 * This file implements the handler for transaction requests in the SVM-Pay protocol.
 * Transaction requests are interactive requests for complex transactions.
 */
import { NetworkAdapter, PaymentRecord, SVMNetwork, TransactionRequest, RequestType } from './types';
/**
 * Handler for transaction requests
 */
export declare class TransactionRequestHandler {
    private networkAdapters;
    /**
     * Create a new TransactionRequestHandler
     *
     * @param networkAdapters Map of network adapters for each supported network
     */
    constructor(networkAdapters: Map<SVMNetwork, NetworkAdapter>);
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
     * Check the status of a payment
     *
     * @param paymentId The ID of the payment to check
     * @param paymentType Optional type hint for the payment (transfer, transaction, etc.)
     * @returns The updated payment record
     */
    checkStatus(paymentId: string, _paymentType?: string): Promise<PaymentRecord>;
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
     * @param paymentId The ID of the transfer payment to check
     * @returns The updated payment record
     */
    private checkTransferStatus;
}
//# sourceMappingURL=transaction-handler.d.ts.map
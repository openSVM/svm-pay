/**
 * SVM-Pay Transfer Request Handler
 *
 * This file implements the handler for transfer requests in the SVM-Pay protocol.
 * Transfer requests are non-interactive requests for simple token transfers.
 */
import { NetworkAdapter, PaymentRecord, SVMNetwork, TransferRequest } from './types';
/**
 * Handler for transfer requests
 */
export declare class TransferRequestHandler {
    private networkAdapters;
    /**
     * Create a new TransferRequestHandler
     *
     * @param networkAdapters Map of network adapters for each supported network
     */
    constructor(networkAdapters: Map<SVMNetwork, NetworkAdapter>);
    /**
     * Process a transfer request
     *
     * @param request The transfer request to process
     * @returns A payment record for the processed request
     */
    processRequest(request: TransferRequest): Promise<PaymentRecord>;
    /**
     * Submit a signed transaction for a transfer request
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
     * @returns The updated payment record
     */
    checkStatus(paymentId: string): Promise<PaymentRecord>;
}
//# sourceMappingURL=transfer-handler.d.ts.map
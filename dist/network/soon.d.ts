/**
 * SVM-Pay SOON Network Adapter
 *
 * This file implements the network adapter for the SOON (s00n) network.
 */
import { BaseNetworkAdapter } from './adapter';
import { PaymentStatus, TransferRequest, TransactionRequest } from '../core/types';
/**
 * SOON network adapter
 */
export declare class SoonNetworkAdapter extends BaseNetworkAdapter {
    /**
     * Create a new SoonNetworkAdapter
     */
    constructor();
    /**
     * Create a transaction from a transfer request
     *
     * @param request The transfer request to create a transaction for
     * @returns A promise that resolves to the transaction string
     */
    createTransferTransaction(request: TransferRequest): Promise<string>;
    /**
     * Fetch a transaction from a transaction request
     *
     * @param request The transaction request to fetch a transaction for
     * @returns A promise that resolves to the transaction string
     */
    fetchTransaction(request: TransactionRequest): Promise<string>;
    /**
     * Submit a signed transaction to the network
     *
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @returns A promise that resolves to the transaction signature
     */
    submitTransaction(transaction: string, signature: string): Promise<string>;
    /**
     * Check the status of a transaction
     *
     * @param signature The signature of the transaction to check
     * @returns A promise that resolves to the payment status
     */
    checkTransactionStatus(signature: string): Promise<PaymentStatus>;
}
//# sourceMappingURL=soon.d.ts.map
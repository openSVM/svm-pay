/**
 * SVM-Pay Sonic SVM Network Adapter
 *
 * This file implements the network adapter for the Sonic SVM network with real blockchain integration.
 * Sonic SVM is Solana-compatible, so we can reuse Solana web3.js with different RPC endpoints.
 */
import { Connection } from '@solana/web3.js';
import { BaseNetworkAdapter } from './adapter';
import { PaymentStatus, TransferRequest, TransactionRequest } from '../core/types';
/**
 * Sonic SVM network adapter with real blockchain integration
 */
export declare class SonicNetworkAdapter extends BaseNetworkAdapter {
    private connection;
    private defaultEndpoint;
    /**
     * Create a new SonicNetworkAdapter
     *
     * @param rpcEndpoint Optional custom RPC endpoint for Sonic SVM
     */
    constructor(rpcEndpoint?: string);
    /**
     * Create a transaction from a transfer request
     *
     * @param request The transfer request to create a transaction for
     * @returns A promise that resolves to the serialized transaction string
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
     * @param transactionData The serialized transaction data
     * @param signature The signature for the transaction (or signed transaction)
     * @returns A promise that resolves to the transaction signature
     */
    submitTransaction(transactionData: string, signature: string): Promise<string>;
    /**
     * Check the status of a transaction
     *
     * @param signature The signature of the transaction to check
     * @returns A promise that resolves to the payment status
     */
    checkTransactionStatus(signature: string): Promise<PaymentStatus>;
    /**
     * Get the current connection
     *
     * @returns The Sonic SVM connection instance
     */
    getConnection(): Connection;
    /**
     * Update the RPC endpoint
     *
     * @param rpcEndpoint The new RPC endpoint
     */
    updateEndpoint(rpcEndpoint: string): void;
    /**
     * Get account balance
     *
     * @param publicKey The public key to check balance for
     * @returns Promise that resolves to the balance in SOL equivalent
     */
    getBalance(publicKey: string): Promise<number>;
    /**
     * Get network-specific token info
     *
     * @returns Network token information
     */
    getTokenInfo(): {
        symbol: string;
        decimals: number;
        name: string;
    };
}
//# sourceMappingURL=sonic.d.ts.map
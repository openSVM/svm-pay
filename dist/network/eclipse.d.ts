/**
 * SVM-Pay Eclipse Network Adapter
 *
 * This file implements the network adapter for the Eclipse network with real blockchain integration.
 * Eclipse is a Solana-compatible SVM network, so we can use similar web3.js patterns.
 */
import { Connection } from '@solana/web3.js';
import { BaseNetworkAdapter } from './adapter';
import { PaymentStatus, TransferRequest, TransactionRequest } from '../core/types';
/**
 * Eclipse network adapter with real blockchain integration
 */
export declare class EclipseNetworkAdapter extends BaseNetworkAdapter {
    private connection;
    private defaultEndpoint;
    /**
     * Create a new EclipseNetworkAdapter
     *
     * @param rpcEndpoint Optional custom RPC endpoint for Eclipse
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
     * @returns The Eclipse connection instance
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
     * @returns Promise that resolves to the balance in ETH equivalent
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
    /**
     * Eclipse-specific methods for Ethereum compatibility
     */
    /**
     * Get Eclipse network chain ID
     *
     * @returns The chain ID for Eclipse network
     */
    getChainId(): number;
    /**
     * Convert Ethereum address to Eclipse format if needed
     *
     * @param ethAddress Ethereum address
     * @returns Eclipse-compatible address
     */
    convertEthereumAddress(ethAddress: string): string;
}
//# sourceMappingURL=eclipse.d.ts.map
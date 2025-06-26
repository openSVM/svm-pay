/**
 * SVM-Pay Network Adapter Interface
 *
 * This file defines the interface for network adapters in the SVM-Pay protocol.
 * Each supported SVM network must implement this interface.
 */
import { NetworkAdapter, SVMNetwork } from '../core/types';
/**
 * Abstract base class for network adapters
 */
export declare abstract class BaseNetworkAdapter implements NetworkAdapter {
    /** The network this adapter handles */
    readonly network: SVMNetwork;
    /**
     * Create a new BaseNetworkAdapter
     *
     * @param network The network this adapter handles
     */
    constructor(network: SVMNetwork);
    /**
     * Create a transaction from a transfer request
     *
     * @param request The transfer request to create a transaction for
     * @returns A promise that resolves to the transaction string
     */
    abstract createTransferTransaction(request: any): Promise<string>;
    /**
     * Fetch a transaction from a transaction request
     *
     * @param request The transaction request to fetch a transaction for
     * @returns A promise that resolves to the transaction string
     */
    abstract fetchTransaction(request: any): Promise<string>;
    /**
     * Submit a signed transaction to the network
     *
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @returns A promise that resolves to the transaction signature
     */
    abstract submitTransaction(transaction: string, signature: string): Promise<string>;
    /**
     * Check the status of a transaction
     *
     * @param signature The signature of the transaction to check
     * @returns A promise that resolves to the payment status
     */
    abstract checkTransactionStatus(signature: string): Promise<any>;
}
/**
 * Factory for creating network adapters
 */
export declare class NetworkAdapterFactory {
    private static adapters;
    /**
     * Register a network adapter
     *
     * @param adapter The network adapter to register
     */
    static registerAdapter(adapter: NetworkAdapter): void;
    /**
     * Get a network adapter for a specific network
     *
     * @param network The network to get an adapter for
     * @returns The network adapter, or undefined if none is registered
     */
    static getAdapter(network: SVMNetwork): NetworkAdapter | undefined;
    /**
     * Get all registered network adapters
     *
     * @returns A map of all registered network adapters
     */
    static getAllAdapters(): Map<SVMNetwork, NetworkAdapter>;
}
//# sourceMappingURL=adapter.d.ts.map
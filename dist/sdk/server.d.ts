/**
 * SVM-Pay Server SDK
 *
 * This file implements the server-side SDK for SVM-Pay.
 */
import { PaymentRequest, PaymentStatus, SVMNetwork } from '../core/types';
/**
 * SVM-Pay Server SDK configuration options
 */
export interface ServerSDKConfig {
    /** Default network to use if not specified */
    defaultNetwork?: SVMNetwork;
    /** Whether to enable debug logging */
    debug?: boolean;
    /** Secret key for signing server-side transactions */
    secretKey?: string;
}
/**
 * SVM-Pay Server SDK
 */
export declare class SVMPayServer {
    private config;
    /**
     * Create a new SVMPayServer instance
     *
     * @param config Configuration options
     */
    constructor(config?: ServerSDKConfig);
    /**
     * Register network adapters
     */
    private registerNetworkAdapters;
    /**
     * Create a payment URL for a transfer request
     *
     * @param recipient Recipient address
     * @param amount Amount to transfer (optional)
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransferUrl(recipient: string, amount?: string, options?: {
        network?: SVMNetwork;
        splToken?: string;
        label?: string;
        message?: string;
        memo?: string;
        references?: string[];
        orderId?: string;
    }): string;
    /**
     * Create a transaction request URL
     *
     * @param recipient Recipient address
     * @param link URL to fetch transaction details
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransactionUrl(recipient: string, link: string, options?: {
        network?: SVMNetwork;
        label?: string;
        message?: string;
        memo?: string;
        references?: string[];
        orderId?: string;
    }): string;
    /**
     * Parse a payment URL
     *
     * @param url Payment URL to parse
     * @returns Parsed payment request
     */
    parseUrl(url: string): PaymentRequest;
    /**
     * Generate a reference ID
     *
     * @returns Reference ID string
     */
    generateReference(): string;
    /**
     * Generate a deterministic reference ID from an order ID
     *
     * @param orderId Order ID to generate a reference from
     * @returns Reference ID string
     */
    generateOrderReference(orderId: string): string;
    /**
     * Verify a transaction against a payment request
     *
     * @param transaction Transaction to verify
     * @param request Payment request to verify against
     * @returns Whether the transaction is valid
     */
    verifyTransaction(transaction: any, request: PaymentRequest): boolean;
    /**
     * Handle a transaction webhook
     *
     * @param signature Transaction signature
     * @param reference Reference ID
     * @returns Payment status
     */
    handleWebhook(signature: string, reference: string): Promise<PaymentStatus>;
    /**
     * Check the status of a transaction
     *
     * @param signature Transaction signature
     * @param network Network to check on
     * @returns Payment status
     */
    checkTransactionStatus(signature: string, network?: SVMNetwork): Promise<PaymentStatus>;
    /**
     * Find transactions by reference
     *
     * @param reference Reference ID to search for
     * @param network Network to search on
     * @returns Array of transaction signatures
     */
    findTransactionsByReference(reference: string, network?: SVMNetwork): Promise<string[]>;
    /**
     * Log a debug message
     *
     * @param message Message to log
     * @param data Additional data to log
     */
    private log;
}
//# sourceMappingURL=server.d.ts.map
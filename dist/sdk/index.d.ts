/**
 * SVM-Pay JavaScript SDK
 *
 * This file implements the main SDK class for SVM-Pay.
 */
import { PaymentRequest, PaymentStatus, SVMNetwork } from '../core/types';
/**
 * SVM-Pay SDK configuration options
 */
export interface SVMPayConfig {
    /** Default network to use if not specified */
    defaultNetwork?: SVMNetwork;
    /** API endpoint for server-side operations */
    apiEndpoint?: string;
    /** Whether to enable debug logging */
    debug?: boolean;
}
/**
 * SVM-Pay SDK
 */
export declare class SVMPay {
    private config;
    private transferHandler;
    private transactionHandler;
    /**
     * Create a new SVMPay SDK instance
     *
     * @param config Configuration options
     */
    constructor(config?: SVMPayConfig);
    /**
     * Register network adapters
     */
    private registerNetworkAdapters;
    /**
     * Create a payment URL for a transfer request
     *
     * @param recipient Recipient address
     * @param amount Amount to transfer
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransferUrl(recipient: string, amount: string, options?: {
        network?: SVMNetwork;
        splToken?: string;
        label?: string;
        message?: string;
        memo?: string;
        references?: string[];
    }): string;
    /**
     * Create a payment URL for a transaction request
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
     * Process a payment request
     *
     * @param request Payment request to process
     * @returns Payment record
     */
    processPayment(request: PaymentRequest): Promise<any>;
    /**
     * Check the status of a payment
     *
     * @param paymentId ID of the payment to check
     * @returns Payment status
     */
    checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
    /**
     * Log a debug message
     *
     * @param message Message to log
     * @param data Additional data to log
     */
    private log;
    /**
     * Check wallet balance (uses local CLI functionality)
     *
     * @returns Wallet balance information
     */
    checkWalletBalance(): Promise<any>;
    /**
     * Check API usage (uses local CLI functionality)
     *
     * @returns API usage information
     */
    checkApiUsage(): Promise<any>;
    /**
     * Get payment history (uses local CLI functionality)
     *
     * @returns Payment history
     */
    getPaymentHistory(): Promise<any>;
    /**
     * Setup wallet configuration (uses local CLI functionality)
     *
     * @param options Setup options
     * @returns Setup result
     */
    setupWallet(options: {
        privateKey?: string;
        apiKey?: string;
        threshold?: number;
        recipient?: string;
    }): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map
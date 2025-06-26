"use strict";
/**
 * SVM-Pay Server SDK
 *
 * This file implements the server-side SDK for SVM-Pay.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVMPayServer = void 0;
const types_1 = require("../core/types");
const url_scheme_1 = require("../core/url-scheme");
const reference_1 = require("../core/reference");
const adapter_1 = require("../network/adapter");
const solana_1 = require("../network/solana");
const sonic_1 = require("../network/sonic");
const eclipse_1 = require("../network/eclipse");
const soon_1 = require("../network/soon");
/**
 * SVM-Pay Server SDK
 */
class SVMPayServer {
    /**
     * Create a new SVMPayServer instance
     *
     * @param config Configuration options
     */
    constructor(config = {}) {
        this.config = {
            defaultNetwork: types_1.SVMNetwork.SOLANA,
            debug: false,
            ...config
        };
        // Register network adapters
        this.registerNetworkAdapters();
        this.log('SVMPay Server SDK initialized');
    }
    /**
     * Register network adapters
     */
    registerNetworkAdapters() {
        adapter_1.NetworkAdapterFactory.registerAdapter(new solana_1.SolanaNetworkAdapter());
        adapter_1.NetworkAdapterFactory.registerAdapter(new sonic_1.SonicNetworkAdapter());
        adapter_1.NetworkAdapterFactory.registerAdapter(new eclipse_1.EclipseNetworkAdapter());
        adapter_1.NetworkAdapterFactory.registerAdapter(new soon_1.SoonNetworkAdapter());
    }
    /**
     * Create a payment URL for a transfer request
     *
     * @param recipient Recipient address
     * @param amount Amount to transfer (optional)
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransferUrl(recipient, amount, options = {}) {
        const network = options.network || this.config.defaultNetwork || types_1.SVMNetwork.SOLANA;
        // Generate a reference from order ID if provided
        let references = options.references || [];
        if (options.orderId) {
            const orderReference = (0, reference_1.generateDeterministicReference)(options.orderId);
            references = [...references, orderReference];
        }
        const request = {
            type: types_1.RequestType.TRANSFER,
            network,
            recipient,
            amount,
            references,
            ...options
        };
        return (0, url_scheme_1.createURL)(request);
    }
    /**
     * Create a transaction request URL
     *
     * @param recipient Recipient address
     * @param link URL to fetch transaction details
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransactionUrl(recipient, link, options = {}) {
        const network = options.network || this.config.defaultNetwork || types_1.SVMNetwork.SOLANA;
        // Generate a reference from order ID if provided
        let references = options.references || [];
        if (options.orderId) {
            const orderReference = (0, reference_1.generateDeterministicReference)(options.orderId);
            references = [...references, orderReference];
        }
        const request = {
            type: types_1.RequestType.TRANSACTION,
            network,
            recipient,
            link,
            references,
            ...options
        };
        return (0, url_scheme_1.createURL)(request);
    }
    /**
     * Parse a payment URL
     *
     * @param url Payment URL to parse
     * @returns Parsed payment request
     */
    parseUrl(url) {
        return (0, url_scheme_1.parseURL)(url);
    }
    /**
     * Generate a reference ID
     *
     * @returns Reference ID string
     */
    generateReference() {
        return (0, reference_1.generateReference)();
    }
    /**
     * Generate a deterministic reference ID from an order ID
     *
     * @param orderId Order ID to generate a reference from
     * @returns Reference ID string
     */
    generateOrderReference(orderId) {
        return (0, reference_1.generateDeterministicReference)(orderId);
    }
    /**
     * Verify a transaction against a payment request
     *
     * @param transaction Transaction to verify
     * @param request Payment request to verify against
     * @returns Whether the transaction is valid
     */
    verifyTransaction(transaction, request) {
        // In a real implementation, this would verify that the transaction
        // matches the payment request
        this.log(`Verifying transaction against request`);
        // For this example, we'll just return true
        return true;
    }
    /**
     * Handle a transaction webhook
     *
     * @param signature Transaction signature
     * @param reference Reference ID
     * @returns Payment status
     */
    async handleWebhook(signature, reference) {
        this.log(`Handling webhook for transaction: ${signature}`);
        this.log(`With reference: ${reference}`);
        // In a real implementation, this would verify the transaction
        // and update the payment status
        // For this example, we'll just return a confirmed status
        return types_1.PaymentStatus.CONFIRMED;
    }
    /**
     * Check the status of a transaction
     *
     * @param signature Transaction signature
     * @param network Network to check on
     * @returns Payment status
     */
    async checkTransactionStatus(signature, network = this.config.defaultNetwork) {
        this.log(`Checking status of transaction: ${signature}`);
        this.log(`On network: ${network}`);
        const adapter = adapter_1.NetworkAdapterFactory.getAdapter(network);
        if (!adapter) {
            throw new Error(`No adapter available for network: ${network}`);
        }
        return adapter.checkTransactionStatus(signature);
    }
    /**
     * Find transactions by reference
     *
     * @param reference Reference ID to search for
     * @param network Network to search on
     * @returns Array of transaction signatures
     */
    async findTransactionsByReference(reference, network = this.config.defaultNetwork) {
        this.log(`Finding transactions with reference: ${reference}`);
        this.log(`On network: ${network}`);
        // In a real implementation, this would search for transactions
        // with the specified reference
        // For this example, we'll just return an empty array
        return [];
    }
    /**
     * Log a debug message
     *
     * @param message Message to log
     * @param data Additional data to log
     */
    log(message, data) {
        if (this.config.debug) {
            console.log(`[SVMPay Server] ${message}`);
            if (data) {
                console.log(data);
            }
        }
    }
}
exports.SVMPayServer = SVMPayServer;
//# sourceMappingURL=server.js.map
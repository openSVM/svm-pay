"use strict";
/**
 * SVM-Pay JavaScript SDK
 *
 * This file implements the main SDK class for SVM-Pay.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVMPay = void 0;
const types_1 = require("../core/types");
const url_scheme_1 = require("../core/url-scheme");
const reference_1 = require("../core/reference");
const transfer_handler_1 = require("../core/transfer-handler");
const transaction_handler_1 = require("../core/transaction-handler");
const adapter_1 = require("../network/adapter");
const solana_1 = require("../network/solana");
const sonic_1 = require("../network/sonic");
const eclipse_1 = require("../network/eclipse");
const soon_1 = require("../network/soon");
const config_1 = require("../cli/utils/config");
const solana_2 = require("../cli/utils/solana");
const openrouter_1 = require("../cli/utils/openrouter");
const history_1 = require("../cli/utils/history");
/**
 * SVM-Pay SDK
 */
class SVMPay {
    /**
     * Create a new SVMPay SDK instance
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
        // Create request handlers
        this.transferHandler = new transfer_handler_1.TransferRequestHandler(adapter_1.NetworkAdapterFactory.getAllAdapters());
        this.transactionHandler = new transaction_handler_1.TransactionRequestHandler(adapter_1.NetworkAdapterFactory.getAllAdapters());
        this.log('SVMPay SDK initialized');
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
     * @param amount Amount to transfer
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransferUrl(recipient, amount, options = {}) {
        const network = options.network || this.config.defaultNetwork || types_1.SVMNetwork.SOLANA;
        if (!amount) {
            throw new Error('Amount is required for transfer requests');
        }
        const request = {
            type: types_1.RequestType.TRANSFER,
            network,
            recipient,
            amount,
            ...options
        };
        return (0, url_scheme_1.createURL)(request);
    }
    /**
     * Create a payment URL for a transaction request
     *
     * @param recipient Recipient address
     * @param link URL to fetch transaction details
     * @param options Additional options
     * @returns Payment URL string
     */
    createTransactionUrl(recipient, link, options = {}) {
        const network = options.network || this.config.defaultNetwork || types_1.SVMNetwork.SOLANA;
        const request = {
            type: types_1.RequestType.TRANSACTION,
            network,
            recipient,
            link,
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
     * Process a payment request
     *
     * @param request Payment request to process
     * @returns Payment record
     */
    async processPayment(request) {
        this.log(`Processing payment request of type: ${request.type}`);
        // Use local implementation
        if (request.type === types_1.RequestType.TRANSFER) {
            return this.transferHandler.processRequest(request);
        }
        else {
            return this.transactionHandler.processRequest(request);
        }
    }
    /**
     * Check the status of a payment
     *
     * @param paymentId ID of the payment to check
     * @returns Payment status
     */
    async checkPaymentStatus(paymentId) {
        this.log(`Checking status of payment: ${paymentId}`);
        // In a real implementation, this would determine which handler to use
        // based on the payment type
        const record = await this.transferHandler.checkStatus(paymentId);
        return record.status;
    }
    /**
     * Log a debug message
     *
     * @param message Message to log
     * @param data Additional data to log
     */
    log(message, data) {
        if (this.config.debug) {
            console.log(`[SVMPay] ${message}`);
            if (data) {
                console.log(data);
            }
        }
    }
    /**
     * Check wallet balance (uses local CLI functionality)
     *
     * @returns Wallet balance information
     */
    async checkWalletBalance() {
        try {
            this.log('Using local CLI functionality for balance check');
            const config = (0, config_1.loadConfig)();
            if (!config.privateKey) {
                throw new Error('Private key not configured. Run "svm-pay setup -k <private-key>" first.');
            }
            const balance = await (0, solana_2.getWalletBalance)(config.privateKey);
            return {
                balance,
                address: config.privateKey // Note: This should be converted to public key
            };
        }
        catch (error) {
            this.log(`Failed to check balance: ${error}`);
            throw error;
        }
    }
    /**
     * Check API usage (uses local CLI functionality)
     *
     * @returns API usage information
     */
    async checkApiUsage() {
        try {
            this.log('Using local CLI functionality for API usage check');
            const config = (0, config_1.loadConfig)();
            if (!config.apiKey) {
                throw new Error('API key not configured. Run "svm-pay setup -a <api-key>" first.');
            }
            return await (0, openrouter_1.checkApiUsage)(config.apiKey);
        }
        catch (error) {
            this.log(`Failed to check API usage: ${error}`);
            throw error;
        }
    }
    /**
     * Get payment history (uses local CLI functionality)
     *
     * @returns Payment history
     */
    async getPaymentHistory() {
        try {
            this.log('Using local CLI functionality for payment history');
            return (0, history_1.loadPaymentHistory)();
        }
        catch (error) {
            this.log(`Failed to get payment history: ${error}`);
            throw error;
        }
    }
    /**
     * Setup wallet configuration (uses local CLI functionality)
     *
     * @param options Setup options
     * @returns Setup result
     */
    async setupWallet(options) {
        try {
            this.log('Using local CLI functionality for wallet setup');
            const { loadConfig, saveConfig } = await Promise.resolve().then(() => __importStar(require('../cli/utils/config')));
            const config = loadConfig();
            if (options.privateKey)
                config.privateKey = options.privateKey;
            if (options.apiKey)
                config.apiKey = options.apiKey;
            if (options.threshold)
                config.threshold = options.threshold;
            if (options.recipient)
                config.recipientAddress = options.recipient;
            saveConfig(config);
            return { success: true, config };
        }
        catch (error) {
            this.log(`Failed to setup wallet: ${error}`);
            throw error;
        }
    }
}
exports.SVMPay = SVMPay;
//# sourceMappingURL=index.js.map
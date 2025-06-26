"use strict";
/**
 * SVM-Pay Transaction Request Handler
 *
 * This file implements the handler for transaction requests in the SVM-Pay protocol
 * with dynamic payment status handling by ID and type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRequestHandler = void 0;
const types_1 = require("./types");
/**
 * In-memory payment store implementation
 */
class MemoryPaymentStore {
    constructor() {
        this.payments = new Map();
    }
    async save(record) {
        this.payments.set(record.id, { ...record });
    }
    async load(id) {
        const record = this.payments.get(id);
        return record ? { ...record } : null;
    }
    async loadByType(type) {
        return Array.from(this.payments.values())
            .filter(record => record.request.type === type)
            .map(record => ({ ...record }));
    }
    async update(id, updates) {
        const existing = this.payments.get(id);
        if (!existing) {
            throw new Error(`Payment record not found: ${id}`);
        }
        const updated = {
            ...existing,
            ...updates,
            updatedAt: Date.now()
        };
        this.payments.set(id, updated);
        return { ...updated };
    }
    async delete(id) {
        return this.payments.delete(id);
    }
}
/**
 * Payment ID parser for extracting type and network information
 */
class PaymentIdParser {
    /**
     * Parse payment ID to extract metadata
     */
    static parse(paymentId) {
        // Expected format: {type}_{network}_{timestamp}_{random}
        const parts = paymentId.split('_');
        if (parts.length >= 4) {
            const [typeStr, networkStr, timestampStr] = parts;
            return {
                id: paymentId,
                type: typeStr.toUpperCase(),
                network: networkStr.toUpperCase(),
                timestamp: parseInt(timestampStr, 10)
            };
        }
        // Fallback for simple IDs
        return { id: paymentId };
    }
    /**
     * Generate a structured payment ID
     */
    static generate(type, network) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${type.toLowerCase()}_${network.toLowerCase()}_${timestamp}_${random}`;
    }
}
/**
 * Handler for transaction requests with dynamic status checking
 */
class TransactionRequestHandler {
    /**
     * Create a new TransactionRequestHandler
     *
     * @param networkAdapters Map of network adapters for each supported network
     * @param paymentStore Optional custom payment store (defaults to in-memory)
     */
    constructor(networkAdapters, paymentStore) {
        this.networkAdapters = networkAdapters;
        this.paymentStore = paymentStore || new MemoryPaymentStore();
    }
    /**
     * Process a transaction request
     *
     * @param request The transaction request to process
     * @returns A payment record for the processed request
     */
    async processRequest(request) {
        // Get the network adapter for this request
        const adapter = this.networkAdapters.get(request.network);
        if (!adapter) {
            throw new Error(`No adapter available for network: ${request.network}`);
        }
        // Generate a structured ID for this payment
        const id = PaymentIdParser.generate(request.type, request.network);
        // Create a payment record
        const record = {
            id,
            request,
            status: types_1.PaymentStatus.CREATED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        try {
            // Save initial record
            await this.paymentStore.save(record);
            // Fetch the transaction from the provided link
            const _transaction = await adapter.fetchTransaction(request);
            // Update record with pending status
            const updatedRecord = await this.paymentStore.update(id, {
                status: types_1.PaymentStatus.PENDING
            });
            return updatedRecord;
        }
        catch (error) {
            // Update record with error
            const errorRecord = await this.paymentStore.update(id, {
                status: types_1.PaymentStatus.FAILED,
                error: error.message
            });
            return errorRecord;
        }
    }
    /**
     * Submit a signed transaction for a transaction request
     *
     * @param paymentId The ID of the payment record
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @returns The updated payment record
     */
    async submitTransaction(paymentId, transaction, signature) {
        // Load the payment record
        const record = await this.paymentStore.load(paymentId);
        if (!record) {
            throw new Error(`Payment record not found: ${paymentId}`);
        }
        try {
            // Get the network adapter for this request
            const adapter = this.networkAdapters.get(record.request.network);
            if (!adapter) {
                throw new Error(`No adapter available for network: ${record.request.network}`);
            }
            // Submit the transaction
            const txSignature = await adapter.submitTransaction(transaction, signature);
            // Update the payment record
            const updatedRecord = await this.paymentStore.update(paymentId, {
                status: types_1.PaymentStatus.CONFIRMED,
                signature: txSignature
            });
            return updatedRecord;
        }
        catch (error) {
            // Update record with error
            const errorRecord = await this.paymentStore.update(paymentId, {
                status: types_1.PaymentStatus.FAILED,
                error: error.message
            });
            return errorRecord;
        }
    }
    /**
     * Check the status of a payment dynamically by ID
     *
     * @param paymentId The ID of the payment to check
     * @returns The updated payment record
     */
    async checkStatus(paymentId) {
        // Load the payment record
        const record = await this.paymentStore.load(paymentId);
        if (!record) {
            throw new Error(`Payment record not found: ${paymentId}`);
        }
        // Parse payment ID to determine type and handle accordingly
        const parsedId = PaymentIdParser.parse(paymentId);
        if (parsedId.type) {
            return this.checkStatusByType(paymentId, parsedId.type);
        }
        // Fallback to generic status check
        return this.checkGenericStatus(record);
    }
    /**
     * Check status for multiple payment types dynamically
     *
     * @param paymentId The ID of the payment to check
     * @param requestType The type of request (transfer, transaction, etc.)
     * @returns The updated payment record
     */
    async checkStatusByType(paymentId, requestType) {
        const record = await this.paymentStore.load(paymentId);
        if (!record) {
            throw new Error(`Payment record not found: ${paymentId}`);
        }
        // Handle different request types with specialized logic
        switch (requestType) {
            case types_1.RequestType.TRANSFER:
                return this.checkTransferStatus(record);
            case types_1.RequestType.TRANSACTION:
                return this.checkTransactionStatus(record);
            default:
                throw new Error(`Unsupported request type: ${requestType}`);
        }
    }
    /**
     * Check status specifically for transfer requests
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    async checkTransferStatus(record) {
        if (record.request.type !== types_1.RequestType.TRANSFER) {
            throw new Error('Invalid request type for transfer status check');
        }
        // Transfer-specific validation
        const transferRequest = record.request;
        // Validate transfer amount
        const amount = parseFloat(transferRequest.amount);
        if (amount <= 0) {
            return this.paymentStore.update(record.id, {
                status: types_1.PaymentStatus.FAILED,
                error: 'Invalid transfer amount'
            });
        }
        return this.checkGenericStatus(record);
    }
    /**
     * Check status specifically for transaction requests
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    async checkTransactionStatus(record) {
        if (record.request.type !== types_1.RequestType.TRANSACTION) {
            throw new Error('Invalid request type for transaction status check');
        }
        // Transaction-specific validation
        const transactionRequest = record.request;
        // Validate transaction link
        if (!transactionRequest.link || !transactionRequest.link.startsWith('http')) {
            return this.paymentStore.update(record.id, {
                status: types_1.PaymentStatus.FAILED,
                error: 'Invalid transaction link'
            });
        }
        return this.checkGenericStatus(record);
    }
    /**
     * Generic status check using network adapter
     *
     * @param record The payment record to check
     * @returns The updated payment record
     */
    async checkGenericStatus(record) {
        try {
            // Get the network adapter for this request
            const adapter = this.networkAdapters.get(record.request.network);
            if (!adapter) {
                throw new Error(`No adapter available for network: ${record.request.network}`);
            }
            // Only check if we have a signature
            if (!record.signature) {
                return record; // No signature to check yet
            }
            // Check the transaction status
            const status = await adapter.checkTransactionStatus(record.signature);
            // Update the payment record
            return this.paymentStore.update(record.id, { status });
        }
        catch (error) {
            // Update record with error
            return this.paymentStore.update(record.id, {
                status: types_1.PaymentStatus.FAILED,
                error: error.message
            });
        }
    }
    /**
     * Get all payments by type
     *
     * @param requestType The type of requests to retrieve
     * @returns Array of payment records
     */
    async getPaymentsByType(requestType) {
        return this.paymentStore.loadByType(requestType);
    }
    /**
     * Get payment record by ID
     *
     * @param paymentId The ID of the payment to retrieve
     * @returns The payment record or null if not found
     */
    async getPayment(paymentId) {
        return this.paymentStore.load(paymentId);
    }
    /**
     * Delete a payment record
     *
     * @param paymentId The ID of the payment to delete
     * @returns True if deleted, false if not found
     */
    async deletePayment(paymentId) {
        return this.paymentStore.delete(paymentId);
    }
    /**
     * Bulk status check for multiple payments
     *
     * @param paymentIds Array of payment IDs to check
     * @returns Array of updated payment records
     */
    async bulkCheckStatus(paymentIds) {
        const results = [];
        for (const paymentId of paymentIds) {
            try {
                const updatedRecord = await this.checkStatus(paymentId);
                results.push(updatedRecord);
            }
            catch (error) {
                // Log error but continue with other payments
                console.error(`Error checking status for payment ${paymentId}:`, error);
            }
        }
        return results;
    }
    /**
     * Get payment statistics
     *
     * @returns Statistics about payments
     */
    async getPaymentStats() {
        const allTransfers = await this.paymentStore.loadByType(types_1.RequestType.TRANSFER);
        const allTransactions = await this.paymentStore.loadByType(types_1.RequestType.TRANSACTION);
        const allPayments = [...allTransfers, ...allTransactions];
        const stats = {
            total: allPayments.length,
            byStatus: {},
            byType: {},
            byNetwork: {}
        };
        // Initialize counters
        Object.values(types_1.PaymentStatus).forEach(status => stats.byStatus[status] = 0);
        Object.values(types_1.RequestType).forEach(type => stats.byType[type] = 0);
        Object.values(types_1.SVMNetwork).forEach(network => stats.byNetwork[network] = 0);
        // Count occurrences
        allPayments.forEach(payment => {
            stats.byStatus[payment.status]++;
            stats.byType[payment.request.type]++;
            stats.byNetwork[payment.request.network]++;
        });
        return stats;
    }
}
exports.TransactionRequestHandler = TransactionRequestHandler;
//# sourceMappingURL=transaction-handler.js.map
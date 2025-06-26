"use strict";
/**
 * SVM-Pay Transaction Request Handler
 *
 * This file implements the handler for transaction requests in the SVM-Pay protocol.
 * Transaction requests are interactive requests for complex transactions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRequestHandler = void 0;
const types_1 = require("./types");
const reference_1 = require("./reference");
/**
 * Handler for transaction requests
 */
class TransactionRequestHandler {
    /**
     * Create a new TransactionRequestHandler
     *
     * @param networkAdapters Map of network adapters for each supported network
     */
    constructor(networkAdapters) {
        this.networkAdapters = networkAdapters;
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
        // Generate a unique ID for this payment
        const id = (0, reference_1.generateReference)();
        // Create a payment record
        const record = {
            id,
            request,
            status: types_1.PaymentStatus.CREATED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        try {
            // Fetch the transaction from the provided link
            const _transaction = await adapter.fetchTransaction(request);
            // Return the payment record
            return {
                ...record,
                status: types_1.PaymentStatus.PENDING,
                updatedAt: Date.now()
            };
        }
        catch (error) {
            // Return the payment record with error
            return {
                ...record,
                status: types_1.PaymentStatus.FAILED,
                error: error.message,
                updatedAt: Date.now()
            };
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
        // In a real implementation, we would look up the payment record by ID
        // For this example, we'll create a dummy record
        const dummyRequest = {
            type: types_1.RequestType.TRANSACTION,
            network: types_1.SVMNetwork.SOLANA,
            recipient: 'dummy',
            link: 'https://example.com/transaction'
        };
        const record = {
            id: paymentId,
            request: dummyRequest,
            status: types_1.PaymentStatus.PENDING,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        try {
            // Get the network adapter for this request
            const adapter = this.networkAdapters.get(record.request.network);
            if (!adapter) {
                throw new Error(`No adapter available for network: ${record.request.network}`);
            }
            // Submit the transaction
            const txSignature = await adapter.submitTransaction(transaction, signature);
            // Return the updated payment record
            return {
                ...record,
                status: types_1.PaymentStatus.CONFIRMED,
                signature: txSignature,
                updatedAt: Date.now()
            };
        }
        catch (error) {
            // Return the payment record with error
            return {
                ...record,
                status: types_1.PaymentStatus.FAILED,
                error: error.message,
                updatedAt: Date.now()
            };
        }
    }
    /**
     * Check the status of a payment
     *
     * @param paymentId The ID of the payment to check
     * @param paymentType Optional type hint for the payment (transfer, transaction, etc.)
     * @returns The updated payment record
     */
    async checkStatus(paymentId, _paymentType) {
        // In a real implementation, we would look up the payment record by ID from a database
        // For this example, we'll create a dummy record but the structure supports dynamic types
        const dummyRequest = {
            type: types_1.RequestType.TRANSACTION,
            network: types_1.SVMNetwork.SOLANA,
            recipient: 'dummy',
            link: 'https://example.com/transaction'
        };
        const record = {
            id: paymentId,
            request: dummyRequest,
            status: types_1.PaymentStatus.PENDING,
            signature: 'dummy-signature',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        try {
            // Get the network adapter for this request
            const adapter = this.networkAdapters.get(record.request.network);
            if (!adapter) {
                throw new Error(`No adapter available for network: ${record.request.network}`);
            }
            // Check the transaction status
            const status = await adapter.checkTransactionStatus(record.signature);
            // Return the updated payment record
            return {
                ...record,
                status,
                updatedAt: Date.now()
            };
        }
        catch (error) {
            // Return the payment record with error
            return {
                ...record,
                status: types_1.PaymentStatus.FAILED,
                error: error.message,
                updatedAt: Date.now()
            };
        }
    }
    /**
     * Check status for multiple payment types dynamically
     *
     * @param paymentId The ID of the payment to check
     * @param requestType The type of request (transfer, transaction, etc.)
     * @returns The updated payment record
     */
    async checkStatusByType(paymentId, requestType) {
        // This method demonstrates how the handler can process different request types
        switch (requestType) {
            case types_1.RequestType.TRANSFER:
                // Handle transfer-specific status checking
                return this.checkTransferStatus(paymentId);
            case types_1.RequestType.TRANSACTION:
                // Handle transaction-specific status checking
                return this.checkStatus(paymentId, 'transaction');
            default:
                throw new Error(`Unsupported request type: ${requestType}`);
        }
    }
    /**
     * Check status specifically for transfer requests
     *
     * @param paymentId The ID of the transfer payment to check
     * @returns The updated payment record
     */
    async checkTransferStatus(paymentId) {
        // Transfer-specific status checking logic
        const dummyRequest = {
            type: types_1.RequestType.TRANSFER,
            network: types_1.SVMNetwork.SOLANA,
            recipient: 'dummy',
            amount: '1.0'
        };
        const _record = {
            id: paymentId,
            request: dummyRequest,
            status: types_1.PaymentStatus.PENDING,
            signature: 'dummy-transfer-signature',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        // Additional transfer-specific validation could go here
        return this.checkStatus(paymentId, 'transfer');
    }
}
exports.TransactionRequestHandler = TransactionRequestHandler;
//# sourceMappingURL=transaction-handler.js.map
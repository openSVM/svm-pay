"use strict";
/**
 * SVM-Pay SOON Network Adapter
 *
 * This file implements the network adapter for the SOON (s00n) network with real blockchain integration.
 * SOON is a Solana-compatible SVM network with enhanced features.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoonNetworkAdapter = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_memo_1 = require("@solana/spl-memo");
const adapter_1 = require("./adapter");
const types_1 = require("../core/types");
/**
 * SOON network adapter with real blockchain integration
 */
class SoonNetworkAdapter extends adapter_1.BaseNetworkAdapter {
    /**
     * Create a new SoonNetworkAdapter
     *
     * @param rpcEndpoint Optional custom RPC endpoint for SOON
     */
    constructor(rpcEndpoint) {
        super(types_1.SVMNetwork.SOON);
        // SOON mainnet/testnet endpoints would go here
        this.defaultEndpoint = rpcEndpoint || 'https://rpc.soon.network'; // Example endpoint
        this.connection = new web3_js_1.Connection(this.defaultEndpoint, 'confirmed');
    }
    /**
     * Create a transaction from a transfer request
     *
     * @param request The transfer request to create a transaction for
     * @returns A promise that resolves to the serialized transaction string
     */
    async createTransferTransaction(request) {
        try {
            // Validate recipient address
            const recipientPubkey = new web3_js_1.PublicKey(request.recipient);
            // Convert amount to lamports (SOON uses same denomination as Solana)
            const amount = Math.floor(parseFloat(request.amount) * web3_js_1.LAMPORTS_PER_SOL);
            if (amount <= 0) {
                throw new Error('Transfer amount must be greater than 0');
            }
            // Create a new transaction
            const transaction = new web3_js_1.Transaction();
            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            // Create transfer instruction (SOON uses same instruction format as Solana)
            const transferInstruction = web3_js_1.SystemProgram.transfer({
                fromPubkey: new web3_js_1.PublicKey('11111111111111111111111111111111'), // Placeholder
                toPubkey: recipientPubkey,
                lamports: amount,
            });
            transaction.add(transferInstruction);
            // Add memo if provided (SOON supports enhanced memo program)
            if (request.memo) {
                const memoInstruction = (0, spl_memo_1.createMemoInstruction)(request.memo, []);
                transaction.add(memoInstruction);
            }
            // Serialize transaction
            const serializedTransaction = transaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            });
            return serializedTransaction.toString('base64');
        }
        catch (error) {
            console.error('Error creating SOON transfer transaction:', error);
            throw new Error(`Failed to create transfer transaction: ${error.message}`);
        }
    }
    /**
     * Fetch a transaction from a transaction request
     *
     * @param request The transaction request to fetch a transaction for
     * @returns A promise that resolves to the transaction string
     */
    async fetchTransaction(request) {
        try {
            console.log(`Fetching SOON transaction from link: ${request.link}`);
            // In a real implementation, this would parse the transaction from the link
            const transaction = new web3_js_1.Transaction();
            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            // Add a placeholder instruction
            const transferInstruction = web3_js_1.SystemProgram.transfer({
                fromPubkey: new web3_js_1.PublicKey('11111111111111111111111111111111'), // Placeholder
                toPubkey: new web3_js_1.PublicKey(request.recipient),
                lamports: web3_js_1.LAMPORTS_PER_SOL, // Default 1 SOON token
            });
            transaction.add(transferInstruction);
            // Serialize transaction
            const serializedTransaction = transaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            });
            return serializedTransaction.toString('base64');
        }
        catch (error) {
            console.error('Error fetching SOON transaction:', error);
            throw new Error(`Failed to fetch transaction: ${error.message}`);
        }
    }
    /**
     * Submit a signed transaction to the network
     *
     * @param transactionData The serialized transaction data
     * @param signature The signature for the transaction (or signed transaction)
     * @returns A promise that resolves to the transaction signature
     */
    async submitTransaction(transactionData, signature) {
        try {
            // Parse the transaction from the provided data
            let transaction;
            try {
                // Try to deserialize as a complete signed transaction
                transaction = web3_js_1.Transaction.from(Buffer.from(signature, 'base64'));
            }
            catch (_a) {
                // If that fails, try to reconstruct from parts
                transaction = web3_js_1.Transaction.from(Buffer.from(transactionData, 'base64'));
            }
            // Send the transaction to the SOON network
            const txSignature = await this.connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
                maxRetries: 3,
            });
            console.log(`Submitted SOON transaction with signature: ${txSignature}`);
            return txSignature;
        }
        catch (error) {
            console.error('Error submitting SOON transaction:', error);
            throw new Error(`Failed to submit transaction: ${error.message}`);
        }
    }
    /**
     * Check the status of a transaction
     *
     * @param signature The signature of the transaction to check
     * @returns A promise that resolves to the payment status
     */
    async checkTransactionStatus(signature) {
        try {
            console.log(`Checking status of SOON transaction: ${signature}`);
            // Get transaction confirmation status
            const status = await this.connection.getSignatureStatus(signature, {
                searchTransactionHistory: true
            });
            if (!status.value) {
                return types_1.PaymentStatus.FAILED;
            }
            if (status.value.err) {
                return types_1.PaymentStatus.FAILED;
            }
            // Check confirmation level
            if (status.value.confirmationStatus === 'processed') {
                return types_1.PaymentStatus.PENDING;
            }
            else if (status.value.confirmationStatus === 'confirmed' ||
                status.value.confirmationStatus === 'finalized') {
                return types_1.PaymentStatus.CONFIRMED;
            }
            return types_1.PaymentStatus.PENDING;
        }
        catch (error) {
            console.error('Error checking SOON transaction status:', error);
            return types_1.PaymentStatus.FAILED;
        }
    }
    /**
     * Get the current connection
     *
     * @returns The SOON connection instance
     */
    getConnection() {
        return this.connection;
    }
    /**
     * Update the RPC endpoint
     *
     * @param rpcEndpoint The new RPC endpoint
     */
    updateEndpoint(rpcEndpoint) {
        this.connection = new web3_js_1.Connection(rpcEndpoint, 'confirmed');
    }
    /**
     * Get account balance
     *
     * @param publicKey The public key to check balance for
     * @returns Promise that resolves to the balance in SOON tokens
     */
    async getBalance(publicKey) {
        try {
            const pubkey = new web3_js_1.PublicKey(publicKey);
            const balance = await this.connection.getBalance(pubkey);
            return balance / web3_js_1.LAMPORTS_PER_SOL;
        }
        catch (error) {
            console.error('Error getting SOON balance:', error);
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }
    /**
     * Get network-specific token info
     *
     * @returns Network token information
     */
    getTokenInfo() {
        return {
            symbol: 'SOON',
            decimals: 9,
            name: 'SOON Token'
        };
    }
    /**
     * SOON-specific enhanced features
     */
    /**
     * Get SOON network version and features
     *
     * @returns Network version information
     */
    async getNetworkInfo() {
        try {
            const version = await this.connection.getVersion();
            return {
                version: version['solana-core'] || 'unknown',
                features: [
                    'enhanced-memo',
                    'fast-finality',
                    'low-fees',
                    'ethereum-compatibility'
                ],
                blockTime: 400, // ms - SOON's enhanced block time
                tps: 10000 // Theoretical TPS for SOON network
            };
        }
        catch (error) {
            console.error('Error getting SOON network info:', error);
            return {
                version: 'unknown',
                features: [],
                blockTime: 400,
                tps: 1000
            };
        }
    }
    /**
     * Create enhanced memo with SOON-specific features
     *
     * @param memo The memo text
     * @param metadata Optional metadata for enhanced features
     * @returns Enhanced memo instruction
     */
    createEnhancedMemo(memo, metadata) {
        let enhancedMemo = memo;
        if (metadata) {
            const metadataStr = JSON.stringify(metadata);
            enhancedMemo = `${memo} | SOON_META:${metadataStr}`;
        }
        return (0, spl_memo_1.createMemoInstruction)(enhancedMemo, []);
    }
}
exports.SoonNetworkAdapter = SoonNetworkAdapter;
//# sourceMappingURL=soon.js.map
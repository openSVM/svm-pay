"use strict";
/**
 * Solana utilities for SVM-Pay CLI
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolanaConnection = getSolanaConnection;
exports.createKeypairFromPrivateKey = createKeypairFromPrivateKey;
exports.getWalletBalance = getWalletBalance;
exports.sendPayment = sendPayment;
exports.isValidSolanaAddress = isValidSolanaAddress;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const config_1 = require("./config");
// Solana RPC endpoints
const SOLANA_RPC_ENDPOINTS = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com'
];
/**
 * Get Solana connection
 */
function getSolanaConnection() {
    const endpoint = SOLANA_RPC_ENDPOINTS[0];
    return new web3_js_1.Connection(endpoint, 'confirmed');
}
/**
 * Create keypair from private key
 */
function createKeypairFromPrivateKey(privateKey) {
    try {
        // Handle both base58 and array formats
        let secretKey;
        if (privateKey.startsWith('[') && privateKey.endsWith(']')) {
            // Array format: [1,2,3,...]
            const numbers = JSON.parse(privateKey);
            secretKey = new Uint8Array(numbers);
        }
        else {
            // Base58 format
            secretKey = bs58_1.default.decode(privateKey);
        }
        return web3_js_1.Keypair.fromSecretKey(secretKey);
    }
    catch (error) {
        throw new Error('Invalid private key format. Please provide a valid base58 string or array format.');
    }
}
/**
 * Get wallet balance in SOL
 */
async function getWalletBalance(privateKey) {
    if ((0, config_1.isTestMode)()) {
        console.log('TEST MODE: Simulating balance check');
        return 1.5; // Mock balance
    }
    try {
        const connection = getSolanaConnection();
        const keypair = createKeypairFromPrivateKey(privateKey);
        const balance = await connection.getBalance(keypair.publicKey);
        return balance / web3_js_1.LAMPORTS_PER_SOL;
    }
    catch (error) {
        throw new Error(`Failed to get wallet balance: ${error}`);
    }
}
/**
 * Send SOL payment
 */
async function sendPayment(privateKey, recipientAddress, amount, memo) {
    if ((0, config_1.isTestMode)()) {
        console.log('TEST MODE: Simulating payment');
        console.log(`Would send ${amount} SOL to ${recipientAddress}`);
        if (memo)
            console.log(`Memo: ${memo}`);
        return 'test_transaction_signature_' + Date.now();
    }
    try {
        const connection = getSolanaConnection();
        const fromKeypair = createKeypairFromPrivateKey(privateKey);
        const toPublicKey = new web3_js_1.PublicKey(recipientAddress);
        // Create transfer instruction
        const transferInstruction = web3_js_1.SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKey,
            lamports: Math.floor(amount * web3_js_1.LAMPORTS_PER_SOL)
        });
        // Create transaction
        const transaction = new web3_js_1.Transaction().add(transferInstruction);
        // Add memo if provided
        if (memo) {
            // Note: This would require importing @solana/spl-memo
            // For now, we'll skip the memo functionality
            console.log(`Note: Memo "${memo}" would be added to transaction`);
        }
        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromKeypair.publicKey;
        // Sign and send transaction
        transaction.sign(fromKeypair);
        const signature = await connection.sendRawTransaction(transaction.serialize());
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        return signature;
    }
    catch (error) {
        throw new Error(`Failed to send payment: ${error}`);
    }
}
/**
 * Validate Solana address
 */
function isValidSolanaAddress(address) {
    try {
        new web3_js_1.PublicKey(address);
        return true;
    }
    catch (_a) {
        return false;
    }
}
//# sourceMappingURL=solana.js.map
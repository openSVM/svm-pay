/**
 * Solana utilities for SVM-Pay CLI
 */
import { Connection, Keypair } from '@solana/web3.js';
/**
 * Get Solana connection
 */
export declare function getSolanaConnection(): Connection;
/**
 * Create keypair from private key
 */
export declare function createKeypairFromPrivateKey(privateKey: string): Keypair;
/**
 * Get wallet balance in SOL
 */
export declare function getWalletBalance(privateKey: string): Promise<number>;
/**
 * Send SOL payment
 */
export declare function sendPayment(privateKey: string, recipientAddress: string, amount: number, memo?: string): Promise<string>;
/**
 * Validate Solana address
 */
export declare function isValidSolanaAddress(address: string): boolean;
//# sourceMappingURL=solana.d.ts.map
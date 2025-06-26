/**
 * SVM-Pay Metadata Handler
 *
 * This file implements the metadata handling for SVM-Pay transactions.
 * Metadata includes label, message, and memo fields that provide context for transactions.
 * Includes real Solana memo instruction support.
 */
import { TransactionInstruction, PublicKey } from '@solana/web3.js';
/**
 * Encode metadata for inclusion in a transaction
 *
 * @param label Optional label describing the payment source
 * @param message Optional message describing the payment purpose
 * @param memo Optional memo to be included in the transaction
 * @returns Encoded metadata object
 */
export declare function encodeMetadata(label?: string, message?: string, memo?: string): {
    encodedLabel?: string;
    encodedMessage?: string;
    encodedMemo?: string;
};
/**
 * Decode metadata from a transaction
 *
 * @param encodedLabel Encoded label from the transaction
 * @param encodedMessage Encoded message from the transaction
 * @param encodedMemo Encoded memo from the transaction
 * @returns Decoded metadata object
 */
export declare function decodeMetadata(encodedLabel?: string, encodedMessage?: string, encodedMemo?: string): {
    label?: string;
    message?: string;
    memo?: string;
};
/**
 * Validate metadata fields
 *
 * @param label Label to validate
 * @param message Message to validate
 * @param memo Memo to validate
 * @returns Object with validation results
 */
export declare function validateMetadata(label?: string, message?: string, memo?: string): {
    isValid: boolean;
    errors: string[];
};
/**
 * Create a Solana memo instruction from metadata
 *
 * @param metadata The metadata to include in the memo
 * @param signers Optional array of additional signers for the memo
 * @returns Solana memo instruction
 */
export declare function createSolanaMemoInstruction(metadata: {
    label?: string;
    message?: string;
    memo?: string;
}, signers?: PublicKey[]): TransactionInstruction;
/**
 * Parse memo data from a Solana memo instruction
 *
 * @param memoData The memo data from the instruction
 * @returns Parsed metadata object
 */
export declare function parseSolanaMemoData(memoData: string): {
    label?: string;
    message?: string;
    memo?: string;
};
/**
 * Create memo instructions for different network types
 *
 * @param networkType The network type (solana, sonic, eclipse, soon)
 * @param metadata The metadata to include
 * @param signers Optional additional signers
 * @returns Network-specific memo instruction or data
 */
export declare function createNetworkMemoInstruction(networkType: string, metadata: {
    label?: string;
    message?: string;
    memo?: string;
}, signers?: PublicKey[]): TransactionInstruction | string;
/**
 * Optimize memo content for size and readability
 *
 * @param metadata The metadata to optimize
 * @returns Optimized metadata that fits within limits
 */
export declare function optimizeMemoContent(metadata: {
    label?: string;
    message?: string;
    memo?: string;
}): {
    label?: string;
    message?: string;
    memo?: string;
};
//# sourceMappingURL=metadata.d.ts.map
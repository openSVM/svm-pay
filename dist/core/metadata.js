"use strict";
/**
 * SVM-Pay Metadata Handler
 *
 * This file implements the metadata handling for SVM-Pay transactions.
 * Metadata includes label, message, and memo fields that provide context for transactions.
 * Includes real Solana memo instruction support.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMetadata = encodeMetadata;
exports.decodeMetadata = decodeMetadata;
exports.validateMetadata = validateMetadata;
exports.createSolanaMemoInstruction = createSolanaMemoInstruction;
exports.parseSolanaMemoData = parseSolanaMemoData;
exports.createNetworkMemoInstruction = createNetworkMemoInstruction;
exports.optimizeMemoContent = optimizeMemoContent;
const spl_memo_1 = require("@solana/spl-memo");
/**
 * Encode metadata for inclusion in a transaction
 *
 * @param label Optional label describing the payment source
 * @param message Optional message describing the payment purpose
 * @param memo Optional memo to be included in the transaction
 * @returns Encoded metadata object
 */
function encodeMetadata(label, message, memo) {
    return {
        encodedLabel: label ? encodeURIComponent(label) : undefined,
        encodedMessage: message ? encodeURIComponent(message) : undefined,
        encodedMemo: memo ? encodeURIComponent(memo) : undefined,
    };
}
/**
 * Decode metadata from a transaction
 *
 * @param encodedLabel Encoded label from the transaction
 * @param encodedMessage Encoded message from the transaction
 * @param encodedMemo Encoded memo from the transaction
 * @returns Decoded metadata object
 */
function decodeMetadata(encodedLabel, encodedMessage, encodedMemo) {
    return {
        label: encodedLabel ? decodeURIComponent(encodedLabel) : undefined,
        message: encodedMessage ? decodeURIComponent(encodedMessage) : undefined,
        memo: encodedMemo ? decodeURIComponent(encodedMemo) : undefined,
    };
}
/**
 * Validate metadata fields
 *
 * @param label Label to validate
 * @param message Message to validate
 * @param memo Memo to validate
 * @returns Object with validation results
 */
function validateMetadata(label, message, memo) {
    const errors = [];
    // Check label length
    if (label && label.length > 200) {
        errors.push('Label must be 200 characters or less');
    }
    // Check message length
    if (message && message.length > 500) {
        errors.push('Message must be 500 characters or less');
    }
    // Check memo length (Solana memo program has specific limits)
    if (memo && memo.length > 566) {
        errors.push('Memo must be 566 characters or less (Solana memo program limit)');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Create a Solana memo instruction from metadata
 *
 * @param metadata The metadata to include in the memo
 * @param signers Optional array of additional signers for the memo
 * @returns Solana memo instruction
 */
function createSolanaMemoInstruction(metadata, signers = []) {
    // Combine metadata into a single memo string
    const memoParts = [];
    if (metadata.label) {
        memoParts.push(`Label: ${metadata.label}`);
    }
    if (metadata.message) {
        memoParts.push(`Message: ${metadata.message}`);
    }
    if (metadata.memo) {
        memoParts.push(metadata.memo);
    }
    const memoText = memoParts.join(' | ');
    if (!memoText) {
        throw new Error('No metadata provided for memo instruction');
    }
    // Validate memo length
    if (memoText.length > 566) {
        throw new Error('Combined metadata exceeds Solana memo limit of 566 characters');
    }
    return (0, spl_memo_1.createMemoInstruction)(memoText, signers);
}
/**
 * Parse memo data from a Solana memo instruction
 *
 * @param memoData The memo data from the instruction
 * @returns Parsed metadata object
 */
function parseSolanaMemoData(memoData) {
    const metadata = {};
    // Split by separator and parse each part
    const parts = memoData.split(' | ');
    for (const part of parts) {
        if (part.startsWith('Label: ')) {
            metadata.label = part.substring(7);
        }
        else if (part.startsWith('Message: ')) {
            metadata.message = part.substring(9);
        }
        else {
            // Treat anything else as memo content
            metadata.memo = part;
        }
    }
    return metadata;
}
/**
 * Create memo instructions for different network types
 *
 * @param networkType The network type (solana, sonic, eclipse, soon)
 * @param metadata The metadata to include
 * @param signers Optional additional signers
 * @returns Network-specific memo instruction or data
 */
function createNetworkMemoInstruction(networkType, metadata, signers = []) {
    switch (networkType.toLowerCase()) {
        case 'solana':
            return createSolanaMemoInstruction(metadata, signers);
        case 'sonic':
            // Sonic SVM uses similar memo structure to Solana
            return createSolanaMemoInstruction(metadata, signers);
        case 'eclipse':
            // Eclipse uses Solana-compatible memo instructions
            return createSolanaMemoInstruction(metadata, signers);
        case 'soon':
            // s00n network memo handling (similar to Solana for now)
            return createSolanaMemoInstruction(metadata, signers);
        default:
            throw new Error(`Unsupported network type for memo: ${networkType}`);
    }
}
/**
 * Optimize memo content for size and readability
 *
 * @param metadata The metadata to optimize
 * @returns Optimized metadata that fits within limits
 */
function optimizeMemoContent(metadata) {
    const maxLength = 566; // Solana memo limit
    // Calculate current length
    const memoParts = [];
    if (metadata.label)
        memoParts.push(`Label: ${metadata.label}`);
    if (metadata.message)
        memoParts.push(`Message: ${metadata.message}`);
    if (metadata.memo)
        memoParts.push(metadata.memo);
    const currentLength = memoParts.join(' | ').length;
    if (currentLength <= maxLength) {
        return metadata; // No optimization needed
    }
    // Optimize by truncating in order of priority: memo > message > label
    const optimized = { ...metadata };
    const overhead = ' | '.length * (memoParts.length - 1);
    let availableLength = maxLength - overhead;
    // Allocate space: label (50), message (150), memo (rest)
    if (optimized.label && optimized.label.length > 50) {
        optimized.label = optimized.label.substring(0, 47) + '...';
    }
    availableLength -= optimized.label ? `Label: ${optimized.label}`.length : 0;
    if (optimized.message && optimized.message.length > 150) {
        optimized.message = optimized.message.substring(0, 147) + '...';
    }
    availableLength -= optimized.message ? `Message: ${optimized.message}`.length : 0;
    if (optimized.memo && optimized.memo.length > availableLength) {
        optimized.memo = optimized.memo.substring(0, availableLength - 3) + '...';
    }
    return optimized;
}
//# sourceMappingURL=metadata.js.map
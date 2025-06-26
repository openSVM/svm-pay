"use strict";
/**
 * SVM-Pay Metadata Handler
 *
 * This file implements the metadata handling for SVM-Pay transactions.
 * Metadata includes label, message, and memo fields that provide context for transactions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMetadata = encodeMetadata;
exports.decodeMetadata = decodeMetadata;
exports.validateMetadata = validateMetadata;
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
    // Check memo length
    if (memo && memo.length > 1000) {
        errors.push('Memo must be 1000 characters or less');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=metadata.js.map
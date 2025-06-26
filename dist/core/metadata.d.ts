/**
 * SVM-Pay Metadata Handler
 *
 * This file implements the metadata handling for SVM-Pay transactions.
 * Metadata includes label, message, and memo fields that provide context for transactions.
 */
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
//# sourceMappingURL=metadata.d.ts.map
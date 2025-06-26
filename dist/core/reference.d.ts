/**
 * SVM-Pay Reference Generator
 *
 * This file implements the reference ID generation for SVM-Pay transactions.
 * Reference IDs are used to uniquely identify transactions and link them to merchant systems.
 */
/**
 * Generate a random reference ID
 *
 * @returns A base58-encoded 32-byte reference ID
 */
export declare function generateReference(): string;
/**
 * Generate a deterministic reference ID based on input data
 *
 * @param data The data to generate a reference ID from
 * @returns A base58-encoded 32-byte reference ID
 */
export declare function generateDeterministicReference(data: string): string;
/**
 * Validate a reference ID
 *
 * @param reference The reference ID to validate
 * @returns True if the reference ID is valid, false otherwise
 */
export declare function validateReference(reference: string): boolean;
//# sourceMappingURL=reference.d.ts.map
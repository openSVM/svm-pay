"use strict";
/**
 * SVM-Pay Reference Generator
 *
 * This file implements the reference ID generation for SVM-Pay transactions.
 * Reference IDs are used to uniquely identify transactions and link them to merchant systems.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReference = generateReference;
exports.generateDeterministicReference = generateDeterministicReference;
exports.validateReference = validateReference;
const crypto_1 = require("crypto");
/**
 * Generate a random reference ID
 *
 * @returns A base58-encoded 32-byte reference ID
 */
function generateReference() {
    // Generate 32 random bytes
    const bytes = (0, crypto_1.randomBytes)(32);
    // Convert to base58
    return base58Encode(bytes);
}
/**
 * Generate a deterministic reference ID based on input data
 *
 * @param data The data to generate a reference ID from
 * @returns A base58-encoded 32-byte reference ID
 */
function generateDeterministicReference(data) {
    // Create a SHA-256 hash of the input data
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(data).digest();
    // Convert to base58
    return base58Encode(hash);
}
/**
 * Validate a reference ID
 *
 * @param reference The reference ID to validate
 * @returns True if the reference ID is valid, false otherwise
 */
function validateReference(reference) {
    try {
        // Attempt to decode the reference ID
        const decoded = base58Decode(reference);
        // Check that it's 32 bytes
        return decoded.length === 32;
    }
    catch (error) {
        return false;
    }
}
/**
 * Encode a Buffer as base58
 *
 * @param buffer The buffer to encode
 * @returns A base58-encoded string
 */
function base58Encode(buffer) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    let value = 0;
    let carry = 0;
    for (let i = 0; i < buffer.length; i++) {
        value = (value * 256) + buffer[i];
        carry = 0;
        while (value >= 58 || carry > 0) {
            const remainder = value % 58;
            value = Math.floor(value / 58);
            result = ALPHABET[remainder] + result;
            carry = 0;
        }
        if (value > 0) {
            result = ALPHABET[value] + result;
            value = 0;
        }
    }
    // Add leading '1's for leading zeros in the buffer
    for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
        result = '1' + result;
    }
    return result;
}
/**
 * Decode a base58 string to a Buffer
 *
 * @param str The base58 string to decode
 * @returns A Buffer containing the decoded bytes
 */
function base58Decode(str) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const ALPHABET_MAP = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET[i]] = i;
    }
    let result = Buffer.alloc(str.length * 2); // Allocate max possible size
    let resultLength = 0;
    let value = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charValue = ALPHABET_MAP[char];
        if (charValue === undefined) {
            throw new Error(`Invalid character: ${char}`);
        }
        value = value * 58 + charValue;
        if (value > 0xFF) {
            result[resultLength++] = value & 0xFF;
            value >>= 8;
        }
    }
    if (value > 0) {
        result[resultLength++] = value;
    }
    // Count leading '1's (zeros)
    let leadingZeros = 0;
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
        leadingZeros++;
    }
    // Add leading zeros
    const finalResult = Buffer.alloc(resultLength + leadingZeros);
    for (let i = 0; i < leadingZeros; i++) {
        finalResult[i] = 0;
    }
    // Copy the rest of the result in reverse order
    for (let i = 0; i < resultLength; i++) {
        finalResult[leadingZeros + i] = result[resultLength - 1 - i];
    }
    return finalResult;
}
//# sourceMappingURL=reference.js.map
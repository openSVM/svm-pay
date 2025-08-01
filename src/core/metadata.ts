/**
 * SVM-Pay Metadata Handler
 * 
 * This file implements the metadata handling for SVM-Pay transactions.
 * Metadata includes label, message, and memo fields that provide context for transactions.
 * Includes real Solana memo instruction support.
 */

import { TransactionInstruction, PublicKey } from '@solana/web3.js';
import { createMemoInstruction } from '@solana/spl-memo';

/**
 * Encode metadata for inclusion in a transaction
 * 
 * @param label Optional label describing the payment source
 * @param message Optional message describing the payment purpose
 * @param memo Optional memo to be included in the transaction
 * @returns Encoded metadata object
 */
export function encodeMetadata(label?: string, message?: string, memo?: string): {
  encodedLabel?: string;
  encodedMessage?: string;
  encodedMemo?: string;
} {
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
export function decodeMetadata(encodedLabel?: string, encodedMessage?: string, encodedMemo?: string): {
  label?: string;
  message?: string;
  memo?: string;
} {
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
export function validateMetadata(label?: string, message?: string, memo?: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
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
export function createSolanaMemoInstruction(
  metadata: { label?: string; message?: string; memo?: string },
  signers: PublicKey[] = []
): TransactionInstruction {
  // Combine metadata into a single memo string
  const memoParts: string[] = [];
  
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
  
  return createMemoInstruction(memoText, signers);
}

/**
 * Parse memo data from a Solana memo instruction
 * 
 * @param memoData The memo data from the instruction
 * @returns Parsed metadata object
 */
export function parseSolanaMemoData(memoData: string): {
  label?: string;
  message?: string;
  memo?: string;
} {
  const metadata: { label?: string; message?: string; memo?: string } = {};
  
  // Split by separator and parse each part
  const parts = memoData.split(' | ');
  
  for (const part of parts) {
    if (part.startsWith('Label: ')) {
      metadata.label = part.substring(7);
    } else if (part.startsWith('Message: ')) {
      metadata.message = part.substring(9);
    } else {
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
export function createNetworkMemoInstruction(
  networkType: string,
  metadata: { label?: string; message?: string; memo?: string },
  signers: PublicKey[] = []
): TransactionInstruction | string {
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
 * Optimize memo content for size and readability with improved heuristics
 * 
 * @param metadata The metadata to optimize
 * @returns Optimized metadata that fits within limits
 */
export function optimizeMemoContent(metadata: {
  label?: string;
  message?: string;
  memo?: string;
}): { label?: string; message?: string; memo?: string } {
  const maxLength = 566; // Solana memo limit
  let wasOptimized = false;
  
  // Calculate current length
  const memoParts: string[] = [];
  if (metadata.label) memoParts.push(`Label: ${metadata.label}`);
  if (metadata.message) memoParts.push(`Message: ${metadata.message}`);
  if (metadata.memo) memoParts.push(metadata.memo);
  
  const currentLength = memoParts.join(' | ').length;
  
  if (currentLength <= maxLength) {
    return metadata; // No optimization needed
  }
  
  console.warn(`⚠ Memo content exceeds ${maxLength} character limit (current: ${currentLength} chars)`);
  console.warn('   Applying intelligent truncation to fit within Solana memo constraints...');
  
  // Prioritize message over label, and preserve custom memo content when possible
  const optimized = { ...metadata };
  const separator = ' | ';
  const separatorOverhead = separator.length * (memoParts.length - 1);
  let availableLength = maxLength - separatorOverhead;
  
  // Strategy: Allocate space dynamically based on content priority and length
  // Priority: 1) Custom memo (most important), 2) Message (context), 3) Label (identification)
  
  // Reserve space for custom memo first (it's usually the most important)
  let memoSpace = 0;
  if (optimized.memo) {
    memoSpace = Math.min(optimized.memo.length, Math.floor(availableLength * 0.6)); // 60% for memo
    availableLength -= memoSpace;
  }
  
  // Allocate remaining space between label and message (favor message for context)
  const remainingSpace = availableLength;
  const messageSpace = Math.min(
    optimized.message ? optimized.message.length : 0,
    Math.floor(remainingSpace * 0.7) // 70% of remaining for message
  );
  const labelSpace = remainingSpace - messageSpace;
  
  // Apply truncation with ellipsis
  if (optimized.label && `Label: ${optimized.label}`.length > labelSpace) {
    const availableForLabel = Math.max(0, labelSpace - 10); // Reserve space for "Label: ..."
    if (availableForLabel > 3) { // Only truncate if we have meaningful space
      optimized.label = optimized.label.substring(0, availableForLabel - 3) + '...';
      wasOptimized = true;
    } else {
      // If no meaningful space, remove label entirely
      optimized.label = undefined;
      wasOptimized = true;
      console.warn('   ⚠ Label removed due to space constraints');
    }
  }
  
  if (optimized.message && `Message: ${optimized.message}`.length > messageSpace) {
    const availableForMessage = Math.max(0, messageSpace - 12); // Reserve space for "Message: ..."
    if (availableForMessage > 3) {
      optimized.message = optimized.message.substring(0, availableForMessage - 3) + '...';
      wasOptimized = true;
    } else {
      optimized.message = undefined;
      wasOptimized = true;
      console.warn('   ⚠ Message removed due to space constraints');
    }
  }
  
  if (optimized.memo && optimized.memo.length > memoSpace) {
    if (memoSpace > 3) {
      optimized.memo = optimized.memo.substring(0, memoSpace - 3) + '...';
      wasOptimized = true;
    } else {
      optimized.memo = undefined;
      wasOptimized = true;
      console.warn('   ⚠ Custom memo removed due to space constraints');
    }
  }
  
  // Final verification
  const finalParts: string[] = [];
  if (optimized.label) finalParts.push(`Label: ${optimized.label}`);
  if (optimized.message) finalParts.push(`Message: ${optimized.message}`);
  if (optimized.memo) finalParts.push(optimized.memo);
  
  const finalLength = finalParts.join(' | ').length;
  
  if (wasOptimized) {
    console.warn(`   ✓ Memo optimized: ${currentLength} → ${finalLength} characters`);
    if (finalLength > maxLength) {
      console.error(`   ❌ ERROR: Optimization failed, still exceeds limit (${finalLength}/${maxLength})`);
    }
  }
  
  return optimized;
}

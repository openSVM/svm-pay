/**
 * Enhanced Assembly-BPF SDK for SVM-Pay
 * 
 * This SDK provides low-level Assembly and LLVM IR abstractions for developing
 * BPF programs that work with SVM-Pay across all supported SVM networks.
 * 
 * Features comprehensive security validation, optimization, ELF parsing,
 * and integration testing capabilities.
 */

export * from './types';
export * from './core';
export * from './helpers';
export * from './templates';
export * from './loader';
export * from './syscalls';
export * from './memory';
export * from './examples';
export * from './validation';
export * from './elf-parser';
export * from './integration-tests';

// Main SDK class
export { AssemblyBPFSDK } from './sdk';
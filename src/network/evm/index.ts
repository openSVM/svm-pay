/**
 * SVM-Pay EVM Network Module
 * 
 * This file exports all the EVM network adapters and utilities for cross-chain functionality.
 */

// Export EVM adapter interface and factory
export * from './adapter';

// Export specific EVM network adapters
export * from './ethereum';

// Additional EVM networks can be added here as needed
// export * from './bnb-chain';
// export * from './polygon';
// export * from './arbitrum';
// export * from './optimism';
// export * from './avalanche';
/**
 * SVM-Pay Bridge Utilities
 * 
 * This file contains utility functions for bridge operations and management.
 */

import { 
  BridgeAdapter, 
  BridgeQuote,
  CrossChainTransferRequest,
  SupportedNetwork,
  SVMNetwork 
} from '../core/types';
import { BridgeAdapterFactory } from './adapter';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

/**
 * Get the best bridge quote from all available bridges
 * 
 * @param request The cross-chain transfer request
 * @returns The best quote and corresponding bridge adapter
 */
export async function getBestBridgeQuote(
  request: CrossChainTransferRequest
): Promise<{ quote: BridgeQuote; adapter: BridgeAdapter } | null> {
  try {
    // Find all compatible bridges
    const compatibleAdapters = BridgeAdapterFactory.findCompatibleAdapters(
      request.sourceNetwork,
      request.destinationNetwork,
      request.token
    );
    
    if (compatibleAdapters.length === 0) {
      return null;
    }
    
    // Get quotes from all compatible bridges
    const quotePromises = compatibleAdapters.map(async (adapter) => {
      try {
        const quote = await adapter.quote(request);
        return { quote, adapter, score: calculateQuoteScore(quote) };
      } catch (error) {
        console.warn(`Failed to get quote from ${adapter.info.name}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(quotePromises);
    const validResults = results.filter((result): result is NonNullable<typeof result> => result !== null);
    
    if (validResults.length === 0) {
      return null;
    }
    
    // Sort by score (higher is better) and return the best
    validResults.sort((a, b) => b.score - a.score);
    const best = validResults[0];
    
    return { quote: best.quote, adapter: best.adapter };
  } catch (error) {
    console.error('Failed to get best bridge quote:', error);
    return null;
  }
}

/**
 * Calculate a score for a bridge quote to determine the best option
 * Higher score is better
 * 
 * @param quote The bridge quote to score
 * @returns A numerical score
 */
function calculateQuoteScore(quote: BridgeQuote): number {
  // Use BigNumber for precise calculations
  const outputAmount = new BigNumber(quote.outputAmount);
  const inputAmount = new BigNumber(quote.inputAmount);
  const fee = new BigNumber(quote.fee);
  
  // Validate inputs
  if (outputAmount.isNaN() || inputAmount.isNaN() || fee.isNaN() || inputAmount.isZero()) {
    return 0;
  }
  
  // Calculate efficiency ratio (output/input) 
  const efficiency = outputAmount.dividedBy(inputAmount);
  
  // Calculate time score (faster is better, max 600 seconds)
  const timeScore = Math.max(0, (600 - quote.estimatedTime) / 600);
  
  // Calculate fee score (lower fees are better)
  const feeRatio = fee.dividedBy(inputAmount);
  const feeScore = Math.max(0, new BigNumber(1).minus(feeRatio.multipliedBy(10)).toNumber());
  
  // Weighted score: 50% efficiency, 30% time, 20% fees
  return (efficiency.toNumber() * 0.5) + (timeScore * 0.3) + (feeScore * 0.2);
}

/**
 * Get all available bridges for a specific network pair and token
 * 
 * @param sourceNetwork Source network
 * @param destinationNetwork Destination network
 * @param token Token address
 * @returns Array of compatible bridge adapters with their info
 */
export function getAvailableBridges(
  sourceNetwork: SupportedNetwork,
  destinationNetwork: SVMNetwork,
  token: string
): Array<{ adapter: BridgeAdapter; info: any }> {
  const compatibleAdapters = BridgeAdapterFactory.findCompatibleAdapters(
    sourceNetwork,
    destinationNetwork,
    token
  );
  
  return compatibleAdapters.map(adapter => ({
    adapter,
    info: {
      id: adapter.info.id,
      name: adapter.info.name,
      fees: adapter.info.fees,
      estimatedTime: adapter.info.estimatedTime
    }
  }));
}

/**
 * Initialize default bridge adapters
 * This should be called once during application startup
 */
export function initializeDefaultBridges(): void {
  // Import and register default bridges
  // This is done here to avoid circular dependencies
  import('./wormhole').then(({ WormholeBridgeAdapter }) => {
    BridgeAdapterFactory.registerAdapter(new WormholeBridgeAdapter());
  });
  
  import('./allbridge').then(({ AllbridgeBridgeAdapter }) => {
    BridgeAdapterFactory.registerAdapter(new AllbridgeBridgeAdapter());
  });
}

/**
 * Common token addresses and aliases for normalization
 */
const TOKEN_ALIASES: Record<string, Set<string>> = {
  // Ethereum USDC
  '0xa0b86a33e6441c4d0c85c81a1a4e18a3f3f3f77f': new Set([
    '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F', // Correct checksum
    '0xa0b86a33e6441c4d0c85c81a1a4e18a3f3f3f77f'  // Lowercase
  ]),
  // Polygon USDC  
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': new Set([
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Mixed case
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'  // Lowercase
  ]),
  // Add more token aliases as needed
};

/**
 * Normalize a token address for comparison
 * 
 * @param token The token address to normalize
 * @param network The network the token belongs to
 * @returns The normalized token address
 */
export function normalizeTokenAddress(token: string, network: string): string {
  if (!token) return token;
  
  // For EVM networks, use checksum address
  if (['ethereum', 'bnb-chain', 'polygon', 'arbitrum', 'optimism', 'avalanche'].includes(network)) {
    try {
      return ethers.getAddress(token.toLowerCase());
    } catch {
      // If checksum fails, return lowercase for comparison
      return token.toLowerCase();
    }
  }
  
  // For SVM networks, return as-is (they are case-sensitive)
  return token;
}

/**
 * Check if two token addresses are equivalent (including aliases)
 * 
 * @param token1 First token address
 * @param token2 Second token address  
 * @param network The network context
 * @returns True if tokens are equivalent
 */
export function areTokensEquivalent(token1: string, token2: string, network: string): boolean {
  const normalized1 = normalizeTokenAddress(token1, network);
  const normalized2 = normalizeTokenAddress(token2, network);
  
  // Direct comparison
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Check aliases
  const aliasSet = TOKEN_ALIASES[normalized1.toLowerCase()];
  if (aliasSet && aliasSet.has(normalized2.toLowerCase())) {
    return true;
  }
  
  const reverseAliasSet = TOKEN_ALIASES[normalized2.toLowerCase()];
  if (reverseAliasSet && reverseAliasSet.has(normalized1.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Common token addresses for validation
 */
const COMMON_TOKEN_PATTERNS = {
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  solana: /^[A-Za-z0-9]{32,44}$/,
  // Add more patterns as needed
};

/**
 * Validate a token address format with robust checksum validation
 * 
 * @param token The token address to validate
 * @param network The network to validate against
 * @returns True if valid, false otherwise
 */
function isValidTokenAddress(token: string, network: string): boolean {
  if (!token) return false;
  
  // Check for common EVM token address format with checksum validation
  if (['ethereum', 'bnb-chain', 'polygon', 'arbitrum', 'optimism', 'avalanche'].includes(network)) {
    try {
      // Use ethers.js for proper checksum validation
      ethers.getAddress(token);
      return true;
    } catch {
      return false;
    }
  }
  
  // Check for SVM token address format (base58 with proper length)
  if (['solana', 'sonic', 'eclipse', 'soon'].includes(network)) {
    return COMMON_TOKEN_PATTERNS.solana.test(token);
  }
  
  // Default to basic validation
  return token.length > 0;
}

/**
 * Validate a cross-chain transfer request
 * 
 * @param request The request to validate
 * @throws Error if the request is invalid
 */
export function validateCrossChainRequest(request: CrossChainTransferRequest): void {
  if (!request.sourceNetwork) {
    throw new Error('Source network is required');
  }
  
  if (!request.destinationNetwork) {
    throw new Error('Destination network is required');
  }
  
  if (!request.token) {
    throw new Error('Token address is required');
  }
  
  // Validate token address format
  if (!isValidTokenAddress(request.token, request.sourceNetwork)) {
    throw new Error(`Invalid token address format for ${request.sourceNetwork} network`);
  }
  
  if (!request.amount || Number(request.amount) <= 0 || isNaN(Number(request.amount))) {
    throw new Error('Amount must be a positive number');
  }
  
  if (!request.recipient) {
    throw new Error('Recipient address is required');
  }
  
  // Validate recipient address format
  if (!isValidTokenAddress(request.recipient, request.destinationNetwork)) {
    throw new Error(`Invalid recipient address format for ${request.destinationNetwork} network`);
  }
  
  if (request.sourceNetwork === request.destinationNetwork) {
    throw new Error('Source and destination networks cannot be the same');
  }
}

/**
 * Format bridge transfer time for display
 * 
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTransferTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.round(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
}

/**
 * Format bridge fee for display
 * 
 * @param fee Fee amount as string
 * @param inputAmount Input amount for calculating percentage
 * @returns Formatted fee string
 */
export function formatBridgeFee(fee: string, inputAmount: string): string {
  // Use BigNumber for precise calculations
  const feeBN = new BigNumber(fee);
  const inputBN = new BigNumber(inputAmount);
  
  // Check for valid numbers
  if (feeBN.isNaN() || inputBN.isNaN() || inputBN.isZero()) {
    return `${fee} (0.00%)`;
  }
  
  // Calculate percentage with high precision
  const percentage = feeBN.dividedBy(inputBN).multipliedBy(100);
  
  // Format percentage appropriately
  const formattedPercentage = percentage.isLessThan(0.01) ? 
    percentage.toFixed(4) : 
    percentage.toFixed(2);
  
  return `${fee} (${formattedPercentage}%)`;
}
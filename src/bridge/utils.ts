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
  const outputAmount = parseFloat(quote.outputAmount);
  const inputAmount = parseFloat(quote.inputAmount);
  const fee = parseFloat(quote.fee);
  
  // Calculate efficiency ratio (output/input)
  const efficiency = outputAmount / inputAmount;
  
  // Calculate time score (faster is better, max 600 seconds)
  const timeScore = Math.max(0, (600 - quote.estimatedTime) / 600);
  
  // Calculate fee score (lower fees are better)
  const feeRatio = fee / inputAmount;
  const feeScore = Math.max(0, 1 - feeRatio * 100); // Penalize high fee ratios
  
  // Weighted score: 50% efficiency, 30% time, 20% fees
  return (efficiency * 0.5) + (timeScore * 0.3) + (feeScore * 0.2);
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
  
  if (!request.amount || parseFloat(request.amount) <= 0) {
    throw new Error('Amount must be a positive number');
  }
  
  if (!request.recipient) {
    throw new Error('Recipient address is required');
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
  const feeNum = parseFloat(fee);
  const inputNum = parseFloat(inputAmount);
  const percentage = (feeNum / inputNum) * 100;
  
  return `${fee} (${percentage.toFixed(2)}%)`;
}
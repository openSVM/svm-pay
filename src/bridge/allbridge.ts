/**
 * SVM-Pay Allbridge Bridge Adapter
 * 
 * This file implements the bridge adapter for Allbridge, another popular cross-chain bridge
 * that supports transfers between various networks and Solana.
 */

import { 
  BridgeQuote, 
  BridgeTransferResult, 
  BridgeTransferStatus, 
  CrossChainTransferRequest,
  EVMNetwork,
  SVMNetwork 
} from '../core/types';
import { BaseBridgeAdapter } from './adapter';
import BigNumber from 'bignumber.js';

/**
 * Allbridge bridge adapter implementation
 */
export class AllbridgeBridgeAdapter extends BaseBridgeAdapter {
  private apiEndpoint: string;
  
  /**
   * Create a new AllbridgeBridgeAdapter
   * 
   * @param apiEndpoint Optional custom API endpoint for Allbridge
   */
  constructor(apiEndpoint?: string) {
    super({
      id: 'allbridge',
      name: 'Allbridge',
      supportedNetworks: {
        source: [
          EVMNetwork.ETHEREUM,
          EVMNetwork.BNB_CHAIN,
          EVMNetwork.POLYGON,
          EVMNetwork.AVALANCHE,
          SVMNetwork.SOLANA
        ],
        destination: [SVMNetwork.SOLANA]
      },
      supportedTokens: {
        [EVMNetwork.ETHEREUM]: [
          '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F', // USDC
          '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'  // WETH
        ],
        [EVMNetwork.BNB_CHAIN]: [
          '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
          '0x55d398326f99059fF775485246999027B3197955', // USDT
          '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'  // WBNB
        ],
        [EVMNetwork.POLYGON]: [
          '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
          '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
          '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'  // WMATIC
        ],
        [EVMNetwork.AVALANCHE]: [
          '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC
          '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // USDT
          '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'  // WAVAX
        ],
        [SVMNetwork.SOLANA]: [
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
          'So11111111111111111111111111111111111111112'  // SOL
        ]
      },
      fees: {
        percentage: 0.05 // 0.05% of transfer amount
      },
      estimatedTime: 180, // 3 minutes
      contracts: {
        [EVMNetwork.ETHEREUM]: '0x1A2B73207C883Ce8E51653d6A9cC8a022740cCA4',
        [EVMNetwork.BNB_CHAIN]: '0xBBbD1BbB4f9b936C3604906D7592A644071dE884',
        [EVMNetwork.POLYGON]: '0x7775d63836987c2C17f6F0c3E6daa4D5f3123C05',
        [EVMNetwork.AVALANCHE]: '0x842F5a5f6dF0c4EF073C2a9B7ee6ef634c8c8e0B7',
        [SVMNetwork.SOLANA]: 'bb1bBBB5f96936C3604906D7592A644071dE884A'
      }
    });
    
    this.apiEndpoint = apiEndpoint || 'https://api.allbridge.io';
  }
  
  /**
   * Quote a cross-chain transfer using Allbridge
   * 
   * @param request The cross-chain transfer request
   * @returns A promise that resolves to the bridge quote
   */
  async quote(request: CrossChainTransferRequest): Promise<BridgeQuote> {
    try {
      // Validate that this bridge supports the requested transfer
      if (!this.supportsTransfer(request.sourceNetwork, request.destinationNetwork, request.token)) {
        throw new Error(`Allbridge does not support transfer from ${request.sourceNetwork} to ${request.destinationNetwork} for token ${request.token}`);
      }
      
      // Calculate fees using BigNumber for precision
      const inputAmount = request.amount;
      const feeAmount = this.calculateFee(inputAmount);
      const inputBN = new BigNumber(inputAmount);
      const feeBN = new BigNumber(feeAmount);
      const outputAmount = inputBN.minus(feeBN).toString();
      
      // Generate quote
      const quote: BridgeQuote = {
        id: `allbridge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        inputAmount,
        outputAmount,
        fee: feeAmount,
        estimatedTime: this.info.estimatedTime,
        expiresAt: Date.now() + (10 * 60 * 1000), // Quote expires in 10 minutes
        data: {
          sourceNetwork: request.sourceNetwork,
          destinationNetwork: request.destinationNetwork,
          token: request.token,
          bridgeParams: request.bridgeParams
        }
      };
      
      return quote;
    } catch (error) {
      throw new Error(`Failed to get Allbridge quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Execute a cross-chain transfer using Allbridge
   * 
   * @param request The cross-chain transfer request
   * @param quote The bridge quote
   * @returns A promise that resolves to the transfer result
   */
  async execute(request: CrossChainTransferRequest, quote: BridgeQuote): Promise<BridgeTransferResult> {
    try {
      // Validate quote hasn't expired
      if (Date.now() > quote.expiresAt) {
        throw new Error('Quote has expired');
      }
      
      // In a real implementation, this would:
      // 1. Create the source network transaction
      // 2. Submit it to the Allbridge bridge contract
      // 3. Monitor for completion on destination
      
      // For now, return a mock result
      const result: BridgeTransferResult = {
        transferId: `allbridge-transfer-${Date.now()}`,
        sourceTransactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: BridgeTransferStatus.INITIATED
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to execute Allbridge transfer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Check the status of an Allbridge bridge transfer
   * 
   * @param transferId The transfer identifier
   * @returns A promise that resolves to the transfer status
   */
  async checkTransferStatus(transferId: string): Promise<BridgeTransferStatus> {
    try {
      // In a real implementation, this would query the Allbridge API
      // For now, return a mock status based on time (faster than Wormhole)
      const transferTime = parseInt(transferId.split('-').pop() || '0');
      const elapsed = Date.now() - transferTime;
      
      if (elapsed < 30000) { // Less than 30 seconds
        return BridgeTransferStatus.INITIATED;
      } else if (elapsed < 180000) { // Less than 3 minutes
        return BridgeTransferStatus.PENDING;
      } else {
        return BridgeTransferStatus.COMPLETED;
      }
    } catch (error) {
      throw new Error(`Failed to check Allbridge transfer status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Calculate the fee for a transfer using BigNumber for precision
   * 
   * @param amount The transfer amount
   * @returns The calculated fee
   */
  private calculateFee(amount: string): string {
    const amountBN = new BigNumber(amount);
    const percentageFee = amountBN.multipliedBy(this.info.fees.percentage || 0).dividedBy(100);
    
    return percentageFee.toString();
  }
}
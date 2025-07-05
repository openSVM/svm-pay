/**
 * SVM-Pay Wormhole Bridge Adapter
 * 
 * This file implements the bridge adapter for Wormhole, a popular cross-chain bridge
 * that supports transfers between EVM networks and Solana.
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
 * Wormhole bridge adapter implementation
 */
export class WormholeBridgeAdapter extends BaseBridgeAdapter {
  private apiEndpoint: string;
  
  /**
   * Create a new WormholeBridgeAdapter
   * 
   * @param apiEndpoint Optional custom API endpoint for Wormhole
   */
  constructor(apiEndpoint?: string) {
    super({
      id: 'wormhole',
      name: 'Wormhole',
      supportedNetworks: {
        source: [
          EVMNetwork.ETHEREUM,
          EVMNetwork.BNB_CHAIN,
          EVMNetwork.POLYGON,
          EVMNetwork.ARBITRUM,
          EVMNetwork.OPTIMISM,
          EVMNetwork.AVALANCHE,
          SVMNetwork.SOLANA
        ],
        destination: [SVMNetwork.SOLANA]
      },
      supportedTokens: {
        [EVMNetwork.ETHEREUM]: [
          '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F', // USDC
          '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'  // WETH
        ],
        [EVMNetwork.BNB_CHAIN]: [
          '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
          '0x55d398326f99059fF775485246999027B3197955', // USDT
          '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'  // BTCB
        ],
        [EVMNetwork.POLYGON]: [
          '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
          '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
          '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'  // WBTC
        ],
        [SVMNetwork.SOLANA]: [
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
          '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'  // BTC
        ]
      },
      fees: {
        fixed: '0.1', // 0.1 SOL fixed fee
        percentage: 0.1 // 0.1% of transfer amount
      },
      estimatedTime: 300, // 5 minutes
      contracts: {
        [EVMNetwork.ETHEREUM]: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
        [EVMNetwork.BNB_CHAIN]: '0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7',
        [EVMNetwork.POLYGON]: '0x7a4B5a56eD0F8E6be64B1A50b75B4F3E0ad0A6D6',
        [SVMNetwork.SOLANA]: 'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb'
      }
    });
    
    this.apiEndpoint = apiEndpoint || 'https://api.wormhole.com';
  }
  
  /**
   * Quote a cross-chain transfer using Wormhole
   * 
   * @param request The cross-chain transfer request
   * @returns A promise that resolves to the bridge quote
   */
  async quote(request: CrossChainTransferRequest): Promise<BridgeQuote> {
    try {
      // Validate that this bridge supports the requested transfer
      if (!this.supportsTransfer(request.sourceNetwork, request.destinationNetwork, request.token)) {
        throw new Error(`Wormhole does not support transfer from ${request.sourceNetwork} to ${request.destinationNetwork} for token ${request.token}`);
      }
      
      // Calculate fees using BigNumber for precision
      const inputAmount = request.amount;
      const feeAmount = this.calculateFee(inputAmount);
      const inputBN = new BigNumber(inputAmount);
      const feeBN = new BigNumber(feeAmount);
      const outputAmount = inputBN.minus(feeBN).toString();
      
      // Generate quote
      const quote: BridgeQuote = {
        id: `wormhole-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        inputAmount,
        outputAmount,
        fee: feeAmount,
        estimatedTime: this.info.estimatedTime,
        expiresAt: Date.now() + (15 * 60 * 1000), // Quote expires in 15 minutes
        data: {
          sourceNetwork: request.sourceNetwork,
          destinationNetwork: request.destinationNetwork,
          token: request.token,
          bridgeParams: request.bridgeParams
        }
      };
      
      return quote;
    } catch (error) {
      throw new Error(`Failed to get Wormhole quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Execute a cross-chain transfer using Wormhole
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
      // 2. Submit it to the Wormhole bridge contract
      // 3. Wait for attestation
      // 4. Create and submit the destination transaction
      
      // For now, return a mock result
      const result: BridgeTransferResult = {
        transferId: `wormhole-transfer-${Date.now()}`,
        sourceTransactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: BridgeTransferStatus.INITIATED
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to execute Wormhole transfer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Check the status of a Wormhole bridge transfer
   * 
   * @param transferId The transfer identifier
   * @returns A promise that resolves to the transfer status
   */
  async checkTransferStatus(transferId: string): Promise<BridgeTransferStatus> {
    try {
      // In a real implementation, this would query the Wormhole API
      // For now, return a mock status based on time
      const transferTime = parseInt(transferId.split('-').pop() || '0');
      const elapsed = Date.now() - transferTime;
      
      if (elapsed < 60000) { // Less than 1 minute
        return BridgeTransferStatus.INITIATED;
      } else if (elapsed < 300000) { // Less than 5 minutes
        return BridgeTransferStatus.PENDING;
      } else {
        return BridgeTransferStatus.COMPLETED;
      }
    } catch (error) {
      throw new Error(`Failed to check Wormhole transfer status: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    const fixedFee = new BigNumber(this.info.fees.fixed || '0');
    
    return percentageFee.plus(fixedFee).toString();
  }
}
/**
 * SVM-Pay Bridge Adapter Interface
 * 
 * This file defines the base interface and factory for bridge adapters in the SVM-Pay protocol.
 * Each supported bridge must implement this interface.
 */

import { 
  BridgeAdapter, 
  BridgeInfo, 
  BridgeQuote, 
  BridgeTransferResult, 
  BridgeTransferStatus, 
  CrossChainTransferRequest,
  SupportedNetwork,
  SVMNetwork 
} from '../core/types';

/**
 * Abstract base class for bridge adapters
 */
export abstract class BaseBridgeAdapter implements BridgeAdapter {
  /** Bridge information */
  readonly info: BridgeInfo;
  
  /**
   * Create a new BaseBridgeAdapter
   * 
   * @param info Bridge information
   */
  constructor(info: BridgeInfo) {
    this.info = info;
  }
  
  /**
   * Quote a cross-chain transfer
   * 
   * @param request The cross-chain transfer request
   * @returns A promise that resolves to the bridge quote
   */
  abstract quote(request: CrossChainTransferRequest): Promise<BridgeQuote>;
  
  /**
   * Execute a cross-chain transfer
   * 
   * @param request The cross-chain transfer request
   * @param quote The bridge quote
   * @returns A promise that resolves to the transfer result
   */
  abstract execute(request: CrossChainTransferRequest, quote: BridgeQuote): Promise<BridgeTransferResult>;
  
  /**
   * Check the status of a bridge transfer
   * 
   * @param transferId The transfer identifier
   * @returns A promise that resolves to the transfer status
   */
  abstract checkTransferStatus(transferId: string): Promise<BridgeTransferStatus>;
  
  /**
   * Check if this bridge supports a specific network pair and token
   * 
   * @param sourceNetwork Source network
   * @param destinationNetwork Destination network  
   * @param token Token address
   * @returns True if supported, false otherwise
   */
  supportsTransfer(
    sourceNetwork: SupportedNetwork, 
    destinationNetwork: SVMNetwork, 
    token: string
  ): boolean {
    // Check if source network is supported
    if (!this.info.supportedNetworks.source.includes(sourceNetwork)) {
      return false;
    }
    
    // Check if destination network is supported
    if (!this.info.supportedNetworks.destination.includes(destinationNetwork)) {
      return false;
    }
    
    // Check if token is supported on source network
    const sourceTokens = this.info.supportedTokens[sourceNetwork];
    if (!sourceTokens || !sourceTokens.includes(token)) {
      return false;
    }
    
    return true;
  }
}

/**
 * Factory for creating bridge adapters
 */
export class BridgeAdapterFactory {
  private static adapters: Map<string, BridgeAdapter> = new Map();
  
  /**
   * Register a bridge adapter
   * 
   * @param adapter The bridge adapter to register
   */
  static registerAdapter(adapter: BridgeAdapter): void {
    this.adapters.set(adapter.info.id, adapter);
  }
  
  /**
   * Get a bridge adapter by ID
   * 
   * @param bridgeId The bridge ID
   * @returns The bridge adapter, or undefined if none is registered
   */
  static getAdapter(bridgeId: string): BridgeAdapter | undefined {
    return this.adapters.get(bridgeId);
  }
  
  /**
   * Get all registered bridge adapters
   * 
   * @returns A map of all registered bridge adapters
   */
  static getAllAdapters(): Map<string, BridgeAdapter> {
    return new Map(this.adapters);
  }
  
  /**
   * Find compatible bridge adapters for a transfer
   * 
   * @param sourceNetwork Source network
   * @param destinationNetwork Destination network
   * @param token Token address
   * @returns Array of compatible bridge adapters
   */
  static findCompatibleAdapters(
    sourceNetwork: SupportedNetwork,
    destinationNetwork: SVMNetwork,
    token: string
  ): BridgeAdapter[] {
    const compatible: BridgeAdapter[] = [];
    
    for (const adapter of this.adapters.values()) {
      if (adapter.supportsTransfer(sourceNetwork, destinationNetwork, token)) {
        compatible.push(adapter);
      }
    }
    
    return compatible;
  }
}
/**
 * SVM-Pay EVM Network Adapter Base
 * 
 * This file implements the base class for EVM network adapters.
 */

import { 
  EVMNetworkAdapter, 
  EVMNetwork, 
  PaymentStatus, 
  TransferRequest 
} from '../../core/types';

/**
 * Abstract base class for EVM network adapters
 */
export abstract class BaseEVMNetworkAdapter implements EVMNetworkAdapter {
  /** The EVM network this adapter handles */
  readonly network: EVMNetwork;
  
  /** RPC endpoint for the network */
  protected rpcEndpoint: string;
  
  /** Chain ID for the network */
  protected chainId: number;
  
  /**
   * Create a new BaseEVMNetworkAdapter
   * 
   * @param network The EVM network this adapter handles
   * @param rpcEndpoint RPC endpoint for the network
   * @param chainId Chain ID for the network
   */
  constructor(network: EVMNetwork, rpcEndpoint: string, chainId: number) {
    this.network = network;
    this.rpcEndpoint = rpcEndpoint;
    this.chainId = chainId;
  }
  
  /**
   * Create a transaction from a transfer request
   * 
   * @param request The transfer request to create a transaction for
   * @returns A promise that resolves to the transaction string
   */
  abstract createTransferTransaction(request: TransferRequest): Promise<string>;
  
  /**
   * Submit a signed transaction to the network
   * 
   * @param transaction The transaction to submit
   * @param signature The signature for the transaction
   * @returns A promise that resolves to the transaction hash
   */
  abstract submitTransaction(transaction: string, signature: string): Promise<string>;
  
  /**
   * Check the status of a transaction
   * 
   * @param signature The transaction hash to check
   * @returns A promise that resolves to the payment status
   */
  abstract checkTransactionStatus(signature: string): Promise<PaymentStatus>;
  
  /**
   * Get token balance for an address
   * 
   * @param address The address to check
   * @param tokenAddress The token contract address
   * @returns A promise that resolves to the balance as a string
   */
  abstract getTokenBalance(address: string, tokenAddress: string): Promise<string>;
  
  /**
   * Get native token balance for an address
   * 
   * @param address The address to check
   * @returns A promise that resolves to the balance as a string
   */
  abstract getNativeBalance(address: string): Promise<string>;
  
  /**
   * Get the current RPC endpoint
   * 
   * @returns The RPC endpoint
   */
  getRpcEndpoint(): string {
    return this.rpcEndpoint;
  }
  
  /**
   * Get the chain ID
   * 
   * @returns The chain ID
   */
  getChainId(): number {
    return this.chainId;
  }
  
  /**
   * Update the RPC endpoint
   * 
   * @param rpcEndpoint The new RPC endpoint
   */
  updateEndpoint(rpcEndpoint: string): void {
    this.rpcEndpoint = rpcEndpoint;
  }
  
  /**
   * Check if an address is a valid Ethereum address
   * 
   * @param address The address to validate
   * @returns True if valid, false otherwise
   */
  protected isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  /**
   * Check if a transaction hash is valid
   * 
   * @param hash The hash to validate
   * @returns True if valid, false otherwise
   */
  protected isValidTransactionHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }
}

/**
 * Factory for creating EVM network adapters
 */
export class EVMNetworkAdapterFactory {
  private static adapters: Map<EVMNetwork, EVMNetworkAdapter> = new Map();
  
  /**
   * Register an EVM network adapter
   * 
   * @param adapter The EVM network adapter to register
   */
  static registerAdapter(adapter: EVMNetworkAdapter): void {
    this.adapters.set(adapter.network, adapter);
  }
  
  /**
   * Get an EVM network adapter for a specific network
   * 
   * @param network The network to get an adapter for
   * @returns The EVM network adapter, or undefined if none is registered
   */
  static getAdapter(network: EVMNetwork): EVMNetworkAdapter | undefined {
    return this.adapters.get(network);
  }
  
  /**
   * Get all registered EVM network adapters
   * 
   * @returns A map of all registered EVM network adapters
   */
  static getAllAdapters(): Map<EVMNetwork, EVMNetworkAdapter> {
    return new Map(this.adapters);
  }
}
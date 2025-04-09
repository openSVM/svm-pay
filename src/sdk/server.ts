/**
 * SVM-Pay Server SDK
 * 
 * This file implements the server-side SDK for SVM-Pay.
 */

import { 
  PaymentRequest, 
  PaymentStatus, 
  RequestType, 
  SVMNetwork, 
  TransferRequest, 
  TransactionRequest 
} from '../core/types';
import { createURL, parseURL } from '../core/url-scheme';
import { generateReference, generateDeterministicReference } from '../core/reference';
import { NetworkAdapterFactory } from '../network/adapter';
import { SolanaNetworkAdapter } from '../network/solana';
import { SonicNetworkAdapter } from '../network/sonic';
import { EclipseNetworkAdapter } from '../network/eclipse';
import { SoonNetworkAdapter } from '../network/soon';

/**
 * SVM-Pay Server SDK configuration options
 */
export interface ServerSDKConfig {
  /** Default network to use if not specified */
  defaultNetwork?: SVMNetwork;
  
  /** Whether to enable debug logging */
  debug?: boolean;
  
  /** Secret key for signing server-side transactions */
  secretKey?: string;
}

/**
 * SVM-Pay Server SDK
 */
export class SVMPayServer {
  private config: ServerSDKConfig;
  
  /**
   * Create a new SVMPayServer instance
   * 
   * @param config Configuration options
   */
  constructor(config: ServerSDKConfig = {}) {
    this.config = {
      defaultNetwork: SVMNetwork.SOLANA,
      debug: false,
      ...config
    };
    
    // Register network adapters
    this.registerNetworkAdapters();
    
    this.log('SVMPay Server SDK initialized');
  }
  
  /**
   * Register network adapters
   */
  private registerNetworkAdapters(): void {
    NetworkAdapterFactory.registerAdapter(new SolanaNetworkAdapter());
    NetworkAdapterFactory.registerAdapter(new SonicNetworkAdapter());
    NetworkAdapterFactory.registerAdapter(new EclipseNetworkAdapter());
    NetworkAdapterFactory.registerAdapter(new SoonNetworkAdapter());
  }
  
  /**
   * Create a payment URL for a transfer request
   * 
   * @param recipient Recipient address
   * @param amount Amount to transfer (optional)
   * @param options Additional options
   * @returns Payment URL string
   */
  createTransferUrl(
    recipient: string,
    amount?: string,
    options: {
      network?: SVMNetwork;
      splToken?: string;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
      orderId?: string;
    } = {}
  ): string {
    const network = options.network || this.config.defaultNetwork || SVMNetwork.SOLANA;
    
    // Generate a reference from order ID if provided
    let references = options.references || [];
    if (options.orderId) {
      const orderReference = generateDeterministicReference(options.orderId);
      references = [...references, orderReference];
    }
    
    const request: TransferRequest = {
      type: RequestType.TRANSFER,
      network,
      recipient,
      amount,
      references,
      ...options
    };
    
    return createURL(request);
  }
  
  /**
   * Create a transaction request URL
   * 
   * @param recipient Recipient address
   * @param link URL to fetch transaction details
   * @param options Additional options
   * @returns Payment URL string
   */
  createTransactionUrl(
    recipient: string,
    link: string,
    options: {
      network?: SVMNetwork;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
      orderId?: string;
    } = {}
  ): string {
    const network = options.network || this.config.defaultNetwork || SVMNetwork.SOLANA;
    
    // Generate a reference from order ID if provided
    let references = options.references || [];
    if (options.orderId) {
      const orderReference = generateDeterministicReference(options.orderId);
      references = [...references, orderReference];
    }
    
    const request: TransactionRequest = {
      type: RequestType.TRANSACTION,
      network,
      recipient,
      link,
      references,
      ...options
    };
    
    return createURL(request);
  }
  
  /**
   * Parse a payment URL
   * 
   * @param url Payment URL to parse
   * @returns Parsed payment request
   */
  parseUrl(url: string): PaymentRequest {
    return parseURL(url);
  }
  
  /**
   * Generate a reference ID
   * 
   * @returns Reference ID string
   */
  generateReference(): string {
    return generateReference();
  }
  
  /**
   * Generate a deterministic reference ID from an order ID
   * 
   * @param orderId Order ID to generate a reference from
   * @returns Reference ID string
   */
  generateOrderReference(orderId: string): string {
    return generateDeterministicReference(orderId);
  }
  
  /**
   * Verify a transaction against a payment request
   * 
   * @param transaction Transaction to verify
   * @param request Payment request to verify against
   * @returns Whether the transaction is valid
   */
  verifyTransaction(transaction: any, request: PaymentRequest): boolean {
    // In a real implementation, this would verify that the transaction
    // matches the payment request
    
    this.log(`Verifying transaction against request`);
    
    // For this example, we'll just return true
    return true;
  }
  
  /**
   * Handle a transaction webhook
   * 
   * @param signature Transaction signature
   * @param reference Reference ID
   * @returns Payment status
   */
  async handleWebhook(signature: string, reference: string): Promise<PaymentStatus> {
    this.log(`Handling webhook for transaction: ${signature}`);
    this.log(`With reference: ${reference}`);
    
    // In a real implementation, this would verify the transaction
    // and update the payment status
    
    // For this example, we'll just return a confirmed status
    return PaymentStatus.CONFIRMED;
  }
  
  /**
   * Check the status of a transaction
   * 
   * @param signature Transaction signature
   * @param network Network to check on
   * @returns Payment status
   */
  async checkTransactionStatus(
    signature: string,
    network: SVMNetwork = this.config.defaultNetwork as SVMNetwork
  ): Promise<PaymentStatus> {
    this.log(`Checking status of transaction: ${signature}`);
    this.log(`On network: ${network}`);
    
    const adapter = NetworkAdapterFactory.getAdapter(network);
    if (!adapter) {
      throw new Error(`No adapter available for network: ${network}`);
    }
    
    return adapter.checkTransactionStatus(signature);
  }
  
  /**
   * Find transactions by reference
   * 
   * @param reference Reference ID to search for
   * @param network Network to search on
   * @returns Array of transaction signatures
   */
  async findTransactionsByReference(
    reference: string,
    network: SVMNetwork = this.config.defaultNetwork as SVMNetwork
  ): Promise<string[]> {
    this.log(`Finding transactions with reference: ${reference}`);
    this.log(`On network: ${network}`);
    
    // In a real implementation, this would search for transactions
    // with the specified reference
    
    // For this example, we'll just return an empty array
    return [];
  }
  
  /**
   * Log a debug message
   * 
   * @param message Message to log
   * @param data Additional data to log
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[SVMPay Server] ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }
}

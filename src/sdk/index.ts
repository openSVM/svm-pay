/**
 * SVM-Pay JavaScript SDK
 * 
 * This file implements the main SDK class for SVM-Pay.
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
import { generateReference } from '../core/reference';
import { TransferRequestHandler } from '../core/transfer-handler';
import { TransactionRequestHandler } from '../core/transaction-handler';
import { NetworkAdapterFactory } from '../network/adapter';
import { SolanaNetworkAdapter } from '../network/solana';
import { SonicNetworkAdapter } from '../network/sonic';
import { EclipseNetworkAdapter } from '../network/eclipse';
import { SoonNetworkAdapter } from '../network/soon';
import { loadConfig } from '../cli/utils/config';
import { getWalletBalance, createKeypairFromPrivateKey } from '../cli/utils/solana';
import { checkApiUsage } from '../cli/utils/openrouter';
import { loadPaymentHistory } from '../cli/utils/history';

/**
 * SVM-Pay SDK configuration options
 */
export interface SVMPayConfig {
  /** Default network to use if not specified */
  defaultNetwork?: SVMNetwork;
  
  /** API endpoint for server-side operations */
  apiEndpoint?: string;
  
  /** Whether to enable debug logging */
  debug?: boolean;
}

/**
 * SVM-Pay SDK
 */
export class SVMPay {
  private config: SVMPayConfig;
  private transferHandler: TransferRequestHandler;
  private transactionHandler: TransactionRequestHandler;
  
  /**
   * Create a new SVMPay SDK instance
   * 
   * @param config Configuration options
   */
  constructor(config: SVMPayConfig = {}) {
    this.config = {
      defaultNetwork: SVMNetwork.SOLANA,
      debug: false,
      ...config
    };
    
    // Register network adapters
    this.registerNetworkAdapters();
    
    // Create request handlers
    this.transferHandler = new TransferRequestHandler(NetworkAdapterFactory.getAllAdapters());
    this.transactionHandler = new TransactionRequestHandler(NetworkAdapterFactory.getAllAdapters());
    
    this.log('SVMPay SDK initialized');
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
   * @param amount Amount to transfer
   * @param options Additional options
   * @returns Payment URL string
   */
  createTransferUrl(
    recipient: string,
    amount: string,
    options: {
      network?: SVMNetwork;
      splToken?: string;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
    } = {}
  ): string {
    const network = options.network || this.config.defaultNetwork || SVMNetwork.SOLANA;
    
    if (!amount) {
      throw new Error('Amount is required for transfer requests');
    }
    
    const request: TransferRequest = {
      type: RequestType.TRANSFER,
      network,
      recipient,
      amount,
      ...options
    };
    
    return createURL(request);
  }
  
  /**
   * Create a payment URL for a transaction request
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
    } = {}
  ): string {
    const network = options.network || this.config.defaultNetwork || SVMNetwork.SOLANA;
    
    const request: TransactionRequest = {
      type: RequestType.TRANSACTION,
      network,
      recipient,
      link,
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
   * Process a payment request
   * 
   * @param request Payment request to process
   * @returns Payment record
   */
  async processPayment(request: PaymentRequest): Promise<any> {
    this.log(`Processing payment request of type: ${request.type}`);
    
    // Use local implementation
    if (request.type === RequestType.TRANSFER) {
      return this.transferHandler.processRequest(request as TransferRequest);
    } else {
      return this.transactionHandler.processRequest(request as TransactionRequest);
    }
  }
  
  /**
   * Check the status of a payment
   * 
   * @param paymentId ID of the payment to check
   * @returns Payment status
   */
  async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    this.log(`Checking status of payment: ${paymentId}`);
    
    // In a real implementation, this would determine which handler to use
    // based on the payment type
    const record = await this.transferHandler.checkStatus(paymentId);
    return record.status;
  }
  
  /**
   * Log a debug message
   * 
   * @param message Message to log
   * @param data Additional data to log
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[SVMPay] ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }
  
  /**
   * Check wallet balance (uses local CLI functionality)
   * 
   * @returns Wallet balance information
   */
  async checkWalletBalance(): Promise<any> {
    try {
      this.log('Using local CLI functionality for balance check');
      const config = loadConfig();
      
      if (!config.privateKey) {
        throw new Error('Private key not configured. Run "svm-pay setup -k <private-key>" first.');
      }
      
      // SECURITY FIX: Derive public address from private key instead of exposing private key
      const keypair = createKeypairFromPrivateKey(config.privateKey);
      const publicAddress = keypair.publicKey.toString();
      
      const balance = await getWalletBalance(config.privateKey);
      return {
        balance,
        address: publicAddress // Now returns the public address, not the private key
      };
    } catch (error) {
      this.log(`Failed to check balance: ${error}`);
      throw error;
    }
  }
  
  /**
   * Check API usage (uses local CLI functionality)
   * 
   * @returns API usage information
   */
  async checkApiUsage(): Promise<any> {
    try {
      this.log('Using local CLI functionality for API usage check');
      const config = loadConfig();
      
      if (!config.apiKey) {
        throw new Error('API key not configured. Run "svm-pay setup -a <api-key>" first.');
      }
      
      return await checkApiUsage(config.apiKey);
    } catch (error) {
      this.log(`Failed to check API usage: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get payment history (uses local CLI functionality)
   * 
   * @returns Payment history
   */
  async getPaymentHistory(): Promise<any> {
    try {
      this.log('Using local CLI functionality for payment history');
      return loadPaymentHistory();
    } catch (error) {
      this.log(`Failed to get payment history: ${error}`);
      throw error;
    }
  }
  
  /**
   * Setup wallet configuration (uses local CLI functionality)
   * 
   * @param options Setup options
   * @returns Setup result
   */
  async setupWallet(options: { 
    privateKey?: string;
    apiKey?: string;
    threshold?: number;
    recipient?: string;
  }): Promise<any> {
    try {
      this.log('Using local CLI functionality for wallet setup');
      const { loadConfig, saveConfig } = await import('../cli/utils/config');
      
      const config = loadConfig();
      
      if (options.privateKey) config.privateKey = options.privateKey;
      if (options.apiKey) config.apiKey = options.apiKey;
      if (options.threshold) config.threshold = options.threshold;
      if (options.recipient) config.recipientAddress = options.recipient;
      
      saveConfig(config);
      
      return { success: true, config };
    } catch (error) {
      this.log(`Failed to setup wallet: ${error}`);
      throw error;
    }
  }
}

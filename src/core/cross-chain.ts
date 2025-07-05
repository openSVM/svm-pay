/**
 * SVM-Pay Cross-Chain Payment Manager
 * 
 * This file implements the main orchestrator for cross-chain payments,
 * handling the flow from EVM networks to Solana via bridges.
 */

import { 
  BridgeAdapter,
  BridgeQuote,
  BridgeTransferResult,
  BridgeTransferStatus,
  CrossChainTransferRequest,
  PaymentRecord,
  PaymentStatus,
  RequestType,
  SVMNetwork,
  SupportedNetwork,
  QuoteExpirationCallback,
  QuoteRefreshAPI,
  PaymentStorageAdapter,
  MemoryPaymentStorageAdapter
} from '../core/types';
import { BridgeAdapterFactory } from '../bridge/adapter';
import { getBestBridgeQuote, validateCrossChainRequest } from '../bridge/utils';
import { NetworkAdapterFactory } from '../network/adapter';

/**
 * Cross-chain payment execution result
 */
export interface CrossChainPaymentResult {
  /** Payment record ID */
  paymentId: string;
  
  /** Bridge transfer result */
  bridgeResult: BridgeTransferResult;
  
  /** Bridge adapter used */
  bridge: BridgeAdapter;
  
  /** Quote used for the transfer */
  quote: BridgeQuote;
  
  /** Current status */
  status: PaymentStatus;
}

/**
 * Cross-chain payment manager
 */
export class CrossChainPaymentManager implements QuoteRefreshAPI {
  private paymentStore: PaymentStorageAdapter;
  private quoteExpirationCallbacks: QuoteExpirationCallback[] = [];
  
  /**
   * Create a new CrossChainPaymentManager
   * 
   * @param storageAdapter Optional storage adapter (defaults to in-memory)
   */
  constructor(storageAdapter?: PaymentStorageAdapter) {
    this.paymentStore = storageAdapter || new MemoryPaymentStorageAdapter();
  }
  
  /**
   * Execute a cross-chain payment
   * 
   * @param request The cross-chain transfer request
   * @returns Promise that resolves to the payment result
   */
  async executePayment(request: CrossChainTransferRequest): Promise<CrossChainPaymentResult> {
    try {
      // Validate the request
      validateCrossChainRequest(request);
      
      // Get the best bridge quote
      const bridgeResult = await getBestBridgeQuote(request);
      if (!bridgeResult) {
        throw new Error('No compatible bridges found for this transfer');
      }
      
      const { quote, adapter: bridge } = bridgeResult;
      
      // Create payment record
      const paymentId = this.generatePaymentId();
      const paymentRecord: PaymentRecord = {
        id: paymentId,
        request,
        status: PaymentStatus.CREATED,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bridgeUsed: bridge.info.id,
        bridgeQuote: quote
      };
      
      await this.paymentStore.set(paymentId, paymentRecord);
      
      try {
        // Update status to bridging
        await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGING);
        
        // Execute the bridge transfer
        const bridgeTransferResult = await bridge.execute(request, quote);
        
        // Update payment record with bridge transaction
        paymentRecord.bridgeTransactionHash = bridgeTransferResult.sourceTransactionHash;
        paymentRecord.updatedAt = Date.now();
        await this.paymentStore.set(paymentId, paymentRecord);
        
        // Monitor bridge transfer status (don't await - let it run in background)
        this.monitorBridgeTransfer(paymentId, bridge, bridgeTransferResult.transferId).catch(error => {
          console.error(`Background monitoring failed for payment ${paymentId}:`, error);
        });
        
        return {
          paymentId,
          bridgeResult: bridgeTransferResult,
          bridge,
          quote,
          status: PaymentStatus.BRIDGING
        };
        
      } catch (error) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED, error instanceof Error ? error.message : 'Unknown error');
        throw error;
      }
      
    } catch (error) {
      // Preserve original error information and stack trace with proper cause handling
      if (error instanceof Error) {
        const wrappedError = new Error(`Failed to execute cross-chain payment: ${error.message}`);
        wrappedError.stack = error.stack;
        
        // Use cause if supported (Node.js 16.9.0+), otherwise fallback gracefully
        if ('cause' in Error.prototype) {
          (wrappedError as any).cause = error;
        }
        
        throw wrappedError;
      } else {
        throw new Error(`Failed to execute cross-chain payment: ${String(error)}`);
      }
    }
  }
  
  /**
   * Get payment status
   * 
   * @param paymentId The payment ID
   * @returns The payment record
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentRecord | null> {
    return await this.paymentStore.get(paymentId);
  }
  
  /**
   * Monitor a bridge transfer until completion
   * 
   * @param paymentId The payment ID
   * @param bridge The bridge adapter
   * @param transferId The bridge transfer ID
   */
  private async monitorBridgeTransfer(
    paymentId: string,
    bridge: BridgeAdapter,
    transferId: string
  ): Promise<void> {
    const maxAttempts = 60; // Monitor for up to 10 minutes (10s intervals)
    let attempts = 0;
    let isMonitoring = true;
    
    const monitor = async (): Promise<void> => {
      if (!isMonitoring) return;
      
      try {
        const bridgeStatus = await bridge.checkTransferStatus(transferId);
        
        switch (bridgeStatus) {
          case BridgeTransferStatus.COMPLETED:
            isMonitoring = false;
            await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGE_CONFIRMED);
            // TODO: Handle final payment on destination network
            await this.updatePaymentStatus(paymentId, PaymentStatus.CONFIRMED);
            return;
            
          case BridgeTransferStatus.FAILED:
          case BridgeTransferStatus.REFUNDED:
            isMonitoring = false;
            await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGE_FAILED);
            return;
            
          case BridgeTransferStatus.PENDING:
          case BridgeTransferStatus.INITIATED:
            attempts++;
            if (attempts >= maxAttempts) {
              isMonitoring = false;
              await this.updatePaymentStatus(paymentId, PaymentStatus.EXPIRED, 'Bridge transfer timed out');
              return;
            }
            
            // Wait 10 seconds before next check using Promise-based approach
            await new Promise(resolve => setTimeout(resolve, 10000));
            if (isMonitoring) {
              await monitor();
            }
            break;
        }
      } catch (error) {
        console.error(`Error monitoring bridge transfer ${transferId}:`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          isMonitoring = false;
          await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED, 'Failed to monitor bridge transfer');
          return;
        }
        
        // Retry after 10 seconds using Promise-based approach
        await new Promise(resolve => setTimeout(resolve, 10000));
        if (isMonitoring) {
          await monitor();
        }
      }
    };
    
    // Start monitoring with initial delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    await monitor();
  }
  
  /**
   * Update payment status
   * 
   * @param paymentId The payment ID
   * @param status The new status
   * @param error Optional error message
   */
  private async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    error?: string
  ): Promise<void> {
    const payment = await this.paymentStore.get(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }
    
    payment.status = status;
    payment.updatedAt = Date.now();
    
    if (error) {
      payment.error = error;
    }
    
    await this.paymentStore.set(paymentId, payment);
  }
  
  /**
   * Generate a unique payment ID
   * 
   * @returns A unique payment ID
   */
  private generatePaymentId(): string {
    return `cc-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Refresh a quote before it expires
   * 
   * @param quoteId The quote ID to refresh
   * @returns A promise that resolves to the refreshed quote
   */
  async refreshQuote(quoteId: string): Promise<BridgeQuote> {
    // Extract bridge info from quote ID
    const bridgeId = quoteId.split('-')[0];
    const adapter = BridgeAdapterFactory.getAdapter(bridgeId);
    
    if (!adapter) {
      throw new Error(`Bridge adapter not found for quote ${quoteId}`);
    }
    
    // Find payment with this quote - need to check if storage adapter supports getAll
    const payments = await this.getAllPayments();
    const targetPayment = payments.find(payment => payment.bridgeQuote?.id === quoteId);
    
    if (!targetPayment) {
      throw new Error(`Payment not found for quote ${quoteId}`);
    }
    
    // Extract cross-chain request properties
    const ccRequest = targetPayment.request as CrossChainTransferRequest;
    
    // Create new request and get fresh quote
    const request: CrossChainTransferRequest = {
      type: RequestType.CROSS_CHAIN_TRANSFER,
      network: ccRequest.destinationNetwork,
      sourceNetwork: ccRequest.sourceNetwork,
      destinationNetwork: ccRequest.destinationNetwork,
      recipient: ccRequest.recipient,
      amount: ccRequest.amount,
      token: ccRequest.token || ''
    };
    
    const newQuote = await adapter.quote(request);
    
    // Update payment record
    targetPayment.bridgeQuote = newQuote;
    targetPayment.updatedAt = Date.now();
    await this.paymentStore.set(targetPayment.id, targetPayment);
    
    return newQuote;
  }
  
  /**
   * Get all payments (helper method)
   */
  private async getAllPayments(): Promise<PaymentRecord[]> {
    if (this.paymentStore.getAll) {
      return await this.paymentStore.getAll();
    }
    // If storage adapter doesn't support getAll, we can't refresh quotes
    throw new Error('Storage adapter does not support getAllPayments - cannot refresh quotes');
  }
  
  /**
   * Get time until quote expires (in milliseconds)
   * 
   * @param quote The bridge quote
   * @returns Time until expiration in milliseconds
   */
  getTimeToExpiry(quote: BridgeQuote): number {
    return Math.max(0, quote.expiresAt - Date.now());
  }
  
  /**
   * Check if quote is near expiry
   * 
   * @param quote The bridge quote
   * @param thresholdMs Threshold in milliseconds (default: 2 minutes)
   * @returns True if quote is near expiry
   */
  isNearExpiry(quote: BridgeQuote, thresholdMs: number = 2 * 60 * 1000): boolean {
    return this.getTimeToExpiry(quote) <= thresholdMs;
  }
  
  /**
   * Register callback for quote expiration warnings
   * 
   * @param callback The callback to register
   */
  onQuoteExpiring(callback: QuoteExpirationCallback): void {
    this.quoteExpirationCallbacks.push(callback);
  }
  
  /**
   * Check and notify about quotes nearing expiry
   */
  private async checkQuoteExpiry(): Promise<void> {
    try {
      const payments = await this.getAllPayments();
      for (const payment of payments) {
        if (payment.bridgeQuote && this.isNearExpiry(payment.bridgeQuote)) {
          const timeToExpiry = this.getTimeToExpiry(payment.bridgeQuote);
          this.quoteExpirationCallbacks.forEach(callback => {
            try {
              callback(payment.bridgeQuote!, timeToExpiry);
            } catch (error) {
              console.warn('Quote expiration callback failed:', error);
            }
          });
        }
      }
    } catch (error) {
      console.warn('Failed to check quote expiry:', error);
    }
  }
}

/**
 * Factory for creating cross-chain payment requests
 */
export class CrossChainRequestFactory {
  /**
   * Create a cross-chain transfer request
   * 
   * @param params Request parameters
   * @returns The cross-chain transfer request
   */
  static createTransferRequest(params: {
    sourceNetwork: SupportedNetwork;
    destinationNetwork: SVMNetwork;
    recipient: string;
    amount: string;
    token: string;
    bridge?: string;
    label?: string;
    message?: string;
    memo?: string;
    references?: string[];
  }): CrossChainTransferRequest {
    return {
      type: RequestType.CROSS_CHAIN_TRANSFER,
      network: params.destinationNetwork, // For compatibility with PaymentRequest interface
      sourceNetwork: params.sourceNetwork,
      destinationNetwork: params.destinationNetwork,
      recipient: params.recipient,
      amount: params.amount,
      token: params.token,
      bridge: params.bridge,
      label: params.label,
      message: params.message,
      memo: params.memo,
      references: params.references
    };
  }
}
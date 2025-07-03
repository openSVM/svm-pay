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
  SupportedNetwork
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
export class CrossChainPaymentManager {
  private paymentStore: Map<string, PaymentRecord> = new Map();
  
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
        bridgeUsed: bridge.info.id
      };
      
      this.paymentStore.set(paymentId, paymentRecord);
      
      try {
        // Update status to bridging
        await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGING);
        
        // Execute the bridge transfer
        const bridgeTransferResult = await bridge.execute(request, quote);
        
        // Update payment record with bridge transaction
        paymentRecord.bridgeTransactionHash = bridgeTransferResult.sourceTransactionHash;
        paymentRecord.updatedAt = Date.now();
        this.paymentStore.set(paymentId, paymentRecord);
        
        // Monitor bridge transfer status
        await this.monitorBridgeTransfer(paymentId, bridge, bridgeTransferResult.transferId);
        
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
      throw new Error(`Failed to execute cross-chain payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get payment status
   * 
   * @param paymentId The payment ID
   * @returns The payment record
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentRecord | null> {
    return this.paymentStore.get(paymentId) || null;
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
    
    const monitor = async (): Promise<void> => {
      try {
        const bridgeStatus = await bridge.checkTransferStatus(transferId);
        
        switch (bridgeStatus) {
          case BridgeTransferStatus.COMPLETED:
            await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGE_CONFIRMED);
            // TODO: Handle final payment on destination network
            await this.updatePaymentStatus(paymentId, PaymentStatus.CONFIRMED);
            return;
            
          case BridgeTransferStatus.FAILED:
          case BridgeTransferStatus.REFUNDED:
            await this.updatePaymentStatus(paymentId, PaymentStatus.BRIDGE_FAILED);
            return;
            
          case BridgeTransferStatus.PENDING:
          case BridgeTransferStatus.INITIATED:
            attempts++;
            if (attempts >= maxAttempts) {
              await this.updatePaymentStatus(paymentId, PaymentStatus.EXPIRED, 'Bridge transfer timed out');
              return;
            }
            
            // Wait 10 seconds before next check
            setTimeout(monitor, 10000);
            break;
        }
      } catch (error) {
        console.error(`Error monitoring bridge transfer ${transferId}:`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED, 'Failed to monitor bridge transfer');
          return;
        }
        
        // Retry after 10 seconds
        setTimeout(monitor, 10000);
      }
    };
    
    // Start monitoring
    setTimeout(monitor, 5000); // Initial delay of 5 seconds
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
    const payment = this.paymentStore.get(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }
    
    payment.status = status;
    payment.updatedAt = Date.now();
    
    if (error) {
      payment.error = error;
    }
    
    this.paymentStore.set(paymentId, payment);
  }
  
  /**
   * Generate a unique payment ID
   * 
   * @returns A unique payment ID
   */
  private generatePaymentId(): string {
    return `cc-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
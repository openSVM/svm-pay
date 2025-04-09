/**
 * SVM-Pay Core Types
 * 
 * This file defines the core types used throughout the SVM-Pay protocol.
 */

/**
 * Supported SVM networks
 */
export enum SVMNetwork {
  SOLANA = 'solana',
  SONIC = 'sonic',
  ECLIPSE = 'eclipse',
  SOON = 'soon'
}

/**
 * Payment request types
 */
export enum RequestType {
  TRANSFER = 'transfer',
  TRANSACTION = 'transaction'
}

/**
 * Base interface for all payment requests
 */
export interface PaymentRequest {
  /** The type of payment request */
  type: RequestType;
  
  /** The target SVM network for this payment */
  network: SVMNetwork;
  
  /** The recipient's address (base58 encoded public key) */
  recipient: string;
  
  /** Optional label describing the payment source */
  label?: string;
  
  /** Optional message describing the payment purpose */
  message?: string;
  
  /** Optional memo to be included in the transaction */
  memo?: string;
  
  /** Optional reference IDs for transaction identification */
  references?: string[];
}

/**
 * Transfer request for simple token transfers
 */
export interface TransferRequest extends PaymentRequest {
  type: RequestType.TRANSFER;
  
  /** The amount to transfer (as a string to preserve precision) */
  amount?: string;
  
  /** The SPL token mint address (if transferring an SPL token) */
  splToken?: string;
}

/**
 * Transaction request for complex transactions
 */
export interface TransactionRequest extends PaymentRequest {
  type: RequestType.TRANSACTION;
  
  /** The URL to fetch the transaction details from */
  link: string;
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

/**
 * Payment record interface
 */
export interface PaymentRecord {
  /** Unique identifier for the payment */
  id: string;
  
  /** The payment request */
  request: PaymentRequest;
  
  /** Current status of the payment */
  status: PaymentStatus;
  
  /** Transaction signature (once submitted) */
  signature?: string;
  
  /** Timestamp when the payment was created */
  createdAt: number;
  
  /** Timestamp when the payment was last updated */
  updatedAt: number;
  
  /** Error message if the payment failed */
  error?: string;
}

/**
 * Network adapter interface
 */
export interface NetworkAdapter {
  /** The network this adapter handles */
  network: SVMNetwork;
  
  /** Create a transaction from a transfer request */
  createTransferTransaction(request: TransferRequest): Promise<string>;
  
  /** Fetch a transaction from a transaction request */
  fetchTransaction(request: TransactionRequest): Promise<string>;
  
  /** Submit a signed transaction to the network */
  submitTransaction(transaction: string, signature: string): Promise<string>;
  
  /** Check the status of a transaction */
  checkTransactionStatus(signature: string): Promise<PaymentStatus>;
}

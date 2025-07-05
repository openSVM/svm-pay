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
 * Supported EVM networks for cross-chain payments
 */
export enum EVMNetwork {
  ETHEREUM = 'ethereum',
  BNB_CHAIN = 'bnb-chain',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  AVALANCHE = 'avalanche'
}

/**
 * Union type for all supported networks
 */
export type SupportedNetwork = SVMNetwork | EVMNetwork;

/**
 * Payment request types
 */
export enum RequestType {
  TRANSFER = 'transfer',
  TRANSACTION = 'transaction',
  CROSS_CHAIN_TRANSFER = 'cross-chain-transfer'
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
  amount: string;
  
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
 * Cross-chain transfer request for payments across different networks via bridges
 */
export interface CrossChainTransferRequest extends PaymentRequest {
  type: RequestType.CROSS_CHAIN_TRANSFER;
  
  /** The source network where the payment originates */
  sourceNetwork: SupportedNetwork;
  
  /** The destination network where the payment should arrive */
  destinationNetwork: SVMNetwork;
  
  /** The amount to transfer (as a string to preserve precision) */
  amount: string;
  
  /** The token to transfer (contract address for EVM, mint address for SVM) */
  token: string;
  
  /** Optional bridge to use for the transfer */
  bridge?: string;
  
  /** Optional bridge-specific parameters */
  bridgeParams?: Record<string, any>;
}

/**
 * Bridge information interface
 */
export interface BridgeInfo {
  /** Unique identifier for the bridge */
  id: string;
  
  /** Human-readable name of the bridge */
  name: string;
  
  /** Networks supported by this bridge */
  supportedNetworks: {
    source: SupportedNetwork[];
    destination: SVMNetwork[];
  };
  
  /** Tokens supported by this bridge */
  supportedTokens: {
    [network: string]: string[]; // network -> token addresses
  };
  
  /** Bridge fee information */
  fees: {
    fixed?: string; // Fixed fee amount
    percentage?: number; // Fee as percentage (0.1 = 0.1%)
  };
  
  /** Estimated transfer time in seconds */
  estimatedTime: number;
  
  /** Bridge contract addresses */
  contracts: {
    [network: string]: string;
  };
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  // Cross-chain specific statuses
  BRIDGING = 'bridging',
  BRIDGE_CONFIRMED = 'bridge-confirmed',
  BRIDGE_FAILED = 'bridge-failed'
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
  
  /** Bridge transaction hash (for cross-chain payments) */
  bridgeTransactionHash?: string;
  
  /** Bridge used for cross-chain transfer */
  bridgeUsed?: string;
  
  /** Bridge quote used for cross-chain transfer */
  bridgeQuote?: BridgeQuote;
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

/**
 * EVM Network adapter interface for cross-chain support
 */
export interface EVMNetworkAdapter {
  /** The EVM network this adapter handles */
  network: EVMNetwork;
  
  /** Create a transaction from a transfer request */
  createTransferTransaction(request: TransferRequest): Promise<string>;
  
  /** Submit a signed transaction to the network */
  submitTransaction(transaction: string, signature: string): Promise<string>;
  
  /** Check the status of a transaction */
  checkTransactionStatus(signature: string): Promise<PaymentStatus>;
  
  /** Get token balance for an address */
  getTokenBalance(address: string, tokenAddress: string): Promise<string>;
  
  /** Get native token balance for an address */
  getNativeBalance(address: string): Promise<string>;
}

/**
 * Bridge adapter interface for cross-chain transfers
 */
export interface BridgeAdapter {
  /** Bridge information */
  info: BridgeInfo;
  
  /** Quote a cross-chain transfer */
  quote(request: CrossChainTransferRequest): Promise<BridgeQuote>;
  
  /** Execute a cross-chain transfer */
  execute(request: CrossChainTransferRequest, quote: BridgeQuote): Promise<BridgeTransferResult>;
  
  /** Check the status of a bridge transfer */
  checkTransferStatus(transferId: string): Promise<BridgeTransferStatus>;
  
  /** Check if this bridge supports a specific network pair and token */
  supportsTransfer(
    sourceNetwork: SupportedNetwork, 
    destinationNetwork: SVMNetwork, 
    token: string
  ): boolean;
}

/**
 * Bridge quote information
 */
export interface BridgeQuote {
  /** Unique identifier for the quote */
  id: string;
  
  /** Input amount (source network) */
  inputAmount: string;
  
  /** Output amount (destination network) */
  outputAmount: string;
  
  /** Bridge fee */
  fee: string;
  
  /** Estimated transfer time in seconds */
  estimatedTime: number;
  
  /** Quote expiry timestamp */
  expiresAt: number;
  
  /** Additional quote data */
  data?: Record<string, any>;
}

/**
 * Bridge transfer result
 */
export interface BridgeTransferResult {
  /** Transfer identifier */
  transferId: string;
  
  /** Source transaction hash */
  sourceTransactionHash: string;
  
  /** Destination transaction hash (if available) */
  destinationTransactionHash?: string;
  
  /** Transfer status */
  status: BridgeTransferStatus;
}

/**
 * Bridge transfer status
 */
export enum BridgeTransferStatus {
  INITIATED = 'initiated',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

/**
 * Quote expiration notification callback
 */
export type QuoteExpirationCallback = (quote: BridgeQuote, timeToExpiry: number) => void;

/**
 * Quote refresh API interface
 */
export interface QuoteRefreshAPI {
  /** Refresh a quote before it expires */
  refreshQuote(quoteId: string): Promise<BridgeQuote>;
  
  /** Get time until quote expires (in milliseconds) */
  getTimeToExpiry(quote: BridgeQuote): number;
  
  /** Check if quote is near expiry (within threshold) */
  isNearExpiry(quote: BridgeQuote, thresholdMs?: number): boolean;
  
  /** Register callback for quote expiration warnings */
  onQuoteExpiring(callback: QuoteExpirationCallback): void;
}

/**
 * Storage adapter interface for persistent payment storage
 */
export interface PaymentStorageAdapter {
  /** Get a payment record by ID */
  get(paymentId: string): Promise<PaymentRecord | null>;
  
  /** Set a payment record */
  set(paymentId: string, payment: PaymentRecord): Promise<void>;
  
  /** Delete a payment record */
  delete(paymentId: string): Promise<void>;
  
  /** Get all payment records (optional, for admin/monitoring) */
  getAll?(): Promise<PaymentRecord[]>;
  
  /** Clear all payment records (optional, for testing) */
  clear?(): Promise<void>;
}

/**
 * In-memory storage adapter implementation
 */
export class MemoryPaymentStorageAdapter implements PaymentStorageAdapter {
  private store: Map<string, PaymentRecord> = new Map();
  
  async get(paymentId: string): Promise<PaymentRecord | null> {
    return this.store.get(paymentId) || null;
  }
  
  async set(paymentId: string, payment: PaymentRecord): Promise<void> {
    this.store.set(paymentId, payment);
  }
  
  async delete(paymentId: string): Promise<void> {
    this.store.delete(paymentId);
  }
  
  async getAll(): Promise<PaymentRecord[]> {
    return Array.from(this.store.values());
  }
  
  async clear(): Promise<void> {
    this.store.clear();
  }
}

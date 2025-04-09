/**
 * SVM-Pay Mobile SDK Interface
 * 
 * This file defines the interface for mobile SDKs (iOS and Android).
 * It serves as a specification for implementing native mobile SDKs.
 */

/**
 * Configuration options for the SVM-Pay Mobile SDK
 */
export interface MobileSDKConfig {
  /** Default network to use if not specified */
  defaultNetwork: string;
  
  /** API endpoint for server-side operations */
  apiEndpoint?: string;
  
  /** Whether to enable debug logging */
  debug?: boolean;
  
  /** Custom wallet app URI scheme (if not using default wallet) */
  walletUriScheme?: string;
}

/**
 * Payment request options
 */
export interface PaymentRequestOptions {
  /** Recipient address */
  recipient: string;
  
  /** Amount to transfer (optional) */
  amount?: string;
  
  /** Network to use */
  network?: string;
  
  /** Token to transfer (if not native token) */
  token?: string;
  
  /** Payment label */
  label?: string;
  
  /** Payment description */
  message?: string;
  
  /** Additional memo */
  memo?: string;
  
  /** Reference IDs for transaction identification */
  references?: string[];
}

/**
 * Payment response
 */
export interface PaymentResponse {
  /** Payment status */
  status: string;
  
  /** Transaction signature (if successful) */
  signature?: string;
  
  /** Error message (if failed) */
  error?: string;
}

/**
 * SVM-Pay Mobile SDK Interface
 * 
 * This interface defines the methods that should be implemented
 * by native mobile SDKs for iOS and Android.
 */
export interface SVMPayMobileSDK {
  /**
   * Initialize the SDK
   * 
   * @param config Configuration options
   */
  initialize(config: MobileSDKConfig): void;
  
  /**
   * Create a payment request URL
   * 
   * @param options Payment request options
   * @returns Payment URL string
   */
  createPaymentUrl(options: PaymentRequestOptions): string;
  
  /**
   * Open a payment request in the wallet app
   * 
   * @param options Payment request options
   * @returns Promise that resolves with the payment response
   */
  requestPayment(options: PaymentRequestOptions): Promise<PaymentResponse>;
  
  /**
   * Generate a QR code for a payment request
   * 
   * @param options Payment request options
   * @param size QR code size
   * @returns Base64-encoded image data
   */
  generateQRCode(options: PaymentRequestOptions, size: number): string;
  
  /**
   * Check the status of a payment
   * 
   * @param reference Reference ID of the payment
   * @returns Promise that resolves with the payment status
   */
  checkPaymentStatus(reference: string): Promise<string>;
  
  /**
   * Generate a reference ID
   * 
   * @returns Reference ID string
   */
  generateReference(): string;
}

/**
 * Implementation notes for native SDKs:
 * 
 * 1. iOS SDK:
 *    - Implement using Swift
 *    - Use URLSession for network requests
 *    - Implement deep linking to wallet apps
 *    - Use Core Image for QR code generation
 * 
 * 2. Android SDK:
 *    - Implement using Kotlin
 *    - Use OkHttp for network requests
 *    - Implement intent handling for wallet apps
 *    - Use ZXing for QR code generation
 * 
 * Both implementations should:
 * - Follow the URL scheme defined in the core protocol
 * - Support all SVM networks (Solana, Sonic SVM, Eclipse, s00n)
 * - Handle wallet app selection and deep linking
 * - Provide synchronous and asynchronous APIs
 * - Include comprehensive error handling
 */

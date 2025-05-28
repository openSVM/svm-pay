/**
 * Type definitions for svm-pay npm package
 */

declare module 'svm-pay' {
  /**
   * Check wallet balance
   */
  export function checkBalance(): Promise<any>;

  /**
   * Process a payment
   */
  export function processPayment(options: {
    walletPath?: string;
    amount?: number;
    recipient?: string;
  }): Promise<any>;

  /**
   * Set up wallet configuration
   */
  export function setup(options: {
    walletPath?: string;
  }): Promise<any>;

  /**
   * Get payment history
   */
  export function getHistory(): Promise<any>;

  /**
   * Check API usage
   */
  export function checkUsage(): Promise<any>;
}
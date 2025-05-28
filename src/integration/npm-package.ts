/**
 * Integration with the svm-pay npm package
 * 
 * This module provides integration with the svm-pay CLI tool published on npm.
 */

// Import types from our SDK
import { SVMNetwork } from '../core/types';

// We can't directly import types from the svm-pay package as it doesn't export TypeScript types
// So we'll define minimal interfaces for what we need
interface SVMPayNPMOptions {
  walletPath?: string;
  amount?: number;
  recipient?: string;
}

/**
 * A wrapper around the svm-pay npm package for programmatic usage
 */
export class SVMPayNPMIntegration {
  /**
   * Check the current Solana wallet balance
   * 
   * @returns Promise resolving to the balance details
   */
  static async checkBalance(): Promise<any> {
    try {
      // We need to use dynamic import to avoid bundling issues
      const svmPay = await import('svm-pay');
      
      if (typeof svmPay.checkBalance === 'function') {
        return await svmPay.checkBalance();
      } else {
        throw new Error('svm-pay npm package does not export checkBalance function');
      }
    } catch (error) {
      console.error('Error checking balance with svm-pay npm package:', error);
      throw error;
    }
  }
  
  /**
   * Process a payment using the svm-pay npm package
   * 
   * @param options Payment options
   * @returns Promise resolving to the payment result
   */
  static async processPayment(options: SVMPayNPMOptions): Promise<any> {
    try {
      // We need to use dynamic import to avoid bundling issues
      const svmPay = await import('svm-pay');
      
      if (typeof svmPay.processPayment === 'function') {
        return await svmPay.processPayment(options);
      } else {
        throw new Error('svm-pay npm package does not export processPayment function');
      }
    } catch (error) {
      console.error('Error processing payment with svm-pay npm package:', error);
      throw error;
    }
  }
  
  /**
   * Set up payment configuration
   * 
   * @param options Setup options
   * @returns Promise resolving to the setup result
   */
  static async setupConfig(options: SVMPayNPMOptions): Promise<any> {
    try {
      // We need to use dynamic import to avoid bundling issues
      const svmPay = await import('svm-pay');
      
      if (typeof svmPay.setup === 'function') {
        return await svmPay.setup(options);
      } else {
        throw new Error('svm-pay npm package does not export setup function');
      }
    } catch (error) {
      console.error('Error setting up config with svm-pay npm package:', error);
      throw error;
    }
  }
  
  /**
   * Get payment history
   * 
   * @returns Promise resolving to the payment history
   */
  static async getPaymentHistory(): Promise<any> {
    try {
      // We need to use dynamic import to avoid bundling issues
      const svmPay = await import('svm-pay');
      
      if (typeof svmPay.getHistory === 'function') {
        return await svmPay.getHistory();
      } else {
        throw new Error('svm-pay npm package does not export getHistory function');
      }
    } catch (error) {
      console.error('Error getting payment history with svm-pay npm package:', error);
      throw error;
    }
  }
  
  /**
   * Check API usage
   * 
   * @returns Promise resolving to the API usage details
   */
  static async checkUsage(): Promise<any> {
    try {
      // We need to use dynamic import to avoid bundling issues
      const svmPay = await import('svm-pay');
      
      if (typeof svmPay.checkUsage === 'function') {
        return await svmPay.checkUsage();
      } else {
        throw new Error('svm-pay npm package does not export checkUsage function');
      }
    } catch (error) {
      console.error('Error checking API usage with svm-pay npm package:', error);
      throw error;
    }
  }
}
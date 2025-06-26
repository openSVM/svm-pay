/**
 * Angular Integration for SVM-Pay
 * 
 * This module provides Angular-specific components, services, and utilities
 * for integrating SVM-Pay into Angular applications.
 * 
 * Note: This module requires Angular to be installed as a peer dependency.
 * Install with: npm install @angular/core rxjs
 */

// Configuration interface
export interface SVMPayConfig {
  debug?: boolean;
  network?: string;
  rpcEndpoint?: string;
}

// Check if Angular is available at runtime
function hasAngularSupport(): boolean {
  try {
    require('@angular/core');
    require('rxjs');
    return true;
  } catch {
    return false;
  }
}

// Create a dummy injection token that works with or without Angular
export const SVM_PAY_CONFIG = 'SVM_PAY_CONFIG';

/**
 * SVMPay service interface (works with or without Angular)
 */
export class SVMPayService {
  private config: SVMPayConfig;
  
  constructor(config: SVMPayConfig) {
    this.config = config;
    
    if (!hasAngularSupport()) {
      console.warn('Angular integration requires @angular/core and rxjs to be installed');
    }
  }
  
  createTransferUrl(
    recipient: string,
    amount: string,
    options?: { label?: string; message?: string; memo?: string }
  ): string {
    // Import SVMPay dynamically to avoid circular dependencies
    const { SVMPay } = require('../index');
    const svmPay = new SVMPay(this.config);
    return svmPay.createTransferUrl(recipient, amount, options);
  }
  
  createTransactionUrl(link: string, recipient?: string): string {
    const { SVMPay } = require('../index');
    const svmPay = new SVMPay(this.config);
    return svmPay.createTransactionUrl(link, recipient);
  }
  
  async checkWalletBalance(): Promise<any> {
    const { SVMPay } = require('../index');
    const svmPay = new SVMPay(this.config);
    return svmPay.checkWalletBalance();
  }
  
  async getPaymentHistory(): Promise<any> {
    const { SVMPay } = require('../index');
    const svmPay = new SVMPay(this.config);
    return svmPay.getPaymentHistory();
  }
  
  async setupWallet(walletConfig: any): Promise<any> {
    const { SVMPay } = require('../index');
    const svmPay = new SVMPay(this.config);
    return svmPay.setupWallet(walletConfig);
  }
}

/**
 * Button component interface
 */
export interface SVMPayButtonProps {
  recipient: string;
  amount: string;
  label?: string;
  message?: string;
  memo?: string;
  onPaymentInitiated?: (url: string) => void;
  onPaymentError?: (error: string) => void;
}

/**
 * Create a payment button (framework agnostic)
 */
export function createPaymentButton(
  props: SVMPayButtonProps,
  config: SVMPayConfig
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = `Pay ${props.amount} SOL`;
  button.className = 'svm-pay-button';
  
  button.onclick = () => {
    try {
      const service = new SVMPayService(config);
      const url = service.createTransferUrl(props.recipient, props.amount, {
        label: props.label,
        message: props.message,
        memo: props.memo
      });
      
      if (props.onPaymentInitiated) {
        props.onPaymentInitiated(url);
      }
      
      window.open(url, '_blank');
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (props.onPaymentError) {
        props.onPaymentError(errorMessage);
      }
    }
  };
  
  return button;
}

/**
 * Factory function for creating Angular module when Angular is available
 */
export function createSVMPayModule(config: SVMPayConfig): any {
  if (hasAngularSupport()) {
    console.log('Creating SVM-Pay Angular module with config:', config);
    
    // Return a basic module configuration that Angular can understand
    return {
      providers: [
        {
          provide: SVM_PAY_CONFIG,
          useValue: config
        },
        SVMPayService
      ]
    };
  } else {
    console.warn('Angular not available. Install @angular/core and rxjs to use Angular integration.');
    return {
      providers: []
    };
  }
}

/**
 * Get Angular-specific utilities if available
 */
export function getAngularUtilities(): any {
  if (hasAngularSupport()) {
    try {
      const { Injectable, Component } = require('@angular/core');
      const { BehaviorSubject } = require('rxjs');
      
      return {
        Injectable,
        Component,
        BehaviorSubject,
        hasAngular: true
      };
    } catch (error) {
      console.warn('Failed to load Angular utilities:', error);
    }
  }
  
  return {
    hasAngular: false
  };
}

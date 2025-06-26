/**
 * Angular Integration for SVM-Pay
 *
 * This module provides Angular-specific components, services, and utilities
 * for integrating SVM-Pay into Angular applications.
 *
 * Note: This module requires Angular to be installed as a peer dependency.
 * Install with: npm install @angular/core rxjs
 */
export interface SVMPayConfig {
    debug?: boolean;
    network?: string;
    rpcEndpoint?: string;
}
export declare const SVM_PAY_CONFIG = "SVM_PAY_CONFIG";
/**
 * SVMPay service interface (works with or without Angular)
 */
export declare class SVMPayService {
    private config;
    constructor(config: SVMPayConfig);
    createTransferUrl(recipient: string, amount: string, options?: {
        label?: string;
        message?: string;
        memo?: string;
    }): string;
    createTransactionUrl(link: string, recipient?: string): string;
    checkWalletBalance(): Promise<any>;
    getPaymentHistory(): Promise<any>;
    setupWallet(walletConfig: any): Promise<any>;
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
export declare function createPaymentButton(props: SVMPayButtonProps, config: SVMPayConfig): HTMLButtonElement;
/**
 * Factory function for creating Angular module when Angular is available
 */
export declare function createSVMPayModule(config: SVMPayConfig): any;
/**
 * Get Angular-specific utilities if available
 */
export declare function getAngularUtilities(): any;
//# sourceMappingURL=angular-integration.d.ts.map
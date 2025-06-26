/**
 * SVM-Pay React One-Click Integration
 *
 * This file implements React components for one-click integration of SVM-Pay.
 */
import React from 'react';
import { SVMPay } from './index';
import { SVMNetwork } from '../core/types';
/**
 * Props for the SVMPayProvider component
 */
interface SVMPayProviderProps {
    /** Children components */
    children: React.ReactNode;
    /** Configuration options */
    config?: {
        /** Default network to use */
        defaultNetwork?: SVMNetwork;
        /** API endpoint for server-side operations */
        apiEndpoint?: string;
        /** Whether to enable debug logging */
        debug?: boolean;
    };
}
/**
 * SVM-Pay Provider Component
 *
 * A React context provider that initializes the SVM-Pay SDK and makes it available to child components.
 */
export declare const SVMPayProvider: React.FC<SVMPayProviderProps>;
/**
 * Hook to use SVM-Pay in React components
 */
export declare const useSVMPay: () => SVMPay;
/**
 * Props for the SimplePaymentButton component
 */
interface SimplePaymentButtonProps {
    /** Recipient address */
    recipient: string;
    /** Amount to transfer */
    amount: string;
    /** Token to transfer (if not native token) */
    token?: string;
    /** Network to use */
    network?: SVMNetwork;
    /** Button label */
    label?: string;
    /** Payment description */
    description?: string;
    /** Callback when payment is completed */
    onComplete?: (status: string, signature?: string) => void;
    /** Button style */
    style?: React.CSSProperties;
    /** Button class name */
    className?: string;
}
/**
 * Simple Payment Button Component
 *
 * A React component that provides a simple payment button with one-click integration.
 */
export declare const SimplePaymentButton: React.FC<SimplePaymentButtonProps>;
/**
 * Props for the SimpleQRCodePayment component
 */
interface SimpleQRCodePaymentProps {
    /** Recipient address */
    recipient: string;
    /** Amount to transfer */
    amount: string;
    /** Token to transfer (if not native token) */
    token?: string;
    /** Network to use */
    network?: SVMNetwork;
    /** Payment label */
    label?: string;
    /** Payment description */
    description?: string;
    /** QR code size */
    size?: number;
    /** Callback when payment is completed */
    onComplete?: (status: string, signature?: string) => void;
    /** Container style */
    style?: React.CSSProperties;
    /** Container class name */
    className?: string;
}
/**
 * Simple QR Code Payment Component
 *
 * A React component that provides a simple QR code payment with one-click integration.
 */
export declare const SimpleQRCodePayment: React.FC<SimpleQRCodePaymentProps>;
/**
 * Props for the PaymentForm component
 */
interface PaymentFormProps {
    /** Default recipient address */
    defaultRecipient?: string;
    /** Default amount to transfer */
    defaultAmount?: string;
    /** Default token to transfer */
    defaultToken?: string;
    /** Default network to use */
    defaultNetwork?: SVMNetwork;
    /** Whether to show the QR code */
    showQRCode?: boolean;
    /** Callback when payment is completed */
    onComplete?: (status: string, signature?: string) => void;
    /** Form style */
    style?: React.CSSProperties;
    /** Form class name */
    className?: string;
}
/**
 * Payment Form Component
 *
 * A React component that provides a complete payment form with one-click integration.
 */
export declare const PaymentForm: React.FC<PaymentFormProps>;
export {};
//# sourceMappingURL=react-integration.d.ts.map
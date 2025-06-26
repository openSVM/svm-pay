/**
 * SVM-Pay React Components
 *
 * This file implements React components for SVM-Pay integration.
 */
import React from 'react';
import { SVMPay } from './index';
import { PaymentStatus, SVMNetwork } from '../core/types';
/**
 * Props for the PaymentButton component
 */
interface PaymentButtonProps {
    /** SVM-Pay SDK instance */
    svmPay: SVMPay;
    /** Recipient address */
    recipient: string;
    /** Amount to transfer */
    amount?: string;
    /** Token to transfer (if not native token) */
    token?: string;
    /** Network to use */
    network?: SVMNetwork;
    /** Button label */
    label?: string;
    /** Payment description */
    description?: string;
    /** Callback when payment is completed */
    onComplete?: (status: PaymentStatus, signature?: string) => void;
    /** Callback when payment is started */
    onStart?: () => void;
    /** Button style */
    style?: React.CSSProperties;
    /** Button class name */
    className?: string;
}
/**
 * Payment Button Component
 *
 * A React component that renders a button to initiate a payment.
 */
export declare const PaymentButton: React.FC<PaymentButtonProps>;
/**
 * Props for the QRCodePayment component
 */
interface QRCodePaymentProps {
    /** SVM-Pay SDK instance */
    svmPay: SVMPay;
    /** Recipient address */
    recipient: string;
    /** Amount to transfer */
    amount?: string;
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
    onComplete?: (status: PaymentStatus, signature?: string) => void;
    /** Container style */
    style?: React.CSSProperties;
    /** Container class name */
    className?: string;
}
/**
 * QR Code Payment Component
 *
 * A React component that renders a QR code for a payment.
 */
export declare const QRCodePayment: React.FC<QRCodePaymentProps>;
export {};
//# sourceMappingURL=react.d.ts.map
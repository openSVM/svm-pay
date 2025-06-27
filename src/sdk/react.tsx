/**
 * SVM-Pay React Components
 * 
 * This file implements React components for SVM-Pay integration.
 */

import React, { useState, useEffect } from 'react';
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
export const PaymentButton: React.FC<PaymentButtonProps> = ({
  svmPay,
  recipient,
  amount,
  token,
  network,
  label = 'Pay',
  description,
  onComplete,
  onStart,
  style,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (onStart) {
        onStart();
      }
      
      // Generate a reference ID for this payment
      const reference = svmPay.generateReference();
      
      // Create a payment URL
      const paymentUrl = svmPay.createTransferUrl(
        recipient,
        amount,
        {
          network,
          splToken: token,
          label: label,
          message: description,
          references: [reference],
        }
      );
      
      // In a real implementation, this would open a wallet or QR code
      // For this example, we'll just log the URL
      console.log('Payment URL:', paymentUrl);
      
      // Simulate a successful payment
      setTimeout(() => {
        setIsLoading(false);
        if (onComplete) {
          onComplete(PaymentStatus.CONFIRMED, 'simulated-signature');
        }
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
      if (onComplete) {
        onComplete(PaymentStatus.FAILED);
      }
    }
  };
  
  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          borderRadius: '4px',
          backgroundColor: '#9945FF',
          color: 'white',
          border: 'none',
          cursor: isLoading ? 'wait' : 'pointer',
          ...style,
        }}
        className={className}
      >
        {isLoading ? 'Processing...' : label}
      </button>
      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </div>
  );
};

/**
 * Props for the QRCodePayment component
 */
interface QRCodePaymentProps {
  /** SVM-Pay SDK instance */
  svmPay: SVMPay;
  
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
export const QRCodePayment: React.FC<QRCodePaymentProps> = ({
  svmPay,
  recipient,
  amount,
  token,
  network,
  label,
  description,
  size = 200,
  onComplete,
  style,
  className,
}) => {
  const [_paymentUrl, setPaymentUrl] = useState<string>('');
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [_reference, setReference] = useState<string>('');
  
  useEffect(() => {
    // Generate a reference ID for this payment
    const ref = svmPay.generateReference();
    setReference(ref);
    
    // Create a payment URL
    const url = svmPay.createTransferUrl(
      recipient,
      amount,
      {
        network,
        splToken: token,
        label: label,
        message: description,
        references: [ref],
      }
    );
    
    setPaymentUrl(url);
    
    // In a real implementation, this would poll for payment status
    // For this example, we'll just simulate a payment after 5 seconds
    const timer = setTimeout(() => {
      setStatus(PaymentStatus.CONFIRMED);
      if (onComplete) {
        onComplete(PaymentStatus.CONFIRMED, 'simulated-signature');
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [recipient, amount, token, network, label, description]);
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
      className={className}
    >
      {status === PaymentStatus.CONFIRMED ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', color: 'green', marginBottom: '16px' }}>
            Payment Confirmed!
          </div>
          <p>Thank you for your payment.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            Scan with your SVM wallet to pay
          </div>
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            {/* In a real implementation, this would be a QR code */}
            <div style={{ textAlign: 'center' }}>
              <div>QR Code Placeholder</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                (In a real implementation, this would be a QR code)
              </div>
            </div>
          </div>
          {amount && (
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              {amount} {token || 'SOL'}
            </div>
          )}
          {description && (
            <div style={{ marginBottom: '16px' }}>{description}</div>
          )}
          <div style={{ fontSize: '12px', color: '#666' }}>
            Waiting for payment...
          </div>
        </>
      )}
    </div>
  );
};

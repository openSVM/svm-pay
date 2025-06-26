/**
 * SVM-Pay React One-Click Integration
 * 
 * This file implements React components for one-click integration of SVM-Pay.
 */

import React, { useState, useEffect } from 'react';
import { SVMPay } from './index';
import { PaymentButton, QRCodePayment } from './react';
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
 * Context for SVM-Pay
 */
const SVMPayContext = React.createContext<{
  svmPay: SVMPay | null;
}>({
  svmPay: null,
});

/**
 * SVM-Pay Provider Component
 * 
 * A React context provider that initializes the SVM-Pay SDK and makes it available to child components.
 */
export const SVMPayProvider: React.FC<SVMPayProviderProps> = ({
  children,
  config = {},
}) => {
  const [svmPay, setSvmPay] = useState<SVMPay | null>(null);
  
  useEffect(() => {
    // Initialize SVM-Pay SDK
    const instance = new SVMPay(config);
    setSvmPay(instance);
  }, []);
  
  return (
    <SVMPayContext.Provider value={{ svmPay }}>
      {children}
    </SVMPayContext.Provider>
  );
};

/**
 * Hook to use SVM-Pay in React components
 */
export const useSVMPay = () => {
  const context = React.useContext(SVMPayContext);
  
  if (!context.svmPay) {
    throw new Error('useSVMPay must be used within a SVMPayProvider');
  }
  
  return context.svmPay;
};

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
export const SimplePaymentButton: React.FC<SimplePaymentButtonProps> = (props) => {
  const svmPay = useSVMPay();
  
  return <PaymentButton svmPay={svmPay} {...props} />;
};

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
export const SimpleQRCodePayment: React.FC<SimpleQRCodePaymentProps> = (props) => {
  const svmPay = useSVMPay();
  
  return <QRCodePayment svmPay={svmPay} {...props} />;
};

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
export const PaymentForm: React.FC<PaymentFormProps> = ({
  defaultRecipient = '',
  defaultAmount = '',
  defaultToken = '',
  defaultNetwork = SVMNetwork.SOLANA,
  showQRCode = true,
  onComplete,
  style,
  className,
}) => {
  const svmPay = useSVMPay();
  
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [amount, setAmount] = useState(defaultAmount);
  const [token, setToken] = useState(defaultToken);
  const [network, setNetwork] = useState(defaultNetwork);
  const [showForm, setShowForm] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setShowPayment(true);
  };
  
  const handleComplete = (status: string, signature?: string) => {
    if (onComplete) {
      onComplete(status, signature);
    }
  };
  
  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        ...style,
      }}
      className={className}
    >
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Token (leave empty for native token)
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Network
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as SVMNetwork)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value={SVMNetwork.SOLANA}>Solana</option>
              <option value={SVMNetwork.SONIC}>Sonic SVM</option>
              <option value={SVMNetwork.ECLIPSE}>Eclipse</option>
              <option value={SVMNetwork.SOON}>SOON</option>
            </select>
          </div>
          
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              backgroundColor: '#9945FF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Continue to Payment
          </button>
        </form>
      )}
      
      {showPayment && (
        <div>
          {showQRCode ? (
            <QRCodePayment
              svmPay={svmPay}
              recipient={recipient}
              amount={amount}
              token={token}
              network={network as SVMNetwork}
              onComplete={handleComplete}
            />
          ) : (
            <PaymentButton
              svmPay={svmPay}
              recipient={recipient}
              amount={amount}
              token={token}
              network={network as SVMNetwork}
              onComplete={handleComplete}
            />
          )}
          
          <button
            onClick={() => {
              setShowForm(true);
              setShowPayment(false);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              marginTop: '16px',
            }}
          >
            Back to Form
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { SolanaWalletProvider, SolanaPayment } from '../src/sdk/solana-integration';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Example wallet connection and payment test component
const WalletConnectTest = () => {
  // Replace with your WalletConnect project ID
  const projectId = 'YOUR_PROJECT_ID';
  
  // Example recipient address (replace with your own)
  const recipientAddress = 'GsbwXfJUbzxDzLJcJMJxpR9nBf9XwQxwKLWi7g2LuG1s';
  
  const handlePaymentSuccess = (signature: string) => {
    console.log('Payment successful!', signature);
  };
  
  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
  };

  return (
    <SolanaWalletProvider 
      projectId={projectId}
      network={WalletAdapterNetwork.Devnet}
    >
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>SVM Pay with WalletConnect</h1>
        <p>Connect your Solana wallet and make a test payment</p>
        
        <div style={{ marginTop: '30px' }}>
          <SolanaPayment 
            amount={0.01} 
            recipientAddress={recipientAddress}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </SolanaWalletProvider>
  );
};

export default WalletConnectTest;

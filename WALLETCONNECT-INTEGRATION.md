# SVM-Pay WalletConnect Integration

This document outlines the changes made to replace Stripe and GitHub authentication with WalletConnect for Solana in the SVM-Pay repository.

## Changes Made

### 1. Added WalletConnect for Solana Integration

Created a complete WalletConnect integration for Solana with the following components:

- **Core WalletConnect Implementation**
  - `src/walletconnect/types.ts`: Type definitions for WalletConnect integration
  - `src/walletconnect/constants.ts`: Constants for Solana chain IDs and RPC methods
  - `src/walletconnect/core.ts`: Core wallet functionality for connecting and signing transactions
  - `src/walletconnect/adapter.ts`: Wallet adapter implementation for Solana
  - `src/walletconnect/index.ts`: Export file for all WalletConnect components

- **React Integration Components**
  - `src/sdk/solana-provider.tsx`: React provider for WalletConnect integration
  - `src/sdk/solana-payment.tsx`: Payment component for Solana transactions
  - `src/sdk/solana-integration.ts`: Export file for React components

- **Demo and Testing**
  - `examples/wallet-connect-test.tsx`: Test component for WalletConnect integration
  - `examples/wallet-connect-demo.html`: Demo page for testing wallet connection and payments

### 2. Removed Stripe Integration

Removed the Stripe payment processing components:
- Deleted `website/packages/stripe` directory containing Stripe integration code

### 3. Removed GitHub Authentication

Removed the GitHub authentication components:
- Deleted `website/packages/auth` directory containing NextAuth with GitHub provider

## Dependencies Added

The following dependencies were added to support WalletConnect for Solana:

```
@walletconnect/solana-adapter
@walletconnect/universal-provider
@reown/appkit
@solana/wallet-adapter-base
@solana/wallet-adapter-react
@solana/wallet-adapter-react-ui
@solana/web3.js
bs58
```

## How to Use

### 1. Set Up WalletConnect

To use WalletConnect in your application, you need to:

1. Get a WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Update the `projectId` in your implementation

### 2. Integrate Wallet Connection

Wrap your application with the `SolanaWalletProvider`:

```jsx
import { SolanaWalletProvider } from 'svm-pay/sdk/solana-integration';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

function App() {
  return (
    <SolanaWalletProvider 
      projectId="YOUR_PROJECT_ID"
      network={WalletAdapterNetwork.Mainnet}
    >
      {/* Your app content */}
    </SolanaWalletProvider>
  );
}
```

### 3. Implement Payments

Use the `SolanaPayment` component to accept payments:

```jsx
import { SolanaPayment } from 'svm-pay/sdk/solana-integration';

function PaymentPage() {
  const handleSuccess = (signature) => {
    console.log('Payment successful!', signature);
  };

  return (
    <SolanaPayment 
      amount={0.1} // Amount in SOL
      recipientAddress="YOUR_WALLET_ADDRESS"
      onSuccess={handleSuccess}
    />
  );
}
```

## Testing

To test the implementation:

1. Update the `projectId` in `examples/wallet-connect-test.tsx` with your WalletConnect project ID
2. Run `npm run start:web-demo` to start the demo server
3. Open the demo page and test wallet connection and payments

## Notes

- This implementation uses WalletConnect v2 protocol
- Supports both legacy and versioned Solana transactions
- Works with most Solana wallets that support WalletConnect
- For mobile wallets, QR code scanning is supported

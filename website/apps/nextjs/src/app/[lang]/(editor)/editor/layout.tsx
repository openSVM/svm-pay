import React from 'react';
import { SolanaWalletProvider } from '../../../../../../../src/sdk/solana-integration';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Replace with your WalletConnect project ID
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
  
  return (
    <SolanaWalletProvider 
      projectId={projectId}
      network={WalletAdapterNetwork.Mainnet}
    >
      <div className="flex min-h-screen flex-col">
        <div className="container flex-1 items-start">
          {children}
        </div>
      </div>
    </SolanaWalletProvider>
  );
}

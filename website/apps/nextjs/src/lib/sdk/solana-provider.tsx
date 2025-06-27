"use client";

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

// Define wallet adapters with fallback
let walletAdapters: any[] = [];

try {
  // Try to import wallet adapters
  const { 
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    MathWalletAdapter,
    Coin98WalletAdapter,
    SolletWalletAdapter,
    SolletExtensionWalletAdapter,
  } = require('@solana/wallet-adapter-wallets');
  
  walletAdapters = [
    PhantomWalletAdapter,
    SolflareWalletAdapter, 
    MathWalletAdapter,
    Coin98WalletAdapter,
    SolletWalletAdapter,
    SolletExtensionWalletAdapter,
  ];
} catch (error) {
  console.warn('Wallet adapters not available:', error);
  // Fallback to empty array if wallet adapters are not installed
  walletAdapters = [];
}

export interface SolanaWalletProviderProps {
  children: ReactNode;
  projectId: string;
  network?: WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ 
  children, 
  projectId,
  network = WalletAdapterNetwork.Mainnet 
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure wallet adapters for popular Solana wallets with fallback
  const wallets = useMemo(() => {
    try {
      return walletAdapters.map((WalletAdapter: any) => new WalletAdapter());
    } catch (error) {
      console.warn('Error initializing wallet adapters:', error);
      return [];
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

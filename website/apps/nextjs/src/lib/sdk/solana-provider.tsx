"use client";

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '../walletconnect';

// Import the styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

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

  // Initialize the WalletConnect wallet adapter
  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          projectId,
          metadata: {
            name: 'SVM Pay',
            description: 'SVM Pay with WalletConnect',
            url: window.location.origin,
            icons: [`${window.location.origin}/logo.png`]
          }
        },
      }),
    ],
    [network, projectId]
  );

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

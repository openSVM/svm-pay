"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletConnectionContent() {
  // This component can safely use wallet hooks since it's wrapped in the provider
  const { publicKey, connecting } = useWallet();

  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton />
    </div>
  );
}
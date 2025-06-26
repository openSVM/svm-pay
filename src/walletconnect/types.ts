import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SignClientTypes } from '@walletconnect/types';
import { PublicKey } from '@solana/web3.js';

export interface WalletConnectWalletAdapterConfig {
  network: WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet;
  options: SignClientTypes.Options;
}

export interface WalletConnectWalletInit {
  publicKey: PublicKey;
}

export type UniversalProviderType = any; // Simplified for implementation

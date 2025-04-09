import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SignClientTypes } from '@walletconnect/types';
import { PublicKey } from '@solana/web3.js';

export type WalletConnectChainID = 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ' | 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K';

export interface WalletConnectWalletAdapterConfig {
  network: WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet;
  options: SignClientTypes.Options;
}

export interface WalletConnectWalletInit {
  publicKey: PublicKey;
}

export type UniversalProviderType = any; // Simplified for implementation

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const WalletConnectChainID = {
  Mainnet: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  Devnet: 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
} as const;

export type WalletConnectChainID = typeof WalletConnectChainID[keyof typeof WalletConnectChainID];

export enum WalletConnectRPCMethods {
  signTransaction = 'solana_signTransaction',
  signAllTransactions = 'solana_signAllTransactions',
  signMessage = 'solana_signMessage',
  signAndSendTransaction = 'solana_signAndSendTransaction',
}

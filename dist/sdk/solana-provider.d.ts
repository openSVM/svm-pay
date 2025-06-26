import { FC, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import '@solana/wallet-adapter-react-ui/styles.css';
export interface SolanaWalletProviderProps {
    children: ReactNode;
    projectId: string;
    network?: WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet;
}
export declare const SolanaWalletProvider: FC<SolanaWalletProviderProps>;
//# sourceMappingURL=solana-provider.d.ts.map
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import type { UniversalProviderType, WalletConnectWalletAdapterConfig, WalletConnectWalletInit } from './types';
export declare class ClientNotInitializedError extends Error {
    constructor();
}
export declare class WalletConnectFeatureNotSupportedError extends Error {
    constructor(method: string);
}
export declare class WalletConnectWallet {
    private _UniversalProvider;
    private _session;
    private _projectId;
    private _network;
    private _ConnectQueueResolver;
    constructor(config: WalletConnectWalletAdapterConfig);
    connect(): Promise<WalletConnectWalletInit>;
    disconnect(): Promise<void>;
    get client(): UniversalProviderType;
    get session(): any;
    get publicKey(): PublicKey;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<string>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    initClient(options: any): Promise<void>;
    private serialize;
    private deserialize;
    private checkIfWalletSupportsMethod;
}
//# sourceMappingURL=core.d.ts.map
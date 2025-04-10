import { WalletConnectionError, isVersionedTransaction, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { UniversalProvider } from '@walletconnect/universal-provider';
import { parseAccountId } from '@walletconnect/utils';
import base58 from 'bs58';
import { WalletConnectChainID, WalletConnectRPCMethods } from './constants';
import type { UniversalProviderType, WalletConnectWalletAdapterConfig, WalletConnectWalletInit } from './types';

export class ClientNotInitializedError extends Error {
  constructor() {
    super('WalletConnect client not initialized');
    this.name = 'ClientNotInitializedError';
  }
}

export class WalletConnectFeatureNotSupportedError extends Error {
  constructor(method: string) {
    super(`WalletConnect method not supported by wallet: ${method}`);
    this.name = 'WalletConnectFeatureNotSupportedError';
  }
}

export class WalletConnectWallet {
  private _UniversalProvider: UniversalProviderType | undefined;
  private _session: any | undefined;
  private _projectId: string;
  private _network: string;
  private _ConnectQueueResolver: ((value: unknown) => void) | undefined;

  constructor(config: WalletConnectWalletAdapterConfig) {
    this.initClient(config.options);
    this._network = config.network === WalletAdapterNetwork.Mainnet 
      ? WalletConnectChainID.Mainnet 
      : WalletConnectChainID.Devnet;
    
    if (!config.options.projectId) {
      throw Error('WalletConnect Adapter: Project ID is undefined');
    }
    this._projectId = config.options.projectId;
  }

  async connect(): Promise<WalletConnectWalletInit> {
    if (!this._UniversalProvider) {
      await new Promise(res => {
        this._ConnectQueueResolver = res;
      });
    }

    if (!this._UniversalProvider) {
      throw new Error(
        "WalletConnect Adapter - Universal Provider was undefined while calling 'connect()'"
      );
    }

    if (this._UniversalProvider.session) {
      this._session = this._UniversalProvider.session;
      return { publicKey: this.publicKey };
    }

    const params = {
      namespaces: {
        solana: {
          methods: Object.values(WalletConnectRPCMethods),
          chains: [this._network],
          events: [],
        },
      },
    };

    try {
      const session = await this._UniversalProvider?.connect(params);
      this._session = session;
      
      if (!session) {
        throw new WalletConnectionError();
      }
      
      return { publicKey: this.publicKey };
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this._UniversalProvider?.session) {
      try {
        await this.client.disconnect();
        this._session = undefined;
      } catch (error) {
        console.error('WalletConnect disconnect error:', error);
        throw error;
      }
    } else {
      throw new ClientNotInitializedError();
    }
  }

  get client(): UniversalProviderType {
    if (this._UniversalProvider) {
      return this._UniversalProvider;
    }
    throw new ClientNotInitializedError();
  }

  get session(): any {
    if (!this._session) {
      throw new ClientNotInitializedError();
    }
    return this._session;
  }

  get publicKey(): PublicKey {
    if (this._UniversalProvider?.session && this._session) {
      const { address } = parseAccountId(this._session?.namespaces['solana']?.accounts[0] ?? '');
      return new PublicKey(address);
    }
    throw new ClientNotInitializedError();
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    this.checkIfWalletSupportsMethod(WalletConnectRPCMethods.signTransaction);
    const isVersioned = isVersionedTransaction(transaction);
    const legacyTransaction = isVersioned ? {} : transaction;

    const { signature, transaction: signedSerializedTransaction } = await this.client.request({
      chainId: this._network,
      topic: this.session.topic,
      request: {
        method: WalletConnectRPCMethods.signTransaction,
        params: {
          ...legacyTransaction,
          transaction: this.serialize(transaction)
        }
      }
    });

    if (signedSerializedTransaction) {
      return this.deserialize(signedSerializedTransaction, isVersioned) as T;
    }

    transaction.addSignature(this.publicKey, Buffer.from(base58.decode(signature)));
    return transaction;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    this.checkIfWalletSupportsMethod(WalletConnectRPCMethods.signMessage);
    
    const { signature } = await this.client.request({
      chainId: this._network,
      topic: this.session.topic,
      request: {
        method: WalletConnectRPCMethods.signMessage,
        params: {
          pubkey: this.publicKey.toString(),
          message: base58.encode(message)
        }
      }
    });

    return base58.decode(signature);
  }

  async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<string> {
    this.checkIfWalletSupportsMethod(WalletConnectRPCMethods.signAndSendTransaction);
    
    const { signature } = await this.client.request({
      chainId: this._network,
      topic: this.session.topic,
      request: {
        method: WalletConnectRPCMethods.signAndSendTransaction,
        params: {
          transaction: this.serialize(transaction)
        }
      }
    });

    return signature;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]> {
    try {
      this.checkIfWalletSupportsMethod(WalletConnectRPCMethods.signAllTransactions);
      
      const serializedTransactions = transactions.map(transaction => this.serialize(transaction));
      
      const { transactions: serializedSignedTransactions } = await this.client.request({
        chainId: this._network,
        topic: this.session.topic,
        request: {
          method: WalletConnectRPCMethods.signAllTransactions,
          params: {
            transactions: serializedTransactions
          }
        }
      });

      return transactions.map((transaction, index) => {
        if (isVersionedTransaction(transaction)) {
          return this.deserialize(serializedSignedTransactions[index] ?? '', true);
        }
        return this.deserialize(serializedSignedTransactions[index] ?? '');
      }) as T[];
    } catch (error) {
      if (error instanceof WalletConnectFeatureNotSupportedError) {
        const promises = transactions.map(transaction => this.signTransaction(transaction));
        const signedTransactions = await Promise.all(promises);
        return signedTransactions;
      }
      throw error;
    }
  }

  async initClient(options: any) {
    try {
      const provider = await UniversalProvider.init(options);
      this._UniversalProvider = provider;
      
      if (this._ConnectQueueResolver) {
        this._ConnectQueueResolver(true);
      }
    } catch (error) {
      console.error('Error initializing WalletConnect client:', error);
      throw error;
    }
  }

  private serialize(transaction: Transaction | VersionedTransaction): string {
    return Buffer.from(transaction.serialize({ verifySignatures: false })).toString('base64');
  }

  private deserialize(
    serializedTransaction: string,
    versioned = false
  ): Transaction | VersionedTransaction {
    if (versioned) {
      return VersionedTransaction.deserialize(Buffer.from(serializedTransaction, 'base64'));
    }
    return Transaction.from(Buffer.from(serializedTransaction, 'base64'));
  }

  private checkIfWalletSupportsMethod(method: WalletConnectRPCMethods) {
    if (!this.session.namespaces['solana']?.methods.includes(method)) {
      throw new WalletConnectFeatureNotSupportedError(method);
    }
  }
}

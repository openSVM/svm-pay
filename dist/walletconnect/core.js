"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectWallet = exports.WalletConnectFeatureNotSupportedError = exports.ClientNotInitializedError = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
const universal_provider_1 = require("@walletconnect/universal-provider");
const utils_1 = require("@walletconnect/utils");
const bs58_1 = __importDefault(require("bs58"));
const constants_1 = require("./constants");
class ClientNotInitializedError extends Error {
    constructor() {
        super('WalletConnect client not initialized');
        this.name = 'ClientNotInitializedError';
    }
}
exports.ClientNotInitializedError = ClientNotInitializedError;
class WalletConnectFeatureNotSupportedError extends Error {
    constructor(method) {
        super(`WalletConnect method not supported by wallet: ${method}`);
        this.name = 'WalletConnectFeatureNotSupportedError';
    }
}
exports.WalletConnectFeatureNotSupportedError = WalletConnectFeatureNotSupportedError;
class WalletConnectWallet {
    constructor(config) {
        this.initClient(config.options);
        this._network = config.network === wallet_adapter_base_1.WalletAdapterNetwork.Mainnet
            ? constants_1.WalletConnectChainID.Mainnet
            : constants_1.WalletConnectChainID.Devnet;
        if (!config.options.projectId) {
            throw Error('WalletConnect Adapter: Project ID is undefined');
        }
        this._projectId = config.options.projectId;
    }
    async connect() {
        var _a;
        if (!this._UniversalProvider) {
            await new Promise(res => {
                this._ConnectQueueResolver = res;
            });
        }
        if (!this._UniversalProvider) {
            throw new Error("WalletConnect Adapter - Universal Provider was undefined while calling 'connect()'");
        }
        if (this._UniversalProvider.session) {
            this._session = this._UniversalProvider.session;
            return { publicKey: this.publicKey };
        }
        const params = {
            namespaces: {
                solana: {
                    methods: Object.values(constants_1.WalletConnectRPCMethods),
                    chains: [this._network],
                    events: [],
                },
            },
        };
        try {
            const session = await ((_a = this._UniversalProvider) === null || _a === void 0 ? void 0 : _a.connect(params));
            this._session = session;
            if (!session) {
                throw new wallet_adapter_base_1.WalletConnectionError();
            }
            return { publicKey: this.publicKey };
        }
        catch (error) {
            console.error('WalletConnect connection error:', error);
            throw error;
        }
    }
    async disconnect() {
        var _a;
        if ((_a = this._UniversalProvider) === null || _a === void 0 ? void 0 : _a.session) {
            try {
                await this.client.disconnect();
                this._session = undefined;
            }
            catch (error) {
                console.error('WalletConnect disconnect error:', error);
                throw error;
            }
        }
        else {
            throw new ClientNotInitializedError();
        }
    }
    get client() {
        if (this._UniversalProvider) {
            return this._UniversalProvider;
        }
        throw new ClientNotInitializedError();
    }
    get session() {
        if (!this._session) {
            throw new ClientNotInitializedError();
        }
        return this._session;
    }
    get publicKey() {
        var _a, _b, _c, _d;
        if (((_a = this._UniversalProvider) === null || _a === void 0 ? void 0 : _a.session) && this._session) {
            const { address } = (0, utils_1.parseAccountId)((_d = (_c = (_b = this._session) === null || _b === void 0 ? void 0 : _b.namespaces['solana']) === null || _c === void 0 ? void 0 : _c.accounts[0]) !== null && _d !== void 0 ? _d : '');
            return new web3_js_1.PublicKey(address);
        }
        throw new ClientNotInitializedError();
    }
    async signTransaction(transaction) {
        this.checkIfWalletSupportsMethod(constants_1.WalletConnectRPCMethods.signTransaction);
        const isVersioned = (0, wallet_adapter_base_1.isVersionedTransaction)(transaction);
        const legacyTransaction = isVersioned ? {} : transaction;
        const { signature, transaction: signedSerializedTransaction } = await this.client.request({
            chainId: this._network,
            topic: this.session.topic,
            request: {
                method: constants_1.WalletConnectRPCMethods.signTransaction,
                params: {
                    ...legacyTransaction,
                    transaction: this.serialize(transaction)
                }
            }
        });
        if (signedSerializedTransaction) {
            return this.deserialize(signedSerializedTransaction, isVersioned);
        }
        transaction.addSignature(this.publicKey, Buffer.from(bs58_1.default.decode(signature)));
        return transaction;
    }
    async signMessage(message) {
        this.checkIfWalletSupportsMethod(constants_1.WalletConnectRPCMethods.signMessage);
        const { signature } = await this.client.request({
            chainId: this._network,
            topic: this.session.topic,
            request: {
                method: constants_1.WalletConnectRPCMethods.signMessage,
                params: {
                    pubkey: this.publicKey.toString(),
                    message: bs58_1.default.encode(message)
                }
            }
        });
        return bs58_1.default.decode(signature);
    }
    async signAndSendTransaction(transaction) {
        this.checkIfWalletSupportsMethod(constants_1.WalletConnectRPCMethods.signAndSendTransaction);
        const { signature } = await this.client.request({
            chainId: this._network,
            topic: this.session.topic,
            request: {
                method: constants_1.WalletConnectRPCMethods.signAndSendTransaction,
                params: {
                    transaction: this.serialize(transaction)
                }
            }
        });
        return signature;
    }
    async signAllTransactions(transactions) {
        try {
            this.checkIfWalletSupportsMethod(constants_1.WalletConnectRPCMethods.signAllTransactions);
            const serializedTransactions = transactions.map(transaction => this.serialize(transaction));
            const { transactions: serializedSignedTransactions } = await this.client.request({
                chainId: this._network,
                topic: this.session.topic,
                request: {
                    method: constants_1.WalletConnectRPCMethods.signAllTransactions,
                    params: {
                        transactions: serializedTransactions
                    }
                }
            });
            return transactions.map((transaction, index) => {
                var _a, _b;
                if ((0, wallet_adapter_base_1.isVersionedTransaction)(transaction)) {
                    return this.deserialize((_a = serializedSignedTransactions[index]) !== null && _a !== void 0 ? _a : '', true);
                }
                return this.deserialize((_b = serializedSignedTransactions[index]) !== null && _b !== void 0 ? _b : '');
            });
        }
        catch (error) {
            if (error instanceof WalletConnectFeatureNotSupportedError) {
                const promises = transactions.map(transaction => this.signTransaction(transaction));
                const signedTransactions = await Promise.all(promises);
                return signedTransactions;
            }
            throw error;
        }
    }
    async initClient(options) {
        try {
            const provider = await universal_provider_1.UniversalProvider.init(options);
            this._UniversalProvider = provider;
            if (this._ConnectQueueResolver) {
                this._ConnectQueueResolver(true);
            }
        }
        catch (error) {
            console.error('Error initializing WalletConnect client:', error);
            throw error;
        }
    }
    serialize(transaction) {
        return Buffer.from(transaction.serialize({ verifySignatures: false })).toString('base64');
    }
    deserialize(serializedTransaction, versioned = false) {
        if (versioned) {
            return web3_js_1.VersionedTransaction.deserialize(Buffer.from(serializedTransaction, 'base64'));
        }
        return web3_js_1.Transaction.from(Buffer.from(serializedTransaction, 'base64'));
    }
    checkIfWalletSupportsMethod(method) {
        var _a;
        if (!((_a = this.session.namespaces['solana']) === null || _a === void 0 ? void 0 : _a.methods.includes(method))) {
            throw new WalletConnectFeatureNotSupportedError(method);
        }
    }
}
exports.WalletConnectWallet = WalletConnectWallet;
//# sourceMappingURL=core.js.map
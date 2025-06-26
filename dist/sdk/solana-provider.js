"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWalletProvider = void 0;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
const walletconnect_1 = require("../walletconnect");
// Import the styles for the wallet modal
require("@solana/wallet-adapter-react-ui/styles.css");
const SolanaWalletProvider = ({ children, projectId, network = wallet_adapter_base_1.WalletAdapterNetwork.Mainnet }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const endpoint = (0, react_1.useMemo)(() => (0, web3_js_1.clusterApiUrl)(network), [network]);
    // Initialize the WalletConnect wallet adapter
    const wallets = (0, react_1.useMemo)(() => [
        new walletconnect_1.WalletConnectWalletAdapter({
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
    ], [network, projectId]);
    return (react_1.default.createElement(wallet_adapter_react_1.ConnectionProvider, { endpoint: endpoint },
        react_1.default.createElement(wallet_adapter_react_1.WalletProvider, { wallets: wallets, autoConnect: true },
            react_1.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null, children))));
};
exports.SolanaWalletProvider = SolanaWalletProvider;
//# sourceMappingURL=solana-provider.js.map
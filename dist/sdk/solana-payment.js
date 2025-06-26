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
exports.SolanaPayment = void 0;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
const SolanaPayment = ({ amount, recipientAddress, onSuccess, onError }) => {
    const { publicKey, sendTransaction } = (0, wallet_adapter_react_1.useWallet)();
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [txSignature, setTxSignature] = (0, react_1.useState)(null);
    const handlePayment = async () => {
        if (!publicKey)
            return;
        try {
            setIsProcessing(true);
            // Create a simple transfer transaction
            const transaction = new web3_js_1.Transaction().add(
            // Create a transfer instruction
            // This is a simplified example - in a real app, you would use the Solana SDK to create a proper transfer instruction
            {
                keys: [
                    { pubkey: publicKey, isSigner: true, isWritable: true },
                    { pubkey: new web3_js_1.PublicKey(recipientAddress), isSigner: false, isWritable: true },
                ],
                programId: new web3_js_1.PublicKey('11111111111111111111111111111111'), // System program ID
                data: Buffer.from([2, ...new Uint8Array(8).fill(0)]), // Transfer instruction with amount
            });
            // Create a connection to use for sending the transaction
            const connection = new web3_js_1.Connection('https://api.mainnet-beta.solana.com');
            // Send the transaction
            const signature = await sendTransaction(transaction, connection);
            setTxSignature(signature);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(signature);
        }
        catch (error) {
            console.error('Payment error:', error);
            onError === null || onError === void 0 ? void 0 : onError(error);
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (react_1.default.createElement("div", { className: "solana-payment" }, !publicKey ? (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null, "Connect your wallet to make a payment"),
        react_1.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null))) : (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null,
            "Connected: ",
            publicKey.toString()),
        react_1.default.createElement("p", null,
            "Payment Amount: ",
            amount,
            " SOL"),
        react_1.default.createElement("p", null,
            "Recipient: ",
            recipientAddress),
        react_1.default.createElement("button", { onClick: handlePayment, disabled: isProcessing, style: {
                padding: '10px 20px',
                backgroundColor: '#3b99fc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isProcessing ? 'not-allowed' : 'pointer'
            } }, isProcessing ? 'Processing...' : 'Pay with Solana'),
        txSignature && (react_1.default.createElement("div", { style: { marginTop: '20px' } },
            react_1.default.createElement("p", null, "Transaction successful!"),
            react_1.default.createElement("p", null,
                "Signature: ",
                txSignature)))))));
};
exports.SolanaPayment = SolanaPayment;
//# sourceMappingURL=solana-payment.js.map
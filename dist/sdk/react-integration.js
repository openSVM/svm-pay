"use strict";
/**
 * SVM-Pay React One-Click Integration
 *
 * This file implements React components for one-click integration of SVM-Pay.
 */
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
exports.PaymentForm = exports.SimpleQRCodePayment = exports.SimplePaymentButton = exports.useSVMPay = exports.SVMPayProvider = void 0;
const react_1 = __importStar(require("react"));
const index_1 = require("./index");
const react_2 = require("./react");
const types_1 = require("../core/types");
/**
 * Context for SVM-Pay
 */
const SVMPayContext = react_1.default.createContext({
    svmPay: null,
});
/**
 * SVM-Pay Provider Component
 *
 * A React context provider that initializes the SVM-Pay SDK and makes it available to child components.
 */
const SVMPayProvider = ({ children, config = {}, }) => {
    const [svmPay, setSvmPay] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // Initialize SVM-Pay SDK
        const instance = new index_1.SVMPay(config);
        setSvmPay(instance);
    }, []);
    return (react_1.default.createElement(SVMPayContext.Provider, { value: { svmPay } }, children));
};
exports.SVMPayProvider = SVMPayProvider;
/**
 * Hook to use SVM-Pay in React components
 */
const useSVMPay = () => {
    const context = react_1.default.useContext(SVMPayContext);
    if (!context.svmPay) {
        throw new Error('useSVMPay must be used within a SVMPayProvider');
    }
    return context.svmPay;
};
exports.useSVMPay = useSVMPay;
/**
 * Simple Payment Button Component
 *
 * A React component that provides a simple payment button with one-click integration.
 */
const SimplePaymentButton = (props) => {
    const svmPay = (0, exports.useSVMPay)();
    return react_1.default.createElement(react_2.PaymentButton, { svmPay: svmPay, ...props });
};
exports.SimplePaymentButton = SimplePaymentButton;
/**
 * Simple QR Code Payment Component
 *
 * A React component that provides a simple QR code payment with one-click integration.
 */
const SimpleQRCodePayment = (props) => {
    const svmPay = (0, exports.useSVMPay)();
    return react_1.default.createElement(react_2.QRCodePayment, { svmPay: svmPay, ...props });
};
exports.SimpleQRCodePayment = SimpleQRCodePayment;
/**
 * Payment Form Component
 *
 * A React component that provides a complete payment form with one-click integration.
 */
const PaymentForm = ({ defaultRecipient = '', defaultAmount = '', defaultToken = '', defaultNetwork = types_1.SVMNetwork.SOLANA, showQRCode = true, onComplete, style, className, }) => {
    const svmPay = (0, exports.useSVMPay)();
    const [recipient, setRecipient] = (0, react_1.useState)(defaultRecipient);
    const [amount, setAmount] = (0, react_1.useState)(defaultAmount);
    const [token, setToken] = (0, react_1.useState)(defaultToken);
    const [network, setNetwork] = (0, react_1.useState)(defaultNetwork);
    const [showForm, setShowForm] = (0, react_1.useState)(true);
    const [showPayment, setShowPayment] = (0, react_1.useState)(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowForm(false);
        setShowPayment(true);
    };
    const handleComplete = (status, signature) => {
        if (onComplete) {
            onComplete(status, signature);
        }
    };
    return (react_1.default.createElement("div", { style: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            ...style,
        }, className: className },
        showForm && (react_1.default.createElement("form", { onSubmit: handleSubmit },
            react_1.default.createElement("div", { style: { marginBottom: '16px' } },
                react_1.default.createElement("label", { style: { display: 'block', marginBottom: '8px' } }, "Recipient Address"),
                react_1.default.createElement("input", { type: "text", value: recipient, onChange: (e) => setRecipient(e.target.value), style: {
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }, required: true })),
            react_1.default.createElement("div", { style: { marginBottom: '16px' } },
                react_1.default.createElement("label", { style: { display: 'block', marginBottom: '8px' } }, "Amount"),
                react_1.default.createElement("input", { type: "text", value: amount, onChange: (e) => setAmount(e.target.value), style: {
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    } })),
            react_1.default.createElement("div", { style: { marginBottom: '16px' } },
                react_1.default.createElement("label", { style: { display: 'block', marginBottom: '8px' } }, "Token (leave empty for native token)"),
                react_1.default.createElement("input", { type: "text", value: token, onChange: (e) => setToken(e.target.value), style: {
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    } })),
            react_1.default.createElement("div", { style: { marginBottom: '16px' } },
                react_1.default.createElement("label", { style: { display: 'block', marginBottom: '8px' } }, "Network"),
                react_1.default.createElement("select", { value: network, onChange: (e) => setNetwork(e.target.value), style: {
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    } },
                    react_1.default.createElement("option", { value: types_1.SVMNetwork.SOLANA }, "Solana"),
                    react_1.default.createElement("option", { value: types_1.SVMNetwork.SONIC }, "Sonic SVM"),
                    react_1.default.createElement("option", { value: types_1.SVMNetwork.ECLIPSE }, "Eclipse"),
                    react_1.default.createElement("option", { value: types_1.SVMNetwork.SOON }, "SOON"))),
            react_1.default.createElement("button", { type: "submit", style: {
                    padding: '10px 20px',
                    borderRadius: '4px',
                    backgroundColor: '#9945FF',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                } }, "Continue to Payment"))),
        showPayment && (react_1.default.createElement("div", null,
            showQRCode ? (react_1.default.createElement(react_2.QRCodePayment, { svmPay: svmPay, recipient: recipient, amount: amount, token: token, network: network, onComplete: handleComplete })) : (react_1.default.createElement(react_2.PaymentButton, { svmPay: svmPay, recipient: recipient, amount: amount, token: token, network: network, onComplete: handleComplete })),
            react_1.default.createElement("button", { onClick: () => {
                    setShowForm(true);
                    setShowPayment(false);
                }, style: {
                    padding: '10px 20px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: '16px',
                } }, "Back to Form")))));
};
exports.PaymentForm = PaymentForm;
//# sourceMappingURL=react-integration.js.map
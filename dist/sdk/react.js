"use strict";
/**
 * SVM-Pay React Components
 *
 * This file implements React components for SVM-Pay integration.
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
exports.QRCodePayment = exports.PaymentButton = void 0;
const react_1 = __importStar(require("react"));
const types_1 = require("../core/types");
/**
 * Payment Button Component
 *
 * A React component that renders a button to initiate a payment.
 */
const PaymentButton = ({ svmPay, recipient, amount, token, network, label = 'Pay', description, onComplete, onStart, style, className, }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleClick = async () => {
        try {
            setIsLoading(true);
            setError(null);
            if (onStart) {
                onStart();
            }
            // Generate a reference ID for this payment
            const reference = svmPay.generateReference();
            // Create a payment URL
            const paymentUrl = svmPay.createTransferUrl(recipient, amount, {
                network,
                splToken: token,
                label: label,
                message: description,
                references: [reference],
            });
            // In a real implementation, this would open a wallet or QR code
            // For this example, we'll just log the URL
            console.log('Payment URL:', paymentUrl);
            // Simulate a successful payment
            setTimeout(() => {
                setIsLoading(false);
                if (onComplete) {
                    onComplete(types_1.PaymentStatus.CONFIRMED, 'simulated-signature');
                }
            }, 2000);
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
            if (onComplete) {
                onComplete(types_1.PaymentStatus.FAILED);
            }
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: handleClick, disabled: isLoading, style: {
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#9945FF',
                color: 'white',
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                ...style,
            }, className: className }, isLoading ? 'Processing...' : label),
        error && react_1.default.createElement("div", { style: { color: 'red', marginTop: '8px' } }, error)));
};
exports.PaymentButton = PaymentButton;
/**
 * QR Code Payment Component
 *
 * A React component that renders a QR code for a payment.
 */
const QRCodePayment = ({ svmPay, recipient, amount, token, network, label, description, size = 200, onComplete, style, className, }) => {
    const [_paymentUrl, setPaymentUrl] = (0, react_1.useState)('');
    const [status, setStatus] = (0, react_1.useState)(null);
    const [_reference, setReference] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        // Generate a reference ID for this payment
        const ref = svmPay.generateReference();
        setReference(ref);
        // Create a payment URL
        const url = svmPay.createTransferUrl(recipient, amount, {
            network,
            splToken: token,
            label: label,
            message: description,
            references: [ref],
        });
        setPaymentUrl(url);
        // In a real implementation, this would poll for payment status
        // For this example, we'll just simulate a payment after 5 seconds
        const timer = setTimeout(() => {
            setStatus(types_1.PaymentStatus.CONFIRMED);
            if (onComplete) {
                onComplete(types_1.PaymentStatus.CONFIRMED, 'simulated-signature');
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [recipient, amount, token, network, label, description]);
    return (react_1.default.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...style,
        }, className: className }, status === types_1.PaymentStatus.CONFIRMED ? (react_1.default.createElement("div", { style: { textAlign: 'center' } },
        react_1.default.createElement("div", { style: { fontSize: '24px', color: 'green', marginBottom: '16px' } }, "Payment Confirmed!"),
        react_1.default.createElement("p", null, "Thank you for your payment."))) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: { marginBottom: '16px' } }, "Scan with your SVM wallet to pay"),
        react_1.default.createElement("div", { style: {
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '16px',
            } },
            react_1.default.createElement("div", { style: { textAlign: 'center' } },
                react_1.default.createElement("div", null, "QR Code Placeholder"),
                react_1.default.createElement("div", { style: { fontSize: '12px', marginTop: '8px' } }, "(In a real implementation, this would be a QR code)"))),
        amount && (react_1.default.createElement("div", { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' } },
            amount,
            " ",
            token || 'SOL')),
        description && (react_1.default.createElement("div", { style: { marginBottom: '16px' } }, description)),
        react_1.default.createElement("div", { style: { fontSize: '12px', color: '#666' } }, "Waiting for payment...")))));
};
exports.QRCodePayment = QRCodePayment;
//# sourceMappingURL=react.js.map
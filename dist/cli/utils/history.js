"use strict";
/**
 * Payment history utilities for SVM-Pay CLI
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
exports.loadPaymentHistory = loadPaymentHistory;
exports.savePaymentHistory = savePaymentHistory;
exports.addPaymentRecord = addPaymentRecord;
exports.formatPaymentHistory = formatPaymentHistory;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const HISTORY_DIR = path.join(os.homedir(), '.svm-pay');
const HISTORY_FILE = path.join(HISTORY_DIR, 'payment-history.json');
/**
 * Ensure the history directory exists
 */
function ensureHistoryDir() {
    if (!fs.existsSync(HISTORY_DIR)) {
        fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }
}
/**
 * Load payment history from file
 */
function loadPaymentHistory() {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return [];
        }
        const historyData = fs.readFileSync(HISTORY_FILE, 'utf-8');
        return JSON.parse(historyData);
    }
    catch (error) {
        console.error('Error loading payment history:', error);
        return [];
    }
}
/**
 * Save payment history to file
 */
function savePaymentHistory(history) {
    try {
        ensureHistoryDir();
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    }
    catch (error) {
        console.error('Error saving payment history:', error);
        throw error;
    }
}
/**
 * Add a payment record to history
 */
function addPaymentRecord(payment) {
    const history = loadPaymentHistory();
    const record = {
        ...payment,
        timestamp: new Date().toISOString()
    };
    history.unshift(record); // Add to beginning
    // Keep only last 100 records
    if (history.length > 100) {
        history.splice(100);
    }
    savePaymentHistory(history);
}
/**
 * Format payment history for display
 */
function formatPaymentHistory(history) {
    if (history.length === 0) {
        return 'No payment history found.';
    }
    let output = 'Payment History:\n';
    output += '================\n\n';
    history.forEach((payment, index) => {
        const date = new Date(payment.timestamp).toLocaleString();
        output += `${index + 1}. ${date}\n`;
        output += `   Amount: ${payment.amount} SOL\n`;
        output += `   Recipient: ${payment.recipient}\n`;
        output += `   Status: ${payment.status}\n`;
        if (payment.reason) {
            output += `   Reason: ${payment.reason}\n`;
        }
        if (payment.transactionSignature) {
            output += `   Transaction: ${payment.transactionSignature}\n`;
        }
        output += '\n';
    });
    return output;
}
//# sourceMappingURL=history.js.map
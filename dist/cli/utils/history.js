"use strict";
/**
 * Payment history utilities for SVM-Pay CLI with encryption support
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPaymentHistory = loadPaymentHistory;
exports.savePaymentHistory = savePaymentHistory;
exports.addPaymentRecord = addPaymentRecord;
exports.formatPaymentHistory = formatPaymentHistory;
exports.setEncryptionEnabled = setEncryptionEnabled;
exports.isEncryptionEnabled = isEncryptionEnabled;
exports.exportPaymentHistory = exportPaymentHistory;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const HISTORY_DIR = path.join(os.homedir(), '.svm-pay');
const HISTORY_FILE = path.join(HISTORY_DIR, 'payment-history.json');
const ENCRYPTED_HISTORY_FILE = path.join(HISTORY_DIR, 'payment-history.enc');
const CONFIG_FILE = path.join(HISTORY_DIR, 'config.json');
const defaultConfig = {
    encryption: {
        enabled: true,
        algorithm: 'AES',
    },
    storage: {
        maxRecords: 1000,
        backupEnabled: true,
    },
};
/**
 * Ensure the history directory exists
 */
function ensureHistoryDir() {
    if (!fs.existsSync(HISTORY_DIR)) {
        fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }
}
/**
 * Load or create config
 */
function loadConfig() {
    try {
        ensureHistoryDir();
        if (fs.existsSync(CONFIG_FILE)) {
            const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
            return { ...defaultConfig, ...JSON.parse(configData) };
        }
        else {
            // Create default config
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
    }
    catch (error) {
        console.warn('Error loading config, using defaults:', error);
        return defaultConfig;
    }
}
/**
 * Get encryption key from environment or generate one
 */
function getEncryptionKey() {
    // Try environment variable first
    const envKey = process.env.SVM_PAY_ENCRYPTION_KEY;
    if (envKey) {
        return envKey;
    }
    // Generate a key based on system info (not cryptographically secure, but better than nothing)
    const userInfo = os.userInfo();
    const systemInfo = `${userInfo.username}-${os.hostname()}-${os.platform()}`;
    return crypto_js_1.default.SHA256(systemInfo).toString();
}
/**
 * Encrypt payment history data
 */
function encryptHistoryData(data) {
    const key = getEncryptionKey();
    const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
}
/**
 * Decrypt payment history data
 */
function decryptHistoryData(encryptedData) {
    try {
        const key = getEncryptionKey();
        const decrypted = crypto_js_1.default.AES.decrypt(encryptedData, key);
        const decryptedString = decrypted.toString(crypto_js_1.default.enc.Utf8);
        return JSON.parse(decryptedString);
    }
    catch (error) {
        throw new Error('Failed to decrypt payment history. Data may be corrupted or key changed.');
    }
}
/**
 * Create backup of payment history
 */
function createBackup(history) {
    try {
        const config = loadConfig();
        if (!config.storage.backupEnabled)
            return;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(HISTORY_DIR, `payment-history-backup-${timestamp}.json`);
        // Keep only last 5 backups
        const backupFiles = fs.readdirSync(HISTORY_DIR)
            .filter(file => file.startsWith('payment-history-backup-'))
            .sort()
            .reverse();
        if (backupFiles.length >= 5) {
            const oldBackups = backupFiles.slice(4);
            oldBackups.forEach(backup => {
                try {
                    fs.unlinkSync(path.join(HISTORY_DIR, backup));
                }
                catch (error) {
                    console.warn('Failed to delete old backup:', error);
                }
            });
        }
        fs.writeFileSync(backupFile, JSON.stringify(history, null, 2));
    }
    catch (error) {
        console.warn('Failed to create backup:', error);
    }
}
/**
 * Load payment history from file (with encryption support)
 */
function loadPaymentHistory() {
    try {
        const config = loadConfig();
        // Try encrypted file first
        if (config.encryption.enabled && fs.existsSync(ENCRYPTED_HISTORY_FILE)) {
            const encryptedData = fs.readFileSync(ENCRYPTED_HISTORY_FILE, 'utf-8');
            return decryptHistoryData(encryptedData);
        }
        // Fall back to unencrypted file
        if (fs.existsSync(HISTORY_FILE)) {
            const historyData = fs.readFileSync(HISTORY_FILE, 'utf-8');
            const history = JSON.parse(historyData);
            // Migrate to encrypted storage if encryption is enabled
            if (config.encryption.enabled) {
                savePaymentHistory(history);
                // Remove unencrypted file after migration
                try {
                    fs.unlinkSync(HISTORY_FILE);
                }
                catch (error) {
                    console.warn('Failed to remove unencrypted file after migration:', error);
                }
            }
            return history;
        }
        return [];
    }
    catch (error) {
        console.error('Error loading payment history:', error);
        // Try to load from backup
        try {
            const backupFiles = fs.readdirSync(HISTORY_DIR)
                .filter(file => file.startsWith('payment-history-backup-'))
                .sort()
                .reverse();
            if (backupFiles.length > 0) {
                console.log('Attempting to restore from backup...');
                const backupData = fs.readFileSync(path.join(HISTORY_DIR, backupFiles[0]), 'utf-8');
                return JSON.parse(backupData);
            }
        }
        catch (backupError) {
            console.error('Failed to load from backup:', backupError);
        }
        return [];
    }
}
/**
 * Save payment history to file (with encryption support)
 */
function savePaymentHistory(history) {
    try {
        ensureHistoryDir();
        const config = loadConfig();
        // Create backup before saving
        if (config.storage.backupEnabled && history.length > 0) {
            createBackup(history);
        }
        if (config.encryption.enabled) {
            // Save encrypted
            const encryptedData = encryptHistoryData(history);
            fs.writeFileSync(ENCRYPTED_HISTORY_FILE, encryptedData);
            // Remove unencrypted file if it exists
            if (fs.existsSync(HISTORY_FILE)) {
                try {
                    fs.unlinkSync(HISTORY_FILE);
                }
                catch (error) {
                    console.warn('Failed to remove unencrypted file:', error);
                }
            }
        }
        else {
            // Save unencrypted
            fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        }
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
    const config = loadConfig();
    const record = {
        ...payment,
        timestamp: new Date().toISOString()
    };
    history.unshift(record); // Add to beginning
    // Keep only configured max records
    if (history.length > config.storage.maxRecords) {
        history.splice(config.storage.maxRecords);
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
        if (payment.network) {
            output += `   Network: ${payment.network}\n`;
        }
        if (payment.reason) {
            output += `   Reason: ${payment.reason}\n`;
        }
        if (payment.metadata) {
            if (payment.metadata.label) {
                output += `   Label: ${payment.metadata.label}\n`;
            }
            if (payment.metadata.message) {
                output += `   Message: ${payment.metadata.message}\n`;
            }
            if (payment.metadata.memo) {
                output += `   Memo: ${payment.metadata.memo}\n`;
            }
        }
        if (payment.transactionSignature) {
            output += `   Transaction: ${payment.transactionSignature}\n`;
        }
        output += '\n';
    });
    return output;
}
/**
 * Enable/disable encryption for payment history
 */
function setEncryptionEnabled(enabled) {
    const config = loadConfig();
    config.encryption.enabled = enabled;
    ensureHistoryDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    // Migrate existing data
    if (enabled && fs.existsSync(HISTORY_FILE)) {
        // Encrypt existing unencrypted data
        const history = loadPaymentHistory();
        savePaymentHistory(history);
    }
    else if (!enabled && fs.existsSync(ENCRYPTED_HISTORY_FILE)) {
        // Decrypt existing encrypted data
        const history = loadPaymentHistory();
        savePaymentHistory(history);
    }
}
/**
 * Get current encryption status
 */
function isEncryptionEnabled() {
    const config = loadConfig();
    return config.encryption.enabled;
}
/**
 * Export payment history for backup or analysis
 */
function exportPaymentHistory(format = 'json') {
    const history = loadPaymentHistory();
    if (format === 'csv') {
        const headers = ['timestamp', 'amount', 'recipient', 'status', 'network', 'reason', 'transactionSignature'];
        const csvData = [
            headers.join(','),
            ...history.map(record => [
                record.timestamp,
                record.amount,
                record.recipient,
                record.status,
                record.network || '',
                record.reason || '',
                record.transactionSignature || ''
            ].map(field => `"${field}"`).join(','))
        ];
        return csvData.join('\n');
    }
    return JSON.stringify(history, null, 2);
}
//# sourceMappingURL=history.js.map
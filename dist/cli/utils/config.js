"use strict";
/**
 * Configuration utilities for SVM-Pay CLI
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
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.validateConfig = validateConfig;
exports.isTestMode = isTestMode;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const CONFIG_DIR = path.join(os.homedir(), '.svm-pay');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
/**
 * Ensure the config directory exists
 */
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}
/**
 * Load configuration from file
 */
function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return {};
        }
        const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return JSON.parse(configData);
    }
    catch (error) {
        console.error('Error loading configuration:', error);
        return {};
    }
}
/**
 * Save configuration to file
 */
function saveConfig(config) {
    try {
        ensureConfigDir();
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log('Configuration saved successfully.');
    }
    catch (error) {
        console.error('Error saving configuration:', error);
        throw error;
    }
}
/**
 * Validate that required configuration is present
 */
function validateConfig(config, requiredFields) {
    for (const field of requiredFields) {
        if (!config[field]) {
            console.error(`Missing required configuration: ${field}`);
            console.log('Run "svm-pay setup" to configure your settings.');
            return false;
        }
    }
    return true;
}
/**
 * Check if we're in test mode
 */
function isTestMode() {
    return process.env.TEST_MODE === 'true';
}
//# sourceMappingURL=config.js.map
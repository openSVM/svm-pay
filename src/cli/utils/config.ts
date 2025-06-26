/**
 * Configuration utilities for SVM-Pay CLI
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface SVMPayConfig {
  privateKey?: string;
  apiKey?: string;
  threshold?: number;
  recipientAddress?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.svm-pay');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Ensure the config directory exists
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load configuration from file or environment variables
 */
export function loadConfig(): SVMPayConfig {
  try {
    let config: SVMPayConfig = {};
    
    // Load from file if it exists
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(configData);
    }
    
    // Override with environment variables if available (more secure)
    if (process.env.SVM_PAY_PRIVATE_KEY) {
      config.privateKey = process.env.SVM_PAY_PRIVATE_KEY;
    }
    if (process.env.SVM_PAY_API_KEY) {
      config.apiKey = process.env.SVM_PAY_API_KEY;
    }
    if (process.env.SVM_PAY_THRESHOLD) {
      config.threshold = parseFloat(process.env.SVM_PAY_THRESHOLD);
    }
    if (process.env.SVM_PAY_RECIPIENT) {
      config.recipientAddress = process.env.SVM_PAY_RECIPIENT;
    }
    
    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return {};
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: SVMPayConfig): void {
  try {
    ensureConfigDir();
    
    // Show security warning when saving private keys to file
    if (config.privateKey) {
      console.warn('\n🔐 SECURITY WARNING:');
      console.warn('Private keys are being stored in plain text at:', CONFIG_FILE);
      console.warn('For better security, consider using environment variables:');
      console.warn('  export SVM_PAY_PRIVATE_KEY="your-private-key"');
      console.warn('  export SVM_PAY_API_KEY="your-api-key"');
      console.warn('Environment variables take precedence over config file.\n');
    }
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.info('Configuration saved successfully.');
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw error;
  }
}

/**
 * Validate that required configuration is present
 */
export function validateConfig(config: SVMPayConfig, requiredFields: (keyof SVMPayConfig)[]): boolean {
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
export function isTestMode(): boolean {
  return process.env.TEST_MODE === 'true';
}
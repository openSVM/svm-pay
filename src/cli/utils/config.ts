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
 * Load configuration from file
 */
export function loadConfig(): SVMPayConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return {};
    }
    
    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(configData);
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
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('Configuration saved successfully.');
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
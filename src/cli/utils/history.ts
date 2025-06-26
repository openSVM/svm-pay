/**
 * Payment history utilities for SVM-Pay CLI
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface PaymentRecord {
  timestamp: string;
  amount: number;
  recipient: string;
  reason?: string;
  transactionSignature?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

const HISTORY_DIR = path.join(os.homedir(), '.svm-pay');
const HISTORY_FILE = path.join(HISTORY_DIR, 'payment-history.json');

/**
 * Ensure the history directory exists
 */
function ensureHistoryDir(): void {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

/**
 * Load payment history from file
 */
export function loadPaymentHistory(): PaymentRecord[] {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    
    const historyData = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(historyData);
  } catch (error) {
    console.error('Error loading payment history:', error);
    return [];
  }
}

/**
 * Save payment history to file
 */
export function savePaymentHistory(history: PaymentRecord[]): void {
  try {
    ensureHistoryDir();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving payment history:', error);
    throw error;
  }
}

/**
 * Add a payment record to history
 */
export function addPaymentRecord(payment: Omit<PaymentRecord, 'timestamp'>): void {
  const history = loadPaymentHistory();
  const record: PaymentRecord = {
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
export function formatPaymentHistory(history: PaymentRecord[]): string {
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
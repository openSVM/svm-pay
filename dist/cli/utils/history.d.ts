/**
 * Payment history utilities for SVM-Pay CLI with encryption support
 */
export interface PaymentRecord {
    timestamp: string;
    amount: number;
    recipient: string;
    reason?: string;
    transactionSignature?: string;
    status: 'pending' | 'confirmed' | 'failed';
    network?: string;
    metadata?: {
        label?: string;
        message?: string;
        memo?: string;
    };
}
/**
 * Load payment history from file (with encryption support)
 */
export declare function loadPaymentHistory(): PaymentRecord[];
/**
 * Save payment history to file (with encryption support)
 */
export declare function savePaymentHistory(history: PaymentRecord[]): void;
/**
 * Add a payment record to history
 */
export declare function addPaymentRecord(payment: Omit<PaymentRecord, 'timestamp'>): void;
/**
 * Format payment history for display
 */
export declare function formatPaymentHistory(history: PaymentRecord[]): string;
/**
 * Enable/disable encryption for payment history
 */
export declare function setEncryptionEnabled(enabled: boolean): void;
/**
 * Get current encryption status
 */
export declare function isEncryptionEnabled(): boolean;
/**
 * Export payment history for backup or analysis
 */
export declare function exportPaymentHistory(format?: 'json' | 'csv'): string;
//# sourceMappingURL=history.d.ts.map
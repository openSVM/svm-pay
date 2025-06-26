/**
 * Payment history utilities for SVM-Pay CLI
 */
export interface PaymentRecord {
    timestamp: string;
    amount: number;
    recipient: string;
    reason?: string;
    transactionSignature?: string;
    status: 'pending' | 'confirmed' | 'failed';
}
/**
 * Load payment history from file
 */
export declare function loadPaymentHistory(): PaymentRecord[];
/**
 * Save payment history to file
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
//# sourceMappingURL=history.d.ts.map
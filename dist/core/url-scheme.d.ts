/**
 * SVM-Pay URL Scheme
 *
 * This file implements the URL scheme for SVM-Pay payment requests.
 * The scheme is based on Solana Pay but extended to support multiple SVM networks.
 */
import { PaymentRequest, TransferRequest, TransactionRequest } from './types';
/**
 * Parse a payment URL into a PaymentRequest object
 *
 * @param url The payment URL to parse
 * @returns A PaymentRequest object
 */
export declare function parseURL(url: string): PaymentRequest;
/**
 * Create a payment URL from a TransferRequest
 *
 * @param request The TransferRequest to convert to a URL
 * @returns A payment URL string
 */
export declare function createTransferURL(request: TransferRequest): string;
/**
 * Create a payment URL from a TransactionRequest
 *
 * @param request The TransactionRequest to convert to a URL
 * @returns A payment URL string
 */
export declare function createTransactionURL(request: TransactionRequest): string;
/**
 * Create a payment URL from any PaymentRequest
 *
 * @param request The PaymentRequest to convert to a URL
 * @returns A payment URL string
 */
export declare function createURL(request: PaymentRequest): string;
//# sourceMappingURL=url-scheme.d.ts.map
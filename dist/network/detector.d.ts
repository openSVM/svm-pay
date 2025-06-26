/**
 * SVM-Pay Network Detector
 *
 * This file implements the network detection functionality for SVM-Pay.
 * It detects the appropriate network for a transaction based on various factors.
 */
import { SVMNetwork, PaymentRequest } from '../core/types';
/**
 * Network detection options
 */
export interface NetworkDetectionOptions {
    /** Default network to use if detection fails */
    defaultNetwork?: SVMNetwork;
    /** Whether to use URL protocol for detection */
    useUrlProtocol?: boolean;
    /** Whether to use recipient address format for detection */
    useAddressFormat?: boolean;
}
/**
 * Detect the appropriate network for a payment request
 *
 * @param request The payment request to detect the network for
 * @param options Network detection options
 * @returns The detected network
 */
export declare function detectNetwork(request: PaymentRequest, options?: NetworkDetectionOptions): SVMNetwork;
/**
 * Detect the network from a URL
 *
 * @param url The URL to detect the network from
 * @returns The detected network, or undefined if detection fails
 */
export declare function detectNetworkFromUrl(url: string): SVMNetwork | undefined;
/**
 * Detect the network from an address format
 *
 * @param address The address to detect the network from
 * @returns The detected network, or undefined if detection fails
 */
export declare function detectNetworkFromAddress(_address: string): SVMNetwork | undefined;
//# sourceMappingURL=detector.d.ts.map
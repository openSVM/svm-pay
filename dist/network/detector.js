"use strict";
/**
 * SVM-Pay Network Detector
 *
 * This file implements the network detection functionality for SVM-Pay.
 * It detects the appropriate network for a transaction based on various factors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectNetwork = detectNetwork;
exports.detectNetworkFromUrl = detectNetworkFromUrl;
exports.detectNetworkFromAddress = detectNetworkFromAddress;
const types_1 = require("../core/types");
/**
 * Detect the appropriate network for a payment request
 *
 * @param request The payment request to detect the network for
 * @param options Network detection options
 * @returns The detected network
 */
function detectNetwork(request, options = {}) {
    // If the request already has a network specified, use that
    if (request.network) {
        return request.network;
    }
    // Use the default network if specified
    if (options.defaultNetwork) {
        return options.defaultNetwork;
    }
    // Default to Solana if no detection method succeeds
    return types_1.SVMNetwork.SOLANA;
}
/**
 * Detect the network from a URL
 *
 * @param url The URL to detect the network from
 * @returns The detected network, or undefined if detection fails
 */
function detectNetworkFromUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol.replace(':', '');
        switch (protocol) {
            case 'solana':
                return types_1.SVMNetwork.SOLANA;
            case 'sonic':
                return types_1.SVMNetwork.SONIC;
            case 'eclipse':
                return types_1.SVMNetwork.ECLIPSE;
            case 'soon':
                return types_1.SVMNetwork.SOON;
            default:
                return undefined;
        }
    }
    catch (error) {
        return undefined;
    }
}
/**
 * Detect the network from an address format
 *
 * @param address The address to detect the network from
 * @returns The detected network, or undefined if detection fails
 */
function detectNetworkFromAddress(address) {
    // In a real implementation, this would analyze the address format
    // to determine which network it belongs to
    // For this example, we'll just return undefined
    return undefined;
}
//# sourceMappingURL=detector.js.map
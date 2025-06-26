"use strict";
/**
 * SVM-Pay URL Scheme
 *
 * This file implements the URL scheme for SVM-Pay payment requests.
 * The scheme is based on Solana Pay but extended to support multiple SVM networks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseURL = parseURL;
exports.createTransferURL = createTransferURL;
exports.createTransactionURL = createTransactionURL;
exports.createURL = createURL;
const types_1 = require("./types");
/**
 * URL scheme prefixes for each supported network
 */
const NETWORK_PREFIXES = {
    [types_1.SVMNetwork.SOLANA]: 'solana',
    [types_1.SVMNetwork.SONIC]: 'sonic',
    [types_1.SVMNetwork.ECLIPSE]: 'eclipse',
    [types_1.SVMNetwork.SOON]: 'soon'
};
/**
 * Parse a payment URL into a PaymentRequest object
 *
 * @param url The payment URL to parse
 * @returns A PaymentRequest object
 */
function parseURL(url) {
    try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol.replace(':', '');
        // Determine network from protocol
        let network;
        switch (protocol) {
            case NETWORK_PREFIXES[types_1.SVMNetwork.SOLANA]:
                network = types_1.SVMNetwork.SOLANA;
                break;
            case NETWORK_PREFIXES[types_1.SVMNetwork.SONIC]:
                network = types_1.SVMNetwork.SONIC;
                break;
            case NETWORK_PREFIXES[types_1.SVMNetwork.ECLIPSE]:
                network = types_1.SVMNetwork.ECLIPSE;
                break;
            case NETWORK_PREFIXES[types_1.SVMNetwork.SOON]:
                network = types_1.SVMNetwork.SOON;
                break;
            default:
                throw new Error(`Unsupported protocol: ${protocol}`);
        }
        // Get recipient from pathname (removing leading slash)
        const recipient = parsedUrl.pathname.substring(1);
        if (!recipient) {
            throw new Error('Missing recipient');
        }
        // Parse query parameters
        const params = parsedUrl.searchParams;
        // Check if this is a transaction request
        if (params.has('link')) {
            const link = params.get('link');
            const request = {
                type: types_1.RequestType.TRANSACTION,
                network,
                recipient,
                link,
            };
            // Add optional parameters
            if (params.has('label'))
                request.label = params.get('label');
            if (params.has('message'))
                request.message = params.get('message');
            if (params.has('memo'))
                request.memo = params.get('memo');
            // Parse references
            const references = params.getAll('reference');
            if (references.length > 0) {
                request.references = references;
            }
            return request;
        }
        else {
            // This is a transfer request
            const request = {
                type: types_1.RequestType.TRANSFER,
                network,
                recipient,
            };
            // Add optional parameters
            if (params.has('amount'))
                request.amount = params.get('amount');
            if (params.has('spl-token'))
                request.splToken = params.get('spl-token');
            if (params.has('label'))
                request.label = params.get('label');
            if (params.has('message'))
                request.message = params.get('message');
            if (params.has('memo'))
                request.memo = params.get('memo');
            // Parse references
            const references = params.getAll('reference');
            if (references.length > 0) {
                request.references = references;
            }
            return request;
        }
    }
    catch (error) {
        throw new Error(`Invalid payment URL: ${error.message}`);
    }
}
/**
 * Create a payment URL from a TransferRequest
 *
 * @param request The TransferRequest to convert to a URL
 * @returns A payment URL string
 */
function createTransferURL(request) {
    const { network, recipient, amount, splToken, label, message, memo, references } = request;
    // Create URL with network protocol and recipient
    const url = new URL(`${NETWORK_PREFIXES[network]}:${recipient}`);
    // Add optional parameters
    if (amount)
        url.searchParams.append('amount', amount);
    if (splToken)
        url.searchParams.append('spl-token', splToken);
    if (label)
        url.searchParams.append('label', label);
    if (message)
        url.searchParams.append('message', message);
    if (memo)
        url.searchParams.append('memo', memo);
    // Add references
    if (references && references.length > 0) {
        references.forEach(reference => {
            url.searchParams.append('reference', reference);
        });
    }
    return url.toString();
}
/**
 * Create a payment URL from a TransactionRequest
 *
 * @param request The TransactionRequest to convert to a URL
 * @returns A payment URL string
 */
function createTransactionURL(request) {
    const { network, recipient, link, label, message, memo, references } = request;
    // Create URL with network protocol and recipient
    const url = new URL(`${NETWORK_PREFIXES[network]}:${recipient}`);
    // Add link parameter
    url.searchParams.append('link', link);
    // Add optional parameters
    if (label)
        url.searchParams.append('label', label);
    if (message)
        url.searchParams.append('message', message);
    if (memo)
        url.searchParams.append('memo', memo);
    // Add references
    if (references && references.length > 0) {
        references.forEach(reference => {
            url.searchParams.append('reference', reference);
        });
    }
    return url.toString();
}
/**
 * Create a payment URL from any PaymentRequest
 *
 * @param request The PaymentRequest to convert to a URL
 * @returns A payment URL string
 */
function createURL(request) {
    if (request.type === types_1.RequestType.TRANSFER) {
        return createTransferURL(request);
    }
    else {
        return createTransactionURL(request);
    }
}
//# sourceMappingURL=url-scheme.js.map
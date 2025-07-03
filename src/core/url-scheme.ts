/**
 * SVM-Pay URL Scheme
 * 
 * This file implements the URL scheme for SVM-Pay payment requests.
 * The scheme is based on Solana Pay but extended to support multiple SVM networks.
 */

import { 
  PaymentRequest, 
  RequestType, 
  SVMNetwork, 
  TransferRequest, 
  TransactionRequest,
  CrossChainTransferRequest,
  EVMNetwork,
  SupportedNetwork
} from './types';

/**
 * URL scheme prefixes for each supported network
 */
const NETWORK_PREFIXES = {
  [SVMNetwork.SOLANA]: 'solana',
  [SVMNetwork.SONIC]: 'sonic',
  [SVMNetwork.ECLIPSE]: 'eclipse',
  [SVMNetwork.SOON]: 'soon'
};

/**
 * URL scheme prefixes for EVM networks (for cross-chain payments)
 */
const EVM_NETWORK_PREFIXES = {
  [EVMNetwork.ETHEREUM]: 'ethereum',
  [EVMNetwork.BNB_CHAIN]: 'bnb-chain',
  [EVMNetwork.POLYGON]: 'polygon',
  [EVMNetwork.ARBITRUM]: 'arbitrum',
  [EVMNetwork.OPTIMISM]: 'optimism',
  [EVMNetwork.AVALANCHE]: 'avalanche'
};

/**
 * Parse a payment URL into a PaymentRequest object
 * 
 * @param url The payment URL to parse
 * @returns A PaymentRequest object
 */
export function parseURL(url: string): PaymentRequest {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.replace(':', '');
    
    // Determine network from protocol
    let network: SVMNetwork;
    switch (protocol) {
      case NETWORK_PREFIXES[SVMNetwork.SOLANA]:
        network = SVMNetwork.SOLANA;
        break;
      case NETWORK_PREFIXES[SVMNetwork.SONIC]:
        network = SVMNetwork.SONIC;
        break;
      case NETWORK_PREFIXES[SVMNetwork.ECLIPSE]:
        network = SVMNetwork.ECLIPSE;
        break;
      case NETWORK_PREFIXES[SVMNetwork.SOON]:
        network = SVMNetwork.SOON;
        break;
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
    
    // Get recipient from hostname (for custom protocols) or pathname
    let recipient = parsedUrl.hostname;
    if (!recipient && parsedUrl.pathname) {
      // For custom protocols like "solana:", the recipient is in pathname without leading slash
      recipient = parsedUrl.pathname.startsWith('/') ? parsedUrl.pathname.substring(1) : parsedUrl.pathname;
    }
    if (!recipient) {
      throw new Error('Missing recipient');
    }
    
    // Parse query parameters
    const params = parsedUrl.searchParams;
    
    // Check if this is a cross-chain transfer request
    if (params.has('source-network') || params.has('bridge')) {
      const amount = params.get('amount');
      const token = params.get('token');
      const sourceNetworkParam = params.get('source-network');
      
      if (!amount) {
        throw new Error('Cross-chain transfer request requires an amount parameter');
      }
      
      if (!token) {
        throw new Error('Cross-chain transfer request requires a token parameter');
      }
      
      if (!sourceNetworkParam) {
        throw new Error('Cross-chain transfer request requires a source-network parameter');
      }
      
      // Parse source network
      let sourceNetwork: SupportedNetwork;
      const evmNetwork = Object.entries(EVM_NETWORK_PREFIXES).find(([, prefix]) => prefix === sourceNetworkParam);
      const svmNetwork = Object.entries(NETWORK_PREFIXES).find(([, prefix]) => prefix === sourceNetworkParam);
      
      if (evmNetwork) {
        sourceNetwork = evmNetwork[0] as EVMNetwork;
      } else if (svmNetwork) {
        sourceNetwork = svmNetwork[0] as SVMNetwork;
      } else {
        throw new Error(`Unsupported source network: ${sourceNetworkParam}`);
      }
      
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network, // destination network
        sourceNetwork,
        destinationNetwork: network,
        recipient,
        amount,
        token,
      };
      
      // Add optional parameters
      if (params.has('bridge')) request.bridge = params.get('bridge')!;
      if (params.has('label')) request.label = params.get('label')!;
      if (params.has('message')) request.message = params.get('message')!;
      if (params.has('memo')) request.memo = params.get('memo')!;
      
      // Parse references
      const references = params.getAll('reference');
      if (references.length > 0) {
        request.references = references;
      }
      
      return request;
    }
    
    // Check if this is a transaction request
    if (params.has('link')) {
      const link = params.get('link')!;
      
      const request: TransactionRequest = {
        type: RequestType.TRANSACTION,
        network,
        recipient,
        link,
      };
      
      // Add optional parameters
      if (params.has('label')) request.label = params.get('label')!;
      if (params.has('message')) request.message = params.get('message')!;
      if (params.has('memo')) request.memo = params.get('memo')!;
      
      // Parse references
      const references = params.getAll('reference');
      if (references.length > 0) {
        request.references = references;
      }
      
      return request;
    } else {
      // This is a transfer request
      const amount = params.get('amount');
      if (!amount) {
        throw new Error('Transfer request requires an amount parameter');
      }
      
      const request: TransferRequest = {
        type: RequestType.TRANSFER,
        network,
        recipient,
        amount,
      };
      
      // Add optional parameters
      if (params.has('spl-token')) request.splToken = params.get('spl-token')!;
      if (params.has('label')) request.label = params.get('label')!;
      if (params.has('message')) request.message = params.get('message')!;
      if (params.has('memo')) request.memo = params.get('memo')!;
      
      // Parse references
      const references = params.getAll('reference');
      if (references.length > 0) {
        request.references = references;
      }
      
      return request;
    }
  } catch (error) {
    throw new Error(`Invalid payment URL: ${(error as Error).message}`);
  }
}

/**
 * Create a payment URL from a TransferRequest
 * 
 * @param request The TransferRequest to convert to a URL
 * @returns A payment URL string
 */
export function createTransferURL(request: TransferRequest): string {
  const { network, recipient, amount, splToken, label, message, memo, references } = request;
  
  // Create URL with network protocol and recipient
  const url = new URL(`${NETWORK_PREFIXES[network]}:${recipient}`);
  
  // Add optional parameters
  if (amount) url.searchParams.append('amount', amount);
  if (splToken) url.searchParams.append('spl-token', splToken);
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  
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
export function createTransactionURL(request: TransactionRequest): string {
  const { network, recipient, link, label, message, memo, references } = request;
  
  // Create URL with network protocol and recipient
  const url = new URL(`${NETWORK_PREFIXES[network]}:${recipient}`);
  
  // Add link parameter
  url.searchParams.append('link', link);
  
  // Add optional parameters
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  
  // Add references
  if (references && references.length > 0) {
    references.forEach(reference => {
      url.searchParams.append('reference', reference);
    });
  }
  
  return url.toString();
}

/**
 * Create a payment URL from a CrossChainTransferRequest
 * 
 * @param request The CrossChainTransferRequest to convert to a URL
 * @returns A payment URL string
 */
export function createCrossChainURL(request: CrossChainTransferRequest): string {
  const { 
    destinationNetwork, 
    sourceNetwork, 
    recipient, 
    amount, 
    token, 
    bridge, 
    label, 
    message, 
    memo, 
    references 
  } = request;
  
  // Create URL with destination network protocol and recipient
  const url = new URL(`${NETWORK_PREFIXES[destinationNetwork]}:${recipient}`);
  
  // Add required cross-chain parameters
  url.searchParams.append('amount', amount);
  url.searchParams.append('token', token);
  
  // Add source network
  let sourceNetworkPrefix: string;
  if (Object.values(EVMNetwork).includes(sourceNetwork as EVMNetwork)) {
    sourceNetworkPrefix = EVM_NETWORK_PREFIXES[sourceNetwork as EVMNetwork];
  } else {
    sourceNetworkPrefix = NETWORK_PREFIXES[sourceNetwork as SVMNetwork];
  }
  url.searchParams.append('source-network', sourceNetworkPrefix);
  
  // Add optional parameters
  if (bridge) url.searchParams.append('bridge', bridge);
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  
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
export function createURL(request: PaymentRequest): string {
  if (request.type === RequestType.TRANSFER) {
    return createTransferURL(request as TransferRequest);
  } else if (request.type === RequestType.TRANSACTION) {
    return createTransactionURL(request as TransactionRequest);
  } else if (request.type === RequestType.CROSS_CHAIN_TRANSFER) {
    return createCrossChainURL(request as CrossChainTransferRequest);
  } else {
    throw new Error(`Unsupported request type: ${request.type}`);
  }
}

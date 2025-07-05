# Cross-Chain Payments with SVM-Pay

SVM-Pay now supports cross-chain payments, allowing users to pay from EVM networks (like Ethereum, BNB Chain, Polygon, etc.) to Solana and other SVM networks using secure, popular bridges.

## Features

- **Multi-Network Support**: Accept payments from Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, and Avalanche
- **Bridge Integration**: Built-in support for Wormhole and Allbridge with extensible architecture
- **Automatic Bridge Selection**: Smart routing to find the best bridge based on fees, speed, and reliability
- **Seamless User Experience**: Abstract away complex bridging process for end users
- **URL Scheme Support**: Generate cross-chain payment URLs for easy integration

## Supported Networks

### Source Networks (where users pay from)
- Ethereum (`ethereum`)
- BNB Chain (`bnb-chain`)
- Polygon (`polygon`)
- Arbitrum (`arbitrum`)
- Optimism (`optimism`)
- Avalanche (`avalanche`)

### Destination Networks (where payments arrive)
- Solana (`solana`)
- Sonic SVM (`sonic`)
- Eclipse (`eclipse`)
- s00n (`soon`)

### Supported Bridges
- **Wormhole**: Robust cross-chain bridge with wide token support
- **Allbridge**: Fast, cost-effective bridging solution

## Quick Start

### Basic Cross-Chain Payment

```typescript
import { 
  CrossChainPaymentManager, 
  CrossChainRequestFactory,
  EVMNetwork,
  SVMNetwork 
} from '@openSVM/svm-pay';

// Initialize payment manager
const paymentManager = new CrossChainPaymentManager();

// Create a cross-chain transfer request
const request = CrossChainRequestFactory.createTransferRequest({
  sourceNetwork: EVMNetwork.ETHEREUM,
  destinationNetwork: SVMNetwork.SOLANA,
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: '100',
  token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f', // USDC on Ethereum
  label: 'NFT Purchase',
  message: 'Payment for rare NFT'
});

// Execute the payment
const result = await paymentManager.executePayment(request);
console.log('Payment initiated:', result.paymentId);
console.log('Using bridge:', result.bridge.info.name);
```

### Get Best Bridge Quote

```typescript
import { getBestBridgeQuote } from '@openSVM/svm-pay';

const quote = await getBestBridgeQuote(request);
if (quote) {
  console.log('Best bridge:', quote.adapter.info.name);
  console.log('Output amount:', quote.quote.outputAmount);
  console.log('Fee:', quote.quote.fee);
  console.log('Estimated time:', quote.quote.estimatedTime, 'seconds');
}
```

### Generate Cross-Chain Payment URL

```typescript
import { createCrossChainURL } from '@openSVM/svm-pay';

const paymentUrl = createCrossChainURL(request);
console.log('Payment URL:', paymentUrl);
// Output: solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=0xA0b86a33...&source-network=ethereum
```

### Parse Cross-Chain Payment URL

```typescript
import { parseURL } from '@openSVM/svm-pay';

const url = 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f&source-network=ethereum';
const parsedRequest = parseURL(url);
console.log('Source network:', parsedRequest.sourceNetwork);
console.log('Amount:', parsedRequest.amount);
```

## URL Scheme

Cross-chain payment URLs follow this format:

```
{destination-network}:{recipient}?amount={amount}&token={token}&source-network={source}[&bridge={bridge}][&label={label}][&message={message}]
```

### Parameters

- `destination-network`: Target SVM network (solana, sonic, eclipse, soon)
- `recipient`: Destination wallet address
- `amount`: Transfer amount
- `token`: Token contract address on source network
- `source-network`: Source EVM network
- `bridge`: Optional preferred bridge (wormhole, allbridge)
- `label`: Optional payment label
- `message`: Optional payment description

### Example URLs

```
# USDC from Ethereum to Solana
solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f&source-network=ethereum

# USDT from BNB Chain to Solana with Wormhole
solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=50&token=0x55d398326f99059fF775485246999027B3197955&source-network=bnb-chain&bridge=wormhole
```

## Bridge Management

### Register Custom Bridge

```typescript
import { BridgeAdapterFactory, BaseBridgeAdapter } from '@openSVM/svm-pay';

class CustomBridgeAdapter extends BaseBridgeAdapter {
  // Implement bridge-specific logic
}

// Register the bridge
const customBridge = new CustomBridgeAdapter(bridgeInfo);
BridgeAdapterFactory.registerAdapter(customBridge);
```

### Find Compatible Bridges

```typescript
import { BridgeAdapterFactory } from '@openSVM/svm-pay';

const bridges = BridgeAdapterFactory.findCompatibleAdapters(
  EVMNetwork.ETHEREUM,
  SVMNetwork.SOLANA,
  '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f' // USDC
);

console.log('Compatible bridges:', bridges.map(b => b.info.name));
```

## Payment Status Monitoring

```typescript
// Monitor payment status
const status = await paymentManager.getPaymentStatus(result.paymentId);
console.log('Status:', status?.status);
console.log('Bridge used:', status?.bridgeUsed);
console.log('Bridge transaction:', status?.bridgeTransactionHash);
```

## Common Token Addresses

### Ethereum
- USDC: `0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f`
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- WBTC: `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`

### BNB Chain
- USDC: `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d`
- USDT: `0x55d398326f99059fF775485246999027B3197955`
- BTCB: `0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c`

### Polygon
- USDC: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
- USDT: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
- WBTC: `0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6`

### Solana
- USDC: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- USDT: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- SOL: `So11111111111111111111111111111111111111112`

## Security Considerations

1. **Bridge Security**: Only use reputable, audited bridges
2. **Token Verification**: Verify token contract addresses
3. **Amount Validation**: Validate transfer amounts on both frontend and backend
4. **Address Validation**: Ensure recipient addresses are valid for the destination network
5. **Rate Limiting**: Implement appropriate rate limiting for payment requests

## Examples

See `examples/cross-chain-payment-demo.html` for a complete interactive demo of cross-chain payment functionality.

## Error Handling

```typescript
try {
  const result = await paymentManager.executePayment(request);
  // Handle success
} catch (error) {
  if (error.message.includes('No compatible bridges')) {
    // Handle case where no bridges support the requested transfer
  } else if (error.message.includes('Quote has expired')) {
    // Handle expired quote
  } else {
    // Handle other errors
  }
}
```

## Migration from Regular Payments

Existing SVM-Pay integrations will continue to work unchanged. Cross-chain functionality is additive and doesn't affect existing payment flows.
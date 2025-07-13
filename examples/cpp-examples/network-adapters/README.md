# Network Adapters Example

This example demonstrates how to work with different blockchain network adapters in the SVM-Pay C++ SDK.

## Features Demonstrated

- Checking available network adapters
- Creating network-specific clients
- Working with multiple SVM networks (Solana, Sonic, Eclipse, s00n)
- Asynchronous network operations
- Transaction creation and status checking

## Building

```bash
cd network-adapters
g++ -std=c++17 network_adapter.cpp -lsvm-pay -lcurl -lssl -lcrypto -lpthread -o network_adapter
./network_adapter
```

## Code Overview

The example shows:
1. Checking which network adapters are available
2. Getting network-specific adapters
3. Creating transactions asynchronously
4. Checking transaction status
5. Working with different SVM networks

## Networks Supported

- **Solana**: Main Solana network
- **Sonic SVM**: Game-focused chain extension  
- **Eclipse**: SVM on Ethereum
- **s00n**: Ethereum L2 with SVM

## Async Operations

The example demonstrates:
- Future-based asynchronous transaction creation
- Non-blocking transaction status checking
- Proper timeout handling for network operations
- Error handling for network failures

## Next Steps

- Learn about [Basic Payment](../basic-payment/) creation
- Explore [URL Parsing](../url-parsing/) for handling payment requests
# Basic Payment Example

This example demonstrates how to create simple payment URLs and process basic transactions using the SVM-Pay C++ SDK.

## Features Demonstrated

- SDK initialization
- Creating transfer URLs with metadata (label, message, memo)
- Generating secure reference IDs
- Basic error handling

## Building

```bash
cd basic-payment
g++ -std=c++17 basic_payment.cpp -lsvm-pay -lcurl -lssl -lcrypto -o basic_payment
./basic_payment
```

## Code Overview

The example shows:
1. Initializing the SVM-Pay SDK
2. Creating a client for Solana network
3. Creating a payment URL with recipient, amount, and metadata
4. Generating a reference ID for transaction tracking
5. Parsing and displaying the created URL

## Next Steps

- Try the [URL Parsing Example](../url-parsing/) to learn about parsing payment URLs
- See the [Network Adapters Example](../network-adapters/) for working with different blockchains
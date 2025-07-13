# URL Parsing Example

This example demonstrates how to parse and validate SVM-Pay protocol URLs using the C++ SDK.

## Features Demonstrated

- Parsing different types of payment URLs (transfer, transaction, cross-chain)
- URL validation and error handling
- Extracting payment parameters from URLs
- Working with different payment types

## Building

```bash
cd url-parsing
g++ -std=c++17 url_parsing.cpp -lsvm-pay -lcurl -lssl -lcrypto -o url_parsing
./url_parsing
```

## Code Overview

The example shows how to:
1. Parse various SVM-Pay URL formats
2. Extract payment details (recipient, amount, metadata)
3. Handle different payment types (transfer, SPL token, transaction, cross-chain)
4. Validate URL structure and parameters
5. Handle parsing errors gracefully

## URL Types Covered

- **Transfer URLs**: Simple SOL transfers with amount and metadata
- **SPL Token URLs**: Token transfers with SPL token addresses  
- **Transaction URLs**: Complex transactions with custom links
- **Cross-Chain URLs**: Cross-chain transfers with bridge information

## Next Steps

- See the [Network Adapters Example](../network-adapters/) for blockchain integration
- Check out the [Basic Payment Example](../basic-payment/) for URL creation
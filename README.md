# SVM-Pay: Cross-Network Payment Solution

<img width="287" alt="logo" src="https://github.com/user-attachments/assets/92d72516-b163-4b81-bf5f-e0a574d41225" />


Pay from anywhere from any solana-vm based network!

## Overview

SVM-Pay is a payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n) that enables developers to easily integrate payment functionality into their applications. Inspired by Solana Pay, SVM-Pay extends the concept to work across all SVM networks with a one-click integration approach for developers.

## Features

- **Cross-Network Compatibility**: Support for Solana, Sonic SVM, Eclipse, and s00n networks
- **Simple Integration**: One-click integration for developers
- **Comprehensive SDK**: JavaScript/TypeScript SDK with React, Vue, and Angular components
- **C++ SDK**: Native C++ SDK for high-performance applications and system integration
- **Mobile Support**: iOS and Android SDK for mobile applications
- **No Fees**: SVM-Pay itself charges no fees (only standard network transaction fees apply)
- **Secure**: Built with security best practices for blockchain payments
- **Flexible**: Support for different payment scenarios (e-commerce, point-of-sale, subscriptions)

## Quick Links

- [Documentation](docs/documentation.md)
- [Developer Guide](docs/developer-guide.md)
- [Architecture](docs/architecture.md)
- [Security Recommendations](docs/security-recommendations.md)
- [C++ SDK](cpp-sdk/README.md)
- [Examples](examples/)
- [CLI Integration](CLI-INTEGRATION.md)

## Installation

```bash
npm install svm-pay
```

## Basic Usage

```javascript
import { SVMPay } from 'svm-pay';

// Initialize the SDK
const svmPay = new SVMPay({
  defaultNetwork: 'solana', // 'solana', 'sonic', 'eclipse', or 'soon'
});

// Create a payment URL
const url = svmPay.createTransferUrl(
  'YOUR_WALLET_ADDRESS',
  '1.0', // Amount
  {
    label: 'Your Store',
    message: 'Payment for Order #123',
    references: ['order-123']
  }
);

console.log(url);
// Output: solana:YOUR_WALLET_ADDRESS?amount=1.0&label=Your%20Store&message=Payment%20for%20Order%20%23123&reference=order-123

// CLI Integration - access CLI functionality programmatically
// Check wallet balance (requires CLI setup)
svmPay.checkWalletBalance()
  .then(balance => console.log('Wallet balance:', balance))
  .catch(error => console.error('Balance check failed:', error));
```

## CLI Tool

SVM-Pay includes a built-in CLI tool for managing payments:

```bash
# Install globally
npm install -g svm-pay

# Setup configuration
svm-pay setup -k <your-private-key> -a <your-api-key>

# Check wallet balance
svm-pay balance

# Check API usage
svm-pay usage

# Make a payment
svm-pay pay -a 0.1 -r "API usage payment"

# View payment history
svm-pay history
```

See [CLI Integration](CLI-INTEGRATION.md) for complete CLI documentation.
```

## Framework Integration

### React

```jsx
import { SVMPayProvider, PaymentButton } from 'svm-pay/react';

function App() {
  return (
    <SVMPayProvider>
      <PaymentButton
        recipient="YOUR_WALLET_ADDRESS"
        amount="1.0"
        onComplete={(status, signature) => {
          console.log(`Payment ${status}`, signature);
        }}
      />
    </SVMPayProvider>
  );
}
```

### Vue

```vue
<template>
  <svm-pay-button
    recipient="YOUR_WALLET_ADDRESS"
    amount="1.0"
    @complete="handleComplete"
  />
</template>

<script>
export default {
  methods: {
    handleComplete(status, signature) {
      console.log(`Payment ${status}`, signature);
    }
  }
}
</script>
```

### Angular

```typescript
@Component({
  selector: 'app-root',
  template: `
    <svm-pay-button
      recipient="YOUR_WALLET_ADDRESS"
      amount="1.0"
      (complete)="handleComplete($event)"
    ></svm-pay-button>
  `
})
export class AppComponent {
  handleComplete(event: {status: string, signature?: string}) {
    console.log(`Payment ${event.status}`, event.signature);
  }
}
```

## C++ SDK

SVM-Pay includes a comprehensive C++ SDK for high-performance applications and system integration:

```cpp
#include <svm-pay/svm_pay.hpp>

// Initialize SDK
svm_pay::initialize_sdk();

// Create client
svm_pay::Client client(svm_pay::SVMNetwork::SOLANA);

// Create payment URL
std::string url = client.create_transfer_url("recipient_address", "1.5", {
    {"label", "Coffee Shop"},
    {"message", "Payment for coffee"}
});

// Parse payment URL
auto request = client.parse_url(url);

// Generate reference ID
std::string ref = client.generate_reference();
```

**Features:**
- Cross-platform support (Windows, Linux, macOS)
- Asynchronous network operations  
- Secure reference generation with OpenSSL
- Complete URL scheme support
- CMake build system with package management
- Comprehensive test suite and examples

See [C++ SDK Documentation](cpp-sdk/README.md) for detailed installation and usage instructions.

## Demo Applications

SVM-Pay includes several demo applications to showcase its functionality:

- [Web Payment Demo](examples/web-payment-demo.jsx): A simple web application for accepting payments
- [Point-of-Sale Demo](examples/point-of-sale-demo.tsx): A point-of-sale application for in-person payments
- [Subscription Payment Demo](examples/subscription-payment-demo.tsx): A subscription service application

## Security

SVM-Pay is built with security in mind. For security recommendations and best practices, see the [Security Recommendations](docs/security-recommendations.md) document.

## License

MIT

## Contributing

Contributions are welcome! Please see the [Contributing Guidelines](CONTRIBUTING.md) for more information.

# SVM-Pay: Cross-Network Payment Solution

![SVM-Pay Logo](https://example.com/svm-pay-logo.png)

## Overview

SVM-Pay is a payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n) that enables developers to easily integrate payment functionality into their applications. Inspired by Solana Pay, SVM-Pay extends the concept to work across all SVM networks with a one-click integration approach for developers.

## Features

- **Cross-Network Compatibility**: Support for Solana, Sonic SVM, Eclipse, and s00n networks
- **Simple Integration**: One-click integration for developers
- **Comprehensive SDK**: JavaScript/TypeScript SDK with React, Vue, and Angular components
- **Mobile Support**: iOS and Android SDK for mobile applications
- **No Fees**: SVM-Pay itself charges no fees (only standard network transaction fees apply)
- **Secure**: Built with security best practices for blockchain payments
- **Flexible**: Support for different payment scenarios (e-commerce, point-of-sale, subscriptions)

## Quick Links

- [Documentation](docs/documentation.md)
- [Developer Guide](docs/developer-guide.md)
- [Architecture](docs/architecture.md)
- [Security Recommendations](docs/security-recommendations.md)
- [Examples](examples/)

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

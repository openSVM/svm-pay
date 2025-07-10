# SVM-Pay Documentation

## Introduction

SVM-Pay is a payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n) that enables developers to easily integrate payment functionality into their applications. Inspired by Solana Pay, SVM-Pay extends the concept to work across all SVM networks with a one-click integration approach for developers.

This documentation provides comprehensive information about SVM-Pay, including its architecture, core components, integration options, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Protocol](#core-protocol)
4. [Network Compatibility](#network-compatibility)
5. [SDK Reference](#sdk-reference)
6. [Assembly-BPF SDK](#assembly-bpf-sdk)
7. [Integration Guide](#integration-guide)
8. [Examples](#examples)
9. [API Reference](#api-reference)
10. [Network-Specific Features](#network-specific-features)
11. [Troubleshooting](#troubleshooting)

## Overview

SVM-Pay is a payment protocol and SDK that allows merchants and developers to accept payments in cryptocurrencies across multiple SVM networks. It provides a simple, secure, and standardized way to request and process payments.

Key features:
- Support for multiple SVM networks (Solana, Sonic SVM, Eclipse, s00n)
- Simple URL-based payment requests
- QR code generation for in-person payments
- Reference IDs for transaction tracking
- Comprehensive SDK for JavaScript/TypeScript, React, Vue, and Angular
- Server-side libraries for payment verification
- One-click integration components

## Architecture

SVM-Pay follows a modular architecture with several key components:

1. **Core Protocol**: Defines the payment request format, URL scheme, and reference generation.
2. **Network Adapters**: Provide network-specific implementations for transaction creation and submission.
3. **SDK**: Offers a high-level API for developers to integrate SVM-Pay into their applications.
4. **UI Components**: Ready-to-use components for React, Vue, and Angular applications.
5. **Server SDK**: Tools for server-side payment verification and processing.

The architecture is designed to be extensible, allowing for easy addition of new networks and features.

## Core Protocol

The core protocol defines how payment requests are formatted and processed. It consists of:

### URL Scheme

SVM-Pay uses a URL scheme similar to Solana Pay but extended to support multiple networks:

```
<network>:<recipient>?amount=<amount>&spl-token=<token>&label=<label>&message=<message>&memo=<memo>&reference=<reference>
```

Where:
- `<network>` is the SVM network protocol (solana, sonic, eclipse, soon)
- `<recipient>` is the recipient's wallet address
- `<amount>` is the payment amount (optional)
- `<token>` is the SPL token address (optional, if not specified, the native token is used)
- `<label>` is a label for the payment (optional)
- `<message>` is a message describing the payment (optional)
- `<memo>` is a memo to include in the transaction (optional)
- `<reference>` is a reference ID for the payment (optional, multiple allowed)

### Request Types

SVM-Pay supports two types of payment requests:

1. **Transfer Request**: A simple request to transfer tokens from one account to another.
2. **Transaction Request**: A request to execute a more complex transaction, specified by a URL.

### Reference IDs

Reference IDs are used to track payments and link them to merchant systems. SVM-Pay provides utilities to generate random reference IDs or deterministic reference IDs based on order information.

## Network Compatibility

SVM-Pay is designed to work across multiple SVM networks:

### Solana

The original Solana network is fully supported, with all features of Solana Pay available in SVM-Pay.

### Sonic SVM

Sonic SVM is supported with network-specific adaptations to handle its unique features and transaction format.

### Eclipse

Eclipse network is supported with adaptations for its transaction system and token handling.

### s00n

The s00n network is supported with specific implementations for its transaction format and validation.

## SDK Reference

The SVM-Pay SDK provides a high-level API for integrating payment functionality into applications.

### Core SDK

```javascript
import { SVMPay } from 'svm-pay';

// Initialize the SDK
const svmPay = new SVMPay({
  defaultNetwork: 'solana',
  debug: true
});

// Create a payment URL
const url = svmPay.createTransferUrl(
  'recipient-address',
  '1.0',
  {
    label: 'My Store',
    message: 'Payment for Order #123',
    references: ['order-123']
  }
);

// Parse a payment URL
const request = svmPay.parseUrl(url);

// Generate a reference ID
const reference = svmPay.generateReference();
```

### React SDK

```jsx
import { SVMPayProvider, PaymentButton, QRCodePayment } from 'svm-pay/react';

function App() {
  return (
    <SVMPayProvider>
      <PaymentButton
        recipient="recipient-address"
        amount="1.0"
        onComplete={(status, signature) => {
          console.log(`Payment ${status}`, signature);
        }}
      />
      
      <QRCodePayment
        recipient="recipient-address"
        amount="1.0"
        size={250}
      />
    </SVMPayProvider>
  );
}
```

### Vue SDK

```javascript
import { createApp } from 'vue';
import { createSVMPayPlugin } from 'svm-pay/vue';

const app = createApp(App);
app.use(createSVMPayPlugin({
  defaultNetwork: 'solana'
}));
```

```html
<template>
  <svm-pay-button
    recipient="recipient-address"
    amount="1.0"
    @complete="handleComplete"
  />
  
  <svm-pay-qr-code
    recipient="recipient-address"
    amount="1.0"
    :size="250"
  />
</template>
```

### Angular SDK

```typescript
import { NgModule } from '@angular/core';
import { SVMPayModule } from 'svm-pay/angular';

@NgModule({
  imports: [
    SVMPayModule.forRoot({
      defaultNetwork: 'solana'
    })
  ]
})
export class AppModule { }
```

```html
<svm-pay-button
  recipient="recipient-address"
  amount="1.0"
  (complete)="handleComplete($event)"
></svm-pay-button>

<svm-pay-qr-code
  recipient="recipient-address"
  amount="1.0"
  [size]="250"
></svm-pay-qr-code>
```

### Server SDK

```javascript
import { SVMPayServer } from 'svm-pay/server';

// Initialize the server SDK
const svmPayServer = new SVMPayServer({
  defaultNetwork: 'solana'
});

// Create a payment URL with order reference
const url = svmPayServer.createTransferUrl(
  'recipient-address',
  '1.0',
  {
    orderId: 'order-123'
  }
);

// Verify a transaction
const isValid = svmPayServer.verifyTransaction(transaction, request);

// Handle a webhook
const status = await svmPayServer.handleWebhook(signature, reference);
```

## Assembly-BPF SDK

For advanced use cases requiring low-level BPF program development, SVM-Pay includes a comprehensive Assembly-BPF SDK that provides Assembly and LLVM IR abstractions for developing efficient BPF programs.

### Key Features

- **Assembly abstractions** for BPF instruction generation
- **Memory management utilities** for stack and heap operations
- **Syscall helpers** for SVM network interactions
- **Program templates** for common use cases (payment processor, cross-chain bridge, validator)
- **Multi-network support** across all SVM chains (Solana, Sonic, Eclipse, s00n)
- **Compilation and deployment tools**
- **Security features** with program validation and memory safety

### Quick Start

```typescript
import { AssemblyBPFSDK, BPFTemplates, SVMNetwork } from 'svm-pay/assembly-bpf';

// Initialize SDK for BPF development
const sdk = new AssemblyBPFSDK({ 
  network: SVMNetwork.SOLANA,
  debug: true 
});

// Create a payment processor using built-in template
const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
  networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC],
  feeRate: 0.01,
  maxAmount: 1000000
});

// Compile to BPF bytecode
const result = await sdk.compile(instructions, metadata);

if (result.success) {
  console.log('✅ BPF Program compiled successfully');
  console.log(`📊 Instructions: ${instructions.length}`);
  console.log(`💾 Bytecode size: ${result.bytecode?.length} bytes`);
  console.log(`⚡ Estimated compute units: ${result.computeUnits}`);
}
```

### Program Builder Pattern

```typescript
// Build a custom program step-by-step
const builder = sdk.createProgram(metadata);

builder
  .addInstructions(BPFHelpers.createDebugLog('Starting payment processing'))
  .addPaymentProcessor()
  .addCrossChainBridge()
  .addValidator()
  .addInstructions(BPFHelpers.createDebugLog('Payment processing completed'));

const result = await builder.compile();
```

### Available Templates

- **Payment Processor**: Basic payment processing with optional fees
- **Cross-Chain Bridge**: Bridge assets between different chains
- **Payment Validator**: Validate payment parameters and constraints
- **Token Transfer**: Handle SPL token transfers with validation
- **Middleware**: Custom middleware with pre/post hooks

### Memory Management

```typescript
import { BPFMemoryManager } from 'svm-pay/assembly-bpf';

// Allocate stack space for local variables
const stackPointer = BPFMemoryManager.allocateStack(64);

// Create memory structures
const paymentData = BPFMemoryManager.createStruct([
  { name: 'amount', type: 'u64', offset: 0 },
  { name: 'recipient', type: 'pubkey', offset: 8 },
  { name: 'fee', type: 'u64', offset: 40 }
]);

// Use syscall helpers for network operations
const syscalls = new BPFSyscallHelper(SVMNetwork.SOLANA);
const balance = syscalls.getAccountBalance(accountPublicKey);
```

### Security Features

The Assembly-BPF SDK includes comprehensive security features:

- **Program validation** with size limits and instruction validation
- **Memory safety** with bounds checking and stack overflow protection
- **Network compliance** with chain-specific validation requirements
- **Sandboxed execution** for safe compilation and testing

For complete documentation, examples, and advanced usage, see the [Assembly-BPF Documentation](assembly-bpf/README.md).

## Integration Guide

### Basic Integration

1. Install the SVM-Pay package:

```bash
npm install svm-pay
```

2. Import and initialize the SDK:

```javascript
import { SVMPay } from 'svm-pay';

const svmPay = new SVMPay({
  defaultNetwork: 'solana'
});
```

3. Create a payment URL:

```javascript
const url = svmPay.createTransferUrl(
  'recipient-address',
  '1.0',
  {
    label: 'My Store',
    message: 'Payment for Order #123'
  }
);
```

4. Display the payment URL or QR code to the user.

### React Integration

1. Install the SVM-Pay package:

```bash
npm install svm-pay
```

2. Wrap your application with the SVMPayProvider:

```jsx
import { SVMPayProvider } from 'svm-pay/react-integration';

function App() {
  return (
    <SVMPayProvider>
      {/* Your application */}
    </SVMPayProvider>
  );
}
```

3. Use the payment components:

```jsx
import { SimplePaymentButton, SimpleQRCodePayment } from 'svm-pay/react-integration';

function PaymentPage() {
  return (
    <div>
      <SimplePaymentButton
        recipient="recipient-address"
        amount="1.0"
        onComplete={(status, signature) => {
          console.log(`Payment ${status}`, signature);
        }}
      />
      
      <SimpleQRCodePayment
        recipient="recipient-address"
        amount="1.0"
      />
    </div>
  );
}
```

### Vue Integration

1. Install the SVM-Pay package:

```bash
npm install svm-pay
```

2. Register the plugin:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { createSVMPayPlugin } from 'svm-pay/vue-integration';

const app = createApp(App);
app.use(createSVMPayPlugin({
  defaultNetwork: 'solana'
}));
app.mount('#app');
```

3. Use the payment components:

```html
<template>
  <div>
    <svm-pay-button
      recipient="recipient-address"
      amount="1.0"
      @complete="handleComplete"
    />
    
    <svm-pay-qr-code
      recipient="recipient-address"
      amount="1.0"
    />
  </div>
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

### Angular Integration

1. Install the SVM-Pay package:

```bash
npm install svm-pay
```

2. Import the module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SVMPayModule } from 'svm-pay/angular-integration';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SVMPayModule.forRoot({
      defaultNetwork: 'solana'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

3. Use the payment components:

```html
<svm-pay-button
  recipient="recipient-address"
  amount="1.0"
  (complete)="handleComplete($event)"
></svm-pay-button>

<svm-pay-qr-code
  recipient="recipient-address"
  amount="1.0"
></svm-pay-qr-code>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  handleComplete(event: {status: string, signature?: string}) {
    console.log(`Payment ${event.status}`, event.signature);
  }
}
```

## Examples

SVM-Pay includes several example applications to demonstrate its functionality:

### Web Payment Demo

A simple web application that demonstrates how to integrate SVM-Pay into a website.

```jsx
import React, { useState } from 'react';
import { SVMPayProvider, PaymentForm } from 'svm-pay/react-integration';

function App() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  return (
    <SVMPayProvider>
      <h1>SVM-Pay Demo</h1>
      <PaymentForm
        defaultRecipient="your-wallet-address"
        defaultAmount="1.0"
        onComplete={(status, signature) => {
          setPaymentStatus({ status, signature });
        }}
      />
      {paymentStatus && (
        <div>
          <h2>Payment {paymentStatus.status}</h2>
          {paymentStatus.signature && (
            <p>Transaction signature: {paymentStatus.signature}</p>
          )}
        </div>
      )}
    </SVMPayProvider>
  );
}
```

### Point-of-Sale Demo

A point-of-sale application that demonstrates how to use SVM-Pay for in-person payments.

```jsx
import React, { useState } from 'react';
import { SVMPayProvider, SimpleQRCodePayment } from 'svm-pay/react-integration';

function App() {
  const [product, setProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const products = [
    { id: '1', name: 'Coffee', price: '2.50' },
    { id: '2', name: 'Sandwich', price: '5.00' },
    { id: '3', name: 'Salad', price: '4.50' }
  ];
  
  return (
    <SVMPayProvider>
      <h1>SVM-Pay Point-of-Sale Demo</h1>
      
      {!product ? (
        <div>
          <h2>Select a Product</h2>
          <div className="products">
            {products.map(p => (
              <div key={p.id} className="product" onClick={() => setProduct(p)}>
                <h3>{p.name}</h3>
                <p>${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          
          {!paymentStatus ? (
            <SimpleQRCodePayment
              recipient="your-wallet-address"
              amount={product.price}
              description={`Payment for ${product.name}`}
              onComplete={(status, signature) => {
                setPaymentStatus({ status, signature });
              }}
            />
          ) : (
            <div>
              <h3>Payment {paymentStatus.status}</h3>
              <button onClick={() => {
                setProduct(null);
                setPaymentStatus(null);
              }}>
                Back to Products
              </button>
            </div>
          )}
        </div>
      )}
    </SVMPayProvider>
  );
}
```

### Subscription Payment Demo

A subscription service application that demonstrates how to use SVM-Pay for recurring payments.

```jsx
import React, { useState } from 'react';
import { SVMPayProvider, SimplePaymentButton } from 'svm-pay/react-integration';

function App() {
  const [plan, setPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  
  const plans = [
    { id: 'basic', name: 'Basic Plan', price: '9.99', interval: 'monthly' },
    { id: 'pro', name: 'Pro Plan', price: '19.99', interval: 'monthly' },
    { id: 'enterprise', name: 'Enterprise Plan', price: '49.99', interval: 'monthly' }
  ];
  
  return (
    <SVMPayProvider>
      <h1>SVM-Pay Subscription Demo</h1>
      
      {subscriptions.length > 0 && (
        <div>
          <h2>Your Subscriptions</h2>
          <ul>
            {subscriptions.map((sub, index) => (
              <li key={index}>
                {sub.plan.name} - ${sub.plan.price}/{sub.plan.interval}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!plan ? (
        <div>
          <h2>Choose a Plan</h2>
          <div className="plans">
            {plans.map(p => (
              <div key={p.id} className="plan" onClick={() => setPlan(p)}>
                <h3>{p.name}</h3>
                <p>${p.price}/{p.interval}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>{plan.name}</h2>
          <p>${plan.price}/{plan.interval}</p>
          
          {!paymentStatus ? (
            <SimplePaymentButton
              recipient="your-wallet-address"
              amount={plan.price}
              description={`Subscription to ${plan.name}`}
              onComplete={(status, signature) => {
                setPaymentStatus({ status, signature });
                if (status === 'confirmed') {
                  setSubscriptions([...subscriptions, {
                    plan,
                    date: new Date()
                  }]);
                }
              }}
            />
          ) : (
            <div>
              <h3>Subscription {paymentStatus.status}</h3>
              <button onClick={() => {
                setPlan(null);
                setPaymentStatus(null);
              }}>
                Back to Plans
              </button>
            </div>
          )}
        </div>
      )}
    </SVMPayProvider>
  );
}
```

## API Reference

### Core Types

```typescript
enum SVMNetwork {
  SOLANA = 'solana',
  SONIC = 'sonic',
  ECLIPSE = 'eclipse',
  SOON = 'soon'
}

enum RequestType {
  TRANSFER = 'transfer',
  TRANSACTION = 'transaction'
}

interface PaymentRequest {
  type: RequestType;
  network: SVMNetwork;
  recipient: string;
  label?: string;
  message?: string;
  memo?: string;
  references?: string[];
}

interface TransferRequest extends PaymentRequest {
  type: RequestType.TRANSFER;
  amount?: string;
  splToken?: string;
}

interface TransactionRequest extends PaymentRequest {
  type: RequestType.TRANSACTION;
  link: string;
}

enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

interface PaymentRecord {
  id: string;
  request: PaymentRequest;
  status: PaymentStatus;
  signature?: string;
  createdAt: number;
  updatedAt: number;
  error?: string;
}
```

### SVMPay Class

```typescript
class SVMPay {
  constructor(config?: {
    defaultNetwork?: SVMNetwork;
    apiEndpoint?: string;
    debug?: boolean;
  });
  
  createTransferUrl(
    recipient: string,
    amount?: string,
    options?: {
      network?: SVMNetwork;
      splToken?: string;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
    }
  ): string;
  
  createTransactionUrl(
    recipient: string,
    link: string,
    options?: {
      network?: SVMNetwork;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
    }
  ): string;
  
  parseUrl(url: string): PaymentRequest;
  
  generateReference(): string;
  
  processPayment(request: PaymentRequest): Promise<PaymentRecord>;
  
  checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}
```

### SVMPayServer Class

```typescript
class SVMPayServer {
  constructor(config?: {
    defaultNetwork?: SVMNetwork;
    debug?: boolean;
    secretKey?: string;
  });
  
  createTransferUrl(
    recipient: string,
    amount?: string,
    options?: {
      network?: SVMNetwork;
      splToken?: string;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
      orderId?: string;
    }
  ): string;
  
  createTransactionUrl(
    recipient: string,
    link: string,
    options?: {
      network?: SVMNetwork;
      label?: string;
      message?: string;
      memo?: string;
      references?: string[];
      orderId?: string;
    }
  ): string;
  
  parseUrl(url: string): PaymentRequest;
  
  generateReference(): string;
  
  generateOrderReference(orderId: string): string;
  
  verifyTransaction(transaction: any, request: PaymentRequest): boolean;
  
  handleWebhook(signature: string, reference: string): Promise<PaymentStatus>;
  
  checkTransactionStatus(
    signature: string,
    network?: SVMNetwork
  ): Promise<PaymentStatus>;
  
  findTransactionsByReference(
    reference: string,
    network?: SVMNetwork
  ): Promise<string[]>;
}
```

## Network-Specific Features

### Solana

- Native SOL and SPL token support
- Transaction lookup by reference
- Memo program support

### Sonic SVM

- Native token and SPL token support
- Fast transaction confirmation
- Enhanced transaction metadata

### Eclipse

- Native token support
- Cross-chain compatibility
- Extended reference system

### s00n

- Native token support
- Optimized for high throughput
- Enhanced security features

## Troubleshooting

### Common Issues

1. **Payment URL not recognized by wallet**
   - Ensure the URL format is correct
   - Check that the wallet supports the SVM network you're using
   - Verify that the recipient address is valid

2. **Transaction fails to confirm**
   - Check that the user has sufficient funds
   - Verify that the network is operational
   - Ensure that the transaction is properly signed

3. **Reference ID not found**
   - Verify that the reference ID is correctly generated
   - Check that the reference is included in the payment URL
   - Ensure that the transaction was successfully submitted

### Debugging

SVM-Pay includes debugging features that can be enabled by setting the `debug` option to `true` when initializing the SDK:

```javascript
const svmPay = new SVMPay({
  debug: true
});
```

This will log detailed information about SDK operations to the console, which can help identify issues.

### Support

For additional support, please:
- Check the GitHub repository for issues and solutions
- Join the community Discord server
- Contact the SVM-Pay team via email

---

This documentation is a comprehensive guide to SVM-Pay. For more detailed information about specific components or features, please refer to the source code and examples in the GitHub repository.

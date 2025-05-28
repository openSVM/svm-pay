# SVM-Pay NPM Package Integration

This document outlines how this repository integrates with the `svm-pay` NPM package.

## Overview

The `svm-pay` NPM package is a CLI tool for managing Solana-based payments for OpenRouter API usage. This repository integrates with that package to provide additional functionality while maintaining backward compatibility with our existing SDK.

## Integration Features

- Automatic detection of the `svm-pay` NPM package at runtime
- Fallback to local implementation when the NPM package is not available
- Additional API methods that utilize the NPM package functionality:
  - `checkWalletBalance()`: Check the current Solana wallet balance
  - `checkApiUsage()`: Check OpenRouter API usage
  - `getPaymentHistory()`: View payment history
  - `setupWallet()`: Set up payment configuration

## How to Use

### Basic SDK Usage (No Change)

```javascript
import { SVMPay } from 'svm-pay';

// Create a new SDK instance
const svmPay = new SVMPay({
  defaultNetwork: 'solana',
  debug: true
});

// Create a transfer URL (local implementation)
const url = svmPay.createTransferUrl('ADDRESS', '1.0', {
  label: 'My App',
  message: 'Payment for services'
});
```

### Using NPM Package Features

```javascript
import { SVMPay } from 'svm-pay';

const svmPay = new SVMPay({
  debug: true
});

// Check wallet balance (uses NPM package)
const balance = await svmPay.checkWalletBalance();
console.log('Current balance:', balance);

// Check API usage (uses NPM package)
const usage = await svmPay.checkApiUsage();
console.log('API usage:', usage);

// View payment history (uses NPM package)
const history = await svmPay.getPaymentHistory();
console.log('Payment history:', history);

// Process payment (tries NPM package first, falls back to local implementation)
const payment = await svmPay.processPayment({
  type: 'transfer',
  network: 'solana',
  recipient: 'ADDRESS',
  amount: '1.0'
});
```

## Implementation Details

The integration is implemented using a dynamic import approach to ensure that:

1. The SDK works even when the NPM package is not installed
2. There are no hard dependencies that might cause issues with different versions
3. The integration is seamless to the end user

When methods that rely on the NPM package are called, the SDK:

1. Checks if the NPM package is available
2. If available, uses the package's functionality
3. If not available, or if an error occurs, falls back to local implementation or throws an appropriate error

## Benefits

- Users get access to the functionality of both the SDK and the CLI tool
- Single consistent API for all payment-related operations
- Graceful fallbacks ensure that applications continue to work even if the NPM package changes
- Flexible architecture that can adapt to future changes in the NPM package
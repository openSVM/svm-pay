# SVM-Pay CLI Integration

This document outlines how this repository includes CLI functionality for managing Solana-based payments for OpenRouter API usage.

## Overview

The SVM-Pay repository now includes a built-in CLI tool that provides payment management functionality. Instead of depending on an external npm package, all CLI functionality is built from source as part of this project.

## CLI Features

The integrated CLI provides the following commands:

- `svm-pay setup`: Set up payment configuration with private key, API key, and settings
- `svm-pay balance`: Check the current Solana wallet balance
- `svm-pay usage`: Check OpenRouter API usage and limits
- `svm-pay pay`: Process payments for API usage
- `svm-pay history`: View payment history

## Installation & Usage

### As a Global CLI Tool

Install globally to use the CLI from anywhere:

```bash
npm install -g svm-pay
```

Then use the CLI:

```bash
svm-pay --help
svm-pay setup -k <your-private-key> -a <your-api-key>
svm-pay balance
svm-pay usage
svm-pay pay -a 0.1
svm-pay history
```

### Using npx (No Installation)

Use directly with npx:

```bash
npx svm-pay --help
npx svm-pay balance
npx svm-pay usage
```

### As a Library Dependency

Install as a dependency in your project:

```bash
npm install svm-pay
```

Use the SDK functionality:

```javascript
import { SVMPay } from 'svm-pay';

const svmPay = new SVMPay({ debug: true });

// Original SDK functionality
const url = svmPay.createTransferUrl('ADDRESS', '1.0', {
  label: 'My App',
  message: 'Payment for services'
});

// CLI functionality integrated into SDK
try {
  const balance = await svmPay.checkWalletBalance();
  console.log('Current balance:', balance);
  
  const usage = await svmPay.checkApiUsage();
  console.log('API usage:', usage);
  
  const history = await svmPay.getPaymentHistory();
  console.log('Payment history:', history);
} catch (error) {
  console.error('CLI functions require setup:', error);
}
```

## CLI Commands

### Setup

Configure your payment settings:

```bash
svm-pay setup -k <your-private-key> -a <your-api-key> -t <threshold> -r <recipient-address>
```

Parameters:
- `-k, --private-key`: Your Solana wallet private key (base58 or array format)
- `-a, --api-key`: Your OpenRouter API key
- `-t, --threshold`: Payment threshold in SOL (default: 0.1)
- `-r, --recipient`: Default recipient address for payments

### Check Balance

Check your current Solana wallet balance:

```bash
svm-pay balance
```

### Check API Usage

Check your OpenRouter API usage:

```bash
svm-pay usage
```

### Make Payment

Process a payment:

```bash
svm-pay pay -a <amount> -r <reason> -t <to-address>
```

Parameters:
- `-a, --amount`: Amount to pay in SOL
- `-r, --reason`: Reason for payment (optional)
- `-t, --to`: Recipient address (optional, uses default if configured)
- `-f, --force`: Skip confirmation prompts

### View History

View payment history:

```bash
svm-pay history
svm-pay history --limit 20
svm-pay history --all
svm-pay history --json
```

## Test Mode

For testing without making actual blockchain transactions:

```bash
TEST_MODE=true svm-pay balance
TEST_MODE=true svm-pay pay -a 0.01
```

## Configuration

Configuration is stored in `~/.svm-pay/config.json` and payment history in `~/.svm-pay/payment-history.json`.

## Integration with SDK

The CLI functionality is fully integrated with the SDK. All CLI utilities are available for programmatic use:

```javascript
import { 
  loadConfig, 
  getWalletBalance, 
  checkApiUsage, 
  loadPaymentHistory 
} from 'svm-pay';

// Access CLI functionality programmatically
const config = loadConfig();
const balance = await getWalletBalance(config.privateKey);
const usage = await checkApiUsage(config.apiKey);
const history = loadPaymentHistory();
```

## Benefits

- **Self-contained**: No external dependencies on CLI packages
- **Consistent**: Single codebase for both SDK and CLI functionality
- **Reliable**: No version conflicts or external package issues
- **Maintainable**: Full control over CLI functionality and updates
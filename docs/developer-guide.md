# SVM-Pay Developer Guide

Welcome to the SVM-Pay Developer Guide! This guide will help you integrate SVM-Pay into your applications and start accepting payments across multiple SVM networks.

## Table of Contents

1. [Quickstart Guide](#quickstart-guide)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Integration Tutorials](#integration-tutorials)
   - [Web Application Integration](#web-application-integration)
   - [React Integration](#react-integration)
   - [Vue Integration](#vue-integration)
   - [Angular Integration](#angular-integration)
   - [Mobile Integration](#mobile-integration)
5. [Advanced Usage](#advanced-usage)
   - [Custom Payment Flows](#custom-payment-flows)
   - [Transaction Verification](#transaction-verification)
   - [Handling Callbacks](#handling-callbacks)
6. [Code Examples](#code-examples)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## Quickstart Guide

Get started with SVM-Pay in just a few minutes:

### 1. Install the package

```bash
npm install svm-pay
```

### 2. Create a payment URL

```javascript
import { SVMPay } from 'svm-pay';

const svmPay = new SVMPay();

const paymentUrl = svmPay.createTransferUrl(
  'YOUR_WALLET_ADDRESS',
  '1.0',
  {
    label: 'Your Store',
    message: 'Payment for Order #123',
    references: ['order-123']
  }
);

console.log(paymentUrl);
// Output: solana:YOUR_WALLET_ADDRESS?amount=1.0&label=Your%20Store&message=Payment%20for%20Order%20%23123&reference=order-123
```

### 3. Display the payment URL as a QR code

```javascript
import { SVMPay, QRCode } from 'svm-pay';

const svmPay = new SVMPay();

const paymentUrl = svmPay.createTransferUrl(
  'YOUR_WALLET_ADDRESS',
  '1.0'
);

// Generate QR code in a div with id "qrcode"
new QRCode(document.getElementById("qrcode"), paymentUrl);
```

### 4. Handle payment completion

```javascript
import { SVMPay } from 'svm-pay';

const svmPay = new SVMPay();

// Generate a reference for this payment
const reference = svmPay.generateReference();

const paymentUrl = svmPay.createTransferUrl(
  'YOUR_WALLET_ADDRESS',
  '1.0',
  {
    references: [reference]
  }
);

// Check for payment completion
const checkPayment = async () => {
  const status = await svmPay.checkPaymentStatus(reference);
  
  if (status === 'confirmed') {
    console.log('Payment confirmed!');
    // Update UI or redirect user
  }
};

// Poll for payment status every 2 seconds
const interval = setInterval(checkPayment, 2000);

// Stop polling after 5 minutes
setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
```

## Installation

### NPM

```bash
npm install svm-pay
```

### Yarn

```bash
yarn add svm-pay
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svm-pay@1.0.0/dist/svm-pay.min.js"></script>
```

## Basic Usage

### Initialize the SDK

```javascript
import { SVMPay } from 'svm-pay';

// Default configuration (Solana network)
const svmPay = new SVMPay();

// Custom configuration
const customSvmPay = new SVMPay({
  defaultNetwork: 'sonic', // 'solana', 'sonic', 'eclipse', or 'soon'
  debug: true // Enable debug logging
});
```

### Create a Transfer URL

```javascript
const url = svmPay.createTransferUrl(
  'RECIPIENT_ADDRESS',
  '1.0', // Amount (optional)
  {
    network: 'solana', // Override default network
    splToken: 'TOKEN_ADDRESS', // SPL token address (optional)
    label: 'Store Name', // Label for the payment (optional)
    message: 'Payment for Order #123', // Message (optional)
    memo: 'Order #123', // Memo (optional)
    references: ['order-123'] // Reference IDs (optional)
  }
);
```

### Create a Transaction URL

```javascript
const url = svmPay.createTransactionUrl(
  'RECIPIENT_ADDRESS',
  'https://example.com/transaction', // URL to fetch transaction
  {
    network: 'solana',
    label: 'Store Name',
    message: 'Payment for Order #123',
    references: ['order-123']
  }
);
```

### Parse a Payment URL

```javascript
const request = svmPay.parseUrl('solana:RECIPIENT_ADDRESS?amount=1.0&reference=order-123');

console.log(request);
// Output:
// {
//   type: 'transfer',
//   network: 'solana',
//   recipient: 'RECIPIENT_ADDRESS',
//   amount: '1.0',
//   references: ['order-123']
// }
```

### Generate a Reference ID

```javascript
const reference = svmPay.generateReference();
console.log(reference); // Random UUID without dashes
```

## Integration Tutorials

### Web Application Integration

Integrating SVM-Pay into a web application is straightforward:

1. Install the package:

```bash
npm install svm-pay
```

2. Create a payment form:

```html
<form id="payment-form">
  <div>
    <label for="amount">Amount:</label>
    <input type="text" id="amount" name="amount" value="1.0">
  </div>
  <div>
    <label for="description">Description:</label>
    <input type="text" id="description" name="description" value="Payment for services">
  </div>
  <button type="submit">Pay Now</button>
</form>

<div id="payment-qr" style="display: none;">
  <h3>Scan with your SVM wallet</h3>
  <div id="qrcode"></div>
</div>

<div id="payment-status" style="display: none;"></div>
```

3. Add JavaScript to handle the payment:

```javascript
import { SVMPay, QRCode } from 'svm-pay';

const svmPay = new SVMPay();
const form = document.getElementById('payment-form');
const qrContainer = document.getElementById('payment-qr');
const statusContainer = document.getElementById('payment-status');
const qrcodeElement = document.getElementById('qrcode');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = document.getElementById('amount').value;
  const description = document.getElementById('description').value;
  
  // Generate a reference for this payment
  const reference = svmPay.generateReference();
  
  // Create payment URL
  const paymentUrl = svmPay.createTransferUrl(
    'YOUR_WALLET_ADDRESS',
    amount,
    {
      message: description,
      references: [reference]
    }
  );
  
  // Show QR code
  form.style.display = 'none';
  qrContainer.style.display = 'block';
  
  // Clear previous QR code if any
  qrcodeElement.innerHTML = '';
  
  // Generate QR code
  new QRCode(qrcodeElement, paymentUrl);
  
  // Poll for payment status
  const checkPayment = async () => {
    try {
      const status = await svmPay.checkPaymentStatus(reference);
      
      if (status === 'confirmed') {
        clearInterval(interval);
        qrContainer.style.display = 'none';
        statusContainer.style.display = 'block';
        statusContainer.innerHTML = '<h3>Payment Confirmed!</h3><p>Thank you for your payment.</p>';
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };
  
  const interval = setInterval(checkPayment, 2000);
  
  // Stop polling after 5 minutes
  setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
});
```

### React Integration

SVM-Pay provides React components for easy integration:

1. Install the package:

```bash
npm install svm-pay
```

2. Wrap your application with the SVMPayProvider:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { SVMPayProvider } from 'svm-pay/react-integration';
import App from './App';

ReactDOM.render(
  <SVMPayProvider config={{ defaultNetwork: 'solana' }}>
    <App />
  </SVMPayProvider>,
  document.getElementById('root')
);
```

3. Use the payment components:

```jsx
import React, { useState } from 'react';
import { SimplePaymentButton, SimpleQRCodePayment } from 'svm-pay/react-integration';

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('button');
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const handleComplete = (status, signature) => {
    setPaymentStatus({ status, signature });
  };
  
  return (
    <div>
      <h2>Complete Your Payment</h2>
      
      <div>
        <label>
          <input
            type="radio"
            value="button"
            checked={paymentMethod === 'button'}
            onChange={() => setPaymentMethod('button')}
          />
          Pay with Wallet
        </label>
        
        <label>
          <input
            type="radio"
            value="qr"
            checked={paymentMethod === 'qr'}
            onChange={() => setPaymentMethod('qr')}
          />
          Pay with QR Code
        </label>
      </div>
      
      {paymentStatus ? (
        <div>
          <h3>Payment {paymentStatus.status}</h3>
          {paymentStatus.signature && (
            <p>Transaction signature: {paymentStatus.signature}</p>
          )}
        </div>
      ) : (
        <div>
          {paymentMethod === 'button' ? (
            <SimplePaymentButton
              recipient="YOUR_WALLET_ADDRESS"
              amount="1.0"
              label="Pay Now"
              onComplete={handleComplete}
            />
          ) : (
            <SimpleQRCodePayment
              recipient="YOUR_WALLET_ADDRESS"
              amount="1.0"
              onComplete={handleComplete}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
```

4. For a complete payment form:

```jsx
import React, { useState } from 'react';
import { PaymentForm } from 'svm-pay/react-integration';

function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const handleComplete = (status, signature) => {
    setPaymentStatus({ status, signature });
  };
  
  return (
    <div>
      <h2>Checkout</h2>
      
      {paymentStatus ? (
        <div>
          <h3>Payment {paymentStatus.status}</h3>
          {paymentStatus.signature && (
            <p>Transaction signature: {paymentStatus.signature}</p>
          )}
        </div>
      ) : (
        <PaymentForm
          defaultRecipient="YOUR_WALLET_ADDRESS"
          defaultAmount="1.0"
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

export default CheckoutPage;
```

### Vue Integration

SVM-Pay provides Vue components for easy integration:

1. Install the package:

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

```vue
<template>
  <div>
    <h2>Complete Your Payment</h2>
    
    <div>
      <label>
        <input
          type="radio"
          value="button"
          v-model="paymentMethod"
        />
        Pay with Wallet
      </label>
      
      <label>
        <input
          type="radio"
          value="qr"
          v-model="paymentMethod"
        />
        Pay with QR Code
      </label>
    </div>
    
    <div v-if="paymentStatus">
      <h3>Payment {{ paymentStatus.status }}</h3>
      <p v-if="paymentStatus.signature">
        Transaction signature: {{ paymentStatus.signature }}
      </p>
    </div>
    
    <div v-else>
      <svm-pay-button
        v-if="paymentMethod === 'button'"
        recipient="YOUR_WALLET_ADDRESS"
        amount="1.0"
        label="Pay Now"
        @complete="handleComplete"
      />
      
      <svm-pay-qr-code
        v-else
        recipient="YOUR_WALLET_ADDRESS"
        amount="1.0"
        @complete="handleComplete"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentMethod: 'button',
      paymentStatus: null
    };
  },
  methods: {
    handleComplete(status, signature) {
      this.paymentStatus = { status, signature };
    }
  }
};
</script>
```

4. For a complete payment form:

```vue
<template>
  <div>
    <h2>Checkout</h2>
    
    <div v-if="paymentStatus">
      <h3>Payment {{ paymentStatus.status }}</h3>
      <p v-if="paymentStatus.signature">
        Transaction signature: {{ paymentStatus.signature }}
      </p>
    </div>
    
    <svm-pay-form
      v-else
      defaultRecipient="YOUR_WALLET_ADDRESS"
      defaultAmount="1.0"
      @complete="handleComplete"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentStatus: null
    };
  },
  methods: {
    handleComplete(status, signature) {
      this.paymentStatus = { status, signature };
    }
  }
};
</script>
```

### Angular Integration

SVM-Pay provides Angular components for easy integration:

1. Install the package:

```bash
npm install svm-pay
```

2. Import the module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SVMPayModule } from 'svm-pay/angular-integration';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    SVMPayModule.forRoot({
      defaultNetwork: 'solana'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

3. Use the payment components:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Complete Your Payment</h2>
      
      <div>
        <label>
          <input
            type="radio"
            value="button"
            [(ngModel)]="paymentMethod"
          />
          Pay with Wallet
        </label>
        
        <label>
          <input
            type="radio"
            value="qr"
            [(ngModel)]="paymentMethod"
          />
          Pay with QR Code
        </label>
      </div>
      
      <div *ngIf="paymentStatus">
        <h3>Payment {{ paymentStatus.status }}</h3>
        <p *ngIf="paymentStatus.signature">
          Transaction signature: {{ paymentStatus.signature }}
        </p>
      </div>
      
      <div *ngIf="!paymentStatus">
        <svm-pay-button
          *ngIf="paymentMethod === 'button'"
          recipient="YOUR_WALLET_ADDRESS"
          amount="1.0"
          label="Pay Now"
          (complete)="handleComplete($event)"
        ></svm-pay-button>
        
        <svm-pay-qr-code
          *ngIf="paymentMethod === 'qr'"
          recipient="YOUR_WALLET_ADDRESS"
          amount="1.0"
          (complete)="handleComplete($event)"
        ></svm-pay-qr-code>
      </div>
    </div>
  `
})
export class AppComponent {
  paymentMethod = 'button';
  paymentStatus: { status: string, signature?: string } | null = null;
  
  handleComplete(event: { status: string, signature?: string }) {
    this.paymentStatus = event;
  }
}
```

4. For a complete payment form:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Checkout</h2>
      
      <div *ngIf="paymentStatus">
        <h3>Payment {{ paymentStatus.status }}</h3>
        <p *ngIf="paymentStatus.signature">
          Transaction signature: {{ paymentStatus.signature }}
        </p>
      </div>
      
      <svm-pay-form
        *ngIf="!paymentStatus"
        defaultRecipient="YOUR_WALLET_ADDRESS"
        defaultAmount="1.0"
        (complete)="handleComplete($event)"
      ></svm-pay-form>
    </div>
  `
})
export class AppComponent {
  paymentStatus: { status: string, signature?: string } | null = null;
  
  handleComplete(event: { status: string, signature?: string }) {
    this.paymentStatus = event;
  }
}
```

### Mobile Integration

SVM-Pay provides native SDKs for iOS and Android:

#### iOS Integration

1. Add the SDK to your project using Swift Package Manager:

```swift
// In your Package.swift
dependencies: [
    .package(url: "https://github.com/openSVM/svm-pay-ios.git", .upToNextMajor(from: "1.0.0"))
]
```

2. Import and use the SDK:

```swift
import SVMPay

class PaymentViewController: UIViewController {
    let svmPay = SVMPay(defaultNetwork: .solana)
    
    @IBAction func payButtonTapped(_ sender: UIButton) {
        // Create a payment URL
        let url = svmPay.createTransferUrl(
            recipient: "YOUR_WALLET_ADDRESS",
            amount: "1.0",
            options: [
                "label": "Your Store",
                "message": "Payment for Order #123",
                "references": ["order-123"]
            ]
        )
        
        // Open the URL in a wallet app
        if let url = URL(string: url), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else {
            // Handle case where no compatible wallet is installed
            showAlert(message: "No compatible wallet found")
        }
    }
    
    func showAlert(message: String) {
        let alert = UIAlertController(
            title: "Error",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
```

#### Android Integration

1. Add the SDK to your project:

```gradle
// In your app's build.gradle
dependencies {
    implementation 'com.opensvm:svm-pay:1.0.0'
}
```

2. Import and use the SDK:

```kotlin
import com.opensvm.svmpay.SVMPay
import com.opensvm.svmpay.SVMNetwork
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class PaymentActivity : AppCompatActivity() {
    private val svmPay = SVMPay(defaultNetwork = SVMNetwork.SOLANA)
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_payment)
        
        findViewById<Button>(R.id.payButton).setOnClickListener {
            // Create a payment URL
            val url = svmPay.createTransferUrl(
                recipient = "YOUR_WALLET_ADDRESS",
                amount = "1.0",
                options = mapOf(
                    "label" to "Your Store",
                    "message" to "Payment for Order #123",
                    "references" to listOf("order-123")
                )
            )
            
            // Open the URL in a wallet app
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
            } catch (e: Exception) {
                // Handle case where no compatible wallet is installed
                Toast.makeText(this, "No compatible wallet found", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

## Advanced Usage

### Custom Payment Flows

You can create custom payment flows by combining the core SDK functions:

```javascript
import { SVMPay } from 'svm-pay';

class CustomPaymentFlow {
  constructor(recipientAddress) {
    this.svmPay = new SVMPay();
    this.recipient = recipientAddress;
  }
  
  async startPayment(amount, metadata = {}) {
    // Generate a unique reference for this payment
    const reference = this.svmPay.generateReference();
    
    // Create payment URL
    const paymentUrl = this.svmPay.createTransferUrl(
      this.recipient,
      amount,
      {
        ...metadata,
        references: [...(metadata.references || []), reference]
      }
    );
    
    // Store payment details
    const paymentDetails = {
      id: reference,
      amount,
      url: paymentUrl,
      status: 'created',
      createdAt: Date.now()
    };
    
    // Return payment details
    return paymentDetails;
  }
  
  async checkPaymentStatus(reference) {
    try {
      const status = await this.svmPay.checkPaymentStatus(reference);
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'error';
    }
  }
  
  async waitForPaymentConfirmation(reference, timeoutMs = 5 * 60 * 1000) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        const status = await this.checkPaymentStatus(reference);
        
        if (status === 'confirmed') {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          resolve({ status, reference });
        } else if (status === 'failed') {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          reject(new Error('Payment failed'));
        }
      }, 2000);
      
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Payment timeout'));
      }, timeoutMs);
    });
  }
}

// Usage
const paymentFlow = new CustomPaymentFlow('YOUR_WALLET_ADDRESS');

const startPayment = async () => {
  try {
    const payment = await paymentFlow.startPayment('1.0', {
      label: 'Your Store',
      message: 'Payment for Order #123'
    });
    
    console.log('Payment URL:', payment.url);
    
    // Wait for payment confirmation
    const result = await paymentFlow.waitForPaymentConfirmation(payment.id);
    console.log('Payment confirmed:', result);
    
    // Update UI or redirect user
  } catch (error) {
    console.error('Payment error:', error);
    // Handle payment error
  }
};

startPayment();
```

### Transaction Verification

For server-side verification of payments:

```javascript
import { SVMPayServer } from 'svm-pay/server';

const svmPayServer = new SVMPayServer({
  secretKey: 'YOUR_SECRET_KEY' // Optional, for signing requests
});

// Generate a reference for an order
const generateOrderReference = (orderId) => {
  return svmPayServer.generateOrderReference(orderId);
};

// Verify a transaction
const verifyTransaction = async (transaction, reference) => {
  try {
    const isValid = await svmPayServer.verifyTransaction(transaction, reference);
    return isValid;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
};

// Check transaction status
const checkTransactionStatus = async (signature, network = 'solana') => {
  try {
    const status = await svmPayServer.checkTransactionStatus(signature, network);
    return status;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return 'error';
  }
};

// Find transactions by reference
const findTransactionsByReference = async (reference, network = 'solana') => {
  try {
    const transactions = await svmPayServer.findTransactionsByReference(reference, network);
    return transactions;
  } catch (error) {
    console.error('Error finding transactions:', error);
    return [];
  }
};
```

### Handling Callbacks

You can set up a webhook to receive payment notifications:

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { SVMPayServer } from 'svm-pay/server';

const app = express();
app.use(bodyParser.json());

const svmPayServer = new SVMPayServer({
  secretKey: 'YOUR_SECRET_KEY'
});

// Webhook endpoint
app.post('/webhook/payment', async (req, res) => {
  try {
    const { signature, reference } = req.body;
    
    // Verify the webhook signature
    const isValid = svmPayServer.verifyWebhookSignature(
      req.body,
      req.headers['x-svm-pay-signature']
    );
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Process the payment
    const status = await svmPayServer.handleWebhook(signature, reference);
    
    // Update order status in your database
    // ...
    
    return res.json({ status });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## Code Examples

### E-commerce Checkout

```javascript
import { SVMPay } from 'svm-pay';

class Checkout {
  constructor() {
    this.svmPay = new SVMPay();
    this.cart = [];
  }
  
  addToCart(product) {
    this.cart.push(product);
  }
  
  getTotal() {
    return this.cart.reduce((total, product) => total + product.price, 0).toFixed(2);
  }
  
  async checkout(recipientAddress) {
    const total = this.getTotal();
    const reference = this.svmPay.generateReference();
    
    const paymentUrl = this.svmPay.createTransferUrl(
      recipientAddress,
      total,
      {
        label: 'E-commerce Store',
        message: `Payment for ${this.cart.length} items`,
        references: [reference]
      }
    );
    
    return {
      url: paymentUrl,
      reference,
      total
    };
  }
}

// Usage
const checkout = new Checkout();
checkout.addToCart({ name: 'Product 1', price: 10.99 });
checkout.addToCart({ name: 'Product 2', price: 5.99 });

checkout.checkout('YOUR_WALLET_ADDRESS')
  .then(result => {
    console.log('Checkout URL:', result.url);
    console.log('Reference:', result.reference);
    console.log('Total:', result.total);
    
    // Display QR code or redirect to wallet
  })
  .catch(error => {
    console.error('Checkout error:', error);
  });
```

### Subscription Service

```javascript
import { SVMPay } from 'svm-pay';

class SubscriptionService {
  constructor() {
    this.svmPay = new SVMPay();
    this.subscriptions = [];
  }
  
  async createSubscription(user, plan, recipientAddress) {
    const reference = this.svmPay.generateReference();
    
    const paymentUrl = this.svmPay.createTransferUrl(
      recipientAddress,
      plan.price,
      {
        label: 'Subscription Service',
        message: `Subscription to ${plan.name}`,
        references: [reference]
      }
    );
    
    const subscription = {
      id: reference,
      user,
      plan,
      status: 'pending',
      createdAt: Date.now(),
      nextBillingDate: this.calculateNextBillingDate(plan.interval)
    };
    
    this.subscriptions.push(subscription);
    
    return {
      subscription,
      paymentUrl
    };
  }
  
  calculateNextBillingDate(interval) {
    const date = new Date();
    
    switch (interval) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    
    return date;
  }
  
  async checkSubscriptionStatus(subscriptionId) {
    try {
      const status = await this.svmPay.checkPaymentStatus(subscriptionId);
      
      // Update subscription status
      const subscription = this.subscriptions.find(s => s.id === subscriptionId);
      if (subscription) {
        subscription.status = status;
      }
      
      return status;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return 'error';
    }
  }
}

// Usage
const subscriptionService = new SubscriptionService();

const plans = [
  { id: 'basic', name: 'Basic Plan', price: '9.99', interval: 'monthly' },
  { id: 'pro', name: 'Pro Plan', price: '19.99', interval: 'monthly' },
  { id: 'enterprise', name: 'Enterprise Plan', price: '49.99', interval: 'monthly' }
];

const user = { id: 'user-123', name: 'John Doe' };
const selectedPlan = plans[1]; // Pro Plan

subscriptionService.createSubscription(user, selectedPlan, 'YOUR_WALLET_ADDRESS')
  .then(result => {
    console.log('Subscription created:', result.subscription);
    console.log('Payment URL:', result.paymentUrl);
    
    // Display QR code or redirect to wallet
  })
  .catch(error => {
    console.error('Subscription error:', error);
  });
```

### Point-of-Sale System

```javascript
import { SVMPay } from 'svm-pay';

class PointOfSale {
  constructor(merchantAddress) {
    this.svmPay = new SVMPay();
    this.merchantAddress = merchantAddress;
    this.transactions = [];
  }
  
  async createPayment(amount, itemName) {
    const reference = this.svmPay.generateReference();
    
    const paymentUrl = this.svmPay.createTransferUrl(
      this.merchantAddress,
      amount,
      {
        label: 'Point of Sale',
        message: `Payment for ${itemName}`,
        references: [reference]
      }
    );
    
    const transaction = {
      id: reference,
      amount,
      itemName,
      status: 'pending',
      createdAt: Date.now()
    };
    
    this.transactions.push(transaction);
    
    return {
      transaction,
      paymentUrl
    };
  }
  
  async checkPaymentStatus(transactionId) {
    try {
      const status = await this.svmPay.checkPaymentStatus(transactionId);
      
      // Update transaction status
      const transaction = this.transactions.find(t => t.id === transactionId);
      if (transaction) {
        transaction.status = status;
      }
      
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'error';
    }
  }
  
  getTransactionHistory() {
    return this.transactions;
  }
}

// Usage
const pos = new PointOfSale('YOUR_WALLET_ADDRESS');

// Create a payment for a coffee
pos.createPayment('2.50', 'Coffee')
  .then(result => {
    console.log('Transaction created:', result.transaction);
    console.log('Payment URL:', result.paymentUrl);
    
    // Display QR code
    
    // Check payment status every 2 seconds
    const interval = setInterval(async () => {
      const status = await pos.checkPaymentStatus(result.transaction.id);
      
      if (status === 'confirmed') {
        clearInterval(interval);
        console.log('Payment confirmed!');
        // Print receipt
      } else if (status === 'failed') {
        clearInterval(interval);
        console.log('Payment failed!');
      }
    }, 2000);
    
    // Stop checking after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  })
  .catch(error => {
    console.error('Payment error:', error);
  });
```

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

4. **QR code not scanning**
   - Ensure the QR code is displayed at an appropriate size
   - Check that the QR code has sufficient contrast
   - Verify that the payment URL is not too long

5. **Network-specific issues**
   - Solana: Check that the SPL token address is valid
   - Sonic: Ensure the network is operational
   - Eclipse: Verify that the recipient address is in the correct format
   - s00n: Check for network-specific requirements

### Debugging

SVM-Pay includes debugging features that can be enabled by setting the `debug` option to `true` when initializing the SDK:

```javascript
const svmPay = new SVMPay({
  debug: true
});
```

This will log detailed information about SDK operations to the console, which can help identify issues.

## FAQ

### General Questions

**Q: What is SVM-Pay?**
A: SVM-Pay is a payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n) that enables developers to easily integrate payment functionality into their applications.

**Q: Is SVM-Pay free to use?**
A: Yes, SVM-Pay is free to use. There are no fees charged by the SVM-Pay SDK itself. However, normal network transaction fees still apply.

**Q: Which networks are supported?**
A: SVM-Pay currently supports Solana, Sonic SVM, Eclipse, and s00n networks.

**Q: Can I use SVM-Pay for my business?**
A: Yes, SVM-Pay is designed for businesses of all sizes, from small merchants to large enterprises.

### Technical Questions

**Q: How do I handle payment confirmations?**
A: You can use the `checkPaymentStatus` method to poll for payment status, or set up a webhook to receive payment notifications.

**Q: Can I customize the payment UI?**
A: Yes, you can customize the payment UI by styling the provided components or creating your own components using the core SDK.

**Q: How secure is SVM-Pay?**
A: SVM-Pay uses the security features of the underlying blockchain networks. Payments are secured by cryptographic signatures and verified on-chain.

**Q: Can I accept payments in multiple tokens?**
A: Yes, you can specify the token address in the payment URL to accept payments in different tokens.

**Q: How do I handle refunds?**
A: Refunds need to be handled manually by sending a transaction from your wallet to the customer's wallet.

---

This developer guide provides a comprehensive overview of SVM-Pay and how to integrate it into your applications. For more detailed information, please refer to the [API Reference](../docs/documentation.md#api-reference) in the documentation.

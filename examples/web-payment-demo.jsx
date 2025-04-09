/**
 * SVM-Pay Web Payment Demo
 * 
 * This file implements a simple web payment demo application
 * that showcases the SVM-Pay functionality.
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SVMPayProvider, PaymentForm } from '../sdk/react-integration';
import { SVMNetwork } from '../core/types';

/**
 * Demo Application Component
 */
const App = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentSignature, setPaymentSignature] = useState(null);
  
  const handlePaymentComplete = (status, signature) => {
    setPaymentStatus(status);
    setPaymentSignature(signature);
  };
  
  return (
    <SVMPayProvider config={{ defaultNetwork: SVMNetwork.SOLANA, debug: true }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#9945FF' }}>SVM-Pay Demo</h1>
          <p>A cross-network payment solution for SVM networks</p>
        </header>
        
        <div style={{ display: 'flex', marginBottom: '40px' }}>
          <div style={{ flex: 1, padding: '20px' }}>
            <h2>About SVM-Pay</h2>
            <p>
              SVM-Pay is a payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n)
              that allows developers to easily integrate payments into their applications.
            </p>
            <p>
              This demo showcases the payment form component, which provides a complete
              payment flow with minimal setup.
            </p>
            <h3>Features</h3>
            <ul>
              <li>Support for multiple SVM networks</li>
              <li>Simple integration with React, Vue, and Angular</li>
              <li>QR code and button payment options</li>
              <li>Comprehensive SDK for custom integrations</li>
            </ul>
          </div>
          
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2>Try It Out</h2>
            <p>
              Fill out the form below to create a payment request.
              For this demo, payments are simulated and no actual transactions occur.
            </p>
            
            <PaymentForm
              defaultRecipient="demo123456789abcdef"
              defaultAmount="1.0"
              onComplete={handlePaymentComplete}
            />
            
            {paymentStatus && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: paymentStatus === 'confirmed' ? '#e6f7e6' : '#f7e6e6', borderRadius: '4px' }}>
                <h3>Payment {paymentStatus}</h3>
                {paymentSignature && (
                  <p>Transaction signature: {paymentSignature}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
          <h2>Integration Example</h2>
          <p>Integrating SVM-Pay into your React application is simple:</p>
          <pre style={{ backgroundColor: '#333', color: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { SVMPayProvider, PaymentForm } from 'svm-pay/react';

const App = () => {
  const handlePaymentComplete = (status, signature) => {
    console.log(\`Payment \${status}\`, signature);
  };
  
  return (
    <SVMPayProvider>
      <PaymentForm
        defaultRecipient="your-wallet-address"
        defaultAmount="1.0"
        onComplete={handlePaymentComplete}
      />
    </SVMPayProvider>
  );
};`}
          </pre>
        </div>
        
        <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <p>SVM-Pay - A payment solution for SVM networks</p>
        </footer>
      </div>
    </SVMPayProvider>
  );
};

/**
 * Render the application
 */
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/**
 * HTML template for the demo
 */
export const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVM-Pay Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    h1, h2, h3 {
      margin-top: 0;
    }
    
    ul {
      padding-left: 20px;
    }
    
    pre {
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
`;

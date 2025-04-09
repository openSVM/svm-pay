/**
 * SVM-Pay Point-of-Sale Demo
 * 
 * This file implements a point-of-sale demo application
 * that showcases the SVM-Pay functionality for in-person payments.
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SVMPayProvider, SimpleQRCodePayment } from '../sdk/react-integration';
import { SVMNetwork } from '../core/types';

/**
 * Product interface
 */
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

/**
 * Demo Application Component
 */
const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<SVMNetwork>(SVMNetwork.SOLANA);
  
  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Coffee',
      price: 2.5,
      image: 'coffee.jpg',
      description: 'Freshly brewed coffee'
    },
    {
      id: '2',
      name: 'Sandwich',
      price: 5.0,
      image: 'sandwich.jpg',
      description: 'Delicious sandwich with fresh ingredients'
    },
    {
      id: '3',
      name: 'Salad',
      price: 4.5,
      image: 'salad.jpg',
      description: 'Healthy salad with seasonal vegetables'
    },
    {
      id: '4',
      name: 'Cake',
      price: 3.5,
      image: 'cake.jpg',
      description: 'Sweet cake for dessert'
    }
  ];
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setPaymentStatus(null);
    setPaymentSignature(null);
  };
  
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(e.target.value as SVMNetwork);
  };
  
  const handlePaymentComplete = (status: string, signature?: string) => {
    setPaymentStatus(status);
    if (signature) {
      setPaymentSignature(signature);
    }
  };
  
  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setPaymentStatus(null);
    setPaymentSignature(null);
  };
  
  return (
    <SVMPayProvider config={{ defaultNetwork: selectedNetwork, debug: true }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#9945FF' }}>SVM-Pay Point-of-Sale Demo</h1>
          <p>A cross-network payment solution for in-person payments</p>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ marginRight: '10px' }}>Select Network:</label>
            <select 
              value={selectedNetwork} 
              onChange={handleNetworkChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={SVMNetwork.SOLANA}>Solana</option>
              <option value={SVMNetwork.SONIC}>Sonic SVM</option>
              <option value={SVMNetwork.ECLIPSE}>Eclipse</option>
              <option value={SVMNetwork.SOON}>SOON</option>
            </select>
          </div>
        </header>
        
        {!selectedProduct ? (
          <div>
            <h2>Select a Product</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {products.map(product => (
                <div 
                  key={product.id}
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    ':hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <div 
                    style={{ 
                      height: '120px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    {product.name} Image
                  </div>
                  <h3 style={{ margin: '10px 0 5px' }}>{product.name}</h3>
                  <p style={{ fontWeight: 'bold', color: '#9945FF' }}>${product.price.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <h2>{selectedProduct.name}</h2>
              <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#9945FF' }}>
                ${selectedProduct.price.toFixed(2)}
              </p>
              <p>{selectedProduct.description}</p>
            </div>
            
            {paymentStatus ? (
              <div style={{ 
                width: '100%',
                maxWidth: '400px',
                padding: '20px', 
                backgroundColor: paymentStatus === 'confirmed' ? '#e6f7e6' : '#f7e6e6', 
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <h3>Payment {paymentStatus}</h3>
                {paymentSignature && (
                  <p style={{ wordBreak: 'break-all' }}>Transaction signature: {paymentSignature}</p>
                )}
                <button 
                  onClick={handleBackToProducts}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    backgroundColor: '#9945FF',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '15px'
                  }}
                >
                  Back to Products
                </button>
              </div>
            ) : (
              <>
                <SimpleQRCodePayment
                  recipient="demo123456789abcdef"
                  amount={selectedProduct.price.toString()}
                  description={`Payment for ${selectedProduct.name}`}
                  network={selectedNetwork}
                  onComplete={handlePaymentComplete}
                  style={{ marginBottom: '20px' }}
                />
                
                <button 
                  onClick={handleBackToProducts}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
        
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
  <title>SVM-Pay Point-of-Sale Demo</title>
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
    
    button {
      transition: background-color 0.2s;
    }
    
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
`;

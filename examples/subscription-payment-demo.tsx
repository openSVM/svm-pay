/**
 * SVM-Pay Subscription Payment Demo
 * 
 * This file implements a subscription payment demo application
 * that showcases the SVM-Pay functionality for recurring payments.
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SVMPayProvider, SimplePaymentButton } from '../sdk/react-integration';
import { SVMNetwork } from '../core/types';

/**
 * Subscription Plan interface
 */
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
}

/**
 * Demo Application Component
 */
const App = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<SVMNetwork>(SVMNetwork.SOLANA);
  const [subscriptions, setSubscriptions] = useState<{plan: SubscriptionPlan, date: Date}[]>([]);
  
  // Sample subscription plans
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      interval: 'monthly',
      features: ['Feature 1', 'Feature 2', 'Email support']
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      interval: 'monthly',
      features: ['All Basic features', 'Feature 3', 'Feature 4', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      interval: 'monthly',
      features: ['All Pro features', 'Feature 5', 'Feature 6', 'Feature 7', '24/7 support']
    }
  ];
  
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
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
    
    if (status === 'confirmed' && selectedPlan) {
      // Add subscription to list
      setSubscriptions([...subscriptions, {
        plan: selectedPlan,
        date: new Date()
      }]);
    }
  };
  
  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setPaymentStatus(null);
    setPaymentSignature(null);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getNextBillingDate = (date: Date, interval: 'monthly' | 'quarterly' | 'yearly') => {
    const nextDate = new Date(date);
    
    switch (interval) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    return formatDate(nextDate);
  };
  
  return (
    <SVMPayProvider config={{ defaultNetwork: selectedNetwork, debug: true }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#9945FF' }}>SVM-Pay Subscription Demo</h1>
          <p>A cross-network payment solution for subscription services</p>
          
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
        
        {subscriptions.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2>Your Subscriptions</h2>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Plan</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Start Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Next Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription, index) => (
                    <tr key={index} style={{ borderBottom: index < subscriptions.length - 1 ? '1px solid #ddd' : 'none' }}>
                      <td style={{ padding: '12px' }}>{subscription.plan.name}</td>
                      <td style={{ padding: '12px' }}>${subscription.plan.price.toFixed(2)}/{subscription.plan.interval.slice(0, 2)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(subscription.date)}</td>
                      <td style={{ padding: '12px' }}>{getNextBillingDate(subscription.date, subscription.plan.interval)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {!selectedPlan ? (
          <div>
            <h2>Choose a Subscription Plan</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  style={{ 
                    flex: '1 1 250px',
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    ':hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <h3 style={{ marginTop: 0, color: '#9945FF' }}>{plan.name}</h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0' }}>
                    ${plan.price.toFixed(2)}
                    <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>/{plan.interval}</span>
                  </div>
                  <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#9945FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ textAlign: 'center', marginTop: 0 }}>Subscribe to {selectedPlan.name}</h2>
            
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{selectedPlan.name} ({selectedPlan.interval})</span>
                <span>${selectedPlan.price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>${selectedPlan.price.toFixed(2)}</span>
              </div>
            </div>
            
            {paymentStatus ? (
              <div style={{ 
                padding: '20px', 
                backgroundColor: paymentStatus === 'confirmed' ? '#e6f7e6' : '#f7e6e6', 
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0 }}>
                  {paymentStatus === 'confirmed' ? 'Subscription Activated!' : 'Payment Failed'}
                </h3>
                {paymentSignature && (
                  <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>Transaction signature: {paymentSignature}</p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <p>Click the button below to process your first payment and activate your subscription.</p>
                <SimplePaymentButton
                  recipient="demo123456789abcdef"
                  amount={selectedPlan.price.toString()}
                  description={`Subscription to ${selectedPlan.name} (${selectedPlan.interval})`}
                  network={selectedNetwork}
                  label={`Pay $${selectedPlan.price.toFixed(2)}`}
                  onComplete={handlePaymentComplete}
                  style={{ padding: '12px 24px', fontSize: '16px' }}
                />
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleBackToPlans}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {paymentStatus === 'confirmed' ? 'Back to Plans' : 'Cancel'}
              </button>
            </div>
            
            <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              <p>
                Note: This is a demo application. In a real implementation, the subscription would be stored
                in a database and recurring payments would be handled automatically.
              </p>
            </div>
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
  <title>SVM-Pay Subscription Demo</title>
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

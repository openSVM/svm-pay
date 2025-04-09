import React from 'react';
import { SolanaPayment } from '../../../../../../src/sdk/solana-integration';

export default function PricingPage() {
  // Example recipient address (replace with your own)
  const recipientAddress = 'GsbwXfJUbzxDzLJcJMJxpR9nBf9XwQxwKLWi7g2LuG1s';
  
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Pay with Solana for our services
        </p>
      </div>
      
      <div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg bg-card p-8 shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">Basic Plan</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold">
              0.1 SOL
              <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex">
                <span>✓</span>
                <span className="ml-2">Basic features</span>
              </li>
              <li className="flex">
                <span>✓</span>
                <span className="ml-2">5 projects</span>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <SolanaPayment 
              amount={0.1} 
              recipientAddress={recipientAddress}
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-between rounded-lg bg-card p-8 shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">Pro Plan</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold">
              0.5 SOL
              <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex">
                <span>✓</span>
                <span className="ml-2">All Basic features</span>
              </li>
              <li className="flex">
                <span>✓</span>
                <span className="ml-2">Unlimited projects</span>
              </li>
              <li className="flex">
                <span>✓</span>
                <span className="ml-2">Priority support</span>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <SolanaPayment 
              amount={0.5} 
              recipientAddress={recipientAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

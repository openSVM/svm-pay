import React from 'react';
// import { SolanaPayment } from '../../../../../../../../src/sdk/solana-integration';

export default function DashboardPage() {
  // Example recipient address (replace with your own)
  const recipientAddress = 'GsbwXfJUbzxDzLJcJMJxpR9nBf9XwQxwKLWi7g2LuG1s';
  
  const handlePaymentSuccess = (signature: string) => {
    console.log('Payment successful!', signature);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Make payments with Solana.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
          <SolanaPayment 
            amount={0.01} 
            recipientAddress={recipientAddress}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
}

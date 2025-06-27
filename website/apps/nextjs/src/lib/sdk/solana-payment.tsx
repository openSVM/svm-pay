"use client";

import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, Connection, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface SolanaPaymentProps {
  amount: number; // Amount in SOL
  recipientAddress: string;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

export const SolanaPayment: FC<SolanaPaymentProps> = ({ 
  amount, 
  recipientAddress,
  onSuccess,
  onError
}) => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!publicKey || !sendTransaction || !connected) return;

    try {
      setIsProcessing(true);
      
      // Create a connection to use for sending the transaction
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      
      // Convert SOL amount to lamports
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      
      // Create a proper transfer instruction using SystemProgram
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: lamports,
      });

      // Create transaction and add the transfer instruction
      const transaction = new Transaction().add(transferInstruction);
      
      // Get latest blockhash for the transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxSignature(signature);
      onSuccess?.(signature);
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="solana-payment">
      {!connected || !publicKey ? (
        <div>
          <p>Connect your wallet to make a payment</p>
          <WalletMultiButton />
        </div>
      ) : (
        <div>
          <p>Connected: {publicKey.toString()}</p>
          <p>Payment Amount: {amount} SOL</p>
          <p>Recipient: {recipientAddress}</p>
          
          <button 
            onClick={handlePayment} 
            disabled={isProcessing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b99fc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? 'Processing...' : 'Pay with Solana'}
          </button>
          
          {txSignature && (
            <div style={{ marginTop: '20px' }}>
              <p>Transaction successful!</p>
              <p>Signature: {txSignature}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

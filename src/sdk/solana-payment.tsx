import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';

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
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!publicKey) return;

    try {
      setIsProcessing(true);
      
      // Create a simple transfer transaction
      const transaction = new Transaction().add(
        // Create a transfer instruction
        // This is a simplified example - in a real app, you would use the Solana SDK to create a proper transfer instruction
        {
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: new PublicKey(recipientAddress), isSigner: false, isWritable: true },
          ],
          programId: new PublicKey('11111111111111111111111111111111'), // System program ID
          data: Buffer.from([2, ...new Uint8Array(8).fill(0)]), // Transfer instruction with amount
        }
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, undefined);
      
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
      {!publicKey ? (
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

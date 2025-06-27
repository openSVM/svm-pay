/**
 * Pay command for SVM-Pay CLI
 */

import { Command } from 'commander';
import { loadConfig, validateConfig } from '../utils/config';
import { sendPayment, getWalletBalance, isValidSolanaAddress } from '../utils/solana';
import { addPaymentRecord } from '../utils/history';

export const payCommand = new Command('pay')
  .description('Process a payment for OpenRouter API usage')
  .option('-a, --amount <amount>', 'Amount to pay in SOL')
  .option('-r, --reason <reason>', 'Reason for payment (optional)')
  .option('-t, --to <address>', 'Recipient Solana address (optional, uses default if configured)')
  .option('-f, --force', '⚠️  DANGEROUS: Skip confirmation prompts - use with extreme caution!')
  .action(async (options) => {
    try {
      console.log('Processing payment...\n');
      
      const config = loadConfig();
      
      // Security warning for private key usage
      if (config.privateKey && !process.env.SVM_PAY_PRIVATE_KEY) {
        console.warn('🔐 SECURITY NOTICE: Using private key from config file');
        console.warn('Consider using SVM_PAY_PRIVATE_KEY environment variable instead\n');
      }
      
      // Validate required configuration
      if (!validateConfig(config, ['privateKey'])) {
        process.exit(1);
      }
      
      // Determine amount
      let amount: number;
      if (options.amount) {
        amount = parseFloat(options.amount);
        if (isNaN(amount) || amount <= 0) {
          console.error('Error: Amount must be a positive number');
          process.exit(1);
        }
      } else if (config.threshold) {
        amount = config.threshold;
        console.log(`Using configured threshold amount: ${amount} SOL`);
      } else {
        console.error('Error: No amount specified and no threshold configured');
        console.log('Use: svm-pay pay -a <amount> or configure a threshold with svm-pay setup -t <amount>');
        process.exit(1);
      }
      
      // Determine recipient
      let recipient: string;
      if (options.to) {
        recipient = options.to;
      } else if (config.recipientAddress) {
        recipient = config.recipientAddress;
        console.log(`Using configured recipient: ${recipient}`);
      } else {
        console.error('Error: No recipient specified and no default configured');
        console.log('Use: svm-pay pay -t <address> or configure a default with svm-pay setup -r <address>');
        process.exit(1);
      }
      
      // Validate recipient address
      if (!isValidSolanaAddress(recipient)) {
        console.error('Error: Invalid recipient address');
        process.exit(1);
      }
      
      // Check wallet balance
      const balance = await getWalletBalance(config.privateKey!);
      console.log(`Current balance: ${balance.toFixed(6)} SOL`);
      
      if (balance < amount) {
        console.error(`Error: Insufficient balance. Need ${amount} SOL, have ${balance.toFixed(6)} SOL`);
        process.exit(1);
      }
      
      // Show payment details
      console.log('\nPayment Details:');
      console.log('================');
      console.log(`Amount: ${amount} SOL`);
      console.log(`Recipient: ${recipient}`);
      if (options.reason) {
        console.log(`Reason: ${options.reason}`);
      }
      console.log(`Remaining balance: ${(balance - amount).toFixed(6)} SOL`);
      
      // Confirmation (unless forced)
      if (!options.force) {
        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        console.warn('\n⚠️  WARNING: You are about to send a real payment!');
        console.warn('This action cannot be undone. Please verify all details carefully.');
        
        const answer = await new Promise<string>((resolve) => {
          rl.question('\nConfirm payment? (y/N): ', resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
          console.info('Payment cancelled.');
          process.exit(0);
        }
      } else {
        console.warn('\n🚨 FORCE MODE ENABLED - SKIPPING CONFIRMATION!');
        console.warn('Payment will be sent immediately without further prompts.');
      }
      
      // Record payment attempt
      let paymentRecord = {
        amount,
        recipient,
        reason: options.reason,
        status: 'pending' as 'pending' | 'confirmed' | 'failed',
        transactionSignature: undefined as string | undefined
      };
      
      console.log('\nSending payment...');
      
      try {
        // Send payment
        const signature = await sendPayment(
          config.privateKey!,
          recipient,
          amount,
          options.reason
        );
        
        // Update payment record with success
        paymentRecord.status = 'confirmed';
        paymentRecord.transactionSignature = signature;
        addPaymentRecord(paymentRecord);
        
        console.log('✓ Payment sent successfully!');
        console.log(`Transaction signature: ${signature}`);
        
        if (!signature.startsWith('test_')) {
          console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}`);
        }
        
      } catch (error) {
        // Update payment record with failure
        paymentRecord.status = 'failed';
        addPaymentRecord(paymentRecord);
        
        console.error('✗ Payment failed:', error);
        process.exit(1);
      }
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      process.exit(1);
    }
  });
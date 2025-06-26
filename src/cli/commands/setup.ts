/**
 * Setup command for SVM-Pay CLI
 */

import { Command } from 'commander';
import { loadConfig, saveConfig, SVMPayConfig } from '../utils/config';
import { createKeypairFromPrivateKey } from '../utils/solana';
import { isValidApiKey } from '../utils/openrouter';

export const setupCommand = new Command('setup')
  .description('Set up your payment configuration')
  .option('-k, --private-key <key>', 'Your Solana wallet private key (base58 or array format)')
  .option('-a, --api-key <key>', 'Your OpenRouter API key')
  .option('-t, --threshold <amount>', 'Payment threshold in SOL (default: 0.1)', '0.1')
  .option('-r, --recipient <address>', 'Default recipient address for payments')
  .action(async (options) => {
    try {
      console.log('Setting up SVM-Pay configuration...\n');
      
      const config = loadConfig();
      
      // Update private key if provided
      if (options.privateKey) {
        console.log('Validating private key...');
        try {
          const keypair = createKeypairFromPrivateKey(options.privateKey);
          console.log(`✓ Private key valid. Wallet address: ${keypair.publicKey.toString()}`);
          config.privateKey = options.privateKey;
        } catch (error) {
          console.error('✗ Invalid private key format.');
          console.error('Please provide a valid base58 string or array format (e.g., [1,2,3,...])');
          process.exit(1);
        }
      }
      
      // Update API key if provided
      if (options.apiKey) {
        console.log('Validating API key...');
        if (isValidApiKey(options.apiKey)) {
          console.log('✓ API key format valid');
          config.apiKey = options.apiKey;
        } else {
          console.error('✗ Invalid API key format. OpenRouter API keys should start with "sk-"');
          process.exit(1);
        }
      }
      
      // Update threshold if provided
      if (options.threshold) {
        const threshold = parseFloat(options.threshold);
        if (isNaN(threshold) || threshold <= 0) {
          console.error('✗ Invalid threshold amount. Please provide a positive number.');
          process.exit(1);
        }
        console.log(`✓ Payment threshold set to ${threshold} SOL`);
        config.threshold = threshold;
      }
      
      // Update recipient if provided
      if (options.recipient) {
        // Basic validation - check if it looks like a Solana address
        if (options.recipient.length >= 32 && options.recipient.length <= 44) {
          console.log(`✓ Default recipient set to ${options.recipient}`);
          config.recipientAddress = options.recipient;
        } else {
          console.error('✗ Invalid recipient address format.');
          process.exit(1);
        }
      }
      
      // Save configuration
      saveConfig(config);
      
      console.log('\n✓ Configuration saved successfully!');
      
      // Show current configuration
      console.log('\nCurrent configuration:');
      console.log('=====================');
      
      if (config.privateKey) {
        const keypair = createKeypairFromPrivateKey(config.privateKey);
        console.log(`Wallet Address: ${keypair.publicKey.toString()}`);
      } else {
        console.log('Wallet: Not configured');
      }
      
      if (config.apiKey) {
        console.log(`API Key: ${config.apiKey.substring(0, 10)}...`);
      } else {
        console.log('API Key: Not configured');
      }
      
      console.log(`Threshold: ${config.threshold || 0.1} SOL`);
      
      if (config.recipientAddress) {
        console.log(`Default Recipient: ${config.recipientAddress}`);
      } else {
        console.log('Default Recipient: Not configured');
      }
      
      // Show next steps
      if (!config.privateKey || !config.apiKey) {
        console.log('\nNext steps:');
        if (!config.privateKey) {
          console.log('- Set up your private key: svm-pay setup -k <your-private-key>');
        }
        if (!config.apiKey) {
          console.log('- Set up your API key: svm-pay setup -a <your-api-key>');
        }
      } else {
        console.log('\n✓ Setup complete! You can now use:');
        console.log('- svm-pay balance    (check wallet balance)');
        console.log('- svm-pay usage      (check API usage)');
        console.log('- svm-pay pay        (make a payment)');
        console.log('- svm-pay history    (view payment history)');
      }
      
    } catch (error) {
      console.error('Setup failed:', error);
      process.exit(1);
    }
  });
/**
 * Balance command for SVM-Pay CLI
 */

import { Command } from 'commander';
import { loadConfig, validateConfig } from '../utils/config';
import { getWalletBalance, createKeypairFromPrivateKey } from '../utils/solana';

export const balanceCommand = new Command('balance')
  .description('Check your current Solana wallet balance')
  .action(async () => {
    try {
      console.log('Checking wallet balance...\n');
      
      const config = loadConfig();
      
      // Validate required configuration
      if (!validateConfig(config, ['privateKey'])) {
        process.exit(1);
      }
      
      // Get wallet address for display
      const keypair = createKeypairFromPrivateKey(config.privateKey!);
      console.log(`Wallet Address: ${keypair.publicKey.toString()}`);
      
      // Get balance
      const balance = await getWalletBalance(config.privateKey!);
      
      console.log(`Current Balance: ${balance.toFixed(6)} SOL`);
      
      // Check against threshold if configured
      if (config.threshold) {
        const thresholdDiff = balance - config.threshold;
        
        if (thresholdDiff >= 0) {
          console.log(`✓ Balance is ${thresholdDiff.toFixed(6)} SOL above threshold (${config.threshold} SOL)`);
        } else {
          console.log(`⚠ Balance is ${Math.abs(thresholdDiff).toFixed(6)} SOL below threshold (${config.threshold} SOL)`);
        }
      }
      
      // Show balance in USD (approximate)
      // Note: In a real implementation, you'd fetch the current SOL/USD rate
      const estimatedUSD = balance * 100; // Placeholder rate
      console.log(`Estimated Value: ~$${estimatedUSD.toFixed(2)} USD (estimated)`);
      
    } catch (error) {
      console.error('Failed to check balance:', error);
      process.exit(1);
    }
  });
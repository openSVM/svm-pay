/**
 * History command for SVM-Pay CLI
 */

import { Command } from 'commander';
import { loadPaymentHistory, formatPaymentHistory } from '../utils/history';

export const historyCommand = new Command('history')
  .description('View your payment history')
  .option('-l, --limit <number>', 'Number of records to show (default: 10)', '10')
  .option('--all', 'Show all payment records')
  .option('--json', 'Output in JSON format')
  .action(async (options) => {
    try {
      console.log('Loading payment history...\n');
      
      const history = loadPaymentHistory();
      
      if (history.length === 0) {
        console.log('No payment history found.');
        console.log('Make a payment with: svm-pay pay -a <amount>');
        return;
      }
      
      // Determine how many records to show
      let recordsToShow = history;
      if (!options.all) {
        const limit = parseInt(options.limit);
        if (isNaN(limit) || limit <= 0) {
          console.error('Error: Limit must be a positive number');
          process.exit(1);
        }
        recordsToShow = history.slice(0, limit);
      }
      
      // Output format
      if (options.json) {
        console.log(JSON.stringify(recordsToShow, null, 2));
      } else {
        const formattedHistory = formatPaymentHistory(recordsToShow);
        console.log(formattedHistory);
        
        // Show summary
        const totalPayments = recordsToShow.length;
        const totalAmount = recordsToShow.reduce((sum, payment) => sum + payment.amount, 0);
        const confirmedPayments = recordsToShow.filter(p => p.status === 'confirmed').length;
        const pendingPayments = recordsToShow.filter(p => p.status === 'pending').length;
        const failedPayments = recordsToShow.filter(p => p.status === 'failed').length;
        
        console.log('Summary:');
        console.log('========');
        console.log(`Total payments shown: ${totalPayments}`);
        console.log(`Total amount: ${totalAmount.toFixed(6)} SOL`);
        console.log(`Confirmed: ${confirmedPayments}`);
        
        if (pendingPayments > 0) {
          console.log(`Pending: ${pendingPayments}`);
        }
        
        if (failedPayments > 0) {
          console.log(`Failed: ${failedPayments}`);
        }
        
        if (history.length > recordsToShow.length) {
          console.log(`\nShowing ${recordsToShow.length} of ${history.length} total records.`);
          console.log('Use --all to show all records or --limit <number> to show more.');
        }
      }
      
    } catch (error) {
      console.error('Failed to load payment history:', error);
      process.exit(1);
    }
  });
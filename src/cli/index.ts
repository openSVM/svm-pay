/**
 * SVM-Pay CLI
 * 
 * CLI tool for managing Solana-based payments for OpenRouter API usage.
 */

import { Command } from 'commander';
import { setupCommand } from './commands/setup';
import { balanceCommand } from './commands/balance';
import { usageCommand } from './commands/usage';
import { payCommand } from './commands/pay';
import { historyCommand } from './commands/history';

const program = new Command();

program
  .name('svm-pay')
  .description('CLI tool for managing Solana-based payments for OpenRouter API usage')
  .version('1.0.0');

// Add commands
program.addCommand(setupCommand);
program.addCommand(balanceCommand);
program.addCommand(usageCommand);
program.addCommand(payCommand);
program.addCommand(historyCommand);

export { program as cli };
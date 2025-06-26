"use strict";
/**
 * SVM-Pay CLI
 *
 * CLI tool for managing Solana-based payments for OpenRouter API usage.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const commander_1 = require("commander");
const setup_1 = require("./commands/setup");
const balance_1 = require("./commands/balance");
const usage_1 = require("./commands/usage");
const pay_1 = require("./commands/pay");
const history_1 = require("./commands/history");
const program = new commander_1.Command();
exports.cli = program;
program
    .name('svm-pay')
    .description('CLI tool for managing Solana-based payments for OpenRouter API usage')
    .version('1.0.0');
// Add commands
program.addCommand(setup_1.setupCommand);
program.addCommand(balance_1.balanceCommand);
program.addCommand(usage_1.usageCommand);
program.addCommand(pay_1.payCommand);
program.addCommand(history_1.historyCommand);
//# sourceMappingURL=index.js.map
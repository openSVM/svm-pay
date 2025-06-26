"use strict";
/**
 * Pay command for SVM-Pay CLI
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.payCommand = void 0;
const commander_1 = require("commander");
const config_1 = require("../utils/config");
const solana_1 = require("../utils/solana");
const history_1 = require("../utils/history");
exports.payCommand = new commander_1.Command('pay')
    .description('Process a payment for OpenRouter API usage')
    .option('-a, --amount <amount>', 'Amount to pay in SOL')
    .option('-r, --reason <reason>', 'Reason for payment (optional)')
    .option('-t, --to <address>', 'Recipient Solana address (optional, uses default if configured)')
    .option('-f, --force', 'Skip confirmation prompts')
    .action(async (options) => {
    try {
        console.log('Processing payment...\n');
        const config = (0, config_1.loadConfig)();
        // Validate required configuration
        if (!(0, config_1.validateConfig)(config, ['privateKey'])) {
            process.exit(1);
        }
        // Determine amount
        let amount;
        if (options.amount) {
            amount = parseFloat(options.amount);
            if (isNaN(amount) || amount <= 0) {
                console.error('Error: Amount must be a positive number');
                process.exit(1);
            }
        }
        else if (config.threshold) {
            amount = config.threshold;
            console.log(`Using configured threshold amount: ${amount} SOL`);
        }
        else {
            console.error('Error: No amount specified and no threshold configured');
            console.log('Use: svm-pay pay -a <amount> or configure a threshold with svm-pay setup -t <amount>');
            process.exit(1);
        }
        // Determine recipient
        let recipient;
        if (options.to) {
            recipient = options.to;
        }
        else if (config.recipientAddress) {
            recipient = config.recipientAddress;
            console.log(`Using configured recipient: ${recipient}`);
        }
        else {
            console.error('Error: No recipient specified and no default configured');
            console.log('Use: svm-pay pay -t <address> or configure a default with svm-pay setup -r <address>');
            process.exit(1);
        }
        // Validate recipient address
        if (!(0, solana_1.isValidSolanaAddress)(recipient)) {
            console.error('Error: Invalid recipient address');
            process.exit(1);
        }
        // Check wallet balance
        const balance = await (0, solana_1.getWalletBalance)(config.privateKey);
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
            const readline = await Promise.resolve().then(() => __importStar(require('readline')));
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise((resolve) => {
                rl.question('\nConfirm payment? (y/N): ', resolve);
            });
            rl.close();
            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log('Payment cancelled.');
                process.exit(0);
            }
        }
        // Record payment attempt
        let paymentRecord = {
            amount,
            recipient,
            reason: options.reason,
            status: 'pending',
            transactionSignature: undefined
        };
        console.log('\nSending payment...');
        try {
            // Send payment
            const signature = await (0, solana_1.sendPayment)(config.privateKey, recipient, amount, options.reason);
            // Update payment record with success
            paymentRecord.status = 'confirmed';
            paymentRecord.transactionSignature = signature;
            (0, history_1.addPaymentRecord)(paymentRecord);
            console.log('✓ Payment sent successfully!');
            console.log(`Transaction signature: ${signature}`);
            if (!signature.startsWith('test_')) {
                console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}`);
            }
        }
        catch (error) {
            // Update payment record with failure
            paymentRecord.status = 'failed';
            (0, history_1.addPaymentRecord)(paymentRecord);
            console.error('✗ Payment failed:', error);
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Payment processing failed:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=pay.js.map
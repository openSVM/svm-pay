"use strict";
/**
 * Balance command for SVM-Pay CLI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceCommand = void 0;
const commander_1 = require("commander");
const config_1 = require("../utils/config");
const solana_1 = require("../utils/solana");
exports.balanceCommand = new commander_1.Command('balance')
    .description('Check your current Solana wallet balance')
    .action(async () => {
    try {
        console.log('Checking wallet balance...\n');
        const config = (0, config_1.loadConfig)();
        // Validate required configuration
        if (!(0, config_1.validateConfig)(config, ['privateKey'])) {
            process.exit(1);
        }
        // Get wallet address for display
        const keypair = (0, solana_1.createKeypairFromPrivateKey)(config.privateKey);
        console.log(`Wallet Address: ${keypair.publicKey.toString()}`);
        // Get balance
        const balance = await (0, solana_1.getWalletBalance)(config.privateKey);
        console.log(`Current Balance: ${balance.toFixed(6)} SOL`);
        // Check against threshold if configured
        if (config.threshold) {
            const thresholdDiff = balance - config.threshold;
            if (thresholdDiff >= 0) {
                console.log(`✓ Balance is ${thresholdDiff.toFixed(6)} SOL above threshold (${config.threshold} SOL)`);
            }
            else {
                console.log(`⚠ Balance is ${Math.abs(thresholdDiff).toFixed(6)} SOL below threshold (${config.threshold} SOL)`);
            }
        }
        // Show balance in USD (approximate)
        // Note: In a real implementation, you'd fetch the current SOL/USD rate
        const estimatedUSD = balance * 100; // Placeholder rate
        console.log(`Estimated Value: ~$${estimatedUSD.toFixed(2)} USD (estimated)`);
    }
    catch (error) {
        console.error('Failed to check balance:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=balance.js.map
"use strict";
/**
 * Usage command for SVM-Pay CLI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageCommand = void 0;
const commander_1 = require("commander");
const config_1 = require("../utils/config");
const openrouter_1 = require("../utils/openrouter");
exports.usageCommand = new commander_1.Command('usage')
    .description('Check your OpenRouter API usage')
    .action(async () => {
    try {
        console.log('Checking OpenRouter API usage...\n');
        const config = (0, config_1.loadConfig)();
        // Validate required configuration
        if (!(0, config_1.validateConfig)(config, ['apiKey'])) {
            process.exit(1);
        }
        // Check API usage
        const usage = await (0, openrouter_1.checkApiUsage)(config.apiKey);
        console.log('OpenRouter API Usage:');
        console.log('====================');
        console.log(`Current Usage: $${usage.usage.toFixed(2)}`);
        console.log(`Credit Limit: $${usage.limit.toFixed(2)}`);
        console.log(`Remaining: $${usage.remaining.toFixed(2)}`);
        // Calculate usage percentage
        const usagePercentage = (usage.usage / usage.limit) * 100;
        console.log(`Usage Percentage: ${usagePercentage.toFixed(1)}%`);
        // Show status
        if (usagePercentage < 50) {
            console.log('✓ Usage is within normal limits');
        }
        else if (usagePercentage < 80) {
            console.log('⚠ Usage is approaching the limit');
        }
        else if (usagePercentage < 95) {
            console.log('🔴 Usage is very high - consider making a payment');
        }
        else {
            console.log('🚨 Usage is critical - payment required soon');
        }
        // Show payment recommendation if threshold is configured
        if (config.threshold && usage.remaining > 0) {
            const recommendedPayment = Math.min(config.threshold, usage.remaining);
            console.log(`\nRecommended payment: ${recommendedPayment.toFixed(6)} SOL`);
            console.log('Use: svm-pay pay -a', recommendedPayment.toFixed(6));
        }
    }
    catch (error) {
        console.error('Failed to check API usage:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=usage.js.map
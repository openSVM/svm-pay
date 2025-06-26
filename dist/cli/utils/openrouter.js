"use strict";
/**
 * OpenRouter API utilities for SVM-Pay CLI
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiUsage = checkApiUsage;
exports.isValidApiKey = isValidApiKey;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
/**
 * Check OpenRouter API usage
 */
async function checkApiUsage(apiKey) {
    var _a, _b, _c;
    if ((0, config_1.isTestMode)()) {
        console.log('TEST MODE: Simulating API usage check');
        return {
            usage: 150.75,
            limit: 1000,
            remaining: 849.25
        };
    }
    try {
        const response = await axios_1.default.get(`${OPENROUTER_API_BASE}/auth/key`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        // Extract usage information (this may need adjustment based on actual API response)
        return {
            usage: data.usage || 0,
            limit: data.limit || 0,
            remaining: (data.limit || 0) - (data.usage || 0)
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            }
            throw new Error(`OpenRouter API error: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.status} ${(_c = error.response) === null || _c === void 0 ? void 0 : _c.statusText}`);
        }
        throw new Error(`Failed to check API usage: ${error}`);
    }
}
/**
 * Validate OpenRouter API key format
 */
function isValidApiKey(apiKey) {
    // Basic validation - OpenRouter API keys typically start with 'sk-'
    return apiKey.startsWith('sk-') && apiKey.length > 10;
}
//# sourceMappingURL=openrouter.js.map
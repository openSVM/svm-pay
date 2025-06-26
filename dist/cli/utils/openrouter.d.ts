/**
 * OpenRouter API utilities for SVM-Pay CLI
 */
export interface OpenRouterUsage {
    usage: number;
    limit: number;
    remaining: number;
}
/**
 * Check OpenRouter API usage
 */
export declare function checkApiUsage(apiKey: string): Promise<OpenRouterUsage>;
/**
 * Validate OpenRouter API key format
 */
export declare function isValidApiKey(apiKey: string): boolean;
//# sourceMappingURL=openrouter.d.ts.map
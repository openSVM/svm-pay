/**
 * Configuration utilities for SVM-Pay CLI
 */
export interface SVMPayConfig {
    privateKey?: string;
    apiKey?: string;
    threshold?: number;
    recipientAddress?: string;
}
/**
 * Load configuration from file or environment variables
 */
export declare function loadConfig(): SVMPayConfig;
/**
 * Save configuration to file
 */
export declare function saveConfig(config: SVMPayConfig): void;
/**
 * Validate that required configuration is present
 */
export declare function validateConfig(config: SVMPayConfig, requiredFields: (keyof SVMPayConfig)[]): boolean;
/**
 * Check if we're in test mode
 */
export declare function isTestMode(): boolean;
//# sourceMappingURL=config.d.ts.map
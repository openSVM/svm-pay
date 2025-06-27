/**
 * Tests for CLI functionality
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('CLI Commands', () => {
  let tempConfigDir: string;
  let originalHome: string | undefined;

  beforeEach(async () => {
    // Create temporary directory for test config
    tempConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), 'svm-pay-test-'));
    originalHome = process.env.HOME;
    process.env.HOME = tempConfigDir;
    
    // Mock console methods to reduce test noise
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(async () => {
    // Restore environment
    if (originalHome) {
      process.env.HOME = originalHome;
    }
    
    // Clean up temp directory
    try {
      await fs.rm(tempConfigDir, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
    
    jest.restoreAllMocks();
  });

  describe('setup command', () => {
    it('should show help when no arguments provided', () => {
      const result = execSync('node dist/bin/svm-pay.js setup --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('Set up your payment configuration');
      expect(result).toContain('-k, --private-key');
      expect(result).toContain('-a, --api-key');
    });

    it('should validate private key format', () => {
      try {
        execSync('node dist/bin/svm-pay.js setup -k invalid-key', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for invalid private key');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });

    // Note: Testing with real private keys in unit tests is not recommended
    // In a real test environment, you'd use test keys or mock the validation
  });

  describe('balance command', () => {
    it('should show error when not configured', () => {
      try {
        execSync('node dist/bin/svm-pay.js balance', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for missing configuration');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });

    it('should show help for balance command', () => {
      const result = execSync('node dist/bin/svm-pay.js balance --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('Check your current Solana wallet balance');
    });
  });

  describe('pay command', () => {
    it('should show help for pay command', () => {
      const result = execSync('node dist/bin/svm-pay.js pay --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('Process a payment');
      expect(result).toContain('-a, --amount');
      expect(result).toContain('-t, --to');
      expect(result).toContain('-f, --force');
    });

    it('should show dangerous warning for force flag', () => {
      const result = execSync('node dist/bin/svm-pay.js pay --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('⚠️  DANGEROUS');
      expect(result).toContain('extreme caution');
    });

    it('should require configuration before payment', () => {
      try {
        execSync('node dist/bin/svm-pay.js pay -a 1.0', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for missing configuration');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });
  });

  describe('history command', () => {
    it('should show help for history command', () => {
      const result = execSync('node dist/bin/svm-pay.js history --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('View your payment history');
      expect(result).toContain('--limit');
      expect(result).toContain('--all');
    });

    it('should handle empty history gracefully', () => {
      try {
        const result = execSync('node dist/bin/svm-pay.js history', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        
        // Should not throw error, just show empty results
        expect(result).toContain('No payment history found');
      } catch (error: any) {
        // If it fails, it should be due to missing config, not empty history
        expect(error.status).toBe(1);
      }
    });
  });

  describe('usage command', () => {
    it('should show help for usage command', () => {
      const result = execSync('node dist/bin/svm-pay.js usage --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('Check your OpenRouter API usage');
    });

    it('should require configuration for API usage check', () => {
      try {
        execSync('node dist/bin/svm-pay.js usage', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for missing configuration');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });
  });

  describe('main CLI', () => {
    it('should show help when no command provided', () => {
      const result = execSync('node dist/bin/svm-pay.js --help', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result).toContain('CLI tool for managing Solana-based payments');
      expect(result).toContain('setup');
      expect(result).toContain('balance');
      expect(result).toContain('pay');
      expect(result).toContain('history');
      expect(result).toContain('usage');
    });

    it('should show version information', () => {
      const result = execSync('node dist/bin/svm-pay.js --version', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      expect(result.trim()).toMatch(/^\d+\.\d+\.\d+$/); // Semantic version format
    });

    it('should handle invalid commands gracefully', () => {
      try {
        execSync('node dist/bin/svm-pay.js invalid-command', {
          encoding: 'utf8',
          cwd: process.cwd()
        });
        fail('Should have thrown an error for invalid command');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });
  });

  describe('command validation', () => {
    it('should validate Solana addresses in pay command', () => {
      // Test with obviously invalid address
      try {
        execSync('node dist/bin/svm-pay.js pay -a 1.0 -t invalid-address -f', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for invalid address');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });

    it('should validate amount format in pay command', () => {
      try {
        execSync('node dist/bin/svm-pay.js pay -a invalid-amount', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { ...process.env, HOME: tempConfigDir }
        });
        fail('Should have thrown an error for invalid amount');
      } catch (error: any) {
        expect(error.status).toBe(1);
      }
    });
  });

  describe('environment variable support', () => {
    it('should support SVM_PAY_PRIVATE_KEY environment variable', async () => {
      // Create minimal config without private key
      const configPath = path.join(tempConfigDir, '.svm-pay', 'config.json');
      await fs.mkdir(path.dirname(configPath), { recursive: true });
      await fs.writeFile(configPath, JSON.stringify({
        openrouterApiKey: 'test-key',
        solanaRpcEndpoint: 'https://api.mainnet-beta.solana.com'
      }));

      // Test that environment variable is recognized
      // Note: This would fail in practice without a valid key, but tests the precedence
      try {
        execSync('node dist/bin/svm-pay.js balance', {
          encoding: 'utf8',
          cwd: process.cwd(),
          env: { 
            ...process.env, 
            HOME: tempConfigDir,
            SVM_PAY_PRIVATE_KEY: 'test-private-key'
          }
        });
      } catch (error: any) {
        // Should fail due to invalid key format, not missing key
        const stderr = error.stderr?.toString() || '';
        expect(stderr).not.toContain('Private key not configured');
      }
    });
  });
});
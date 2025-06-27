/**
 * Tests for SDK security fixes
 */

import { SVMPay } from '../../src/sdk/index';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Mock the CLI utilities
jest.mock('../../src/cli/utils/config', () => ({
  loadConfig: jest.fn()
}));

jest.mock('../../src/cli/utils/solana', () => ({
  getWalletBalance: jest.fn(),
  createKeypairFromPrivateKey: jest.fn()
}));

import { loadConfig } from '../../src/cli/utils/config';
import { getWalletBalance, createKeypairFromPrivateKey } from '../../src/cli/utils/solana';

describe('SDK Security Fixes', () => {
  let svmPay: SVMPay;
  let mockLoadConfig: jest.MockedFunction<typeof loadConfig>;
  let mockGetWalletBalance: jest.MockedFunction<typeof getWalletBalance>;
  let mockCreateKeypairFromPrivateKey: jest.MockedFunction<typeof createKeypairFromPrivateKey>;

  beforeEach(() => {
    svmPay = new SVMPay({ debug: false });
    mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
    mockGetWalletBalance = getWalletBalance as jest.MockedFunction<typeof getWalletBalance>;
    mockCreateKeypairFromPrivateKey = createKeypairFromPrivateKey as jest.MockedFunction<typeof createKeypairFromPrivateKey>;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock console methods to reduce test noise
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkWalletBalance security fix', () => {
    it('should return public address, not private key', async () => {
      const mockPrivateKey = 'mock-private-key-should-not-be-exposed';
      const mockPublicKey = 'EaLdVhZUgqQtS5SQTJH5f8YXSKzN9doM7JbZ3BhvvvAt'; // Example Solana address
      const mockBalance = 1.5;

      // Mock config with private key
      mockLoadConfig.mockReturnValue({
        privateKey: mockPrivateKey,
        openrouterApiKey: 'test-key'
      });

      // Mock balance check
      mockGetWalletBalance.mockResolvedValue(mockBalance);

      // Mock keypair creation to return public key
      mockCreateKeypairFromPrivateKey.mockReturnValue({
        publicKey: {
          toString: () => mockPublicKey
        }
      } as any);

      const result = await svmPay.checkWalletBalance();

      expect(result).toBeDefined();
      expect(result.balance).toBe(mockBalance);
      expect(result.address).toBe(mockPublicKey);
      
      // CRITICAL: Ensure private key is NOT exposed
      expect(result.address).not.toBe(mockPrivateKey);
      expect(JSON.stringify(result)).not.toContain(mockPrivateKey);
      expect(Object.values(result)).not.toContain(mockPrivateKey);
    });

    it('should throw error when private key is missing', async () => {
      // Mock config without private key
      mockLoadConfig.mockReturnValue({
        openrouterApiKey: 'test-key'
        // privateKey is missing
      });

      await expect(svmPay.checkWalletBalance()).rejects.toThrow(
        'Private key not configured. Run "svm-pay setup -k <private-key>" first.'
      );

      // Ensure keypair creation was not called with undefined
      expect(mockCreateKeypairFromPrivateKey).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and not expose private key', async () => {
      const mockPrivateKey = 'sensitive-private-key';
      
      mockLoadConfig.mockReturnValue({
        privateKey: mockPrivateKey,
        openrouterApiKey: 'test-key'
      });

      // Mock balance check to fail
      mockGetWalletBalance.mockRejectedValue(new Error('Network error'));

      mockCreateKeypairFromPrivateKey.mockReturnValue({
        publicKey: {
          toString: () => 'public-key'
        }
      } as any);

      await expect(svmPay.checkWalletBalance()).rejects.toThrow('Network error');

      // Ensure private key is not logged or exposed in errors
      const consoleCalls = (console.error as jest.Mock).mock.calls.flat();
      const consoleOutput = consoleCalls.join(' ');
      expect(consoleOutput).not.toContain(mockPrivateKey);
    });

    it('should properly derive public key from different private key formats', async () => {
      const testCases = [
        {
          name: 'base58 private key',
          privateKey: '5J1F7GHaDxuuGeFQrTpTZKWKZ8V4a9xP3vF8f9T4r6nM7q8GhQ2',
          expectedPublicKey: 'mock-public-key-1'
        },
        {
          name: 'array format private key', 
          privateKey: '[1,2,3,4,5]',
          expectedPublicKey: 'mock-public-key-2'
        }
      ];

      for (const testCase of testCases) {
        // Reset mocks for each test case
        jest.clearAllMocks();

        mockLoadConfig.mockReturnValue({
          privateKey: testCase.privateKey,
          openrouterApiKey: 'test-key'
        });

        mockGetWalletBalance.mockResolvedValue(2.0);

        mockCreateKeypairFromPrivateKey.mockReturnValue({
          publicKey: {
            toString: () => testCase.expectedPublicKey
          }
        } as any);

        const result = await svmPay.checkWalletBalance();

        expect(result.address).toBe(testCase.expectedPublicKey);
        expect(result.address).not.toBe(testCase.privateKey);
        expect(mockCreateKeypairFromPrivateKey).toHaveBeenCalledWith(testCase.privateKey);
      }
    });

    it('should not cache or store private key in class instance', async () => {
      const mockPrivateKey = 'secret-key';
      const mockPublicKey = 'public-key';

      mockLoadConfig.mockReturnValue({
        privateKey: mockPrivateKey,
        openrouterApiKey: 'test-key'
      });

      mockGetWalletBalance.mockResolvedValue(1.0);

      mockCreateKeypairFromPrivateKey.mockReturnValue({
        publicKey: {
          toString: () => mockPublicKey
        }
      } as any);

      await svmPay.checkWalletBalance();

      // Verify SDK instance doesn't contain private key
      const sdkString = JSON.stringify(svmPay);
      expect(sdkString).not.toContain(mockPrivateKey);
      
      // Check all properties of the SDK instance
      const checkObject = (obj: any, path = ''): void => {
        if (typeof obj === 'string' && obj === mockPrivateKey) {
          fail(`Private key found at path: ${path}`);
        }
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => {
            checkObject(obj[key], path ? `${path}.${key}` : key);
          });
        }
      };

      checkObject(svmPay);
    });

    it('should work correctly with environment variable override', async () => {
      const configPrivateKey = 'config-private-key';
      const envPrivateKey = 'env-private-key';
      const mockPublicKey = 'derived-public-key';

      // Mock environment variable taking precedence
      const originalEnv = process.env.SVM_PAY_PRIVATE_KEY;
      process.env.SVM_PAY_PRIVATE_KEY = envPrivateKey;

      try {
        mockLoadConfig.mockReturnValue({
          privateKey: configPrivateKey, // This should be overridden by env var
          openrouterApiKey: 'test-key'
        });

        mockGetWalletBalance.mockResolvedValue(3.0);

        mockCreateKeypairFromPrivateKey.mockReturnValue({
          publicKey: {
            toString: () => mockPublicKey
          }
        } as any);

        const result = await svmPay.checkWalletBalance();

        expect(result.address).toBe(mockPublicKey);
        // Verify neither private key is exposed
        expect(result.address).not.toBe(configPrivateKey);
        expect(result.address).not.toBe(envPrivateKey);
        expect(JSON.stringify(result)).not.toContain(configPrivateKey);
        expect(JSON.stringify(result)).not.toContain(envPrivateKey);

      } finally {
        // Restore environment
        if (originalEnv) {
          process.env.SVM_PAY_PRIVATE_KEY = originalEnv;
        } else {
          delete process.env.SVM_PAY_PRIVATE_KEY;
        }
      }
    });
  });

  describe('other SDK security considerations', () => {
    it('should not log private keys in debug mode', async () => {
      const debugSvm = new SVMPay({ debug: true });
      const mockPrivateKey = 'debug-test-private-key';

      mockLoadConfig.mockReturnValue({
        privateKey: mockPrivateKey,
        openrouterApiKey: 'test-key'
      });

      mockGetWalletBalance.mockResolvedValue(1.0);

      mockCreateKeypairFromPrivateKey.mockReturnValue({
        publicKey: {
          toString: () => 'debug-public-key'
        }
      } as any);

      await debugSvm.checkWalletBalance();

      // Check all console calls
      const allConsoleCalls = [
        ...(console.log as jest.Mock).mock.calls,
        ...(console.error as jest.Mock).mock.calls,
        ...(console.warn as jest.Mock).mock.calls
      ].flat();

      const allConsoleOutput = allConsoleCalls.join(' ');
      expect(allConsoleOutput).not.toContain(mockPrivateKey);
    });

    it('should sanitize error messages to prevent private key leakage', async () => {
      const mockPrivateKey = 'error-test-private-key';

      mockLoadConfig.mockReturnValue({
        privateKey: mockPrivateKey,
        openrouterApiKey: 'test-key'
      });

      // Mock createKeypairFromPrivateKey to throw an error that includes the private key
      mockCreateKeypairFromPrivateKey.mockImplementation(() => {
        throw new Error(`Invalid private key format: ${mockPrivateKey}`);
      });

      try {
        await svmPay.checkWalletBalance();
        fail('Should have thrown an error');
      } catch (error: any) {
        // The error should be sanitized by the SDK's sanitizeError method
        expect(error.message).not.toContain(mockPrivateKey);
        expect(error.message).toContain('[REDACTED_SENSITIVE_DATA]');
        
        // Check console output as well
        const consoleCalls = (console.error as jest.Mock).mock.calls.flat();
        const consoleOutput = consoleCalls.join(' ');
        expect(consoleOutput).not.toContain(mockPrivateKey);
      }
    });
  });
});
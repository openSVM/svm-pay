/**
 * Tests for cross-chain URL scheme functionality
 */

import {
  CrossChainTransferRequest,
  RequestType,
  SVMNetwork,
  EVMNetwork
} from '../../src/core/types';
import { parseURL, createCrossChainURL, createURL } from '../../src/core/url-scheme';

describe('Cross-Chain URL Scheme', () => {
  describe('parseURL', () => {
    it('should parse a cross-chain transfer URL', () => {
      const url = 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f&source-network=ethereum&bridge=wormhole&label=Test&message=Cross-chain%20payment';

      const request = parseURL(url) as CrossChainTransferRequest;

      expect(request.type).toBe(RequestType.CROSS_CHAIN_TRANSFER);
      expect(request.network).toBe(SVMNetwork.SOLANA);
      expect(request.sourceNetwork).toBe(EVMNetwork.ETHEREUM);
      expect(request.destinationNetwork).toBe(SVMNetwork.SOLANA);
      expect(request.recipient).toBe('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
      expect(request.amount).toBe('100');
      expect(request.token).toBe('0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f');
      expect(request.bridge).toBe('wormhole');
      expect(request.label).toBe('Test');
      expect(request.message).toBe('Cross-chain payment');
    });

    it('should parse a cross-chain transfer URL from BNB Chain', () => {
      const url = 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=50&token=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d&source-network=bnb-chain';

      const request = parseURL(url) as CrossChainTransferRequest;

      expect(request.type).toBe(RequestType.CROSS_CHAIN_TRANSFER);
      expect(request.sourceNetwork).toBe(EVMNetwork.BNB_CHAIN);
      expect(request.amount).toBe('50');
      expect(request.token).toBe('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d');
    });

    it('should throw error for missing required cross-chain parameters', () => {
      const url = 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?source-network=ethereum'; // Missing amount and token

      expect(() => parseURL(url)).toThrow('Cross-chain transfer request requires an amount parameter');
    });

    it('should throw error for unsupported source network', () => {
      const url = 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=0xABC&source-network=unsupported-network';

      expect(() => parseURL(url)).toThrow('Unsupported source network: unsupported-network');
    });
  });

  describe('createCrossChainURL', () => {
    it('should create a cross-chain transfer URL', () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f',
        bridge: 'wormhole',
        label: 'Test Payment',
        message: 'Cross-chain test'
      };

      const url = createCrossChainURL(request);

      expect(url).toContain('solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
      expect(url).toContain('amount=100');
      expect(url).toContain('token=0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f');
      expect(url).toContain('source-network=ethereum');
      expect(url).toContain('bridge=wormhole');
      expect(url).toContain('label=Test+Payment');
      expect(url).toContain('message=Cross-chain+test');
    });

    it('should create a cross-chain transfer URL from Polygon', () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.POLYGON,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '250',
        token: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
      };

      const url = createCrossChainURL(request);

      expect(url).toContain('source-network=polygon');
      expect(url).toContain('amount=250');
      expect(url).toContain('token=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
    });
  });

  describe('createURL (generic)', () => {
    it('should create a cross-chain URL using the generic function', () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f'
      };

      const url = createURL(request);

      expect(url).toContain('solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
      expect(url).toContain('source-network=ethereum');
      expect(url).toContain('amount=100');
      expect(url).toContain('token=0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f');
    });
  });

  describe('Round-trip URL conversion', () => {
    it('should maintain data integrity through parse -> create cycle', () => {
      const originalRequest: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f',
        bridge: 'wormhole',
        label: 'Test Payment',
        message: 'Cross-chain test',
        memo: 'test-memo',
        references: ['ref1', 'ref2']
      };

      // Create URL from request
      const url = createCrossChainURL(originalRequest);

      // Parse URL back to request
      const parsedRequest = parseURL(url) as CrossChainTransferRequest;

      // Verify all data is preserved
      expect(parsedRequest.type).toBe(originalRequest.type);
      expect(parsedRequest.sourceNetwork).toBe(originalRequest.sourceNetwork);
      expect(parsedRequest.destinationNetwork).toBe(originalRequest.destinationNetwork);
      expect(parsedRequest.recipient).toBe(originalRequest.recipient);
      expect(parsedRequest.amount).toBe(originalRequest.amount);
      expect(parsedRequest.token).toBe(originalRequest.token);
      expect(parsedRequest.bridge).toBe(originalRequest.bridge);
      expect(parsedRequest.label).toBe(originalRequest.label);
      expect(parsedRequest.message).toBe(originalRequest.message);
      expect(parsedRequest.memo).toBe(originalRequest.memo);
      expect(parsedRequest.references).toEqual(originalRequest.references);
    });
  });
});
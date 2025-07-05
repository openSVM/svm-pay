/**
 * Tests for cross-chain payment functionality
 */

import {
  CrossChainTransferRequest,
  RequestType,
  SVMNetwork,
  EVMNetwork,
  BridgeQuote,
  BridgeTransferStatus,
  PaymentStatus
} from '../../src/core/types';
import { CrossChainPaymentManager, CrossChainRequestFactory } from '../../src/core/cross-chain';
import { WormholeBridgeAdapter } from '../../src/bridge/wormhole';
import { AllbridgeBridgeAdapter } from '../../src/bridge/allbridge';
import { BridgeAdapterFactory } from '../../src/bridge/adapter';
import { getBestBridgeQuote, validateCrossChainRequest } from '../../src/bridge/utils';

describe('Cross-Chain Payment Functionality', () => {
  let wormholeAdapter: WormholeBridgeAdapter;
  let allbridgeAdapter: AllbridgeBridgeAdapter;
  let paymentManager: CrossChainPaymentManager;

  beforeEach(() => {
    // Clear any existing adapters
    BridgeAdapterFactory['adapters'].clear();
    
    // Create bridge adapters
    wormholeAdapter = new WormholeBridgeAdapter();
    allbridgeAdapter = new AllbridgeBridgeAdapter();
    
    // Register adapters
    BridgeAdapterFactory.registerAdapter(wormholeAdapter);
    BridgeAdapterFactory.registerAdapter(allbridgeAdapter);
    
    // Create payment manager
    paymentManager = new CrossChainPaymentManager();
  });

  describe('CrossChainRequestFactory', () => {
    it('should create a valid cross-chain transfer request', () => {
      const request = CrossChainRequestFactory.createTransferRequest({
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F', // USDC on Ethereum
        bridge: 'wormhole',
        label: 'Test Payment',
        message: 'Cross-chain test',
        memo: 'test-memo'
      });

      expect(request.type).toBe(RequestType.CROSS_CHAIN_TRANSFER);
      expect(request.sourceNetwork).toBe(EVMNetwork.ETHEREUM);
      expect(request.destinationNetwork).toBe(SVMNetwork.SOLANA);
      expect(request.amount).toBe('100');
      expect(request.token).toBe('0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F');
      expect(request.bridge).toBe('wormhole');
    });
  });

  describe('Bridge Adapters', () => {
    describe('WormholeBridgeAdapter', () => {
      it('should support transfer from Ethereum to Solana for USDC', () => {
        const supported = wormholeAdapter.supportsTransfer(
          EVMNetwork.ETHEREUM,
          SVMNetwork.SOLANA,
          '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F' // USDC
        );
        expect(supported).toBe(true);
      });

      it('should not support unsupported token', () => {
        const supported = wormholeAdapter.supportsTransfer(
          EVMNetwork.ETHEREUM,
          SVMNetwork.SOLANA,
          '0x1234567890123456789012345678901234567890' // Random token
        );
        expect(supported).toBe(false);
      });

      it('should generate a valid quote', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
        };

        const quote = await wormholeAdapter.quote(request);

        expect(quote.id).toContain('wormhole-');
        expect(quote.inputAmount).toBe('100');
        expect(parseFloat(quote.outputAmount)).toBeLessThan(100); // Due to fees
        expect(parseFloat(quote.fee)).toBeGreaterThan(0);
        expect(quote.estimatedTime).toBe(300); // 5 minutes
      });
    });

    describe('AllbridgeBridgeAdapter', () => {
      it('should support transfer from Ethereum to Solana for USDC', () => {
        const supported = allbridgeAdapter.supportsTransfer(
          EVMNetwork.ETHEREUM,
          SVMNetwork.SOLANA,
          '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F' // USDC
        );
        expect(supported).toBe(true);
      });

      it('should generate a valid quote with lower fees than Wormhole', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
        };

        const [wormholeQuote, allbridgeQuote] = await Promise.all([
          wormholeAdapter.quote(request),
          allbridgeAdapter.quote(request)
        ]);

        // Allbridge should have lower fees
        expect(parseFloat(allbridgeQuote.fee)).toBeLessThan(parseFloat(wormholeQuote.fee));
        expect(allbridgeQuote.estimatedTime).toBeLessThan(wormholeQuote.estimatedTime);
      });
    });
  });

  describe('BridgeAdapterFactory', () => {
    it('should find compatible adapters for a transfer', () => {
      const compatibleAdapters = BridgeAdapterFactory.findCompatibleAdapters(
        EVMNetwork.ETHEREUM,
        SVMNetwork.SOLANA,
        '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F' // USDC
      );

      expect(compatibleAdapters).toHaveLength(2); // Wormhole and Allbridge
      expect(compatibleAdapters.map(a => a.info.id)).toContain('wormhole');
      expect(compatibleAdapters.map(a => a.info.id)).toContain('allbridge');
    });

    it('should return empty array for unsupported transfers', () => {
      const compatibleAdapters = BridgeAdapterFactory.findCompatibleAdapters(
        EVMNetwork.ETHEREUM,
        SVMNetwork.SOLANA,
        '0x1234567890123456789012345678901234567890' // Unsupported token
      );

      expect(compatibleAdapters).toHaveLength(0);
    });
  });

  describe('Bridge Utils', () => {
    it('should validate a valid cross-chain request', () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
      };

      expect(() => validateCrossChainRequest(request)).not.toThrow();
    });

    it('should throw for invalid cross-chain request', () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: SVMNetwork.SOLANA, // Same as destination
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
      };

      expect(() => validateCrossChainRequest(request)).toThrow('Source and destination networks cannot be the same');
    });

    it('should get the best bridge quote', async () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
      };

      const result = await getBestBridgeQuote(request);

      expect(result).not.toBeNull();
      expect(result?.quote).toBeDefined();
      expect(result?.adapter).toBeDefined();
      
      // Should select Allbridge due to lower fees and faster time
      expect(result?.adapter.info.id).toBe('allbridge');
    });
  });

  describe('CrossChainPaymentManager', () => {
    it('should execute a cross-chain payment', async () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
      };

      const result = await paymentManager.executePayment(request);

      expect(result.paymentId).toContain('cc-payment-');
      expect(result.bridge.info.id).toBe('allbridge'); // Should select best bridge
      expect(result.status).toBe(PaymentStatus.BRIDGING);
      expect(result.bridgeResult.transferId).toMatch(/allbridge-(transfer|fallback)-/); // Handle both real and fallback transfers
    });

    it('should get payment status', async () => {
      const request: CrossChainTransferRequest = {
        type: RequestType.CROSS_CHAIN_TRANSFER,
        network: SVMNetwork.SOLANA,
        sourceNetwork: EVMNetwork.ETHEREUM,
        destinationNetwork: SVMNetwork.SOLANA,
        recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        amount: '100',
        token: '0xa0B86a33E6441c4D0c85C81a1a4E18A3f3f3F77F'
      };

      const result = await paymentManager.executePayment(request);
      const status = await paymentManager.getPaymentStatus(result.paymentId);

      expect(status).not.toBeNull();
      expect(status?.id).toBe(result.paymentId);
      expect(status?.status).toBe(PaymentStatus.BRIDGING);
      expect(status?.bridgeUsed).toBe('allbridge');
    });
  });

  describe('Negative Test Cases', () => {
    describe('Unsupported Token Quotes', () => {
      it('should throw error for unsupported token in Wormhole', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0x1234567890123456789012345678901234567890' // Unsupported token
        };

        await expect(wormholeAdapter.quote(request)).rejects.toThrow(
          'Wormhole does not support transfer from ethereum to solana for token 0x1234567890123456789012345678901234567890'
        );
      });

      it('should throw error for unsupported token in Allbridge', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0x9876543210987654321098765432109876543210' // Unsupported token
        };

        await expect(allbridgeAdapter.quote(request)).rejects.toThrow(
          'Allbridge does not support transfer from ethereum to solana for token 0x9876543210987654321098765432109876543210'
        );
      });

      it('should return null from getBestBridgeQuote for unsupported token', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0x1111111111111111111111111111111111111111' // Unsupported token
        };

        const result = await getBestBridgeQuote(request);
        expect(result).toBeNull();
      });

      it('should throw error when no compatible bridges found', async () => {
        const request: CrossChainTransferRequest = {
          type: RequestType.CROSS_CHAIN_TRANSFER,
          network: SVMNetwork.SOLANA,
          sourceNetwork: EVMNetwork.ETHEREUM,
          destinationNetwork: SVMNetwork.SOLANA,
          recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          amount: '100',
          token: '0x2222222222222222222222222222222222222222' // Unsupported token
        };

        await expect(paymentManager.executePayment(request)).rejects.toThrow(
          'No compatible bridges found for this transfer'
        );
      });
    });
  });
});
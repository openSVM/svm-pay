/**
 * BPF program templates for common SVM-Pay use cases
 */

import { PublicKey } from '@solana/web3.js';
import { SVMNetwork } from '../../core/types';
import { 
  BPFProgramMetadata, 
  AssemblyInstruction, 
  SVMPayBPFProgramType,
  BPFInstruction,
  BPFRegister
} from './types';
import { BPFHelpers } from './helpers';

/**
 * Template generator for common BPF program patterns
 */
export class BPFTemplates {

  /**
   * Create a simple payment processor template
   */
  static createPaymentProcessor(config: {
    tokenMint?: PublicKey;
    feeAccount?: PublicKey;
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Payment Processor',
      SVMPayBPFProgramType.PAYMENT_PROCESSOR,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R2,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load instruction data'
      },

      // Payment validation
      ...BPFHelpers.createDebugLog('Starting payment processing'),
      ...BPFHelpers.createPaymentValidator(),

      // Token transfer
      ...BPFHelpers.createTokenTransfer(),

      // Fee processing (if configured)
      ...(config.feeAccount ? [
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R3,
          immediate: BPFHelpers.publicKeyToHash(config.feeAccount),
          comment: 'Load fee account'
        },
        ...BPFHelpers.createTokenTransfer()
      ] : []),

      // Success
      ...BPFHelpers.createDebugLog('Payment processed successfully'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a cross-chain bridge template
   */
  static createCrossChainBridge(config: {
    supportedChains: number[];
    bridgeAuthority: PublicKey;
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Cross-Chain Bridge',
      SVMPayBPFProgramType.CROSS_CHAIN_BRIDGE,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },

      // Authority check
      ...BPFHelpers.createDebugLog('Checking bridge authority'),
      ...BPFHelpers.createOwnershipCheck(config.bridgeAuthority),

      // Chain validation
      ...BPFHelpers.createDebugLog('Validating destination chain'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R4,
        src: BPFRegister.R2,
        offset: 0,
        comment: 'Load destination chain ID'
      },
      
      // Check supported chains
      ...config.supportedChains.map((chainId, index) => ({
        opcode: BPFInstruction.JUMP_EQ,
        dst: BPFRegister.R4,
        immediate: chainId,
        comment: `Check chain ${chainId}` 
      } as AssemblyInstruction)),

      // Bridge execution
      ...BPFHelpers.createDebugLog('Executing cross-chain bridge'),
      ...BPFHelpers.createCrossChainBridge(),

      // Success
      ...BPFHelpers.createDebugLog('Bridge operation completed'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a payment validator template
   */
  static createPaymentValidator(config: {
    minAmount: number;
    maxAmount: number;
    allowedTokens: PublicKey[];
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Payment Validator',
      SVMPayBPFProgramType.VALIDATOR,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },

      // Amount validation
      ...BPFHelpers.createDebugLog('Validating payment amount'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R3,
        src: BPFRegister.R2,
        offset: 8,
        comment: 'Load payment amount'
      },
      {
        opcode: BPFInstruction.JUMP_LT,
        dst: BPFRegister.R3,
        immediate: config.minAmount,
        comment: `Check minimum amount: ${config.minAmount}`
      },
      {
        opcode: BPFInstruction.JUMP_GT,
        dst: BPFRegister.R3,
        immediate: config.maxAmount,
        comment: `Check maximum amount: ${config.maxAmount}`
      },

      // Token validation
      ...BPFHelpers.createDebugLog('Validating token mint'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R4,
        src: BPFRegister.R2,
        offset: 16,
        comment: 'Load token mint'
      },
      
      // Check allowed tokens
      ...config.allowedTokens.map((token, index) => ({
        opcode: BPFInstruction.JUMP_EQ,
        dst: BPFRegister.R4,
        immediate: BPFHelpers.publicKeyToHash(token),
        comment: `Check allowed token ${index}`
      } as AssemblyInstruction)),

      // Time validation
      ...BPFHelpers.createDebugLog('Validating transaction time'),
      ...BPFHelpers.createTimeValidation(300), // 5 minutes

      // Success
      ...BPFHelpers.createDebugLog('Payment validation successful'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 1,
        comment: 'Return validation success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a middleware template
   */
  static createMiddleware(config: {
    preHooks: string[];
    postHooks: string[];
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Middleware',
      SVMPayBPFProgramType.MIDDLEWARE,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },

      // Pre-hooks
      ...BPFHelpers.createDebugLog('Executing pre-hooks'),
      ...config.preHooks.flatMap(hook => [
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R5,
          immediate: BPFHelpers.stringToHash(hook),
          comment: `Pre-hook: ${hook}`
        },
        {
          opcode: BPFInstruction.CALL,
          dst: BPFRegister.R0,
          immediate: 6, // sol_invoke_signed
          comment: 'Execute pre-hook'
        }
      ]),

      // Main processing
      ...BPFHelpers.createDebugLog('Executing main processing'),
      ...BPFHelpers.createPaymentValidator(),

      // Post-hooks
      ...BPFHelpers.createDebugLog('Executing post-hooks'),
      ...config.postHooks.flatMap(hook => [
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R6,
          immediate: BPFHelpers.stringToHash(hook),
          comment: `Post-hook: ${hook}`
        },
        {
          opcode: BPFInstruction.CALL,
          dst: BPFRegister.R0,
          immediate: 6, // sol_invoke_signed
          comment: 'Execute post-hook'
        }
      ]),

      // Success
      ...BPFHelpers.createDebugLog('Middleware processing completed'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a token transfer template
   */
  static createTokenTransfer(config: {
    tokenMint: PublicKey;
    decimals: number;
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Token Transfer',
      SVMPayBPFProgramType.TOKEN_TRANSFER,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },

      // Token mint validation
      ...BPFHelpers.createDebugLog('Validating token mint'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R3,
        src: BPFRegister.R2,
        offset: 0,
        comment: 'Load token mint from instruction'
      },
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R3,
        immediate: BPFHelpers.publicKeyToHash(config.tokenMint),
        comment: 'Validate token mint'
      },

      // Decimals validation
      ...BPFHelpers.createDebugLog('Validating amount decimals'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R4,
        src: BPFRegister.R2,
        offset: 8,
        comment: 'Load transfer amount'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R5,
        immediate: Math.pow(10, config.decimals),
        comment: `Load decimals multiplier: ${config.decimals}`
      },
      {
        opcode: BPFInstruction.MOD,
        dst: BPFRegister.R4,
        src: BPFRegister.R5,
        comment: 'Check amount precision'
      },

      // Account validation
      ...BPFHelpers.createDebugLog('Validating accounts'),
      ...BPFHelpers.createPaymentValidator(),

      // Execute transfer
      ...BPFHelpers.createDebugLog('Executing token transfer'),
      ...BPFHelpers.createTokenTransfer(),

      // Success
      ...BPFHelpers.createDebugLog('Token transfer completed'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a minimal hello world template
   */
  static createHelloWorld(networks: SVMNetwork[]): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Hello World',
      SVMPayBPFProgramType.MIDDLEWARE,
      networks
    );

    const instructions: AssemblyInstruction[] = [
      // Say hello
      ...BPFHelpers.createDebugLog('Hello from SVM-Pay Assembly-BPF SDK!'),
      
      // Return success
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }

  /**
   * Create a comprehensive payment flow template
   */
  static createPaymentFlow(config: {
    tokenMint: PublicKey;
    feeAccount: PublicKey;
    feeRate: number; // basis points
    networks: SVMNetwork[];
  }): {
    metadata: BPFProgramMetadata;
    instructions: AssemblyInstruction[];
  } {
    const metadata = BPFHelpers.createProgramMetadata(
      'SVM-Pay Complete Payment Flow',
      SVMPayBPFProgramType.PAYMENT_PROCESSOR,
      config.networks
    );

    const instructions: AssemblyInstruction[] = [
      // Program prologue
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load accounts array'
      },

      // Comprehensive validation
      ...BPFHelpers.createDebugLog('Starting comprehensive payment validation'),
      ...BPFHelpers.createPaymentValidator(),
      ...BPFHelpers.createBalanceCheck(1000000), // 0.001 SOL minimum
      ...BPFHelpers.createTimeValidation(600), // 10 minutes

      // Calculate fees
      ...BPFHelpers.createDebugLog('Calculating fees'),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R6,
        src: BPFRegister.R2,
        offset: 8,
        comment: 'Load payment amount'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R7,
        immediate: config.feeRate,
        comment: `Load fee rate: ${config.feeRate} basis points`
      },
      {
        opcode: BPFInstruction.MUL,
        dst: BPFRegister.R6,
        src: BPFRegister.R7,
        comment: 'Calculate fee amount'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: 10000,
        comment: 'Load basis points divisor'
      },
      {
        opcode: BPFInstruction.DIV,
        dst: BPFRegister.R6,
        src: BPFRegister.R8,
        comment: 'Finalize fee calculation'
      },

      // Execute main transfer
      ...BPFHelpers.createDebugLog('Executing main payment'),
      ...BPFHelpers.createTokenTransfer(),

      // Execute fee transfer
      ...BPFHelpers.createDebugLog('Processing fee payment'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: BPFHelpers.publicKeyToHash(config.feeAccount),
        comment: 'Load fee recipient'
      },
      ...BPFHelpers.createTokenTransfer(),

      // Final validation
      ...BPFHelpers.createDebugLog('Finalizing payment'),
      ...BPFHelpers.createComputeTracking(),

      // Success
      ...BPFHelpers.createDebugLog('Payment flow completed successfully'),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];

    return { metadata, instructions };
  }
}
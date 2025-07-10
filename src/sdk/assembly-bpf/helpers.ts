/**
 * Helper utilities for Assembly-BPF SDK
 */

import { PublicKey } from '@solana/web3.js';
import { 
  AssemblyInstruction, 
  BPFInstruction, 
  BPFRegister,
  BPFProgramMetadata,
  SVMPayBPFProgramType
} from './types';
import { SVMNetwork } from '../../core/types';

/**
 * Common helper functions for BPF development
 */
export class BPFHelpers {
  
  /**
   * Create a simple payment validation function
   */
  static createPaymentValidator(): AssemblyInstruction[] {
    return [
      // Load accounts
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load source account'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R2,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load destination account'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R3,
        src: BPFRegister.R1,
        offset: 16,
        comment: 'Load amount'
      },
      
      // Validate accounts are not null
      {
        opcode: BPFInstruction.JUMP_EQ,
        dst: BPFRegister.R1,
        immediate: 0,
        offset: 3, // Jump forward 3 instructions to end
        comment: 'Check source account not null'
      },
      {
        opcode: BPFInstruction.JUMP_EQ,
        dst: BPFRegister.R2,
        immediate: 0,
        offset: 2, // Jump forward 2 instructions to end
        comment: 'Check destination account not null'
      },
      
      // Validate amount is positive
      {
        opcode: BPFInstruction.JUMP_EQ,
        dst: BPFRegister.R3,
        immediate: 0,
        offset: 1, // Jump forward 1 instruction to end
        comment: 'Check amount is not zero'
      },
      
      // Return success
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 1,
        comment: 'Return success'
      }
    ];
  }

  /**
   * Create token transfer instructions
   */
  static createTokenTransfer(): AssemblyInstruction[] {
    return [
      // Load token program ID
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R4,
        immediate: 0x06ddf6e1, // TOKEN_PROGRAM_ID hash
        comment: 'Load token program ID'
      },
      
      // Prepare transfer instruction
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R5,
        immediate: 3, // Transfer instruction discriminator
        comment: 'Set transfer instruction'
      },
      
      // Execute transfer
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 6, // sol_invoke_signed
        comment: 'Execute token transfer'
      },
      
      // Check result
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R0,
        immediate: 0,
        offset: 1, // Jump to next instruction (effectively a no-op)
        comment: 'Check transfer success'
      }
    ];
  }

  /**
   * Create cross-chain bridge instructions
   */
  static createCrossChainBridge(): AssemblyInstruction[] {
    return [
      // Load bridge program ID
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R6,
        immediate: 0x0badf00d, // Bridge program ID hash
        comment: 'Load bridge program ID'
      },
      
      // Prepare bridge data
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R7,
        src: BPFRegister.R10,
        offset: -32,
        comment: 'Load destination chain ID'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R8,
        src: BPFRegister.R10,
        offset: -40,
        comment: 'Load destination address'
      },
      
      // Execute bridge
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 6, // sol_invoke_signed
        comment: 'Execute cross-chain bridge'
      }
    ];
  }

  /**
   * Create error handling wrapper
   */
  static createErrorHandler(errorCode: number): AssemblyInstruction[] {
    return [
      // Set error code
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: errorCode,
        comment: `Set error code: ${errorCode}`
      },
      
      // Log error
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 1, // sol_log
        comment: 'Log error'
      },
      
      // Exit with error
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit with error'
      }
    ];
  }

  /**
   * Create account ownership check
   */
  static createOwnershipCheck(expectedOwner: PublicKey): AssemblyInstruction[] {
    const ownerHash = BPFHelpers.publicKeyToHash(expectedOwner);
    
    return [
      // Load account owner
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R4,
        src: BPFRegister.R1,
        offset: 32, // Owner field offset
        comment: 'Load account owner'
      },
      
      // Compare with expected owner
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R4,
        immediate: ownerHash,
        offset: 1, // Jump to next instruction
        comment: 'Check account owner'
      }
    ];
  }

  /**
   * Create balance check
   */
  static createBalanceCheck(minBalance: number): AssemblyInstruction[] {
    return [
      // Load account balance
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R5,
        src: BPFRegister.R1,
        offset: 0, // Lamports field offset
        comment: 'Load account balance'
      },
      
      // Check minimum balance
      {
        opcode: BPFInstruction.JUMP_LT,
        dst: BPFRegister.R5,
        immediate: minBalance,
        offset: 1, // Jump to next instruction
        comment: `Check minimum balance: ${minBalance}`
      }
    ];
  }

  /**
   * Create signature verification
   */
  static createSignatureVerification(): AssemblyInstruction[] {
    return [
      // Load signature data
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R6,
        src: BPFRegister.R1,
        offset: 64, // Signature field offset
        comment: 'Load signature'
      },
      
      // Load public key
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R7,
        src: BPFRegister.R1,
        offset: 96, // Public key field offset
        comment: 'Load public key'
      },
      
      // Verify signature (simplified)
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 10, // ed25519_verify syscall
        comment: 'Verify signature'
      }
    ];
  }

  /**
   * Create time-based validation
   */
  static createTimeValidation(maxAge: number): AssemblyInstruction[] {
    return [
      // Get current timestamp
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 3, // sol_get_clock_sysvar
        comment: 'Get current timestamp'
      },
      
      // Load transaction timestamp
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R8,
        src: BPFRegister.R1,
        offset: 128, // Timestamp field offset
        comment: 'Load transaction timestamp'
      },
      
      // Calculate age
      {
        opcode: BPFInstruction.SUB,
        dst: BPFRegister.R0,
        src: BPFRegister.R8,
        comment: 'Calculate transaction age'
      },
      
      // Check max age
      {
        opcode: BPFInstruction.JUMP_GT,
        dst: BPFRegister.R0,
        immediate: maxAge,
        offset: 1, // Jump to error handler
        comment: `Check max age: ${maxAge}`
      }
    ];
  }

  /**
   * Create program derived address generation
   */
  static createPDAGeneration(seeds: string[]): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    
    // Prepare seeds
    seeds.forEach((seed, index) => {
      const seedHash = BPFHelpers.stringToHash(seed);
      instructions.push({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: seedHash,
        comment: `Seed ${index}: ${seed}`
      });
      
      instructions.push({
        opcode: BPFInstruction.STORE,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        offset: -(8 * (index + 1)),
        comment: `Store seed ${index}`
      });
    });
    
    // Generate PDA
    instructions.push({
      opcode: BPFInstruction.CALL,
      dst: BPFRegister.R0,
      immediate: 5, // sol_try_find_program_address
      comment: 'Generate PDA'
    });
    
    return instructions;
  }

  /**
   * Convert PublicKey to hash for immediate values
   */
  static publicKeyToHash(publicKey: PublicKey): number {
    const bytes = publicKey.toBytes();
    let hash = 0;
    for (let i = 0; i < Math.min(bytes.length, 4); i++) {
      hash = (hash << 8) | bytes[i];
    }
    return hash;
  }

  /**
   * Convert string to hash for immediate values
   */
  static stringToHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Create standard program metadata
   */
  static createProgramMetadata(
    name: string,
    type: SVMPayBPFProgramType,
    networks: SVMNetwork[]
  ): BPFProgramMetadata {
    return {
      name,
      version: '1.0.0',
      type,
      networks,
      entryPoint: 'process_instruction',
      computeUnits: 10000,
      memory: {
        stackStart: 0x100000000,
        stackSize: 4096,
        heapStart: 0x200000000,
        heapSize: 65536,
        programDataStart: 0x300000000
      },
      dependencies: []
    };
  }

  /**
   * Create debug logging instructions
   */
  static createDebugLog(message: string): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R1,
        immediate: BPFHelpers.stringToHash(message),
        comment: `Debug: ${message}`
      },
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 1, // sol_log
        comment: 'Log debug message'
      }
    ];
  }

  /**
   * Create computation cost tracking
   */
  static createComputeTracking(): AssemblyInstruction[] {
    return [
      // Get initial compute units
      {
        opcode: BPFInstruction.CALL,
        dst: BPFRegister.R0,
        immediate: 11, // sol_get_compute_budget
        comment: 'Get compute budget'
      },
      {
        opcode: BPFInstruction.STORE,
        dst: BPFRegister.R10,
        src: BPFRegister.R0,
        offset: -8,
        comment: 'Store initial compute units'
      }
    ];
  }
}

/**
 * Utility functions for common operations
 */
export class BPFUtils {
  
  /**
   * Convert bytes to assembly instructions
   */
  static bytesToInstructions(bytes: Uint8Array): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    
    for (let i = 0; i < bytes.length; i += 8) {
      const chunk = bytes.slice(i, i + 8);
      let value = 0;
      
      for (let j = 0; j < chunk.length; j++) {
        value |= chunk[j] << (j * 8);
      }
      
      instructions.push({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: value,
        comment: `Byte chunk ${i / 8}`
      });
    }
    
    return instructions;
  }

  /**
   * Create instruction sequence for common patterns
   */
  static createPattern(pattern: 'payment' | 'bridge' | 'validator'): AssemblyInstruction[] {
    switch (pattern) {
      case 'payment':
        return [
          ...BPFHelpers.createPaymentValidator(),
          ...BPFHelpers.createTokenTransfer()
        ];
      case 'bridge':
        return [
          ...BPFHelpers.createPaymentValidator(),
          ...BPFHelpers.createCrossChainBridge()
        ];
      case 'validator':
        return [
          ...BPFHelpers.createOwnershipCheck(new PublicKey('11111111111111111111111111111111')),
          ...BPFHelpers.createSignatureVerification()
        ];
      default:
        return [];
    }
  }

  /**
   * Optimize instruction sequence
   */
  static optimizeInstructions(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized: AssemblyInstruction[] = [];
    
    for (let i = 0; i < instructions.length; i++) {
      const current = instructions[i];
      const next = instructions[i + 1];
      
      // Skip redundant loads
      if (current.opcode === BPFInstruction.LOAD_IMM && 
          next?.opcode === BPFInstruction.LOAD_IMM &&
          current.dst === next.dst &&
          current.immediate === next.immediate) {
        continue;
      }
      
      optimized.push(current);
    }
    
    return optimized;
  }
}
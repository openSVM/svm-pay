/**
 * Type definitions for Assembly-BPF SDK
 */

import { PublicKey } from '@solana/web3.js';
import { SVMNetwork } from '../../core/types';

/**
 * BPF program configuration
 */
export interface BPFProgramConfig {
  /** Target SVM network */
  network: SVMNetwork;
  /** Program ID (if deploying) */
  programId?: PublicKey;
  /** Debug mode for additional logging */
  debug?: boolean;
  /** Custom RPC endpoint */
  rpcEndpoint?: string;
  /** Maximum compute units */
  maxComputeUnits?: number;
}

/**
 * BPF instruction types
 */
export enum BPFInstruction {
  // Arithmetic operations
  ADD = 0x0f,
  SUB = 0x1f,
  MUL = 0x2f,
  DIV = 0x3f,
  MOD = 0x9f,
  
  // Memory operations
  LOAD = 0x61,
  STORE = 0x62,
  LOAD_IMM = 0x18,
  
  // Control flow
  JUMP = 0x05,
  JUMP_EQ = 0x15,
  JUMP_NE = 0x55,
  JUMP_GT = 0x25,
  JUMP_GE = 0x35,
  JUMP_LT = 0xa5,
  JUMP_LE = 0xb5,
  
  // Function calls
  CALL = 0x85,
  EXIT = 0x95,
  
  // Bitwise operations
  AND = 0x5f,
  OR = 0x4f,
  XOR = 0xaf,
  LSH = 0x6f,
  RSH = 0x7f,
  NEG = 0x87,
}

/**
 * BPF register definitions
 */
export enum BPFRegister {
  R0 = 0, // Return value
  R1 = 1, // First argument
  R2 = 2, // Second argument
  R3 = 3, // Third argument
  R4 = 4, // Fourth argument
  R5 = 5, // Fifth argument
  R6 = 6, // Sixth argument
  R7 = 7, // Seventh argument
  R8 = 8, // Eighth argument
  R9 = 9, // Ninth argument
  R10 = 10, // Stack frame pointer
}

/**
 * SVM-Pay BPF program types
 */
export enum SVMPayBPFProgramType {
  PAYMENT_PROCESSOR = 'payment_processor',
  TOKEN_TRANSFER = 'token_transfer',
  CROSS_CHAIN_BRIDGE = 'cross_chain_bridge',
  VALIDATOR = 'validator',
  MIDDLEWARE = 'middleware',
}

/**
 * BPF syscall definitions for SVM networks
 */
export interface BPFSyscalls {
  /** Log a message */
  sol_log: number;
  /** Log data */
  sol_log_data: number;
  /** Get current slot */
  sol_get_clock_sysvar: number;
  /** Create program derived address */
  sol_create_program_address: number;
  /** Try to find program derived address */
  sol_try_find_program_address: number;
  /** Invoke another program */
  sol_invoke_signed: number;
  /** Get account info */
  sol_get_account_info: number;
  /** Set return data */
  sol_set_return_data: number;
  /** Get return data */
  sol_get_return_data: number;
}

/**
 * Memory layout for BPF programs
 */
export interface BPFMemoryLayout {
  /** Stack start address */
  stackStart: number;
  /** Stack size in bytes */
  stackSize: number;
  /** Heap start address */
  heapStart: number;
  /** Heap size in bytes */
  heapSize: number;
  /** Program data start */
  programDataStart: number;
}

/**
 * BPF program metadata
 */
export interface BPFProgramMetadata {
  /** Program name */
  name: string;
  /** Program version */
  version: string;
  /** Program type */
  type: SVMPayBPFProgramType;
  /** Target networks */
  networks: SVMNetwork[];
  /** Entry point function */
  entryPoint: string;
  /** Required compute units */
  computeUnits: number;
  /** Memory requirements */
  memory: BPFMemoryLayout;
  /** Dependencies */
  dependencies?: string[];
}

/**
 * Assembly instruction representation
 */
export interface AssemblyInstruction {
  /** Operation code */
  opcode: BPFInstruction;
  /** Destination register */
  dst: BPFRegister;
  /** Source register */
  src?: BPFRegister;
  /** Immediate value */
  immediate?: number;
  /** Offset for memory operations */
  offset?: number;
  /** Comment for debugging */
  comment?: string;
}

/**
 * BPF program compilation result
 */
export interface BPFCompilationResult {
  /** Success status */
  success: boolean;
  /** Compiled bytecode */
  bytecode?: Uint8Array;
  /** Assembly listing */
  assembly?: string;
  /** Error messages */
  errors?: string[];
  /** Warnings */
  warnings?: string[];
  /** Metadata */
  metadata: BPFProgramMetadata;
}

/**
 * BPF deployment result
 */
export interface BPFDeploymentResult {
  /** Success status */
  success: boolean;
  /** Deployed program ID */
  programId?: PublicKey;
  /** Transaction signature */
  signature?: string;
  /** Error message */
  error?: string;
  /** Gas used */
  computeUnitsUsed?: number;
}
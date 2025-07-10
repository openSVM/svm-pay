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
 * BPF instruction classes
 */
export enum BPFInstructionClass {
  LD = 0x00,    // Load
  LDX = 0x01,   // Load, indexed
  ST = 0x02,    // Store immediate
  STX = 0x03,   // Store, indexed
  ALU = 0x04,   // Arithmetic operations
  JMP = 0x05,   // Jump operations
  JMP32 = 0x06, // Jump operations on 32-bit
  ALU64 = 0x07  // 64-bit arithmetic operations
}

/**
 * BPF instruction types with full opcode semantics
 */
export enum BPFInstruction {
  // Load instructions (class 0x00-0x03)
  LOAD_IMM = 0x18,      // lddw - Load 64-bit immediate
  LOAD_ABS = 0x20,      // ldabs - Load absolute
  LOAD_IND = 0x40,      // ldind - Load indirect
  LOAD_MEM = 0x61,      // ldx - Load from memory
  LOAD_MEMSX = 0x81,    // ldxs - Load sign-extended
  
  // Store instructions  
  STORE_IMM = 0x62,     // st - Store immediate
  STORE_MEM = 0x63,     // stx - Store to memory
  
  // 64-bit ALU operations (class 0x07)
  ADD64 = 0x0f,         // add64
  SUB64 = 0x1f,         // sub64  
  MUL64 = 0x2f,         // mul64
  DIV64 = 0x3f,         // div64
  OR64 = 0x4f,          // or64
  AND64 = 0x5f,         // and64
  LSH64 = 0x6f,         // lsh64
  RSH64 = 0x7f,         // rsh64
  NEG64 = 0x87,         // neg64
  MOD64 = 0x9f,         // mod64
  XOR64 = 0xaf,         // xor64
  ARSH64 = 0xcf,        // arsh64 - Arithmetic right shift
  
  // 32-bit ALU operations (class 0x04)
  ADD32 = 0x04,         // add32
  SUB32 = 0x14,         // sub32
  MUL32 = 0x24,         // mul32
  DIV32 = 0x34,         // div32
  OR32 = 0x44,          // or32
  AND32 = 0x54,         // and32
  LSH32 = 0x64,         // lsh32
  RSH32 = 0x74,         // rsh32
  NEG32 = 0x84,         // neg32
  MOD32 = 0x94,         // mod32
  XOR32 = 0xa4,         // xor32
  ARSH32 = 0xc4,        // arsh32
  
  // Jump operations (class 0x05)
  JUMP = 0x05,          // ja - Jump always
  JUMP_EQ = 0x15,       // jeq - Jump if equal
  JUMP_GT = 0x25,       // jgt - Jump if greater than
  JUMP_GE = 0x35,       // jge - Jump if greater or equal
  JUMP_SET = 0x45,      // jset - Jump if bit set
  JUMP_NE = 0x55,       // jne - Jump if not equal
  JUMP_SGT = 0x65,      // jsgt - Jump if signed greater than
  JUMP_SGE = 0x75,      // jsge - Jump if signed greater or equal
  JUMP_LT = 0xa5,       // jlt - Jump if less than
  JUMP_LE = 0xb5,       // jle - Jump if less or equal
  JUMP_SLT = 0xc5,      // jslt - Jump if signed less than
  JUMP_SLE = 0xd5,      // jsle - Jump if signed less or equal
  
  // 32-bit Jump operations (class 0x06)
  JUMP32_EQ = 0x16,     // jeq32
  JUMP32_GT = 0x26,     // jgt32
  JUMP32_GE = 0x36,     // jge32
  JUMP32_SET = 0x46,    // jset32
  JUMP32_NE = 0x56,     // jne32
  JUMP32_SGT = 0x66,    // jsgt32
  JUMP32_SGE = 0x76,    // jsge32
  JUMP32_LT = 0xa6,     // jlt32
  JUMP32_LE = 0xb6,     // jle32
  JUMP32_SLT = 0xc6,    // jslt32
  JUMP32_SLE = 0xd6,    // jsle32
  
  // Function calls and returns
  CALL = 0x85,          // call
  EXIT = 0x95,          // exit
  
  // Legacy aliases for backward compatibility
  ADD = 0x0f,
  SUB = 0x1f,
  MUL = 0x2f,
  DIV = 0x3f,
  MOD = 0x9f,
  LOAD = 0x61,
  STORE = 0x62,
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
 * Assembly instruction representation with enhanced 64-bit support
 */
export interface AssemblyInstruction {
  /** Operation code */
  opcode: BPFInstruction;
  /** Destination register */
  dst: BPFRegister;
  /** Source register */
  src?: BPFRegister;
  /** Immediate value (supports 64-bit) */
  immediate?: number | bigint;
  /** Offset for memory operations */
  offset?: number;
  /** Comment for debugging */
  comment?: string;
  /** Instruction size (8 or 16 bytes for wide instructions) */
  size?: 8 | 16;
}

/**
 * Enhanced BPF validation options
 */
export interface BPFValidationOptions {
  /** Enable strict opcode validation */
  strictOpcodes?: boolean;
  /** Check for instruction class compliance */
  validateInstructionClass?: boolean;
  /** Validate 64-bit immediate encoding */
  validate64BitImmediates?: boolean;
  /** Check memory access bounds */
  validateMemoryAccess?: boolean;
  /** Maximum allowed stack depth */
  maxStackDepth?: number;
  /** Enable security pattern validation */
  securityValidation?: boolean;
}

/**
 * ELF parsing result for BPF programs
 */
export interface BPFELFParseResult {
  /** Success status */
  success: boolean;
  /** Program header information */
  programHeaders?: Array<{
    type: number;
    offset: number;
    vaddr: number;
    paddr: number;
    filesz: number;
    memsz: number;
    flags: number;
  }>;
  /** Section header information */
  sectionHeaders?: Array<{
    name: string;
    type: number;
    flags: number;
    addr: number;
    offset: number;
    size: number;
  }>;
  /** Symbol table */
  symbols?: Array<{
    name: string;
    value: number;
    size: number;
    type: number;
    binding: number;
  }>;
  /** Error message if parsing failed */
  error?: string;
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
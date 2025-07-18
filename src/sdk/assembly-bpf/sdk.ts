/**
 * Main Assembly-BPF SDK class with enhanced features
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { SVMNetwork } from '../../core/types';
import { 
  BPFProgramConfig, 
  BPFProgramMetadata, 
  BPFCompilationResult, 
  BPFDeploymentResult,
  AssemblyInstruction,
  SVMPayBPFProgramType,
  BPFValidationOptions
} from './types';
import { BPFSyscallHelper } from './syscalls';
import { BPFMemoryManager } from './memory';
import { BPFAssembler } from './core';
import { BPFProgramLoader } from './loader';
import { BPFValidator } from './validation';
import { BPFELFParser } from './elf-parser';

/**
 * Enhanced Assembly-BPF SDK for SVM-Pay
 * 
 * Provides a complete toolkit for developing BPF programs in Assembly
 * that work with SVM-Pay across all supported SVM networks with
 * comprehensive security validation and optimization.
 */
export class AssemblyBPFSDK {
  private config: BPFProgramConfig;
  private connection: Connection;
  private syscallHelper: BPFSyscallHelper;
  private memoryManager: BPFMemoryManager;
  private assembler: BPFAssembler;
  private loader: BPFProgramLoader;
  private validator: BPFValidator;

  constructor(config: BPFProgramConfig, validationOptions?: BPFValidationOptions) {
    this.config = config;
    this.connection = new Connection(
      config.rpcEndpoint || this.getDefaultRpcEndpoint(config.network),
      'confirmed'
    );
    
    this.syscallHelper = new BPFSyscallHelper(config.network);
    this.memoryManager = new BPFMemoryManager();
    this.assembler = new BPFAssembler(config, validationOptions);
    this.loader = new BPFProgramLoader(this.connection, config);
    this.validator = new BPFValidator(validationOptions);
  }

  /**
   * Create a new BPF program with SVM-Pay integration
   */
  createProgram(metadata: BPFProgramMetadata): BPFProgramBuilder {
    return new BPFProgramBuilder(this, metadata);
  }

  /**
   * Compile assembly instructions to BPF bytecode with enhanced validation
   */
  async compile(instructions: AssemblyInstruction[], metadata: BPFProgramMetadata): Promise<BPFCompilationResult> {
    try {
      const result = await this.assembler.assemble(instructions, metadata);
      return result;
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown compilation error'],
        metadata
      };
    }
  }

  /**
   * Deploy a compiled BPF program
   */
  async deploy(bytecode: Uint8Array, metadata: BPFProgramMetadata): Promise<BPFDeploymentResult> {
    try {
      const result = await this.loader.deploy(bytecode, metadata);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  /**
   * Parse ELF file and extract BPF program
   */
  parseELF(elfData: Uint8Array) {
    const parser = new BPFELFParser(elfData);
    return parser.parse();
  }

  /**
   * Validate BPF program with enhanced security checks
   */
  validateProgram(instructions: AssemblyInstruction[]): { valid: boolean; issues: string[] } {
    const validationIssues = this.validator.validate(instructions);
    const errors = validationIssues.filter(issue => issue.severity === 'error');
    
    return {
      valid: errors.length === 0,
      issues: validationIssues.map(issue => issue.message)
    };
  }

  /**
   * Validate BPF bytecode (legacy method for backward compatibility)
   */
  async validateBytecode(bytecode: Uint8Array): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Basic validation checks
    if (bytecode.length === 0) {
      issues.push('Empty bytecode');
    }
    
    if (bytecode.length > 1024 * 1024) { // 1MB limit
      issues.push('Program size exceeds maximum limit');
    }
    
    // Check for prohibited instructions
    const prohibitedOpcodes = [0xff, 0xfe, 0xfd]; // Example prohibited opcodes
    for (let i = 0; i < bytecode.length; i++) {
      if (prohibitedOpcodes.includes(bytecode[i])) {
        issues.push(`Prohibited opcode found at byte ${i}`);
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Get syscall helper for the current network
   */
  getSyscallHelper(): BPFSyscallHelper {
    return this.syscallHelper;
  }

  /**
   * Get memory manager
   */
  getMemoryManager(): BPFMemoryManager {
    return this.memoryManager;
  }

  /**
   * Get assembler
   */
  getAssembler(): BPFAssembler {
    return this.assembler;
  }

  /**
   * Get validator
   */
  getValidator(): BPFValidator {
    return this.validator;
  }

  /**
   * Get default RPC endpoint for network
   */
  private getDefaultRpcEndpoint(network: SVMNetwork): string {
    switch (network) {
      case SVMNetwork.SOLANA:
        return 'https://api.mainnet-beta.solana.com';
      case SVMNetwork.SONIC:
        return 'https://api.sonic.game';
      case SVMNetwork.ECLIPSE:
        return 'https://mainnet.eclipse.xyz';
      case SVMNetwork.SOON:
        return 'https://rpc.soon.network';
      default:
        return 'https://api.mainnet-beta.solana.com';
    }
  }
}

/**
 * Enhanced builder class for BPF programs
 */
export class BPFProgramBuilder {
  private sdk: AssemblyBPFSDK;
  private metadata: BPFProgramMetadata;
  private instructions: AssemblyInstruction[] = [];

  constructor(sdk: AssemblyBPFSDK, metadata: BPFProgramMetadata) {
    this.sdk = sdk;
    this.metadata = metadata;
  }

  /**
   * Add an instruction to the program
   */
  addInstruction(instruction: AssemblyInstruction): BPFProgramBuilder {
    this.instructions.push(instruction);
    return this;
  }

  /**
   * Add multiple instructions
   */
  addInstructions(instructions: AssemblyInstruction[]): BPFProgramBuilder {
    this.instructions.push(...instructions);
    return this;
  }

  /**
   * Add a SVM-Pay payment processing function
   */
  addPaymentProcessor(): BPFProgramBuilder {
    const syscalls = this.sdk.getSyscallHelper();
    
    // Add payment validation instructions
    this.addInstructions([
      syscalls.createLogInstruction('Starting payment processing'),
      ...syscalls.createAccountValidationInstructions(),
      ...syscalls.createAmountValidationInstructions(),
      syscalls.createTransferInstruction(),
      syscalls.createLogInstruction('Payment processed successfully')
    ]);
    
    return this;
  }

  /**
   * Add cross-chain bridge functionality
   */
  addCrossChainBridge(): BPFProgramBuilder {
    const syscalls = this.sdk.getSyscallHelper();
    
    this.addInstructions([
      syscalls.createLogInstruction('Cross-chain bridge operation'),
      ...syscalls.createBridgeValidationInstructions(),
      ...syscalls.createDestinationChainInstructions(),
      syscalls.createLogInstruction('Cross-chain bridge completed')
    ]);
    
    return this;
  }

  /**
   * Validate the current program
   */
  validate(): { valid: boolean; issues: string[] } {
    return this.sdk.validateProgram(this.instructions);
  }

  /**
   * Compile the program with validation
   */
  async compile(): Promise<BPFCompilationResult> {
    // Run validation first
    const validationResult = this.validate();
    
    if (!validationResult.valid) {
      const errors = validationResult.issues.filter(issue => 
        issue.includes('error') || issue.includes('Error') || issue.includes('missing') || issue.includes('required')
      );
      
      if (errors.length > 0) {
        return {
          success: false,
          errors,
          metadata: this.metadata
        };
      }
    }

    return this.sdk.compile(this.instructions, this.metadata);
  }

  /**
   * Compile and deploy the program
   */
  async deploy(): Promise<BPFDeploymentResult> {
    const compilationResult = await this.compile();
    
    if (!compilationResult.success || !compilationResult.bytecode) {
      return {
        success: false,
        error: `Compilation failed: ${compilationResult.errors?.join(', ')}`
      };
    }
    
    return this.sdk.deploy(compilationResult.bytecode, this.metadata);
  }

  /**
   * Get current instructions
   */
  getInstructions(): AssemblyInstruction[] {
    return [...this.instructions];
  }

  /**
   * Get metadata
   */
  getMetadata(): BPFProgramMetadata {
    return this.metadata;
  }

  /**
   * Get estimated compute units
   */
  getEstimatedComputeUnits(): number {
    return this.sdk.getAssembler().estimateComputeUnitsEnhanced(this.instructions);
  }

  /**
   * Optimize the program
   */
  optimize(): BPFProgramBuilder {
    this.instructions = this.sdk.getAssembler().optimizeAdvanced(this.instructions);
    return this;
  }
}
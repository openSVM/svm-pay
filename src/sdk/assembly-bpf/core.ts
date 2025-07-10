/**
 * BPF assembler and code generation with enhanced features
 */

import { 
  BPFProgramConfig,
  BPFProgramMetadata,
  BPFCompilationResult,
  AssemblyInstruction,
  BPFInstruction,
  BPFRegister,
  BPFValidationOptions,
  BPFInstructionClass
} from './types';
import { BPFValidator, SecurityIssue } from './validation';
import { BPFELFParser } from './elf-parser';

/**
 * Enhanced BPF assembler for converting assembly instructions to bytecode
 */
export class BPFAssembler {
  private config: BPFProgramConfig;
  private validator: BPFValidator;

  constructor(config: BPFProgramConfig, validationOptions?: BPFValidationOptions) {
    this.config = config;
    this.validator = new BPFValidator(validationOptions);
  }

  /**
   * Assemble instructions into BPF bytecode with enhanced validation
   */
  async assemble(instructions: AssemblyInstruction[], metadata: BPFProgramMetadata): Promise<BPFCompilationResult> {
    try {
      // Validate instructions with enhanced security checks
      const validationIssues = this.validator.validate(instructions);
      const errors = validationIssues.filter(issue => issue.severity === 'error');
      const warnings = validationIssues.filter(issue => issue.severity === 'warning');

      if (errors.length > 0) {
        return {
          success: false,
          errors: errors.map(e => e.message),
          metadata
        };
      }

      // Optimize instructions
      const optimizedInstructions = this.optimizeAdvanced(instructions);
      
      // Generate bytecode with enhanced encoding
      const bytecode = this.instructionsToBytecodeEnhanced(optimizedInstructions);
      const assembly = this.instructionsToAssembly(optimizedInstructions);
      
      return {
        success: true,
        bytecode,
        assembly,
        warnings: warnings.length > 0 ? warnings.map(w => w.message) : undefined,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown assembly error'],
        metadata
      };
    }
  }

  /**
   * Enhanced bytecode generation with proper 64-bit immediate and instruction class handling
   */
  private instructionsToBytecodeEnhanced(instructions: AssemblyInstruction[]): Uint8Array {
    const bytecode: number[] = [];
    
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const encoded = this.encodeInstructionEnhanced(instruction);
      bytecode.push(...encoded);
      
      // Handle 64-bit immediate instructions that need two slots
      if (instruction.opcode === BPFInstruction.LOAD_IMM && instruction.size === 16) {
        // Second 8-byte slot for 64-bit immediate (upper 32 bits)
        const immediate = typeof instruction.immediate === 'bigint' ? instruction.immediate : BigInt(instruction.immediate || 0);
        const upperBytes = [
          Number((immediate >> 32n) & 0xFFn),
          Number((immediate >> 40n) & 0xFFn), 
          Number((immediate >> 48n) & 0xFFn),
          Number((immediate >> 56n) & 0xFFn),
          0, 0, 0, 0 // Reserved bytes
        ];
        bytecode.push(...upperBytes);
      }
    }
    
    return new Uint8Array(bytecode);
  }

  /**
   * Enhanced instruction encoding with proper class distinctions
   */
  private encodeInstructionEnhanced(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src = BPFRegister.R0, offset = 0, immediate = 0 } = instruction;
    
    // Get instruction class for proper encoding
    const instructionClass = this.getInstructionClass(opcode);
    
    // Handle different instruction classes
    switch (instructionClass) {
      case BPFInstructionClass.LD:
        return this.encodeLoadInstruction(instruction);
      case BPFInstructionClass.LDX:
        return this.encodeLoadIndexedInstruction(instruction);
      case BPFInstructionClass.ST:
        return this.encodeStoreInstruction(instruction);
      case BPFInstructionClass.STX:
        return this.encodeStoreIndexedInstruction(instruction);
      case BPFInstructionClass.ALU:
        return this.encodeALU32Instruction(instruction);
      case BPFInstructionClass.ALU64:
        return this.encodeALU64Instruction(instruction);
      case BPFInstructionClass.JMP:
      case BPFInstructionClass.JMP32:
        return this.encodeJumpInstruction(instruction);
      default:
        return this.encodeLegacyInstruction(instruction);
    }
  }

  /**
   * Encode load instructions (class 0x00)
   */
  private encodeLoadInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, immediate = 0 } = instruction;
    
    if (opcode === BPFInstruction.LOAD_IMM) {
      // Handle 64-bit immediate loads
      const value = typeof immediate === 'bigint' ? immediate : BigInt(immediate);
      return [
        opcode,
        dst & 0xf,
        0, 0, // offset unused for immediate loads
        Number(value & 0xFFn),
        Number((value >> 8n) & 0xFFn),
        Number((value >> 16n) & 0xFFn),
        Number((value >> 24n) & 0xFFn)
      ];
    }
    
    return this.encodeLegacyInstruction(instruction);
  }

  /**
   * Encode load indexed instructions (class 0x01)
   */
  private encodeLoadIndexedInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src = BPFRegister.R0, offset = 0 } = instruction;
    
    return [
      opcode,
      (dst & 0xf) | ((src & 0xf) << 4),
      offset & 0xff,
      (offset >> 8) & 0xff,
      0, 0, 0, 0 // immediate unused
    ];
  }

  /**
   * Encode store instructions (class 0x02)
   */
  private encodeStoreInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, offset = 0, immediate = 0 } = instruction;
    
    return [
      opcode,
      dst & 0xf,
      offset & 0xff,
      (offset >> 8) & 0xff,
      immediate & 0xff,
      (immediate >> 8) & 0xff,
      (immediate >> 16) & 0xff,
      (immediate >> 24) & 0xff
    ];
  }

  /**
   * Encode store indexed instructions (class 0x03)
   */
  private encodeStoreIndexedInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src = BPFRegister.R0, offset = 0 } = instruction;
    
    return [
      opcode,
      (dst & 0xf) | ((src & 0xf) << 4),
      offset & 0xff,
      (offset >> 8) & 0xff,
      0, 0, 0, 0 // immediate unused
    ];
  }

  /**
   * Encode 32-bit ALU instructions (class 0x04)
   */
  private encodeALU32Instruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src, immediate } = instruction;
    
    if (src !== undefined) {
      // Register-to-register operation
      return [
        opcode | 0x08, // Set source bit for register operations
        (dst & 0xf) | ((src & 0xf) << 4),
        0, 0, // offset unused
        0, 0, 0, 0 // immediate unused
      ];
    } else {
      // Immediate operation
      return [
        opcode,
        dst & 0xf,
        0, 0, // offset unused
        (immediate || 0) & 0xff,
        ((immediate || 0) >> 8) & 0xff,
        ((immediate || 0) >> 16) & 0xff,
        ((immediate || 0) >> 24) & 0xff
      ];
    }
  }

  /**
   * Encode 64-bit ALU instructions (class 0x07)
   */
  private encodeALU64Instruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src, immediate } = instruction;
    
    if (src !== undefined) {
      // Register-to-register operation
      return [
        opcode | 0x08, // Set source bit for register operations
        (dst & 0xf) | ((src & 0xf) << 4),
        0, 0, // offset unused
        0, 0, 0, 0 // immediate unused
      ];
    } else {
      // Immediate operation
      return [
        opcode,
        dst & 0xf,
        0, 0, // offset unused
        (immediate || 0) & 0xff,
        ((immediate || 0) >> 8) & 0xff,
        ((immediate || 0) >> 16) & 0xff,
        ((immediate || 0) >> 24) & 0xff
      ];
    }
  }

  /**
   * Encode jump instructions (class 0x05/0x06)
   */
  private encodeJumpInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src, offset = 0, immediate } = instruction;
    
    if (opcode === BPFInstruction.JUMP) {
      // Unconditional jump
      return [
        opcode,
        0, // registers unused
        offset & 0xff,
        (offset >> 8) & 0xff,
        0, 0, 0, 0 // immediate unused
      ];
    } else if (opcode === BPFInstruction.CALL) {
      // Function call
      return [
        opcode,
        0, // registers unused
        0, 0, // offset unused
        (immediate || 0) & 0xff,
        ((immediate || 0) >> 8) & 0xff,
        ((immediate || 0) >> 16) & 0xff,
        ((immediate || 0) >> 24) & 0xff
      ];
    } else if (opcode === BPFInstruction.EXIT) {
      // Program exit
      return [
        opcode,
        0, // registers unused
        0, 0, // offset unused
        0, 0, 0, 0 // immediate unused
      ];
    } else {
      // Conditional jump
      if (src !== undefined) {
        // Register comparison
        return [
          opcode | 0x08, // Set source bit for register operations
          (dst & 0xf) | ((src & 0xf) << 4),
          offset & 0xff,
          (offset >> 8) & 0xff,
          0, 0, 0, 0 // immediate unused
        ];
      } else {
        // Immediate comparison
        return [
          opcode,
          dst & 0xf,
          offset & 0xff,
          (offset >> 8) & 0xff,
          (immediate || 0) & 0xff,
          ((immediate || 0) >> 8) & 0xff,
          ((immediate || 0) >> 16) & 0xff,
          ((immediate || 0) >> 24) & 0xff
        ];
      }
    }
  }

  /**
   * Legacy instruction encoding for backward compatibility
   */
  private encodeLegacyInstruction(instruction: AssemblyInstruction): number[] {
    const { opcode, dst, src = BPFRegister.R0, offset = 0, immediate = 0 } = instruction;
    
    return [
      opcode,
      (dst & 0xf) | ((src & 0xf) << 4),
      offset & 0xff,
      (offset >> 8) & 0xff,
      immediate & 0xff,
      (immediate >> 8) & 0xff,
      (immediate >> 16) & 0xff,
      (immediate >> 24) & 0xff
    ];
  }

  /**
   * Get instruction class from opcode
   */
  private getInstructionClass(opcode: BPFInstruction): BPFInstructionClass {
    return (opcode & 0x07) as BPFInstructionClass;
  }

  /**
   * Convert instructions to human-readable assembly
   */
  private instructionsToAssembly(instructions: AssemblyInstruction[]): string {
    const lines: string[] = [];
    
    instructions.forEach((instruction, index) => {
      const line = this.instructionToAssemblyLineEnhanced(instruction, index);
      lines.push(line);
    });
    
    return lines.join('\n');
  }

  /**
   * Enhanced assembly line generation with proper mnemonics
   */
  private instructionToAssemblyLineEnhanced(instruction: AssemblyInstruction, index: number): string {
    const { opcode, dst, src, offset, immediate, comment } = instruction;
    
    let line = `${index.toString().padStart(4, '0')}: `;
    
    // Convert opcode to proper mnemonic
    const mnemonic = this.opcodeToMnemonicEnhanced(opcode);
    line += mnemonic.padEnd(8);
    
    // Add operands based on instruction class and type
    const instructionClass = this.getInstructionClass(opcode);
    
    switch (instructionClass) {
      case BPFInstructionClass.LD:
      case BPFInstructionClass.LDX:
        if (opcode === BPFInstruction.LOAD_IMM) {
          const value = typeof immediate === 'bigint' ? immediate.toString() : (immediate || 0).toString();
          line += `r${dst}, ${value}`;
        } else if (src !== undefined && offset !== undefined) {
          line += `r${dst}, [r${src}${offset >= 0 ? '+' : ''}${offset}]`;
        }
        break;
        
      case BPFInstructionClass.ST:
      case BPFInstructionClass.STX:
        if (src !== undefined) {
          line += `[r${dst}${offset >= 0 ? '+' : ''}${offset || 0}], r${src}`;
        } else {
          line += `[r${dst}${offset >= 0 ? '+' : ''}${offset || 0}], ${immediate || 0}`;
        }
        break;
        
      case BPFInstructionClass.ALU:
      case BPFInstructionClass.ALU64:
        if (src !== undefined) {
          line += `r${dst}, r${src}`;
        } else {
          line += `r${dst}, ${immediate || 0}`;
        }
        break;
        
      case BPFInstructionClass.JMP:
      case BPFInstructionClass.JMP32:
        if (opcode === BPFInstruction.CALL) {
          line += `${immediate || 0}`;
        } else if (opcode === BPFInstruction.EXIT) {
          line += 'r0';
        } else if (opcode === BPFInstruction.JUMP) {
          line += `${offset || 0}`;
        } else {
          // Conditional jump
          if (src !== undefined) {
            line += `r${dst}, r${src}, ${offset || 0}`;
          } else {
            line += `r${dst}, ${immediate || 0}, ${offset || 0}`;
          }
        }
        break;
    }
    
    // Add comment if present
    if (comment) {
      line += ` ; ${comment}`;
    }
    
    return line;
  }

  /**
   * Enhanced opcode to mnemonic conversion
   */
  private opcodeToMnemonicEnhanced(opcode: BPFInstruction): string {
    const mnemonics: { [key: number]: string } = {
      // Load instructions
      [BPFInstruction.LOAD_IMM]: 'lddw',
      [BPFInstruction.LOAD_ABS]: 'ldabs',
      [BPFInstruction.LOAD_IND]: 'ldind', 
      [BPFInstruction.LOAD_MEM]: 'ldx',
      [BPFInstruction.LOAD_MEMSX]: 'ldxs',
      
      // Store instructions
      [BPFInstruction.STORE_IMM]: 'st',
      [BPFInstruction.STORE_MEM]: 'stx',
      
      // 64-bit ALU
      [BPFInstruction.ADD64]: 'add64',
      [BPFInstruction.SUB64]: 'sub64',
      [BPFInstruction.MUL64]: 'mul64',
      [BPFInstruction.DIV64]: 'div64',
      [BPFInstruction.OR64]: 'or64',
      [BPFInstruction.AND64]: 'and64',
      [BPFInstruction.LSH64]: 'lsh64',
      [BPFInstruction.RSH64]: 'rsh64',
      [BPFInstruction.NEG64]: 'neg64',
      [BPFInstruction.MOD64]: 'mod64',
      [BPFInstruction.XOR64]: 'xor64',
      [BPFInstruction.ARSH64]: 'arsh64',
      
      // 32-bit ALU
      [BPFInstruction.ADD32]: 'add32',
      [BPFInstruction.SUB32]: 'sub32',
      [BPFInstruction.MUL32]: 'mul32',
      [BPFInstruction.DIV32]: 'div32',
      [BPFInstruction.OR32]: 'or32',
      [BPFInstruction.AND32]: 'and32',
      [BPFInstruction.LSH32]: 'lsh32',
      [BPFInstruction.RSH32]: 'rsh32',
      [BPFInstruction.NEG32]: 'neg32',
      [BPFInstruction.MOD32]: 'mod32',
      [BPFInstruction.XOR32]: 'xor32',
      [BPFInstruction.ARSH32]: 'arsh32',
      
      // Jump instructions
      [BPFInstruction.JUMP]: 'ja',
      [BPFInstruction.JUMP_EQ]: 'jeq',
      [BPFInstruction.JUMP_GT]: 'jgt',
      [BPFInstruction.JUMP_GE]: 'jge',
      [BPFInstruction.JUMP_SET]: 'jset',
      [BPFInstruction.JUMP_NE]: 'jne',
      [BPFInstruction.JUMP_SGT]: 'jsgt',
      [BPFInstruction.JUMP_SGE]: 'jsge',
      [BPFInstruction.JUMP_LT]: 'jlt',
      [BPFInstruction.JUMP_LE]: 'jle',
      [BPFInstruction.JUMP_SLT]: 'jslt',
      [BPFInstruction.JUMP_SLE]: 'jsle',
      
      // 32-bit jumps
      [BPFInstruction.JUMP32_EQ]: 'jeq32',
      [BPFInstruction.JUMP32_GT]: 'jgt32',
      [BPFInstruction.JUMP32_GE]: 'jge32',
      [BPFInstruction.JUMP32_SET]: 'jset32',
      [BPFInstruction.JUMP32_NE]: 'jne32',
      [BPFInstruction.JUMP32_SGT]: 'jsgt32',
      [BPFInstruction.JUMP32_SGE]: 'jsge32',
      [BPFInstruction.JUMP32_LT]: 'jlt32',
      [BPFInstruction.JUMP32_LE]: 'jle32',
      [BPFInstruction.JUMP32_SLT]: 'jslt32',
      [BPFInstruction.JUMP32_SLE]: 'jsle32',
      
      // Function calls
      [BPFInstruction.CALL]: 'call',
      [BPFInstruction.EXIT]: 'exit',
      
      // Legacy mappings
      [BPFInstruction.ADD]: 'add',
      [BPFInstruction.SUB]: 'sub',
      [BPFInstruction.MUL]: 'mul',
      [BPFInstruction.DIV]: 'div',
      [BPFInstruction.MOD]: 'mod',
      [BPFInstruction.LOAD]: 'ldx',
      [BPFInstruction.STORE]: 'stx',
      [BPFInstruction.AND]: 'and',
      [BPFInstruction.OR]: 'or',
      [BPFInstruction.XOR]: 'xor',
      [BPFInstruction.LSH]: 'lsh',
      [BPFInstruction.RSH]: 'rsh',
      [BPFInstruction.NEG]: 'neg'
    };
    
    return mnemonics[opcode] || 'unknown';
  }

  /**
   * Advanced optimization with peephole and DCE passes
   */
  optimizeAdvanced(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    let optimized = [...instructions];
    
    // Run multiple optimization passes
    optimized = this.deadCodeElimination(optimized);
    optimized = this.peepholeOptimization(optimized);
    optimized = this.constantFolding(optimized);
    optimized = this.redundantMoveElimination(optimized);
    
    return optimized;
  }

  /**
   * Dead code elimination (DCE) pass
   */
  private deadCodeElimination(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized: AssemblyInstruction[] = [];
    const reachable = new Set<number>();
    
    // Mark reachable instructions starting from entry point
    this.markReachable(instructions, 0, reachable);
    
    // Include only reachable instructions
    for (let i = 0; i < instructions.length; i++) {
      if (reachable.has(i)) {
        optimized.push(instructions[i]);
      }
    }
    
    return optimized;
  }

  /**
   * Mark reachable instructions for DCE
   */
  private markReachable(instructions: AssemblyInstruction[], index: number, reachable: Set<number>): void {
    if (index < 0 || index >= instructions.length || reachable.has(index)) {
      return;
    }
    
    reachable.add(index);
    const instr = instructions[index];
    
    // Handle control flow
    if (instr.opcode === BPFInstruction.EXIT) {
      return; // No further reachable code
    } else if (instr.opcode === BPFInstruction.JUMP) {
      // Unconditional jump
      this.markReachable(instructions, index + 1 + (instr.offset || 0), reachable);
    } else if (this.isConditionalJump(instr.opcode)) {
      // Conditional jump - both paths reachable
      this.markReachable(instructions, index + 1, reachable); // Fall through
      this.markReachable(instructions, index + 1 + (instr.offset || 0), reachable); // Jump target
    } else {
      // Linear execution
      this.markReachable(instructions, index + 1, reachable);
    }
  }

  /**
   * Peephole optimization pass
   */
  private peepholeOptimization(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized = [...instructions];
    
    for (let i = 0; i < optimized.length - 1; i++) {
      const current = optimized[i];
      const next = optimized[i + 1];
      
      // Remove redundant moves (mov r1, r1)
      if (current.opcode === BPFInstruction.LOAD_MEM &&
          current.dst === current.src &&
          current.offset === 0) {
        optimized.splice(i, 1);
        i--;
        continue;
      }
      
      // Optimize add r1, 0 -> nop
      if ((current.opcode === BPFInstruction.ADD64 || current.opcode === BPFInstruction.ADD32) &&
          current.immediate === 0) {
        optimized.splice(i, 1);
        i--;
        continue;
      }
      
      // Optimize mul r1, 1 -> nop
      if ((current.opcode === BPFInstruction.MUL64 || current.opcode === BPFInstruction.MUL32) &&
          current.immediate === 1) {
        optimized.splice(i, 1);
        i--;
        continue;
      }
      
      // Optimize double negation
      if (current.opcode === BPFInstruction.NEG64 && next.opcode === BPFInstruction.NEG64 &&
          current.dst === next.dst) {
        optimized.splice(i, 2);
        i--;
        continue;
      }
    }
    
    return optimized;
  }

  /**
   * Constant folding optimization
   */
  private constantFolding(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized = [...instructions];
    
    for (let i = 0; i < optimized.length; i++) {
      const instr = optimized[i];
      
      // Fold constants in immediate arithmetic operations
      if (instr.immediate !== undefined) {
        switch (instr.opcode) {
          case BPFInstruction.ADD64:
          case BPFInstruction.ADD32:
            if (instr.immediate === 0) {
              // Add 0 is a no-op, remove it
              optimized.splice(i, 1);
              i--;
            }
            break;
            
          case BPFInstruction.MUL64:
          case BPFInstruction.MUL32:
            if (instr.immediate === 0) {
              // Multiply by 0, replace with load immediate 0
              optimized[i] = {
                opcode: BPFInstruction.LOAD_IMM,
                dst: instr.dst,
                immediate: 0,
                comment: 'Optimized: mul by 0'
              };
            } else if (instr.immediate === 1) {
              // Multiply by 1 is a no-op
              optimized.splice(i, 1);
              i--;
            }
            break;
        }
      }
    }
    
    return optimized;
  }

  /**
   * Redundant move elimination
   */
  private redundantMoveElimination(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized = [...instructions];
    
    for (let i = 0; i < optimized.length - 1; i++) {
      const current = optimized[i];
      const next = optimized[i + 1];
      
      // Remove redundant register copies
      if (current.opcode === BPFInstruction.LOAD_MEM && 
          next.opcode === BPFInstruction.LOAD_MEM &&
          current.dst === next.src &&
          next.dst === current.src &&
          current.offset === 0 && next.offset === 0) {
        // This is a register swap pattern, keep only one move
        optimized.splice(i + 1, 1);
      }
    }
    
    return optimized;
  }

  /**
   * Check if opcode is a conditional jump
   */
  private isConditionalJump(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.JUMP_EQ, BPFInstruction.JUMP_NE, BPFInstruction.JUMP_GT, BPFInstruction.JUMP_GE,
      BPFInstruction.JUMP_LT, BPFInstruction.JUMP_LE, BPFInstruction.JUMP_SGT, BPFInstruction.JUMP_SGE,
      BPFInstruction.JUMP_SLT, BPFInstruction.JUMP_SLE, BPFInstruction.JUMP_SET,
      BPFInstruction.JUMP32_EQ, BPFInstruction.JUMP32_NE, BPFInstruction.JUMP32_GT, BPFInstruction.JUMP32_GE,
      BPFInstruction.JUMP32_LT, BPFInstruction.JUMP32_LE, BPFInstruction.JUMP32_SGT, BPFInstruction.JUMP32_SGE,
      BPFInstruction.JUMP32_SLT, BPFInstruction.JUMP32_SLE, BPFInstruction.JUMP32_SET
    ].includes(opcode);
  }

  /**
   * Calculate estimated compute units with enhanced accuracy
   */
  estimateComputeUnitsEnhanced(instructions: AssemblyInstruction[]): number {
    let units = 0;
    
    for (const instruction of instructions) {
      const instructionClass = this.getInstructionClass(instruction.opcode);
      
      switch (instructionClass) {
        case BPFInstructionClass.LD:
        case BPFInstructionClass.LDX:
          if (instruction.opcode === BPFInstruction.LOAD_IMM) {
            units += 1; // Immediate load is fast
          } else {
            units += 3; // Memory load is more expensive
          }
          break;
          
        case BPFInstructionClass.ST:
        case BPFInstructionClass.STX:
          units += 2; // Store operations
          break;
          
        case BPFInstructionClass.ALU:
          units += 1; // 32-bit operations are fast
          break;
          
        case BPFInstructionClass.ALU64:
          units += 2; // 64-bit operations cost more
          break;
          
        case BPFInstructionClass.JMP:
        case BPFInstructionClass.JMP32:
          if (instruction.opcode === BPFInstruction.CALL) {
            units += 100; // Syscalls are very expensive
          } else if (instruction.opcode === BPFInstruction.EXIT) {
            units += 1;
          } else {
            units += 2; // Jump operations
          }
          break;
          
        default:
          units += 1;
          break;
      }
      
      // Add extra cost for division/modulo operations
      if ([BPFInstruction.DIV64, BPFInstruction.MOD64, BPFInstruction.DIV32, BPFInstruction.MOD32].includes(instruction.opcode)) {
        units += 10;
      }
    }
    
    return units;
  }

  /**
   * Backward compatibility method
   */
  estimateComputeUnits(instructions: AssemblyInstruction[]): number {
    return this.estimateComputeUnitsEnhanced(instructions);
  }

  /**
   * Backward compatibility method
   */
  optimize(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    return this.optimizeAdvanced(instructions);
  }

  /**
   * Create program prologue with enhanced register setup
   */
  createPrologueEnhanced(): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R6,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load first account info'
      },
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R7,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load instruction data'
      },
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R8,
        src: BPFRegister.R1,
        offset: 16,
        comment: 'Load program ID'
      }
    ];
  }

  /**
   * Create program epilogue with enhanced cleanup
   */
  createEpilogueEnhanced(returnValue: number = 0): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: returnValue,
        comment: `Return code ${returnValue}`
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];
  }
}
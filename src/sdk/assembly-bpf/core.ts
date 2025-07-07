/**
 * BPF assembler and code generation
 */

import { 
  BPFProgramConfig,
  BPFProgramMetadata,
  BPFCompilationResult,
  AssemblyInstruction,
  BPFInstruction,
  BPFRegister
} from './types';

/**
 * BPF assembler for converting assembly instructions to bytecode
 */
export class BPFAssembler {
  private config: BPFProgramConfig;

  constructor(config: BPFProgramConfig) {
    this.config = config;
  }

  /**
   * Assemble instructions into BPF bytecode
   */
  async assemble(instructions: AssemblyInstruction[], metadata: BPFProgramMetadata): Promise<BPFCompilationResult> {
    try {
      const bytecode = this.instructionsToBytecode(instructions);
      const assembly = this.instructionsToAssembly(instructions);
      
      const warnings = this.validateInstructions(instructions);
      
      return {
        success: true,
        bytecode,
        assembly,
        warnings: warnings.length > 0 ? warnings : undefined,
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
   * Convert instructions to BPF bytecode
   */
  private instructionsToBytecode(instructions: AssemblyInstruction[]): Uint8Array {
    const bytecode: number[] = [];
    
    for (const instruction of instructions) {
      const encoded = this.encodeInstruction(instruction);
      bytecode.push(...encoded);
    }
    
    return new Uint8Array(bytecode);
  }

  /**
   * Convert instructions to human-readable assembly
   */
  private instructionsToAssembly(instructions: AssemblyInstruction[]): string {
    const lines: string[] = [];
    
    instructions.forEach((instruction, index) => {
      const line = this.instructionToAssemblyLine(instruction, index);
      lines.push(line);
    });
    
    return lines.join('\n');
  }

  /**
   * Encode a single instruction to BPF bytecode
   */
  private encodeInstruction(instruction: AssemblyInstruction): number[] {
    // BPF instruction format: [opcode, dst_reg, src_reg, offset, immediate]
    // This is a simplified encoding - real BPF encoding is more complex
    
    const { opcode, dst, src = BPFRegister.R0, offset = 0, immediate = 0 } = instruction;
    
    // 8-byte BPF instruction format
    const bytes = [
      opcode,                    // opcode
      (dst & 0xf) | ((src & 0xf) << 4), // registers
      (offset & 0xff),           // offset low byte
      (offset >> 8) & 0xff,      // offset high byte
      immediate & 0xff,          // immediate bytes 0-3
      (immediate >> 8) & 0xff,
      (immediate >> 16) & 0xff,
      (immediate >> 24) & 0xff
    ];
    
    return bytes;
  }

  /**
   * Convert instruction to assembly line
   */
  private instructionToAssemblyLine(instruction: AssemblyInstruction, index: number): string {
    const { opcode, dst, src, offset, immediate, comment } = instruction;
    
    let line = `${index.toString().padStart(4, '0')}: `;
    
    // Convert opcode to mnemonic
    const mnemonic = this.opcodeToMnemonic(opcode);
    line += mnemonic.padEnd(8);
    
    // Add operands based on instruction type
    if (opcode === BPFInstruction.LOAD_IMM) {
      line += `r${dst}, ${immediate}`;
    } else if (opcode === BPFInstruction.LOAD || opcode === BPFInstruction.STORE) {
      if (src !== undefined && offset !== undefined) {
        line += `r${dst}, [r${src}${offset >= 0 ? '+' : ''}${offset}]`;
      }
    } else if (opcode === BPFInstruction.CALL) {
      line += `${immediate}`;
    } else if (opcode === BPFInstruction.EXIT) {
      line += 'r0';
    } else if (this.isJumpInstruction(opcode)) {
      if (src !== undefined) {
        line += `r${dst}, r${src}, ${offset}`;
      } else if (immediate !== undefined) {
        line += `r${dst}, ${immediate}, ${offset}`;
      }
    } else {
      // Arithmetic/logical operations
      if (src !== undefined) {
        line += `r${dst}, r${src}`;
      } else if (immediate !== undefined) {
        line += `r${dst}, ${immediate}`;
      }
    }
    
    // Add comment if present
    if (comment) {
      line += ` ; ${comment}`;
    }
    
    return line;
  }

  /**
   * Convert opcode to assembly mnemonic
   */
  private opcodeToMnemonic(opcode: BPFInstruction): string {
    switch (opcode) {
      case BPFInstruction.ADD: return 'add';
      case BPFInstruction.SUB: return 'sub';
      case BPFInstruction.MUL: return 'mul';
      case BPFInstruction.DIV: return 'div';
      case BPFInstruction.MOD: return 'mod';
      case BPFInstruction.LOAD: return 'ldx';
      case BPFInstruction.STORE: return 'stx';
      case BPFInstruction.LOAD_IMM: return 'ldi';
      case BPFInstruction.JUMP: return 'jmp';
      case BPFInstruction.JUMP_EQ: return 'jeq';
      case BPFInstruction.JUMP_NE: return 'jne';
      case BPFInstruction.JUMP_GT: return 'jgt';
      case BPFInstruction.JUMP_GE: return 'jge';
      case BPFInstruction.JUMP_LT: return 'jlt';
      case BPFInstruction.JUMP_LE: return 'jle';
      case BPFInstruction.CALL: return 'call';
      case BPFInstruction.EXIT: return 'exit';
      case BPFInstruction.AND: return 'and';
      case BPFInstruction.OR: return 'or';
      case BPFInstruction.XOR: return 'xor';
      case BPFInstruction.LSH: return 'lsh';
      case BPFInstruction.RSH: return 'rsh';
      case BPFInstruction.NEG: return 'neg';
      default: return 'unknown';
    }
  }

  /**
   * Check if opcode is a jump instruction
   */
  private isJumpInstruction(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.JUMP,
      BPFInstruction.JUMP_EQ,
      BPFInstruction.JUMP_NE,
      BPFInstruction.JUMP_GT,
      BPFInstruction.JUMP_GE,
      BPFInstruction.JUMP_LT,
      BPFInstruction.JUMP_LE
    ].includes(opcode);
  }

  /**
   * Validate instructions for common issues
   */
  private validateInstructions(instructions: AssemblyInstruction[]): string[] {
    const warnings: string[] = [];
    
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      
      // Check for unreachable code after exit
      if (instruction.opcode === BPFInstruction.EXIT && i < instructions.length - 1) {
        warnings.push(`Unreachable code after exit instruction at position ${i}`);
      }
      
      // Check for missing exit instruction
      if (i === instructions.length - 1 && instruction.opcode !== BPFInstruction.EXIT) {
        warnings.push('Program should end with exit instruction');
      }
      
      // Check for invalid register usage
      if (instruction.dst > BPFRegister.R10) {
        warnings.push(`Invalid destination register r${instruction.dst} at position ${i}`);
      }
      
      if (instruction.src !== undefined && instruction.src > BPFRegister.R10) {
        warnings.push(`Invalid source register r${instruction.src} at position ${i}`);
      }
      
      // Check for stack overflow
      if (instruction.offset && Math.abs(instruction.offset) > 512) {
        warnings.push(`Large stack offset ${instruction.offset} at position ${i} may cause overflow`);
      }
    }
    
    return warnings;
  }

  /**
   * Create program prologue
   */
  createPrologue(): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R6,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load first account'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R7,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load instruction data'
      }
    ];
  }

  /**
   * Create program epilogue
   */
  createEpilogue(returnValue: number = 0): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: returnValue,
        comment: `Return ${returnValue}`
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ];
  }

  /**
   * Optimize instruction sequence
   */
  optimize(instructions: AssemblyInstruction[]): AssemblyInstruction[] {
    const optimized = [...instructions];
    
    // Remove redundant moves
    for (let i = 0; i < optimized.length - 1; i++) {
      const current = optimized[i];
      const next = optimized[i + 1];
      
      // Remove mov r1, r1 type instructions
      if (current.opcode === BPFInstruction.LOAD &&
          current.dst === current.src &&
          current.offset === 0) {
        optimized.splice(i, 1);
        i--;
      }
    }
    
    return optimized;
  }

  /**
   * Calculate instruction count
   */
  getInstructionCount(instructions: AssemblyInstruction[]): number {
    return instructions.length;
  }

  /**
   * Calculate estimated compute units
   */
  estimateComputeUnits(instructions: AssemblyInstruction[]): number {
    let units = 0;
    
    for (const instruction of instructions) {
      switch (instruction.opcode) {
        case BPFInstruction.CALL:
          units += 100; // Syscalls are expensive
          break;
        case BPFInstruction.DIV:
        case BPFInstruction.MOD:
          units += 10; // Division is expensive
          break;
        case BPFInstruction.LOAD:
        case BPFInstruction.STORE:
          units += 2; // Memory access
          break;
        default:
          units += 1; // Basic instruction
          break;
      }
    }
    
    return units;
  }
}
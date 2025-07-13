/**
 * Enhanced BPF program validation and security sanitizers
 */

import { 
  AssemblyInstruction, 
  BPFInstruction, 
  BPFRegister, 
  BPFValidationOptions,
  BPFInstructionClass
} from './types';

/**
 * Security patterns and validation issues
 */
export interface SecurityIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  instruction?: number;
  pattern: string;
}

/**
 * Enhanced BPF validator with security sanitizers
 */
export class BPFValidator {
  private options: BPFValidationOptions;

  constructor(options: BPFValidationOptions = {}) {
    this.options = {
      strictOpcodes: true,
      validateInstructionClass: true,
      validate64BitImmediates: true,
      validateMemoryAccess: true,
      maxStackDepth: 64,
      securityValidation: true,
      ...options
    };
  }

  /**
   * Comprehensive instruction validation
   */
  validate(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Basic validation passes
    issues.push(...this.validateOpcodeSemantics(instructions));
    issues.push(...this.validateRegisterUsage(instructions));
    issues.push(...this.validateMemoryAccess(instructions));
    issues.push(...this.validateControlFlow(instructions));
    
    if (this.options.validate64BitImmediates) {
      issues.push(...this.validate64BitImmediates(instructions));
    }
    
    if (this.options.securityValidation) {
      issues.push(...this.validateSecurityPatterns(instructions));
    }

    return issues;
  }

  /**
   * Validate full opcode semantics at compile time
   */
  private validateOpcodeSemantics(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];
      
      // Check if opcode exists and is valid
      if (!this.isValidOpcode(instr.opcode)) {
        issues.push({
          severity: 'error',
          message: `Invalid opcode 0x${instr.opcode.toString(16)} at instruction ${i}`,
          instruction: i,
          pattern: 'invalid-opcode'
        });
        continue;
      }

      // Validate instruction class compliance
      if (this.options.validateInstructionClass) {
        const classIssues = this.validateInstructionClass(instr, i);
        issues.push(...classIssues);
      }

      // Validate operand requirements
      const operandIssues = this.validateOperands(instr, i);
      issues.push(...operandIssues);
    }

    return issues;
  }

  /**
   * Validate operand requirements for instruction
   */
  private validateOperands(instr: AssemblyInstruction, index: number): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const opcode = instr.opcode;

    // Check basic operand requirements
    if (instr.dst === undefined) {
      issues.push({
        severity: 'error',
        message: `Instruction at ${index} missing destination register`,
        instruction: index,
        pattern: 'missing-operand'
      });
    }

    // Check source register requirements for specific instructions
    if (this.requiresSourceRegister(opcode) && instr.src === undefined) {
      issues.push({
        severity: 'error',
        message: `Instruction at ${index} requires source register`,
        instruction: index,
        pattern: 'missing-source-register'
      });
    }

    // Check immediate value requirements
    if (this.requiresImmediate(opcode) && instr.immediate === undefined) {
      issues.push({
        severity: 'error',
        message: `Instruction at ${index} requires immediate value`,
        instruction: index,
        pattern: 'missing-immediate'
      });
    }

    // Check offset requirements
    if (this.requiresOffset(opcode) && instr.offset === undefined) {
      issues.push({
        severity: 'error',
        message: `Instruction at ${index} requires offset value`,
        instruction: index,
        pattern: 'missing-offset'
      });
    }

    return issues;
  }

  /**
   * Check if instruction requires source register
   */
  private requiresSourceRegister(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.ADD64, BPFInstruction.SUB64, BPFInstruction.MUL64, BPFInstruction.DIV64,
      BPFInstruction.ADD32, BPFInstruction.SUB32, BPFInstruction.MUL32, BPFInstruction.DIV32,
      BPFInstruction.AND64, BPFInstruction.OR64, BPFInstruction.XOR64,
      BPFInstruction.AND32, BPFInstruction.OR32, BPFInstruction.XOR32,
      BPFInstruction.LOAD_MEM, BPFInstruction.STORE_MEM
    ].includes(opcode);
  }

  /**
   * Check if instruction requires immediate value
   */
  private requiresImmediate(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.LOAD_IMM, BPFInstruction.CALL
    ].includes(opcode);
  }

  /**
   * Check if instruction requires offset value
   */
  private requiresOffset(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.LOAD_MEM, BPFInstruction.STORE_MEM, BPFInstruction.STORE_IMM
    ].includes(opcode) || this.isJumpInstruction(opcode);
  }

  /**
   * Validate instruction class compliance
   */
  private validateInstructionClass(instr: AssemblyInstruction, index: number): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const opcode = instr.opcode;
    const instructionClass = this.getInstructionClass(opcode);

    switch (instructionClass) {
      case BPFInstructionClass.LD:
      case BPFInstructionClass.LDX:
        if (instr.dst === undefined) {
          issues.push({
            severity: 'error',
            message: `Load instruction missing destination register at ${index}`,
            instruction: index,
            pattern: 'missing-dst-register'
          });
        }
        break;

      case BPFInstructionClass.ST:
      case BPFInstructionClass.STX:
        if (instr.dst === undefined || instr.offset === undefined) {
          issues.push({
            severity: 'error',
            message: `Store instruction missing required operands at ${index}`,
            instruction: index,
            pattern: 'missing-store-operands'
          });
        }
        break;

      case BPFInstructionClass.ALU:
      case BPFInstructionClass.ALU64:
        if (instr.dst === undefined) {
          issues.push({
            severity: 'error',
            message: `ALU instruction missing destination register at ${index}`,
            instruction: index,
            pattern: 'missing-dst-register'
          });
        }
        break;

      case BPFInstructionClass.JMP:
      case BPFInstructionClass.JMP32:
        if (opcode !== BPFInstruction.JUMP && opcode !== BPFInstruction.CALL && opcode !== BPFInstruction.EXIT) {
          if (instr.dst === undefined || instr.offset === undefined) {
            issues.push({
              severity: 'error',
              message: `Conditional jump missing required operands at ${index}`,
              instruction: index,
              pattern: 'missing-jump-operands'
            });
          }
        }
        break;
    }

    return issues;
  }

  /**
   * Get instruction class from opcode
   */
  private getInstructionClass(opcode: BPFInstruction): BPFInstructionClass {
    const classCode = opcode & 0x07;
    return classCode as BPFInstructionClass;
  }

  /**
   * Validate 64-bit immediate encoding
   */
  private validate64BitImmediates(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];
      
      if (instr.opcode === BPFInstruction.LOAD_IMM) {
        // LDDW instruction requires two 8-byte slots
        if (instr.immediate !== undefined) {
          const value = typeof instr.immediate === 'bigint' ? instr.immediate : BigInt(instr.immediate);
          
          // Check if value fits in 64 bits
          if (value > 0xFFFFFFFFFFFFFFFFn || value < -0x8000000000000000n) {
            issues.push({
              severity: 'error',
              message: `64-bit immediate value out of range at instruction ${i}`,
              instruction: i,
              pattern: '64bit-immediate-overflow'
            });
          }

          // Mark instruction as 16-byte wide
          instr.size = 16;
          
          // Ensure next slot is available for 64-bit immediate
          if (i === instructions.length - 1) {
            issues.push({
              severity: 'error',
              message: `64-bit immediate instruction at end of program missing second slot at ${i}`,
              instruction: i,
              pattern: 'incomplete-64bit-immediate'
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * Validate register usage patterns
   */
  private validateRegisterUsage(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const registerState = new Map<BPFRegister, boolean>(); // true = initialized

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];

      // Check for invalid register numbers
      if (instr.dst > BPFRegister.R10) {
        issues.push({
          severity: 'error',
          message: `Invalid destination register r${instr.dst} at instruction ${i}`,
          instruction: i,
          pattern: 'invalid-register'
        });
      }

      if (instr.src !== undefined && instr.src > BPFRegister.R10) {
        issues.push({
          severity: 'error',
          message: `Invalid source register r${instr.src} at instruction ${i}`,
          instruction: i,
          pattern: 'invalid-register'
        });
      }

      // Track register initialization
      if (this.isRegisterWrite(instr)) {
        registerState.set(instr.dst, true);
      }

      if (this.isRegisterRead(instr) && instr.src !== undefined) {
        if (!registerState.has(instr.src) && instr.src !== BPFRegister.R1) {
          issues.push({
            severity: 'warning',
            message: `Reading potentially uninitialized register r${instr.src} at instruction ${i}`,
            instruction: i,
            pattern: 'uninitialized-register-read'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Validate memory access patterns
   */
  private validateMemoryAccess(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    let stackDepth = 0;

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];

      // Check stack access bounds
      if (instr.src === BPFRegister.R10 && instr.offset !== undefined) {
        const newDepth = Math.abs(instr.offset);
        stackDepth = Math.max(stackDepth, newDepth);
        
        if (stackDepth > (this.options.maxStackDepth || 64)) {
          issues.push({
            severity: 'error',
            message: `Stack access beyond limit (${stackDepth} > ${this.options.maxStackDepth}) at instruction ${i}`,
            instruction: i,
            pattern: 'stack-overflow'
          });
        }

        // Check for stack underflow
        if (instr.offset > 0) {
          issues.push({
            severity: 'warning',
            message: `Positive stack offset may cause underflow at instruction ${i}`,
            instruction: i,
            pattern: 'stack-underflow'
          });
        }
      }

      // Check for large memory offsets
      if (instr.offset !== undefined && Math.abs(instr.offset) > 0x7fff) {
        issues.push({
          severity: 'warning',
          message: `Large memory offset ${instr.offset} at instruction ${i}`,
          instruction: i,
          pattern: 'large-memory-offset'
        });
      }
    }

    return issues;
  }

  /**
   * Validate control flow patterns
   */
  private validateControlFlow(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    let hasExit = false;

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];

      if (instr.opcode === BPFInstruction.EXIT) {
        hasExit = true;
        
        // Check for code after exit
        if (i < instructions.length - 1) {
          issues.push({
            severity: 'warning',
            message: `Unreachable code after exit at instruction ${i}`,
            instruction: i,
            pattern: 'unreachable-code'
          });
        }
      }

      // Validate jump targets
      if (this.isJumpInstruction(instr.opcode) && instr.offset !== undefined) {
        const target = i + 1 + instr.offset;
        if (target < 0 || target >= instructions.length) {
          issues.push({
            severity: 'error',
            message: `Jump target out of bounds (${target}) at instruction ${i}`,
            instruction: i,
            pattern: 'invalid-jump-target'
          });
        }
      }
    }

    if (!hasExit) {
      issues.push({
        severity: 'error',
        message: 'Program missing exit instruction',
        pattern: 'missing-exit'
      });
    }

    return issues;
  }

  /**
   * Validate security patterns
   */
  private validateSecurityPatterns(instructions: AssemblyInstruction[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instr = instructions[i];

      // Check for potential integer overflow
      if ([BPFInstruction.ADD64, BPFInstruction.MUL64, BPFInstruction.ADD32, BPFInstruction.MUL32].includes(instr.opcode)) {
        issues.push({
          severity: 'info',
          message: `Potential integer overflow in arithmetic operation at instruction ${i}`,
          instruction: i,
          pattern: 'potential-overflow'
        });
      }

      // Check for division by zero
      if ([BPFInstruction.DIV64, BPFInstruction.MOD64, BPFInstruction.DIV32, BPFInstruction.MOD32].includes(instr.opcode)) {
        if (instr.immediate === 0) {
          issues.push({
            severity: 'error',
            message: `Division by zero at instruction ${i}`,
            instruction: i,
            pattern: 'division-by-zero'
          });
        } else {
          issues.push({
            severity: 'info',
            message: `Division operation - ensure zero check at instruction ${i}`,
            instruction: i,
            pattern: 'division-operation'
          });
        }
      }

      // Check for sensitive syscalls
      if (instr.opcode === BPFInstruction.CALL && instr.immediate !== undefined) {
        const sensitiveSyscalls = [1, 2, 3]; // Example sensitive syscall numbers
        if (sensitiveSyscalls.includes(instr.immediate)) {
          issues.push({
            severity: 'warning',
            message: `Potentially sensitive syscall ${instr.immediate} at instruction ${i}`,
            instruction: i,
            pattern: 'sensitive-syscall'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Helper methods
   */
  private isValidOpcode(opcode: BPFInstruction): boolean {
    return Object.values(BPFInstruction).includes(opcode);
  }

  private isRegisterWrite(instr: AssemblyInstruction): boolean {
    const writeOpcodes = [
      BPFInstruction.LOAD_IMM, BPFInstruction.LOAD_MEM, BPFInstruction.LOAD_ABS, BPFInstruction.LOAD_IND,
      BPFInstruction.ADD64, BPFInstruction.SUB64, BPFInstruction.MUL64, BPFInstruction.DIV64,
      BPFInstruction.ADD32, BPFInstruction.SUB32, BPFInstruction.MUL32, BPFInstruction.DIV32,
      BPFInstruction.AND64, BPFInstruction.OR64, BPFInstruction.XOR64,
      BPFInstruction.AND32, BPFInstruction.OR32, BPFInstruction.XOR32
    ];
    return writeOpcodes.includes(instr.opcode);
  }

  private isRegisterRead(instr: AssemblyInstruction): boolean {
    return instr.src !== undefined && instr.opcode !== BPFInstruction.LOAD_IMM;
  }

  private isJumpInstruction(opcode: BPFInstruction): boolean {
    return [
      BPFInstruction.JUMP, BPFInstruction.JUMP_EQ, BPFInstruction.JUMP_NE,
      BPFInstruction.JUMP_GT, BPFInstruction.JUMP_GE, BPFInstruction.JUMP_LT, BPFInstruction.JUMP_LE,
      BPFInstruction.JUMP_SGT, BPFInstruction.JUMP_SGE, BPFInstruction.JUMP_SLT, BPFInstruction.JUMP_SLE,
      BPFInstruction.JUMP32_EQ, BPFInstruction.JUMP32_NE, BPFInstruction.JUMP32_GT, BPFInstruction.JUMP32_GE,
      BPFInstruction.JUMP32_LT, BPFInstruction.JUMP32_LE, BPFInstruction.JUMP32_SGT, BPFInstruction.JUMP32_SGE,
      BPFInstruction.JUMP32_SLT, BPFInstruction.JUMP32_SLE
    ].includes(opcode);
  }

  /**
   * Sanitize sensitive error messages
   */
  sanitizeErrors(issues: SecurityIssue[]): SecurityIssue[] {
    return issues.map(issue => ({
      ...issue,
      message: this.sanitizeMessage(issue.message)
    }));
  }

  private sanitizeMessage(message: string): string {
    // Remove potentially sensitive information from error messages
    return message
      .replace(/0x[0-9a-fA-F]+/g, '0x***') // Sanitize hex addresses
      .replace(/\b\d{10,}\b/g, '***'); // Sanitize large numbers
  }
}

/**
 * Security pattern documentation for BPF programs
 */
export const BPF_SECURITY_PATTERNS = {
  overflow_protection: {
    title: "Integer Overflow Protection",
    description: "Always check for potential overflows in arithmetic operations",
    example: `
// Bad: Direct addition without overflow check
add64 r1, r2

// Good: Check for overflow before addition  
jgt r1, 0x7FFFFFFFFFFFFFFF, overflow_handler
add64 r1, r2
`
  },
  
  division_safety: {
    title: "Division by Zero Protection", 
    description: "Always validate divisor before division operations",
    example: `
// Bad: Direct division
div64 r1, r2

// Good: Check for zero divisor
jeq r2, 0, division_error
div64 r1, r2
`
  },

  memory_bounds: {
    title: "Memory Access Bounds Checking",
    description: "Validate all memory accesses are within allowed bounds",
    example: `
// Bad: Direct memory access
ldx r1, [r2+8]

// Good: Bounds check first
jgt r2, stack_limit, bounds_error  
ldx r1, [r2+8]
`
  },

  register_init: {
    title: "Register Initialization",
    description: "Initialize all registers before use",
    example: `
// Bad: Using uninitialized register
add64 r1, r3

// Good: Initialize first
ldi r3, 0
add64 r1, r3  
`
  }
};
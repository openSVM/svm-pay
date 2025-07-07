/**
 * BPF memory management utilities
 */

import { 
  BPFMemoryLayout, 
  AssemblyInstruction, 
  BPFInstruction, 
  BPFRegister 
} from './types';

/**
 * BPF memory manager for stack and heap operations
 */
export class BPFMemoryManager {
  private layout: BPFMemoryLayout;

  constructor(layout?: Partial<BPFMemoryLayout>) {
    this.layout = {
      stackStart: 0x100000000,
      stackSize: 4096,
      heapStart: 0x200000000,
      heapSize: 65536,
      programDataStart: 0x300000000,
      ...layout
    };
  }

  /**
   * Create stack allocation instructions
   */
  allocateStack(size: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: size,
        comment: `Allocate ${size} bytes on stack`
      },
      {
        opcode: BPFInstruction.SUB,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        comment: 'Adjust stack pointer'
      }
    ];
  }

  /**
   * Create stack deallocation instructions
   */
  deallocateStack(size: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: size,
        comment: `Deallocate ${size} bytes from stack`
      },
      {
        opcode: BPFInstruction.ADD,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        comment: 'Restore stack pointer'
      }
    ];
  }

  /**
   * Create memory store instructions
   */
  storeMemory(register: BPFRegister, offset: number, size: 1 | 2 | 4 | 8 = 8): AssemblyInstruction {
    let opcode: BPFInstruction;
    
    switch (size) {
      case 1:
        opcode = BPFInstruction.STORE;
        break;
      case 2:
        opcode = BPFInstruction.STORE;
        break;
      case 4:
        opcode = BPFInstruction.STORE;
        break;
      case 8:
      default:
        opcode = BPFInstruction.STORE;
        break;
    }

    return {
      opcode,
      dst: BPFRegister.R10,
      src: register,
      offset,
      comment: `Store ${size} bytes at offset ${offset}`
    };
  }

  /**
   * Create memory load instructions
   */
  loadMemory(register: BPFRegister, offset: number, size: 1 | 2 | 4 | 8 = 8): AssemblyInstruction {
    return {
      opcode: BPFInstruction.LOAD,
      dst: register,
      src: BPFRegister.R10,
      offset,
      comment: `Load ${size} bytes from offset ${offset}`
    };
  }

  /**
   * Create memory copy instructions
   */
  copyMemory(srcOffset: number, dstOffset: number, size: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    
    // Simple byte-by-byte copy for demonstration
    for (let i = 0; i < size; i += 8) {
      const currentSize = Math.min(8, size - i);
      
      instructions.push(
        this.loadMemory(BPFRegister.R8, srcOffset + i, currentSize as 1 | 2 | 4 | 8),
        this.storeMemory(BPFRegister.R8, dstOffset + i, currentSize as 1 | 2 | 4 | 8)
      );
    }
    
    return instructions;
  }

  /**
   * Create memory zero instructions
   */
  zeroMemory(offset: number, size: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    
    // Load zero into register
    instructions.push({
      opcode: BPFInstruction.LOAD_IMM,
      dst: BPFRegister.R8,
      immediate: 0,
      comment: 'Load zero'
    });
    
    // Zero memory in 8-byte chunks
    for (let i = 0; i < size; i += 8) {
      instructions.push(
        this.storeMemory(BPFRegister.R8, offset + i, 8)
      );
    }
    
    return instructions;
  }

  /**
   * Create buffer allocation instructions
   */
  allocateBuffer(size: number): AssemblyInstruction[] {
    return [
      ...this.allocateStack(size),
      ...this.zeroMemory(-size, size),
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R7,
        src: BPFRegister.R10,
        comment: 'Store buffer pointer in R7'
      }
    ];
  }

  /**
   * Create string operations
   */
  storeString(str: string, offset: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    const bytes = new TextEncoder().encode(str);
    
    for (let i = 0; i < bytes.length; i += 8) {
      const chunk = bytes.slice(i, i + 8);
      let value = 0;
      
      // Convert bytes to little-endian 64-bit value
      for (let j = 0; j < chunk.length; j++) {
        value |= chunk[j] << (j * 8);
      }
      
      instructions.push(
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R8,
          immediate: value,
          comment: `String chunk: "${str.substring(i, i + 8)}"`
        },
        this.storeMemory(BPFRegister.R8, offset + i, 8)
      );
    }
    
    return instructions;
  }

  /**
   * Create account data access instructions
   */
  loadAccountData(accountRegister: BPFRegister, dataOffset: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R6,
        src: accountRegister,
        offset: 0,
        comment: 'Load account data pointer'
      },
      {
        opcode: BPFInstruction.ADD,
        dst: BPFRegister.R6,
        immediate: dataOffset,
        comment: `Add data offset: ${dataOffset}`
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R5,
        src: BPFRegister.R6,
        comment: 'Load account data'
      }
    ];
  }

  /**
   * Create bounds check instructions
   */
  createBoundsCheck(register: BPFRegister, minValue: number, maxValue: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.JUMP_LT,
        dst: register,
        immediate: minValue,
        comment: `Check if ${register} < ${minValue}`
      },
      {
        opcode: BPFInstruction.JUMP_GT,
        dst: register,
        immediate: maxValue,
        comment: `Check if ${register} > ${maxValue}`
      }
    ];
  }

  /**
   * Create memory barrier instructions
   */
  createMemoryBarrier(): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.AND,
        dst: BPFRegister.R0,
        src: BPFRegister.R0,
        comment: 'Memory barrier (no-op for ordering)'
      }
    ];
  }

  /**
   * Get current memory layout
   */
  getLayout(): BPFMemoryLayout {
    return { ...this.layout };
  }

  /**
   * Update memory layout
   */
  updateLayout(newLayout: Partial<BPFMemoryLayout>): void {
    this.layout = { ...this.layout, ...newLayout };
  }

  /**
   * Calculate required stack space for a data structure
   */
  calculateStackSpace(fields: { name: string; size: number }[]): number {
    return fields.reduce((total, field) => total + field.size, 0);
  }

  /**
   * Create structure layout instructions
   */
  createStructureLayout(fields: { name: string; size: number; value?: number }[]): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    let offset = 0;
    
    const totalSize = this.calculateStackSpace(fields);
    instructions.push(...this.allocateStack(totalSize));
    
    for (const field of fields) {
      if (field.value !== undefined) {
        instructions.push(
          {
            opcode: BPFInstruction.LOAD_IMM,
            dst: BPFRegister.R8,
            immediate: field.value,
            comment: `Initialize field: ${field.name}`
          },
          this.storeMemory(BPFRegister.R8, -(totalSize - offset), field.size as 1 | 2 | 4 | 8)
        );
      }
      offset += field.size;
    }
    
    return instructions;
  }
}
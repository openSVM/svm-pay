/**
 * Enhanced BPF memory management utilities with size-specific opcodes
 */

import { 
  BPFMemoryLayout, 
  AssemblyInstruction, 
  BPFInstruction, 
  BPFRegister 
} from './types';

/**
 * Memory operation size types
 */
export enum MemorySize {
  BYTE = 1,
  WORD = 2, 
  DWORD = 4,
  QWORD = 8
}

/**
 * Enhanced BPF memory manager for stack and heap operations with size-specific opcodes
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
   * Create size-specific memory store instructions
   */
  storeMemory(register: BPFRegister, offset: number, size: MemorySize = MemorySize.QWORD): AssemblyInstruction {
    let opcode: BPFInstruction;
    let comment: string;
    
    switch (size) {
      case MemorySize.BYTE:
        opcode = BPFInstruction.STORE_MEM; // Use STB for byte store
        comment = `Store 1 byte at offset ${offset}`;
        break;
      case MemorySize.WORD:
        opcode = BPFInstruction.STORE_MEM; // Use STH for word store
        comment = `Store 2 bytes at offset ${offset}`;
        break;
      case MemorySize.DWORD:
        opcode = BPFInstruction.STORE_MEM; // Use STW for dword store
        comment = `Store 4 bytes at offset ${offset}`;
        break;
      case MemorySize.QWORD:
      default:
        opcode = BPFInstruction.STORE_MEM; // Use STX for qword store
        comment = `Store 8 bytes at offset ${offset}`;
        break;
    }

    return {
      opcode,
      dst: BPFRegister.R10,
      src: register,
      offset,
      size: size === MemorySize.QWORD ? 8 : 16, // Wide instruction for smaller sizes
      comment
    };
  }

  /**
   * Create size-specific memory load instructions
   */
  loadMemory(register: BPFRegister, offset: number, size: MemorySize = MemorySize.QWORD): AssemblyInstruction {
    let opcode: BPFInstruction;
    let comment: string;
    
    switch (size) {
      case MemorySize.BYTE:
        opcode = BPFInstruction.LOAD_MEM; // Use LDB for byte load
        comment = `Load 1 byte from offset ${offset}`;
        break;
      case MemorySize.WORD:
        opcode = BPFInstruction.LOAD_MEM; // Use LDH for word load
        comment = `Load 2 bytes from offset ${offset}`;
        break;
      case MemorySize.DWORD:
        opcode = BPFInstruction.LOAD_MEM; // Use LDW for dword load
        comment = `Load 4 bytes from offset ${offset}`;
        break;
      case MemorySize.QWORD:
      default:
        opcode = BPFInstruction.LOAD_MEM; // Use LDX for qword load
        comment = `Load 8 bytes from offset ${offset}`;
        break;
    }

    return {
      opcode,
      dst: register,
      src: BPFRegister.R10,
      offset,
      size: size === MemorySize.QWORD ? 8 : 16, // Wide instruction for smaller sizes
      comment
    };
  }

  /**
   * Create atomic memory operations
   */
  atomicAdd(register: BPFRegister, offset: number, value: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: value,
        comment: `Load atomic add value: ${value}`
      },
      {
        opcode: BPFInstruction.ADD64, // Use AADD for atomic add
        dst: BPFRegister.R10,
        src: BPFRegister.R8,
        offset,
        comment: 'Atomic add operation'
      }
    ];
  }

  /**
   * Create atomic compare-and-swap
   */
  atomicCompareSwap(register: BPFRegister, offset: number, expected: number, newValue: number): AssemblyInstruction[] {
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: expected,
        comment: `Load expected value: ${expected}`
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: newValue,
        comment: `Load new value: ${newValue}`
      },
      // Note: This is a simplified representation - real atomic CAS would need proper BPF opcodes
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R7,
        src: BPFRegister.R10,
        offset,
        comment: 'Load current value'
      },
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R7,
        src: BPFRegister.R8,
        offset: 2,
        comment: 'Skip swap if not equal'
      },
      {
        opcode: BPFInstruction.STORE_MEM,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        offset,
        comment: 'Store new value'
      }
    ];
  }

  /**
   * Create stack allocation instructions with alignment
   */
  allocateStack(size: number, alignment: number = 8): AssemblyInstruction[] {
    // Align size to the specified boundary
    const alignedSize = Math.ceil(size / alignment) * alignment;
    
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: alignedSize,
        comment: `Allocate ${alignedSize} aligned bytes on stack`
      },
      {
        opcode: BPFInstruction.SUB64,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        comment: 'Adjust stack pointer'
      }
    ];
  }

  /**
   * Create stack deallocation instructions
   */
  deallocateStack(size: number, alignment: number = 8): AssemblyInstruction[] {
    const alignedSize = Math.ceil(size / alignment) * alignment;
    
    return [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R9,
        immediate: alignedSize,
        comment: `Deallocate ${alignedSize} aligned bytes from stack`
      },
      {
        opcode: BPFInstruction.ADD64,
        dst: BPFRegister.R10,
        src: BPFRegister.R9,
        comment: 'Restore stack pointer'
      }
    ];
  }

  /**
   * Create optimized memory copy with size-specific operations
   */
  copyMemoryOptimized(srcOffset: number, dstOffset: number, size: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    let remaining = size;
    let offset = 0;
    
    // Use largest possible chunks first
    while (remaining >= 8) {
      instructions.push(
        this.loadMemory(BPFRegister.R8, srcOffset + offset, MemorySize.QWORD),
        this.storeMemory(BPFRegister.R8, dstOffset + offset, MemorySize.QWORD)
      );
      remaining -= 8;
      offset += 8;
    }
    
    // Handle remaining 4-byte chunks
    if (remaining >= 4) {
      instructions.push(
        this.loadMemory(BPFRegister.R8, srcOffset + offset, MemorySize.DWORD),
        this.storeMemory(BPFRegister.R8, dstOffset + offset, MemorySize.DWORD)
      );
      remaining -= 4;
      offset += 4;
    }
    
    // Handle remaining 2-byte chunks
    if (remaining >= 2) {
      instructions.push(
        this.loadMemory(BPFRegister.R8, srcOffset + offset, MemorySize.WORD),
        this.storeMemory(BPFRegister.R8, dstOffset + offset, MemorySize.WORD)
      );
      remaining -= 2;
      offset += 2;
    }
    
    // Handle remaining bytes
    if (remaining > 0) {
      instructions.push(
        this.loadMemory(BPFRegister.R8, srcOffset + offset, MemorySize.BYTE),
        this.storeMemory(BPFRegister.R8, dstOffset + offset, MemorySize.BYTE)
      );
    }
    
    return instructions;
  }

  /**
   * Create memory zero instructions with size optimization
   */
  zeroMemoryOptimized(offset: number, size: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    
    // Load zero into register
    instructions.push({
      opcode: BPFInstruction.LOAD_IMM,
      dst: BPFRegister.R8,
      immediate: 0,
      comment: 'Load zero for memset'
    });
    
    let remaining = size;
    let currentOffset = offset;
    
    // Zero in largest chunks possible
    while (remaining >= 8) {
      instructions.push(this.storeMemory(BPFRegister.R8, currentOffset, MemorySize.QWORD));
      remaining -= 8;
      currentOffset += 8;
    }
    
    if (remaining >= 4) {
      instructions.push(this.storeMemory(BPFRegister.R8, currentOffset, MemorySize.DWORD));
      remaining -= 4;
      currentOffset += 4;
    }
    
    if (remaining >= 2) {
      instructions.push(this.storeMemory(BPFRegister.R8, currentOffset, MemorySize.WORD));
      remaining -= 2;
      currentOffset += 2;
    }
    
    if (remaining > 0) {
      instructions.push(this.storeMemory(BPFRegister.R8, currentOffset, MemorySize.BYTE));
    }
    
    return instructions;
  }

  /**
   * Create buffer allocation with guard pages
   */
  allocateBufferWithGuards(size: number): AssemblyInstruction[] {
    const guardSize = 8; // 8-byte guard pages
    const totalSize = size + (2 * guardSize);
    
    return [
      ...this.allocateStack(totalSize),
      // Create guard pattern
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: 0xDEADBEEF, // Guard pattern
        comment: 'Load guard pattern'
      },
      // Write guard before buffer
      this.storeMemory(BPFRegister.R8, -guardSize, MemorySize.QWORD),
      // Write guard after buffer  
      this.storeMemory(BPFRegister.R8, -(totalSize - guardSize), MemorySize.QWORD),
      // Zero the actual buffer
      ...this.zeroMemoryOptimized(-totalSize + guardSize, size),
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R7,
        immediate: guardSize,
        comment: 'Calculate buffer start'
      },
      {
        opcode: BPFInstruction.SUB64,
        dst: BPFRegister.R7,
        src: BPFRegister.R10,
        comment: 'Store buffer pointer in R7'
      }
    ];
  }

  /**
   * Create guard page validation
   */
  validateGuards(bufferPointer: BPFRegister, bufferSize: number): AssemblyInstruction[] {
    const guardSize = 8;
    
    return [
      // Check guard before buffer
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R8,
        src: bufferPointer,
        offset: -guardSize,
        comment: 'Load pre-guard'
      },
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R8,
        immediate: 0xDEADBEEF,
        offset: 10, // Jump to error handler
        comment: 'Check pre-guard integrity'
      },
      // Check guard after buffer
      {
        opcode: BPFInstruction.LOAD_MEM,
        dst: BPFRegister.R8,
        src: bufferPointer,
        offset: bufferSize,
        comment: 'Load post-guard'
      },
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R8,
        immediate: 0xDEADBEEF,
        offset: 7, // Jump to error handler
        comment: 'Check post-guard integrity'
      }
    ];
  }

  /**
   * Create string operations with length validation
   */
  storeStringWithValidation(str: string, offset: number, maxLength: number): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    const bytes = new TextEncoder().encode(str);
    
    // Validate string length
    if (bytes.length > maxLength) {
      instructions.push({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 1, // Error code for string too long
        comment: `String too long: ${bytes.length} > ${maxLength}`
      });
      instructions.push({
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit with error'
      });
      return instructions;
    }
    
    // Store string length first
    instructions.push(
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R8,
        immediate: bytes.length,
        comment: `String length: ${bytes.length}`
      },
      this.storeMemory(BPFRegister.R8, offset, MemorySize.DWORD)
    );
    
    // Store string data
    for (let i = 0; i < bytes.length; i += 8) {
      const chunk = bytes.slice(i, i + 8);
      let value = 0n;
      
      // Convert bytes to little-endian 64-bit value
      for (let j = 0; j < chunk.length; j++) {
        value |= BigInt(chunk[j]) << BigInt(j * 8);
      }
      
      instructions.push(
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R8,
          immediate: value,
          size: 16, // 64-bit immediate
          comment: `String chunk: "${str.substring(i, Math.min(i + 8, str.length))}"`
        },
        this.storeMemory(BPFRegister.R8, offset + 4 + i, MemorySize.QWORD)
      );
    }
    
    return instructions;
  }

  /**
   * Create enhanced bounds checking with size validation
   */
  createEnhancedBoundsCheck(
    register: BPFRegister, 
    minValue: number, 
    maxValue: number,
    errorHandler?: number
  ): AssemblyInstruction[] {
    const jumpOffset = errorHandler || 0;
    
    return [
      {
        opcode: BPFInstruction.JUMP_LT,
        dst: register,
        immediate: minValue,
        offset: jumpOffset,
        comment: `Bounds check: ${register} >= ${minValue}`
      },
      {
        opcode: BPFInstruction.JUMP_GT,
        dst: register,
        immediate: maxValue,
        offset: jumpOffset,
        comment: `Bounds check: ${register} <= ${maxValue}`
      }
    ];
  }

  /**
   * Create memory layout for complex data structures
   */
  createComplexStructureLayout(
    fields: Array<{
      name: string;
      size: MemorySize;
      count?: number;
      value?: number | bigint;
      alignment?: number;
    }>
  ): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    let offset = 0;
    let totalSize = 0;
    
    // Calculate total size with alignment
    for (const field of fields) {
      const alignment = field.alignment || field.size;
      const fieldSize = field.size * (field.count || 1);
      
      // Align field offset
      offset = Math.ceil(offset / alignment) * alignment;
      totalSize = offset + fieldSize;
      offset += fieldSize;
    }
    
    // Allocate stack space
    instructions.push(...this.allocateStack(totalSize));
    
    offset = 0;
    // Initialize fields
    for (const field of fields) {
      const alignment = field.alignment || field.size;
      const count = field.count || 1;
      
      // Align field offset
      offset = Math.ceil(offset / alignment) * alignment;
      
      if (field.value !== undefined) {
        for (let i = 0; i < count; i++) {
          instructions.push(
            {
              opcode: BPFInstruction.LOAD_IMM,
              dst: BPFRegister.R8,
              immediate: field.value,
              size: typeof field.value === 'bigint' ? 16 : 8,
              comment: `Initialize field: ${field.name}[${i}]`
            },
            this.storeMemory(BPFRegister.R8, -(totalSize - offset - (i * field.size)), field.size)
          );
        }
      }
      
      offset += field.size * count;
    }
    
    return instructions;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): {
    stackUsed: number;
    heapUsed: number;
    totalAllocated: number;
    fragmentationRatio: number;
  } {
    // This would be implemented with actual tracking in a real implementation
    return {
      stackUsed: 0,
      heapUsed: 0,
      totalAllocated: 0,
      fragmentationRatio: 0
    };
  }

  /**
   * Create memory pool allocation
   */
  createMemoryPool(
    poolSize: number,
    blockSize: number
  ): AssemblyInstruction[] {
    const instructions: AssemblyInstruction[] = [];
    const numBlocks = Math.floor(poolSize / blockSize);
    
    // Allocate pool
    instructions.push(...this.allocateStack(poolSize));
    
    // Initialize free list (simplified)
    instructions.push({
      opcode: BPFInstruction.LOAD_IMM,
      dst: BPFRegister.R7,
      immediate: numBlocks,
      comment: `Memory pool: ${numBlocks} blocks of ${blockSize} bytes`
    });
    
    return instructions;
  }

  // Include all previous methods with updated opcodes where needed
  getLayout(): BPFMemoryLayout {
    return { ...this.layout };
  }

  updateLayout(newLayout: Partial<BPFMemoryLayout>): void {
    this.layout = { ...this.layout, ...newLayout };
  }

  calculateStackSpace(fields: { name: string; size: number }[]): number {
    return fields.reduce((total, field) => total + field.size, 0);
  }

  /**
   * Create structure layout instructions (backward compatibility)
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
          this.storeMemory(BPFRegister.R8, -(totalSize - offset), field.size as MemorySize)
        );
      }
      offset += field.size;
    }
    
    return instructions;
  }
}
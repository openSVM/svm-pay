#!/usr/bin/env node

/**
 * Assembly-BPF Memory Management Example
 * 
 * This example demonstrates advanced memory management techniques in BPF programs,
 * including stack allocation, data structures, and memory optimization.
 */

const { 
  AssemblyBPFSDK, 
  BPFHelpers,
  SVMNetwork,
  SVMPayBPFProgramType 
} = require('../../dist/sdk/assembly-bpf');

async function memoryManagementExample() {
  console.log('🚀 Assembly-BPF Memory Management Example');
  console.log('=' .repeat(45));

  try {
    // Initialize SDK
    const sdk = new AssemblyBPFSDK({ 
      network: SVMNetwork.SOLANA,
      debug: true 
    });
    console.log('✅ SDK initialized for Solana');

    // Get memory manager
    const memoryManager = sdk.getMemoryManager();
    console.log('\n🧠 Memory Management Demonstration');

    // 1. Define a payment data structure
    console.log('\n📋 1. Payment Data Structure Layout');
    console.log('-'.repeat(35));
    
    const paymentStructure = [
      { name: 'header', size: 8, value: 0x1234ABCD },
      { name: 'amount', size: 8, value: 1000000 },
      { name: 'recipient', size: 32 },
      { name: 'sender', size: 32 },
      { name: 'memo', size: 64 },
      { name: 'timestamp', size: 8, value: Date.now() },
      { name: 'signature', size: 64 },
      { name: 'footer', size: 8, value: 0xDEADBEEF }
    ];

    console.log('Payment Structure Fields:');
    let offset = 0;
    paymentStructure.forEach(field => {
      console.log(`   ${field.name.padEnd(12)} @ offset ${offset.toString().padStart(3)}: ${field.size} bytes${field.value ? ` (init: 0x${field.value.toString(16)})` : ''}`);
      offset += field.size;
    });

    // 2. Calculate memory requirements
    const totalSize = memoryManager.calculateStackSpace(paymentStructure);
    console.log(`\n📏 Total structure size: ${totalSize} bytes`);

    // 3. Create structure layout instructions
    console.log('\n⚙️  2. Generating Structure Layout Instructions');
    console.log('-'.repeat(45));
    
    const structInstructions = memoryManager.createStructureLayout(paymentStructure);
    console.log(`✅ Generated ${structInstructions.length} initialization instructions`);

    // Display first few instructions
    console.log('\nFirst 5 initialization instructions:');
    structInstructions.slice(0, 5).forEach((instr, i) => {
      console.log(`   ${i + 1}. ${instr.comment || 'Memory operation'}`);
    });

    // 4. Stack allocation demonstration
    console.log('\n📚 3. Stack Allocation Strategies');
    console.log('-'.repeat(35));
    
    const stackSizes = [64, 128, 256, 512, 1024];
    
    console.log('Stack allocation options:');
    stackSizes.forEach(size => {
      const allocInstructions = memoryManager.allocateStack(size);
      console.log(`   ${size.toString().padStart(4)} bytes: ${allocInstructions.length} instructions`);
    });

    // 5. Memory access patterns
    console.log('\n🔄 4. Memory Access Pattern Generation');
    console.log('-'.repeat(40));
    
    // Generate store and load instructions
    const storeInstr = memoryManager.storeMemory('R1', -8);
    const loadInstr = memoryManager.loadMemory('R2', -8);
    
    console.log('Memory access instructions:');
    console.log(`   Store: ${storeInstr.comment}`);
    console.log(`   Load:  ${loadInstr.comment}`);

    // 6. Memory optimization analysis
    console.log('\n⚡ 5. Memory Optimization Analysis');
    console.log('-'.repeat(35));
    
    // Test different alignment strategies
    const unalignedStruct = [
      { name: 'flag', size: 1 },
      { name: 'amount', size: 8 },
      { name: 'flag2', size: 1 },
      { name: 'recipient', size: 32 }
    ];
    
    const alignedStruct = [
      { name: 'amount', size: 8 },
      { name: 'recipient', size: 32 },
      { name: 'flag', size: 1 },
      { name: 'flag2', size: 1 },
      { name: 'padding', size: 6 }
    ];
    
    const unalignedSize = memoryManager.calculateStackSpace(unalignedStruct);
    const alignedSize = memoryManager.calculateStackSpace(alignedStruct);
    
    console.log('Memory layout comparison:');
    console.log(`   Unaligned layout: ${unalignedSize} bytes`);
    console.log(`   Aligned layout:   ${alignedSize} bytes`);
    console.log(`   Difference:       ${alignedSize - unalignedSize} bytes (${((alignedSize - unalignedSize) / unalignedSize * 100).toFixed(1)}%)`);

    // 7. Build a complete program with memory management
    console.log('\n🏗️  6. Complete Program with Memory Management');
    console.log('-'.repeat(45));
    
    const metadata = BPFHelpers.createProgramMetadata(
      'Memory Management Demo',
      SVMPayBPFProgramType.MIDDLEWARE,
      [SVMNetwork.SOLANA]
    );

    const builder = sdk.createProgram(metadata);
    
    // Add structure initialization
    builder.addInstructions(structInstructions);
    
    // Add debug logging
    builder.addInstructions(BPFHelpers.createDebugLog('Memory structures initialized'));
    
    // Add some memory operations
    builder.addInstructions([
      storeInstr,
      loadInstr
    ]);
    
    // Add stack allocation
    builder.addInstructions(memoryManager.allocateStack(256));
    
    console.log(`📊 Program statistics:`);
    console.log(`   Total instructions: ${builder.getInstructions().length}`);
    console.log(`   Memory structures: ${paymentStructure.length} fields`);
    console.log(`   Stack allocation: 256 bytes`);

    // 8. Compile and analyze
    console.log('\n⚡ 7. Compilation and Memory Analysis');
    console.log('-'.repeat(40));
    
    const compilationResult = await builder.compile();
    
    if (compilationResult.success) {
      console.log('✅ Memory management program compiled successfully');
      
      if (compilationResult.bytecode) {
        console.log(`💾 Final bytecode size: ${compilationResult.bytecode.length} bytes`);
        
        // Memory efficiency metrics
        const codeToDataRatio = compilationResult.bytecode.length / totalSize;
        console.log(`📊 Code-to-data ratio: ${codeToDataRatio.toFixed(2)}:1`);
        
        if (codeToDataRatio > 3) {
          console.log('⚠️  High code-to-data ratio - consider optimizing');
        } else {
          console.log('✅ Good memory efficiency');
        }
      }

      // Update memory configuration example
      console.log('\n⚙️  8. Memory Configuration Update');
      console.log('-'.repeat(35));
      
      memoryManager.updateLayout({
        stackSize: 8192,
        heapSize: 131072
      });
      
      console.log('Updated memory configuration:');
      console.log('   Stack size: 8192 bytes (8KB)');
      console.log('   Heap size:  131072 bytes (128KB)');

      console.log('\n🎯 Memory Management Best Practices:');
      console.log('   ✓ Align data structures to word boundaries');
      console.log('   ✓ Minimize memory fragmentation');
      console.log('   ✓ Use stack allocation for temporary data');
      console.log('   ✓ Pre-calculate memory layouts');
      console.log('   ✓ Monitor code-to-data ratios');
      console.log('   ✓ Validate memory bounds in debug mode');

    } else {
      console.log('❌ Compilation failed');
      if (compilationResult.errors) {
        compilationResult.errors.forEach(error => console.log(`   - ${error}`));
      }
    }

  } catch (error) {
    console.error('❌ Memory management example failed:', error.message);
    process.exit(1);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  memoryManagementExample().catch(console.error);
}

module.exports = { memoryManagementExample };
#!/usr/bin/env node

/**
 * Assembly-BPF Custom Validator Example
 * 
 * This example demonstrates building a custom payment validator using the BPF program builder
 * with manual instruction assembly and memory management.
 */

const { 
  AssemblyBPFSDK, 
  BPFHelpers, 
  BPFInstruction, 
  BPFRegister,
  SVMNetwork,
  SVMPayBPFProgramType 
} = require('../../dist/sdk/assembly-bpf');

async function customValidatorExample() {
  console.log('🚀 Assembly-BPF Custom Validator Example');
  console.log('=' .repeat(45));

  try {
    // Initialize SDK for Sonic SVM network
    const sdk = new AssemblyBPFSDK({ 
      network: SVMNetwork.SONIC, 
      debug: true 
    });
    console.log('✅ SDK initialized for Sonic SVM');

    // Create program metadata
    const metadata = BPFHelpers.createProgramMetadata(
      'Custom Payment Validator',
      SVMPayBPFProgramType.VALIDATOR,
      [SVMNetwork.SONIC, SVMNetwork.SOLANA]
    );

    console.log(`📋 Program: ${metadata.name}`);
    console.log(`🔧 Type: ${metadata.programType}`);
    console.log(`🌐 Networks: ${metadata.networks.join(', ')}`);

    // Create program builder
    const builder = sdk.createProgram(metadata);
    console.log('\n🏗️  Building custom validator program...');

    // Add custom validation logic step by step
    console.log('   📝 Adding payment amount validation...');
    builder.addInstructions([
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R2,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load payment amount from input data'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R3,
        immediate: 1000,
        comment: 'Load minimum amount (1000 lamports)'
      },
      {
        opcode: BPFInstruction.JUMP_IF_GREATER_EQUAL,
        dst: BPFRegister.R2,
        src: BPFRegister.R3,
        offset: 2,
        comment: 'Jump if amount >= minimum'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 1,
        comment: 'Return error for insufficient amount'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit with error'
      }
    ]);

    console.log('   📝 Adding amount increment validation...');
    builder.addInstructions([
      // Check if amount is multiple of 1000
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R4,
        immediate: 1000,
        comment: 'Load increment size (1000)'
      },
      {
        opcode: BPFInstruction.MOD,
        dst: BPFRegister.R5,
        src: BPFRegister.R2,
        src2: BPFRegister.R4,
        comment: 'Calculate amount % 1000'
      },
      {
        opcode: BPFInstruction.JUMP_IF_EQUAL,
        dst: BPFRegister.R5,
        immediate: 0,
        offset: 2,
        comment: 'Jump if amount is multiple of 1000'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 2,
        comment: 'Return error for invalid increment'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit with error'
      }
    ]);

    console.log('   📝 Adding recipient validation...');
    builder.addInstructions([
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R6,
        src: BPFRegister.R1,
        offset: 40,
        comment: 'Load recipient address'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R7,
        immediate: 0,
        comment: 'Load null address for comparison'
      },
      {
        opcode: BPFInstruction.JUMP_IF_NOT_EQUAL,
        dst: BPFRegister.R6,
        src: BPFRegister.R7,
        offset: 2,
        comment: 'Jump if recipient is not null'
      },
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 3,
        comment: 'Return error for null recipient'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit with error'
      }
    ]);

    console.log('   📝 Adding success path...');
    builder.addInstructions([
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit successfully'
      }
    ]);

    // Add debug logging
    builder.addInstructions(
      BPFHelpers.createDebugLog('Custom validation complete')
    );

    console.log(`📊 Total instructions: ${builder.getInstructions().length}`);

    // Compile the program
    console.log('\n⚡ Compiling custom validator...');
    const compilationResult = await builder.compile();

    if (compilationResult.success) {
      console.log('✅ Custom validator compiled successfully');
      
      // Display assembly
      console.log('\n📜 Generated Assembly Code:');
      console.log('-'.repeat(40));
      console.log(compilationResult.assembly);

      // Memory analysis
      console.log('\n🧠 Memory Analysis:');
      const memoryManager = sdk.getMemoryManager();
      const stackSpace = memoryManager.calculateStackSpace([
        { name: 'amount', size: 8 },
        { name: 'recipient', size: 32 },
        { name: 'temp_vars', size: 32 }
      ]);
      console.log(`   📏 Required stack space: ${stackSpace} bytes`);

      // Performance estimation
      const assembler = sdk.getAssembler();
      const computeUnits = assembler.estimateComputeUnits(builder.getInstructions());
      console.log(`   ⚡ Estimated compute units: ${computeUnits}`);

      console.log('\n🎯 Validator Features:');
      console.log('   ✓ Minimum amount validation (1000 lamports)');
      console.log('   ✓ Amount increment validation (multiples of 1000)');
      console.log('   ✓ Recipient address validation (non-null)');
      console.log('   ✓ Custom error codes for different failure cases');
      console.log('   ✓ Debug logging for troubleshooting');

      console.log('\n📋 Error Codes:');
      console.log('   0: Success');
      console.log('   1: Amount below minimum (1000 lamports)');
      console.log('   2: Amount not multiple of 1000');
      console.log('   3: Null recipient address');

    } else {
      console.log('❌ Compilation failed');
      if (compilationResult.errors) {
        compilationResult.errors.forEach(error => console.log(`   - ${error}`));
      }
    }

  } catch (error) {
    console.error('❌ Custom validator example failed:', error.message);
    process.exit(1);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  customValidatorExample().catch(console.error);
}

module.exports = { customValidatorExample };
#!/usr/bin/env node

/**
 * Assembly-BPF Payment Processor Example
 * 
 * This example demonstrates creating a payment processing program using the Assembly-BPF SDK
 * with support for multiple SVM networks.
 */

const { 
  AssemblyBPFSDK, 
  BPFTemplates, 
  SVMNetwork 
} = require('../../dist/sdk/assembly-bpf');

async function paymentProcessorExample() {
  console.log('🚀 Assembly-BPF Payment Processor Example');
  console.log('=' .repeat(45));

  try {
    // Configure SDK for Solana with debug mode
    const config = {
      network: SVMNetwork.SOLANA,
      debug: true
    };
    
    const sdk = new AssemblyBPFSDK(config);
    console.log(`✅ SDK initialized for ${config.network}`);

    // Create payment processor using template
    const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
      networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC, SVMNetwork.ECLIPSE]
    });

    console.log(`📋 Program: ${metadata.name}`);
    console.log(`🌐 Networks: ${metadata.networks.join(', ')}`);
    console.log(`📝 Instructions: ${instructions.length}`);

    // Compile the program
    console.log('\n⚡ Compiling payment processor...');
    const compilationResult = await sdk.compile(instructions, metadata);

    if (compilationResult.success) {
      console.log('✅ Payment processor compiled successfully');
      console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
      
      // Display assembly preview
      console.log('\n📜 Assembly Code Preview (first 10 lines):');
      console.log('-'.repeat(40));
      const assemblyLines = compilationResult.assembly?.split('\n') || [];
      assemblyLines.slice(0, 10).forEach(line => console.log(line));
      if (assemblyLines.length > 10) {
        console.log('...');
      }

      // Estimate compute units
      const assembler = sdk.getAssembler();
      const computeUnits = assembler.estimateComputeUnits(instructions);
      console.log(`\n📊 Estimated compute units: ${computeUnits}`);
      console.log(`💰 Estimated cost: ~${(computeUnits * 0.000005).toFixed(6)} SOL`);

      // Validate the program
      if (compilationResult.bytecode) {
        console.log('\n🔍 Validating program...');
        const validation = await sdk.validateProgram(compilationResult.bytecode);
        
        if (validation.valid) {
          console.log('✅ Program validation: PASSED');
        } else {
          console.log('❌ Program validation: FAILED');
          validation.issues.forEach(issue => console.log(`   - ${issue}`));
        }
      }

      console.log('\n🎯 Payment Processor Features:');
      console.log('   ✓ Multi-network support (Solana, Sonic, Eclipse)');
      console.log('   ✓ Fee handling with configurable rates');
      console.log('   ✓ Input validation and error handling');
      console.log('   ✓ Secure recipient verification');
      console.log('   ✓ Transaction metadata logging');

    } else {
      console.log('❌ Compilation failed');
      if (compilationResult.errors) {
        compilationResult.errors.forEach(error => console.log(`   - ${error}`));
      }
    }

  } catch (error) {
    console.error('❌ Payment processor example failed:', error.message);
    process.exit(1);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  paymentProcessorExample().catch(console.error);
}

module.exports = { paymentProcessorExample };
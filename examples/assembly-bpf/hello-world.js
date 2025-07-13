#!/usr/bin/env node

/**
 * Assembly-BPF Hello World Example
 * 
 * This example demonstrates the simplest possible BPF program using the Assembly-BPF SDK.
 */

const { examples } = require('../../dist/sdk/assembly-bpf');

async function helloWorldExample() {
  console.log('🚀 Assembly-BPF Hello World Example');
  console.log('=' .repeat(40));

  try {
    // Create a simple hello world program
    const { sdk, compilationResult, metadata } = await examples.createHelloWorld();

    console.log('✅ Hello World program compiled successfully');
    console.log(`📋 Program Name: ${metadata.name}`);
    console.log(`🔧 Program Type: ${metadata.programType}`);
    console.log(`🌐 Target Networks: ${metadata.networks.join(', ')}`);
    
    console.log('\n📜 Generated Assembly Code:');
    console.log('-'.repeat(30));
    console.log(compilationResult.assembly);
    
    if (compilationResult.bytecode) {
      console.log(`\n💾 Bytecode Size: ${compilationResult.bytecode.length} bytes`);
      console.log(`📊 First 16 bytes: ${Array.from(compilationResult.bytecode.slice(0, 16))
        .map(b => '0x' + b.toString(16).padStart(2, '0'))
        .join(' ')}`);
    }

    console.log('\n🎯 Next Steps:');
    console.log('   1. Deploy to testnet using sdk.deploy()');
    console.log('   2. Validate program using sdk.validateProgram()');
    console.log('   3. Test with actual transactions');

  } catch (error) {
    console.error('❌ Hello World example failed:', error.message);
    process.exit(1);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  helloWorldExample().catch(console.error);
}

module.exports = { helloWorldExample };
#!/usr/bin/env node

/**
 * Assembly-BPF SDK Demo
 * 
 * This script demonstrates the Assembly-BPF SDK capabilities.
 */

const { 
  AssemblyBPFSDK, 
  BPFTemplates, 
  BPFHelpers,
  examples,
  SVMPayBPFProgramType,
  BPFInstruction,
  BPFRegister 
} = require('../../dist/sdk/assembly-bpf');

const { SVMNetwork } = require('../../dist/core/types');

async function runDemo() {
  console.log('🚀 Assembly-BPF SDK Demo');
  console.log('=' .repeat(50));

  try {
    // Demo 1: Hello World
    console.log('\n📝 Demo 1: Hello World Program');
    console.log('-'.repeat(30));
    const { compilationResult: helloResult } = await examples.createHelloWorld();
    console.log('✅ Hello World compiled successfully');
    console.log(`📜 Assembly:\n${helloResult.assembly}`);

    // Demo 2: Payment Processor
    console.log('\n💰 Demo 2: Payment Processor');
    console.log('-'.repeat(30));
    const config = {
      network: SVMNetwork.SOLANA,
      debug: true
    };
    
    const sdk = new AssemblyBPFSDK(config);
    const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
      networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC]
    });
    
    const paymentResult = await sdk.compile(instructions, metadata);
    console.log('✅ Payment processor compiled successfully');
    console.log(`📊 Instructions: ${instructions.length}`);
    console.log(`💾 Bytecode size: ${paymentResult.bytecode?.length} bytes`);

    // Demo 3: Custom Program Builder
    console.log('\n🔧 Demo 3: Custom Program Builder');
    console.log('-'.repeat(30));
    
    const customMetadata = BPFHelpers.createProgramMetadata(
      'Demo Custom Program',
      SVMPayBPFProgramType.MIDDLEWARE,
      [SVMNetwork.SOLANA]
    );

    const builder = sdk.createProgram(customMetadata);
    
    // Build a custom program step by step
    builder
      .addInstructions(BPFHelpers.createDebugLog('Starting custom program'))
      .addInstruction({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R1,
        immediate: 12345,
        comment: 'Load demo value'
      })
      .addInstruction({
        opcode: BPFInstruction.ADD,
        dst: BPFRegister.R1,
        immediate: 67890,
        comment: 'Add another value'
      })
      .addInstructions(BPFHelpers.createDebugLog('Custom processing complete'))
      .addInstruction({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 0,
        comment: 'Return success'
      })
      .addInstruction({
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      });

    const customResult = await builder.compile();
    console.log('✅ Custom program compiled successfully');
    console.log(`📊 Instructions: ${builder.getInstructions().length}`);
    console.log(`📜 Assembly preview:`);
    console.log(customResult.assembly?.split('\n').slice(0, 5).join('\n') + '\n...');

    // Demo 4: Program Validation
    console.log('\n🔍 Demo 4: Program Validation');
    console.log('-'.repeat(30));
    
    if (customResult.bytecode) {
      const validation = await sdk.validateProgram(customResult.bytecode);
      console.log(`✅ Program validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
      if (validation.issues.length > 0) {
        console.log('⚠️  Issues found:');
        validation.issues.forEach(issue => console.log(`   - ${issue}`));
      }
    }

    // Demo 5: Memory Management
    console.log('\n🧠 Demo 5: Memory Management');
    console.log('-'.repeat(30));
    
    const memoryManager = sdk.getMemoryManager();
    
    // Create a data structure
    const structInstructions = memoryManager.createStructureLayout([
      { name: 'header', size: 8, value: 0x1234 },
      { name: 'amount', size: 8, value: 1000000 },
      { name: 'recipient', size: 32 },
      { name: 'memo', size: 64 }
    ]);
    
    console.log(`✅ Created memory structure with ${structInstructions.length} instructions`);
    console.log(`📏 Total structure size: ${memoryManager.calculateStackSpace([
      { name: 'header', size: 8 },
      { name: 'amount', size: 8 },
      { name: 'recipient', size: 32 },
      { name: 'memo', size: 64 }
    ])} bytes`);

    // Demo 6: Compute Unit Estimation
    console.log('\n⚡ Demo 6: Compute Unit Estimation');
    console.log('-'.repeat(30));
    
    const assembler = sdk.getAssembler();
    const computeUnits = assembler.estimateComputeUnits(builder.getInstructions());
    console.log(`📊 Estimated compute units: ${computeUnits}`);
    console.log(`💰 Estimated cost: ~${(computeUnits * 0.000005).toFixed(6)} SOL`);

    // Demo 7: Network Support
    console.log('\n🌐 Demo 7: Multi-Network Support');
    console.log('-'.repeat(30));
    
    const networks = [SVMNetwork.SOLANA, SVMNetwork.SONIC, SVMNetwork.ECLIPSE, SVMNetwork.SOON];
    console.log('Supported SVM Networks:');
    networks.forEach(network => {
      const networkSDK = new AssemblyBPFSDK({ network, debug: false });
      console.log(`  ✅ ${network}: Ready`);
    });

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('   1. Explore the documentation in docs/assembly-bpf/');
    console.log('   2. Check out more examples in examples/assembly-bpf/');
    console.log('   3. Try the testing workflow: examples.testingWorkflow()');
    console.log('   4. Deploy programs: examples.deploymentWorkflow()');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };
/**
 * Example BPF programs using the Assembly-BPF SDK
 */

import { PublicKey } from '@solana/web3.js';
import { SVMNetwork } from '../../core/types';
import { AssemblyBPFSDK } from './sdk';
import { BPFTemplates } from './templates';
import { BPFHelpers } from './helpers';
import { 
  BPFProgramConfig, 
  SVMPayBPFProgramType,
  BPFInstruction,
  BPFRegister
} from './types';

/**
 * Example: Simple payment processor
 */
export async function createSimplePaymentProcessor() {
  const config: BPFProgramConfig = {
    network: SVMNetwork.SOLANA,
    debug: true
  };

  const sdk = new AssemblyBPFSDK(config);

  // Create payment processor using template
  const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
    networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC, SVMNetwork.ECLIPSE, SVMNetwork.SOON]
  });

  // Compile the program
  const compilationResult = await sdk.compile(instructions, metadata);
  
  if (!compilationResult.success) {
    throw new Error(`Compilation failed: ${compilationResult.errors?.join(', ')}`);
  }

  console.log('✅ Simple payment processor compiled successfully');
  console.log(`📊 Instructions: ${instructions.length}`);
  console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
  
  return {
    sdk,
    compilationResult,
    metadata
  };
}

/**
 * Example: Cross-chain bridge
 */
export async function createCrossChainBridge() {
  const config: BPFProgramConfig = {
    network: SVMNetwork.SOLANA,
    debug: true
  };

  const sdk = new AssemblyBPFSDK(config);

  // Create bridge using template
  const bridgeAuthority = new PublicKey('11111111111111111111111111111112');
  const { metadata, instructions } = BPFTemplates.createCrossChainBridge({
    supportedChains: [1, 10, 137, 43114], // Ethereum, Optimism, Polygon, Avalanche
    bridgeAuthority,
    networks: [SVMNetwork.SOLANA, SVMNetwork.ECLIPSE]
  });

  const compilationResult = await sdk.compile(instructions, metadata);
  
  if (!compilationResult.success) {
    throw new Error(`Compilation failed: ${compilationResult.errors?.join(', ')}`);
  }

  console.log('🌉 Cross-chain bridge compiled successfully');
  console.log(`📊 Instructions: ${instructions.length}`);
  console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
  
  return {
    sdk,
    compilationResult,
    metadata
  };
}

/**
 * Example: Custom payment validator
 */
export async function createCustomValidator() {
  const config: BPFProgramConfig = {
    network: SVMNetwork.SONIC,
    debug: true
  };

  const sdk = new AssemblyBPFSDK(config);

  // Create custom validator using builder pattern
  const metadata = BPFHelpers.createProgramMetadata(
    'Custom Payment Validator',
    SVMPayBPFProgramType.VALIDATOR,
    [SVMNetwork.SONIC]
  );

  const builder = sdk.createProgram(metadata);

  // Add custom validation logic
  builder
    .addInstructions([
      // Load payment data
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R1,
        src: BPFRegister.R1,
        offset: 0,
        comment: 'Load payment accounts'
      },
      {
        opcode: BPFInstruction.LOAD,
        dst: BPFRegister.R2,
        src: BPFRegister.R1,
        offset: 8,
        comment: 'Load payment amount'
      }
    ])
    .addInstructions(BPFHelpers.createDebugLog('Custom validation starting'))
    
    // Custom business logic
    .addInstructions([
      // Check if amount is multiple of 1000
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R3,
        immediate: 1000,
        comment: 'Load minimum increment'
      },
      {
        opcode: BPFInstruction.MOD,
        dst: BPFRegister.R2,
        src: BPFRegister.R3,
        comment: 'Check amount increment'
      },
      {
        opcode: BPFInstruction.JUMP_NE,
        dst: BPFRegister.R2,
        immediate: 0,
        offset: 1, // Jump to next instruction
        comment: 'Reject if not multiple of 1000'
      }
    ])
    
    .addInstructions(BPFHelpers.createDebugLog('Custom validation passed'))
    .addInstructions([
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 1,
        comment: 'Return validation success'
      },
      {
        opcode: BPFInstruction.EXIT,
        dst: BPFRegister.R0,
        comment: 'Exit program'
      }
    ]);

  const compilationResult = await builder.compile();
  
  if (!compilationResult.success) {
    throw new Error(`Compilation failed: ${compilationResult.errors?.join(', ')}`);
  }

  console.log('✅ Custom validator compiled successfully');
  console.log(`📊 Instructions: ${builder.getInstructions().length}`);
  console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
  
  return {
    sdk,
    builder,
    compilationResult
  };
}

/**
 * Example: Token transfer with fee
 */
export async function createTokenTransferWithFee() {
  const config: BPFProgramConfig = {
    network: SVMNetwork.ECLIPSE,
    debug: true
  };

  const sdk = new AssemblyBPFSDK(config);

  // USDC mint on different networks
  const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const feeAccount = new PublicKey('FeeAccount1111111111111111111111111111111');

  const { metadata, instructions } = BPFTemplates.createPaymentFlow({
    tokenMint: usdcMint,
    feeAccount,
    feeRate: 50, // 0.5% fee
    networks: [SVMNetwork.ECLIPSE]
  });

  const compilationResult = await sdk.compile(instructions, metadata);
  
  if (!compilationResult.success) {
    throw new Error(`Compilation failed: ${compilationResult.errors?.join(', ')}`);
  }

  console.log('💰 Token transfer with fee compiled successfully');
  console.log(`📊 Instructions: ${instructions.length}`);
  console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
  console.log(`⛽ Estimated compute units: ${sdk.getAssembler().estimateComputeUnits(instructions)}`);
  
  return {
    sdk,
    compilationResult,
    metadata
  };
}

/**
 * Example: Hello World program
 */
export async function createHelloWorld() {
  const config: BPFProgramConfig = {
    network: SVMNetwork.SOON,
    debug: true
  };

  const sdk = new AssemblyBPFSDK(config);

  const { metadata, instructions } = BPFTemplates.createHelloWorld([SVMNetwork.SOON]);

  const compilationResult = await sdk.compile(instructions, metadata);
  
  if (!compilationResult.success) {
    throw new Error(`Compilation failed: ${compilationResult.errors?.join(', ')}`);
  }

  console.log('👋 Hello World program compiled successfully');
  console.log('📜 Assembly listing:');
  console.log(compilationResult.assembly);
  
  return {
    sdk,
    compilationResult,
    metadata
  };
}

/**
 * Example: Complete deployment workflow
 */
export async function deploymentWorkflow() {
  console.log('🚀 Starting complete deployment workflow...');

  // Create a simple payment processor
  const { sdk, compilationResult, metadata } = await createSimplePaymentProcessor();

  if (!compilationResult.bytecode) {
    throw new Error('No bytecode generated');
  }

  // Validate the program
  const validation = await sdk.validateProgram(compilationResult.bytecode);
  
  if (!validation.valid) {
    console.log('❌ Program validation failed:');
    validation.issues.forEach(issue => console.log(`  - ${issue}`));
    throw new Error('Program validation failed');
  }

  console.log('✅ Program validation passed');

  // Deploy the program (in debug mode, this won't actually deploy)
  if (sdk['config'].debug) {
    console.log('🔧 Debug mode: Skipping actual deployment');
    console.log('📋 Deployment summary:');
    console.log(`  - Program: ${metadata.name}`);
    console.log(`  - Type: ${metadata.type}`);
    console.log(`  - Networks: ${metadata.networks.join(', ')}`);
    console.log(`  - Compute units: ${metadata.computeUnits}`);
    
    return {
      success: true,
      programId: 'DebugModeProgram11111111111111111111111111',
      metadata
    };
  } else {
    const deploymentResult = await sdk.deploy(compilationResult.bytecode, metadata);
    
    if (!deploymentResult.success) {
      throw new Error(`Deployment failed: ${deploymentResult.error}`);
    }

    console.log('🎉 Program deployed successfully!');
    console.log(`📍 Program ID: ${deploymentResult.programId}`);
    console.log(`📋 Transaction: ${deploymentResult.signature}`);
    
    return deploymentResult;
  }
}

/**
 * Example: Testing and debugging workflow
 */
export async function testingWorkflow() {
  console.log('🧪 Starting testing workflow...');

  // Create multiple program types
  const programs = await Promise.all([
    createHelloWorld(),
    createSimplePaymentProcessor(),
    createCustomValidator()
  ]);

  console.log('\n📊 Testing Results Summary:');
  console.log('═'.repeat(50));
  
  programs.forEach((program, index) => {
    const programTypes = ['Hello World', 'Payment Processor', 'Custom Validator'];
    console.log(`\n${index + 1}. ${programTypes[index]}:`);
    console.log(`   ✅ Compilation: ${program.compilationResult.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   📏 Instructions: ${program.compilationResult.assembly?.split('\n').length || 0}`);
    console.log(`   💾 Size: ${program.compilationResult.bytecode?.length || 0} bytes`);
    
    // Get metadata from different result types
    let metadata: any;
    if ('metadata' in program) {
      metadata = program.metadata;
    } else if ('builder' in program) {
      metadata = program.builder.getMetadata();
    } else {
      metadata = { 
        name: 'Unknown', 
        type: SVMPayBPFProgramType.MIDDLEWARE, 
        networks: [] 
      };
    }
    
    console.log(`   🏷️  Type: ${metadata.type}`);
    console.log(`   🌐 Networks: ${metadata.networks.join(', ')}`);
    
    if (program.compilationResult.warnings && program.compilationResult.warnings.length > 0) {
      console.log(`   ⚠️  Warnings: ${program.compilationResult.warnings.length}`);
    }
  });

  console.log('\n🎯 All tests completed!');
  
  return programs;
}

/**
 * Export all examples for easy access
 */
export const examples = {
  createSimplePaymentProcessor,
  createCrossChainBridge,
  createCustomValidator,
  createTokenTransferWithFee,
  createHelloWorld,
  deploymentWorkflow,
  testingWorkflow
};

/**
 * Example configuration for different networks
 */
export const networkConfigs = {
  solana: {
    network: SVMNetwork.SOLANA,
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
    debug: false
  } as BPFProgramConfig,
  
  sonic: {
    network: SVMNetwork.SONIC,
    rpcEndpoint: 'https://api.sonic.game',
    debug: false
  } as BPFProgramConfig,
  
  eclipse: {
    network: SVMNetwork.ECLIPSE,
    rpcEndpoint: 'https://mainnet.eclipse.xyz',
    debug: false
  } as BPFProgramConfig,
  
  soon: {
    network: SVMNetwork.SOON,
    rpcEndpoint: 'https://rpc.soon.network',
    debug: false
  } as BPFProgramConfig
};
# Assembly-BPF SDK for SVM-Pay

The Assembly-BPF SDK provides low-level Assembly and LLVM IR abstractions for developing BPF programs that work with SVM-Pay across all supported SVM networks.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Templates](#templates)
- [Examples](#examples)
- [Security](#security)
- [Network Support](#network-support)

## Overview

The Assembly-BPF SDK enables developers to create efficient, low-level BPF programs for payment processing, cross-chain bridging, and validation on SVM networks. It provides:

- **Assembly abstractions** for BPF instruction generation
- **Memory management utilities** for stack and heap operations
- **Syscall helpers** for SVM network interactions
- **Program templates** for common use cases
- **Compilation and deployment tools**
- **Cross-network compatibility**

## Installation

```bash
npm install svm-pay
```

## Quick Start

### Basic Hello World Program

```typescript
import { AssemblyBPFSDK, SVMNetwork, examples } from 'svm-pay/assembly-bpf';

// Create a simple hello world program
const { sdk, compilationResult, metadata } = await examples.createHelloWorld();

console.log('Program compiled:', compilationResult.success);
console.log('Assembly listing:', compilationResult.assembly);
```

### Simple Payment Processor

```typescript
import { 
  AssemblyBPFSDK, 
  BPFProgramConfig, 
  BPFTemplates, 
  SVMNetwork,
  SVMPayBPFProgramType 
} from 'svm-pay/assembly-bpf';

// Configure SDK
const config: BPFProgramConfig = {
  network: SVMNetwork.SOLANA,
  debug: true
};

const sdk = new AssemblyBPFSDK(config);

// Create payment processor using template
const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
  networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC]
});

// Compile the program
const compilationResult = await sdk.compile(instructions, metadata);

if (compilationResult.success) {
  console.log('✅ Payment processor compiled successfully');
  console.log(`📊 Instructions: ${instructions.length}`);
  console.log(`💾 Bytecode size: ${compilationResult.bytecode?.length} bytes`);
}
```

## Core Concepts

### BPF Instructions

The SDK uses an enum-based system for BPF instructions:

```typescript
import { BPFInstruction, BPFRegister } from 'svm-pay/assembly-bpf';

const instruction = {
  opcode: BPFInstruction.LOAD_IMM,
  dst: BPFRegister.R0,
  immediate: 42,
  comment: 'Load value 42 into R0'
};
```

### Program Builder Pattern

Use the builder pattern for complex programs:

```typescript
const metadata = BPFHelpers.createProgramMetadata(
  'Custom Payment Processor',
  SVMPayBPFProgramType.PAYMENT_PROCESSOR,
  [SVMNetwork.SOLANA]
);

const builder = sdk.createProgram(metadata);

builder
  .addInstructions(BPFHelpers.createDebugLog('Starting payment'))
  .addPaymentProcessor()
  .addInstructions(BPFHelpers.createDebugLog('Payment completed'));

const compilationResult = await builder.compile();
```

### Memory Management

The SDK provides utilities for memory operations:

```typescript
const memoryManager = sdk.getMemoryManager();

// Allocate stack space
const allocateInstructions = memoryManager.allocateStack(64);

// Store and load values
const storeInstr = memoryManager.storeMemory(BPFRegister.R1, -8);
const loadInstr = memoryManager.loadMemory(BPFRegister.R2, -8);

// Create data structures
const structInstructions = memoryManager.createStructureLayout([
  { name: 'amount', size: 8, value: 1000000 },
  { name: 'recipient', size: 32 },
  { name: 'memo', size: 64 }
]);
```

## API Reference

### AssemblyBPFSDK

Main SDK class for BPF development.

#### Constructor

```typescript
constructor(config: BPFProgramConfig)
```

#### Methods

- `createProgram(metadata: BPFProgramMetadata): BPFProgramBuilder`
- `compile(instructions: AssemblyInstruction[], metadata: BPFProgramMetadata): Promise<BPFCompilationResult>`
- `deploy(bytecode: Uint8Array, metadata: BPFProgramMetadata): Promise<BPFDeploymentResult>`
- `validateProgram(bytecode: Uint8Array): Promise<{ valid: boolean; issues: string[] }>`

### BPFTemplates

Pre-built program templates for common use cases.

#### Payment Processor

```typescript
BPFTemplates.createPaymentProcessor({
  tokenMint?: PublicKey,
  feeAccount?: PublicKey,
  networks: SVMNetwork[]
})
```

#### Cross-Chain Bridge

```typescript
BPFTemplates.createCrossChainBridge({
  supportedChains: number[],
  bridgeAuthority: PublicKey,
  networks: SVMNetwork[]
})
```

#### Payment Validator

```typescript
BPFTemplates.createPaymentValidator({
  minAmount: number,
  maxAmount: number,
  allowedTokens: PublicKey[],
  networks: SVMNetwork[]
})
```

### BPFHelpers

Utility functions for common BPF operations.

#### Helper Functions

- `createPaymentValidator(): AssemblyInstruction[]`
- `createTokenTransfer(): AssemblyInstruction[]`
- `createCrossChainBridge(): AssemblyInstruction[]`
- `createErrorHandler(errorCode: number): AssemblyInstruction[]`
- `createDebugLog(message: string): AssemblyInstruction[]`

#### Validation Functions

- `createOwnershipCheck(expectedOwner: PublicKey): AssemblyInstruction[]`
- `createBalanceCheck(minBalance: number): AssemblyInstruction[]`
- `createSignatureVerification(): AssemblyInstruction[]`
- `createTimeValidation(maxAge: number): AssemblyInstruction[]`

## Templates

### Available Templates

1. **Payment Processor** - Basic payment processing with optional fees
2. **Cross-Chain Bridge** - Bridge assets between different chains
3. **Payment Validator** - Validate payment parameters and constraints
4. **Token Transfer** - Handle SPL token transfers with validation
5. **Middleware** - Custom middleware with pre/post hooks
6. **Hello World** - Minimal program for testing

### Template Usage

```typescript
import { BPFTemplates, SVMNetwork, PublicKey } from 'svm-pay/assembly-bpf';

// Create a comprehensive payment flow
const { metadata, instructions } = BPFTemplates.createPaymentFlow({
  tokenMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
  feeAccount: new PublicKey('FeeAccount1111111111111111111111111111111'),
  feeRate: 50, // 0.5% fee
  networks: [SVMNetwork.SOLANA, SVMNetwork.ECLIPSE]
});
```

## Examples

### Complete Deployment Workflow

```typescript
import { examples } from 'svm-pay/assembly-bpf';

// Run complete deployment workflow
const result = await examples.deploymentWorkflow();

if (result.success) {
  console.log('🎉 Program deployed successfully!');
  console.log(`📍 Program ID: ${result.programId}`);
}
```

### Custom Validator

```typescript
import { 
  AssemblyBPFSDK, 
  BPFHelpers, 
  BPFInstruction, 
  BPFRegister,
  SVMNetwork,
  SVMPayBPFProgramType 
} from 'svm-pay/assembly-bpf';

const sdk = new AssemblyBPFSDK({ network: SVMNetwork.SONIC, debug: true });

const metadata = BPFHelpers.createProgramMetadata(
  'Custom Validator',
  SVMPayBPFProgramType.VALIDATOR,
  [SVMNetwork.SONIC]
);

const builder = sdk.createProgram(metadata);

// Add custom validation logic
builder.addInstructions([
  {
    opcode: BPFInstruction.LOAD,
    dst: BPFRegister.R2,
    src: BPFRegister.R1,
    offset: 8,
    comment: 'Load payment amount'
  },
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
  }
]);

const result = await builder.compile();
```

### Testing Multiple Programs

```typescript
import { examples } from 'svm-pay/assembly-bpf';

// Test multiple program types
const programs = await examples.testingWorkflow();

console.log('📊 Testing Results:');
programs.forEach((program, index) => {
  console.log(`${index + 1}. ${program.metadata.name}: ${
    program.compilationResult.success ? 'SUCCESS' : 'FAILED'
  }`);
});
```

## Security

### Program Validation

The SDK includes security validation:

```typescript
const validation = await sdk.validateProgram(bytecode);

if (!validation.valid) {
  console.log('❌ Security issues found:');
  validation.issues.forEach(issue => console.log(`  - ${issue}`));
}
```

### Security Features

- **Size limits** - Programs are limited to reasonable sizes
- **Instruction validation** - Prohibited instructions are detected
- **Memory bounds checking** - Stack and heap overflow protection
- **Network-specific validation** - Chain-specific requirements

### Best Practices

1. **Always validate programs** before deployment
2. **Use templates** for common patterns to avoid security issues
3. **Test thoroughly** on testnets before mainnet deployment
4. **Keep programs minimal** to reduce attack surface
5. **Use debug mode** during development

## Network Support

### Supported Networks

- **Solana** - Original SVM blockchain
- **Sonic SVM** - Game-focused chain extension
- **Eclipse** - SVM on Ethereum
- **s00n (SOON)** - Ethereum L2 with SVM

### Network-Specific Features

```typescript
// Configure for specific networks
const networkConfigs = {
  solana: {
    network: SVMNetwork.SOLANA,
    rpcEndpoint: 'https://api.mainnet-beta.solana.com'
  },
  sonic: {
    network: SVMNetwork.SONIC,
    rpcEndpoint: 'https://api.sonic.game'
  },
  eclipse: {
    network: SVMNetwork.ECLIPSE,
    rpcEndpoint: 'https://mainnet.eclipse.xyz'
  },
  soon: {
    network: SVMNetwork.SOON,
    rpcEndpoint: 'https://rpc.soon.network'
  }
};
```

### Cross-Network Programs

```typescript
// Create programs that work across multiple networks
const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
  networks: [
    SVMNetwork.SOLANA,
    SVMNetwork.SONIC,
    SVMNetwork.ECLIPSE,
    SVMNetwork.SOON
  ]
});
```

## Advanced Usage

### Custom Syscalls

```typescript
const syscallHelper = sdk.getSyscallHelper();

// Create custom syscall instructions
const customInstructions = [
  ...syscallHelper.createPDAInstructions(['payment', 'authority']),
  ...syscallHelper.createSignatureVerification(),
  ...syscallHelper.createTimeValidation(300) // 5 minutes
];
```

### Memory Optimization

```typescript
const memoryManager = sdk.getMemoryManager();

// Optimize memory layout
const optimizedLayout = memoryManager.createStructureLayout([
  { name: 'header', size: 8, value: 0x1234 },
  { name: 'data', size: 256 },
  { name: 'footer', size: 8, value: 0x5678 }
]);

// Update memory configuration
memoryManager.updateLayout({
  stackSize: 8192,
  heapSize: 131072
});
```

### Assembly Optimization

```typescript
const assembler = sdk.getAssembler();

// Optimize instruction sequence
let instructions = builder.getInstructions();
instructions = assembler.optimize(instructions);

// Estimate costs
const computeUnits = assembler.estimateComputeUnits(instructions);
console.log(`Estimated compute units: ${computeUnits}`);
```

## Troubleshooting

### Common Issues

1. **Compilation Failures**
   - Check instruction syntax
   - Validate register usage
   - Ensure proper program structure

2. **Deployment Errors**
   - Verify network configuration
   - Check account permissions
   - Validate bytecode format

3. **Runtime Errors**
   - Add debug logging
   - Check memory bounds
   - Validate syscall usage

### Debug Tips

```typescript
// Enable debug mode
const sdk = new AssemblyBPFSDK({ 
  network: SVMNetwork.SOLANA, 
  debug: true 
});

// Add debug logging
builder.addInstructions(
  BPFHelpers.createDebugLog('Checkpoint: validation complete')
);

// Use testing workflow
const results = await examples.testingWorkflow();
```

## Contributing

The Assembly-BPF SDK is part of the SVM-Pay project. Contributions are welcome:

1. Report issues
2. Submit feature requests
3. Contribute code improvements
4. Add new templates
5. Improve documentation

## License

MIT License - see the main SVM-Pay project for details.
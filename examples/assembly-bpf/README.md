# Assembly-BPF SDK Examples

This directory contains comprehensive examples demonstrating the Assembly-BPF SDK capabilities for low-level BPF program development with SVM-Pay.

## Overview

The Assembly-BPF SDK provides direct access to Berkeley Packet Filter (BPF) programming for creating high-performance, low-level payment programs that work across all supported SVM networks.

## Examples

### 1. Demo (`demo.js`)
**Comprehensive demonstration of all Assembly-BPF SDK features**

This is the main demo showcasing:
- Hello World program compilation
- Payment processor creation
- Custom program building
- Program validation
- Memory management
- Compute unit estimation
- Multi-network support

```bash
node demo.js
```

### 2. Hello World (`hello-world.js`)
**Simple BPF program for debugging and basic operations**

- Minimal BPF program structure
- Basic assembly code generation
- Bytecode analysis
- Program metadata inspection

```bash
node hello-world.js
```

### 3. Payment Processor (`payment-processor.js`)
**Low-level payment processing program**

Features:
- Multi-network support (Solana, Sonic, Eclipse)
- Fee handling with configurable rates
- Input validation and error handling
- Secure recipient verification
- Transaction metadata logging

```bash
node payment-processor.js
```

### 4. Custom Validator (`custom-validator.js`)
**Advanced custom payment validation logic**

Demonstrates:
- Manual instruction assembly
- BPF register management
- Conditional logic and jumps
- Custom error codes
- Memory access patterns

Validation Rules:
- Minimum amount: 1000 lamports
- Amount must be multiple of 1000
- Non-null recipient address
- Custom error codes for different failure cases

```bash
node custom-validator.js
```

### 5. Memory Management (`memory-management.js`)
**Advanced memory allocation and data structure management**

Features:
- Payment data structure layout
- Stack allocation strategies
- Memory access pattern generation
- Memory optimization analysis
- Code-to-data ratio monitoring

```bash
node memory-management.js
```

## Prerequisites

Make sure you have built the SVM-Pay project:

```bash
# From the project root
npm run build
```

## Running Examples

Each example can be run independently:

```bash
# Run individual examples
node hello-world.js
node payment-processor.js
node custom-validator.js
node memory-management.js

# Run the comprehensive demo
node demo.js
```

## Example Output

### Hello World Example
```
🚀 Assembly-BPF Hello World Example
========================================
✅ Hello World program compiled successfully
📋 Program Name: Hello World Program
🔧 Program Type: MIDDLEWARE
🌐 Target Networks: solana

📜 Generated Assembly Code:
------------------------------
0000: ldi     r1, 1745172467 ; Debug: Hello from SVM-Pay Assembly-BPF SDK!
0001: call    1 ; Log debug message
0002: ldi     r0, 0 ; Return success
0003: exit    r0 ; Exit program

💾 Bytecode Size: 32 bytes
📊 First 16 bytes: 0x18 0x01 0x00 0x00 0x33 0x44 0x77 0x68 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00
```

### Payment Processor Example
```
🚀 Assembly-BPF Payment Processor Example
=============================================
✅ SDK initialized for solana
📋 Program: Payment Processor
🌐 Networks: solana, sonic, eclipse
📝 Instructions: 19

⚡ Compiling payment processor...
✅ Payment processor compiled successfully
💾 Bytecode size: 152 bytes

📊 Estimated compute units: 206
💰 Estimated cost: ~0.001030 SOL

🔍 Validating program...
✅ Program validation: PASSED
```

## Key Concepts

### BPF Instructions
The SDK uses an enum-based system for BPF instructions:
- `LOAD` - Load data from memory
- `LOAD_IMM` - Load immediate value
- `ADD`, `SUB`, `MUL`, `DIV` - Arithmetic operations
- `JUMP_IF_EQUAL`, `JUMP_IF_GREATER` - Conditional jumps
- `CALL` - System call
- `EXIT` - Program termination

### Registers
BPF programs use 10 registers (R0-R9):
- `R0` - Return value register
- `R1-R5` - Function argument registers
- `R6-R9` - Callee-saved registers
- `R10` - Frame pointer (read-only)

### Memory Management
- Stack allocation for temporary data
- Structure layout for complex data
- Memory bounds checking
- Alignment optimization

## Network Support

All examples support multiple SVM networks:
- **Solana** - Original SVM blockchain
- **Sonic SVM** - Game-focused chain extension  
- **Eclipse** - SVM on Ethereum
- **Soon (SOON)** - Ethereum L2 with SVM

## Error Handling

Examples include comprehensive error handling:
- Compilation errors with detailed messages
- Runtime validation failures
- Memory allocation issues
- Network-specific constraints

## Performance Metrics

Examples demonstrate performance analysis:
- Compute unit estimation
- Memory usage calculation
- Code-to-data ratio analysis
- Bytecode size optimization

## Security Features

- Program validation with size limits
- Instruction validation and security checks
- Memory safety with bounds checking
- Network compliance validation
- Sandboxed execution environment

## Next Steps

1. **Explore the Documentation**: Check `docs/assembly-bpf/` for detailed API reference
2. **Try Custom Programs**: Modify examples to create your own BPF programs
3. **Deploy to Testnet**: Use `sdk.deploy()` to deploy programs for testing
4. **Integration Testing**: Test programs with actual payment flows
5. **Production Deployment**: Follow security guidelines for mainnet deployment

## Troubleshooting

### Common Issues

1. **Module Not Found**: Ensure you've run `npm run build` from the project root
2. **Compilation Failures**: Check instruction syntax and register usage
3. **Validation Errors**: Verify network configuration and program constraints
4. **Memory Issues**: Review stack allocation and structure alignment

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const sdk = new AssemblyBPFSDK({ 
  network: SVMNetwork.SOLANA,
  debug: true 
});
```

## Contributing

To contribute new examples:

1. Follow the existing naming convention
2. Include comprehensive error handling
3. Add detailed comments and documentation
4. Test across multiple networks
5. Update this README with your example

## Resources

- [Assembly-BPF SDK Documentation](../../docs/assembly-bpf/)
- [SVM-Pay Main Documentation](../../docs/)
- [BPF Instruction Reference](../../docs/assembly-bpf/api-reference.md)
- [Security Best Practices](../../docs/assembly-bpf/security.md)
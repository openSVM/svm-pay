# Assembly-BPF SDK Security Patterns and Best Practices

This document provides comprehensive security patterns and best practices for developing secure BPF programs using the Assembly-BPF SDK.

## Table of Contents

1. [Integer Overflow Protection](#integer-overflow-protection)
2. [Memory Safety Patterns](#memory-safety-patterns)
3. [Division Safety](#division-safety)
4. [Bounds Checking](#bounds-checking)
5. [Cross-Chain Security](#cross-chain-security)
6. [Register Management](#register-management)
7. [Control Flow Security](#control-flow-security)
8. [Common Vulnerabilities](#common-vulnerabilities)

## Integer Overflow Protection

### Problem
Integer overflow can lead to unexpected behavior, allowing attackers to bypass security checks or cause program crashes.

### Solution
Always validate arithmetic operations before performing them:

```assembly
; BAD: Direct addition without overflow check
add64 r1, r2

; GOOD: Check for overflow before addition
jgt r1, 0x7FFFFFFFFFFFFFFF, overflow_handler
jgt r2, 0x7FFFFFFFFFFFFFFF, overflow_handler
sub64 r3, 0x7FFFFFFFFFFFFFFF, r1  ; Calculate remaining capacity
jgt r2, r3, overflow_handler        ; Check if addition would overflow
add64 r1, r2                        ; Safe to add
```

### TypeScript Implementation
```typescript
import { BPFInstruction, BPFRegister } from 'svm-pay/assembly-bpf';

// Create overflow-safe addition
const safeAdd = (dst: BPFRegister, src: BPFRegister): AssemblyInstruction[] => [
  {
    opcode: BPFInstruction.JUMP_GT,
    dst,
    immediate: 0x7FFFFFFFFFFFFFFF,
    offset: 10, // Jump to error handler
    comment: 'Check dst for overflow potential'
  },
  {
    opcode: BPFInstruction.JUMP_GT,
    dst: src,
    immediate: 0x7FFFFFFFFFFFFFFF,
    offset: 9,
    comment: 'Check src for overflow potential'
  },
  {
    opcode: BPFInstruction.LOAD_IMM,
    dst: BPFRegister.R8,
    immediate: 0x7FFFFFFFFFFFFFFF,
    comment: 'Load max value'
  },
  {
    opcode: BPFInstruction.SUB64,
    dst: BPFRegister.R8,
    src: dst,
    comment: 'Calculate remaining capacity'
  },
  {
    opcode: BPFInstruction.JUMP_GT,
    dst: src,
    src: BPFRegister.R8,
    offset: 5,
    comment: 'Check if addition would overflow'
  },
  {
    opcode: BPFInstruction.ADD64,
    dst,
    src,
    comment: 'Safe addition'
  }
];
```

## Memory Safety Patterns

### Stack Protection
Always validate stack access and use guard pages:

```assembly
; Allocate buffer with guard pages
lddw r1, 256                    ; Buffer size
call allocate_guarded_buffer    ; Custom allocation with guards
jeq r0, 0, allocation_error    ; Check allocation success

; Before accessing buffer, validate guards
ldx r2, [r7-8]                 ; Load pre-guard
jne r2, 0xDEADBEEF, corruption ; Check guard integrity
ldx r2, [r7+256]               ; Load post-guard  
jne r2, 0xDEADBEEF, corruption ; Check guard integrity
```

### Bounds Checking
Validate all memory accesses:

```assembly
; BAD: Direct memory access
ldx r1, [r2+offset]

; GOOD: Bounds-checked access
jlt offset, 0, bounds_error          ; Check lower bound
jge offset, buffer_size, bounds_error ; Check upper bound
add64 r3, r2, offset                 ; Calculate address
ldx r1, [r3]                         ; Safe access
```

### TypeScript Implementation
```typescript
const createBoundsCheckedAccess = (
  register: BPFRegister,
  baseReg: BPFRegister,
  offset: number,
  bufferSize: number
): AssemblyInstruction[] => [
  {
    opcode: BPFInstruction.JUMP_LT,
    dst: BPFRegister.R8, // Assume offset is in R8
    immediate: 0,
    offset: 5,
    comment: 'Check lower bound'
  },
  {
    opcode: BPFInstruction.JUMP_GE,
    dst: BPFRegister.R8,
    immediate: bufferSize,
    offset: 4,
    comment: 'Check upper bound'
  },
  {
    opcode: BPFInstruction.ADD64,
    dst: BPFRegister.R9,
    src: baseReg,
    comment: 'Calculate address'
  },
  {
    opcode: BPFInstruction.ADD64,
    dst: BPFRegister.R9,
    src: BPFRegister.R8,
    comment: 'Add offset'
  },
  {
    opcode: BPFInstruction.LOAD_MEM,
    dst: register,
    src: BPFRegister.R9,
    comment: 'Safe memory access'
  }
];
```

## Division Safety

### Zero Division Prevention
Always check divisor before division:

```assembly
; BAD: Direct division
div64 r1, r2

; GOOD: Check for zero divisor
jeq r2, 0, division_error    ; Check for zero
jlt r2, 0, negative_divisor  ; Optional: handle negative divisors
div64 r1, r2                 ; Safe division
```

### Safe Modulo Operations
```assembly
; Safe modulo with validation
jeq r2, 0, modulo_error     ; Check divisor
jeq r2, 1, modulo_is_zero   ; r1 % 1 is always 0
mod64 r1, r2                ; Safe modulo

modulo_is_zero:
ldi r1, 0                   ; Result is 0
ja continue

modulo_error:
ldi r0, 1                   ; Error code
exit r0
```

## Cross-Chain Security

### Bridge Validation
Always validate cross-chain operations:

```assembly
; Load source and destination chain IDs
ldx r1, [r6+0]              ; Source chain
ldx r2, [r6+8]              ; Destination chain

; Validate allowed chain pairs
call validate_bridge_pair    ; Custom validation
jeq r0, 0, invalid_bridge   ; Check result

; Validate transfer amount
ldx r3, [r6+16]             ; Transfer amount
jgt r3, max_bridge_amount, amount_too_large
jle r3, 0, invalid_amount   ; Must be positive

; Validate account ownership
call verify_account_owner    ; Verify sender owns account
jeq r0, 0, unauthorized     ; Check ownership

; Proceed with bridge operation
call execute_bridge         ; Execute the bridge
```

### Fee Calculation Security
```typescript
const createSecureFeeCalculation = (
  amount: BPFRegister,
  feeRate: number // In basis points (1/10000)
): AssemblyInstruction[] => [
  // Validate fee rate is reasonable (< 10%)
  {
    opcode: BPFInstruction.JUMP_GT,
    dst: BPFRegister.R5, // Assume fee rate in R5
    immediate: 1000, // 10% in basis points
    offset: 15,
    comment: 'Validate fee rate <= 10%'
  },
  
  // Check for multiplication overflow
  {
    opcode: BPFInstruction.LOAD_IMM,
    dst: BPFRegister.R6,
    immediate: 0xFFFFFFFFFFFFFFFF / 10000, // Max safe value
    comment: 'Load max safe amount for fee calc'
  },
  {
    opcode: BPFInstruction.JUMP_GT,
    dst: amount,
    src: BPFRegister.R6,
    offset: 12,
    comment: 'Check multiplication would not overflow'
  },
  
  // Calculate fee
  {
    opcode: BPFInstruction.MUL64,
    dst: BPFRegister.R7,
    src: amount,
    comment: 'Copy amount'
  },
  {
    opcode: BPFInstruction.MUL64,
    dst: BPFRegister.R7,
    src: BPFRegister.R5,
    comment: 'Multiply by fee rate'
  },
  {
    opcode: BPFInstruction.LOAD_IMM,
    dst: BPFRegister.R8,
    immediate: 10000,
    comment: 'Load basis point divisor'
  },
  {
    opcode: BPFInstruction.DIV64,
    dst: BPFRegister.R7,
    src: BPFRegister.R8,
    comment: 'Calculate final fee'
  }
];
```

## Register Management

### Register Initialization
Always initialize registers before use:

```assembly
; BAD: Using potentially uninitialized register
add64 r1, r3

; GOOD: Initialize all registers
ldi r3, 0        ; Initialize to known value
add64 r1, r3     ; Safe to use
```

### Register Cleanup
Clean up sensitive data from registers:

```assembly
; After processing sensitive data
ldi r1, 0        ; Clear sensitive register
ldi r2, 0        ; Clear sensitive register
ldi r3, 0        ; Clear sensitive register
```

## Control Flow Security

### Return Address Protection
Protect against ROP attacks:

```assembly
; Store return address in protected location
stx [r10-8], r1           ; Store return address on stack
call protected_function   ; Make call
ldx r1, [r10-8]          ; Restore return address
; Validate return address hasn't been tampered with
```

### Jump Table Validation
Validate jump targets:

```assembly
; Validate jump target is within bounds
jlt r1, 0, invalid_target
jge r1, max_functions, invalid_target
; Multiply by function size to get offset
lsh64 r1, 3              ; Assuming 8-byte function pointers
add64 r1, function_table ; Add to base address
ja r1                    ; Safe indirect jump
```

## Common Vulnerabilities

### 1. Time-of-Check Time-of-Use (TOCTOU)
```assembly
; BAD: Account balance can change between check and use
ldx r1, [account_balance]   ; Check balance
jlt r1, transfer_amount, insufficient_funds
; ... other operations that might modify balance
sub64 r1, transfer_amount   ; Use balance (might be different now!)

; GOOD: Atomic check-and-update
ldx r1, [account_balance]
jlt r1, transfer_amount, insufficient_funds
sub64 r1, transfer_amount
stx [account_balance], r1   ; Immediate update
```

### 2. Integer Truncation
```assembly
; BAD: Truncating 64-bit value to 32-bit
and32 r1, 0xFFFFFFFF     ; Loses upper 32 bits

; GOOD: Validate value fits in target size
jgt r1, 0xFFFFFFFF, value_too_large
and32 r1, 0xFFFFFFFF     ; Safe truncation
```

### 3. Unchecked Return Values
```assembly
; BAD: Not checking syscall return value
call sol_transfer        ; Transfer syscall
; Continue regardless of success/failure

; GOOD: Always check return values
call sol_transfer        ; Transfer syscall
jne r0, 0, transfer_failed ; Check for failure
```

## Security Checklist

Before deploying BPF programs, ensure:

- [ ] All arithmetic operations check for overflow
- [ ] All division operations check for zero divisor
- [ ] All memory accesses are bounds-checked
- [ ] All registers are initialized before use
- [ ] All syscall return values are checked
- [ ] All jump targets are validated
- [ ] Sensitive data is cleared from registers
- [ ] Stack usage stays within limits
- [ ] No undefined behavior patterns
- [ ] Cross-chain operations are properly validated

## Testing Security Patterns

Use the Assembly-BPF SDK's built-in security validation:

```typescript
import { BPFValidator, BPF_SECURITY_PATTERNS } from 'svm-pay/assembly-bpf';

const validator = new BPFValidator({
  strictOpcodes: true,
  validateInstructionClass: true,
  validate64BitImmediates: true,
  validateMemoryAccess: true,
  maxStackDepth: 64,
  securityValidation: true
});

const issues = validator.validate(instructions);
const securityIssues = issues.filter(issue => 
  issue.severity === 'error' || 
  issue.pattern.includes('security')
);

console.log('Security validation results:', securityIssues);
```

## Further Reading

- [BPF Security Guidelines](https://docs.solana.com/developing/programming-model/security)
- [Common BPF Vulnerabilities](https://solana.com/security)
- [Assembly-BPF SDK API Reference](./api-reference.md)
- [Integration Testing Guide](./integration-testing.md)
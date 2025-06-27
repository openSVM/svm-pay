# Security Best Practices for SVM-Pay

This document outlines security best practices for using SVM-Pay in development and production environments.

## 🔐 Private Key Security

### Critical Issues Addressed

The SVM-Pay codebase has been enhanced to address security concerns around private key handling:

1. **fromPubkey Placeholder Usage**: Clear documentation prevents wallet confusion
2. **Private Key Storage**: Enhanced warnings and environment variable recommendations
3. **Concurrency Safety**: Warnings about in-memory store limitations for production

### Recommended Security Practices

#### 1. Environment Variables (Recommended)
```bash
# Set environment variables for secure key storage
export SVM_PAY_PRIVATE_KEY="your-private-key-here"
export SVM_PAY_API_KEY="your-openrouter-api-key"
export SVM_PAY_ENCRYPTION_KEY="your-custom-encryption-key"
```

Environment variables take precedence over config files and are more secure.

#### 2. Hardware Wallets (Production)
For production use, integrate with hardware wallets:
- Ledger
- Trezor
- Hardware Security Modules (HSMs)

#### 3. Key Management Services
For enterprise deployments:
- AWS Key Management Service (KMS)
- HashiCorp Vault
- Azure Key Vault
- Google Cloud KMS

#### 4. Encrypted Storage
The payment history supports encryption:
```typescript
import { setEncryptionEnabled } from './src/cli/utils/history';

// Enable encryption for payment history
setEncryptionEnabled(true);
```

## ⚠️ Placeholder Usage Warning

### fromPubkey Placeholders

In the network adapters, you'll see placeholder public keys like `'11111111111111111111111111111111'`. These are intentional and serve important purposes:

```typescript
// This is CORRECT - placeholder will be replaced by wallet
const transferInstruction = SystemProgram.transfer({
  fromPubkey: new PublicKey('11111111111111111111111111111111'), // PLACEHOLDER
  toPubkey: recipientPubkey,
  lamports: amount,
});
```

**Why placeholders are used:**
- Prevents wallet confusion during transaction construction
- Allows transaction structure validation without requiring the actual sender
- Will be replaced with real wallet public key during signing process

**When NOT to use placeholders:**
- CLI direct transactions (where you have the private key)
- Server-side transactions with known keypairs

## 🏗️ Production Scaling Considerations

### In-Memory Store Limitations

The current `MemoryPaymentStore` has limitations:

```typescript
⚠️  CONCURRENCY & SCALING LIMITATIONS:
- NO CONCURRENCY SAFETY: Multiple operations can cause data corruption
- NO PERSISTENCE: Data lost on restart
- NO SCALING: Single-process memory constraints
- NO DISTRIBUTION: Cannot share across instances
```

### Recommended Production Alternatives

1. **Database-Backed Store**
```typescript
class PostgreSQLPaymentStore implements PaymentStore {
  // Implement with proper transactions and concurrency control
}
```

2. **Redis with Persistence**
```typescript
class RedisPaymentStore implements PaymentStore {
  // Implement with Redis transactions and AOF/RDB persistence
}
```

3. **Microservice Architecture**
- Dedicated payment storage service
- Event sourcing for payment state changes
- CQRS for read/write separation

## 🚨 Security Warnings in Code

The codebase now includes prominent security warnings:

### Config File Warnings
```
🔐 CRITICAL SECURITY WARNING:
═══════════════════════════════════════════════════════════════
Private keys are being stored in PLAIN TEXT at: ~/.svm-pay/config.json
This is EXTREMELY DANGEROUS in production environments!
```

### CLI Command Warnings
- Setup command warns before storing private keys
- Pay command shows security notices for config file usage
- Force mode displays prominent danger warnings

### Store Concurrency Warnings
```
⚠️  CONCURRENCY WARNING: Multiple concurrent operations detected
   This can lead to data corruption. Consider upgrading to a database-backed store.
```

## 🛡️ Implementation Checklist

For production deployment, ensure:

- [ ] Private keys stored in secure key management system
- [ ] Environment variables used instead of config files
- [ ] Database-backed payment store implemented
- [ ] Proper transaction handling with ACID properties
- [ ] Audit logging for all payment operations
- [ ] Rate limiting and request validation
- [ ] Network security (TLS, VPNs, firewalls)
- [ ] Regular security audits and penetration testing

## 📞 Security Support

For security-related questions or to report vulnerabilities:
- Create a security-focused GitHub issue
- Follow responsible disclosure practices
- Consider the impact before public disclosure

Remember: **Security is not optional for financial applications!**
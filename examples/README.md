# SVM-Pay Examples

This directory contains comprehensive examples demonstrating SVM-Pay integration across different languages, frameworks, and use cases.

## Examples by Language/Platform

### JavaScript/TypeScript Examples

- **[web-payment-demo.jsx](./web-payment-demo.jsx)** - Basic web payment integration with React
- **[point-of-sale-demo.tsx](./point-of-sale-demo.tsx)** - Point-of-sale terminal implementation
- **[subscription-payment-demo.tsx](./subscription-payment-demo.tsx)** - Subscription payment processing
- **[cross-chain-payment-demo.html](./cross-chain-payment-demo.html)** - Cross-chain payment flows
- **[wallet-connect-demo.html](./wallet-connect-demo.html)** - WalletConnect integration
- **[wallet-connect-test.tsx](./wallet-connect-test.tsx)** - WalletConnect testing utilities

### C++ SDK Examples

- **[cpp-examples/](./cpp-examples/)** - Complete C++ SDK examples
  - **[basic-payment/](./cpp-examples/basic-payment/)** - Simple payment URL creation and processing
  - **[url-parsing/](./cpp-examples/url-parsing/)** - URL parsing and validation examples
  - **[network-adapters/](./cpp-examples/network-adapters/)** - Working with different network adapters

### Assembly-BPF Examples

- **[assembly-bpf/](./assembly-bpf/)** - Low-level BPF program examples
  - Payment processor programs
  - Cross-chain bridge implementations
  - Custom middleware and validation programs

### Integration Examples

- **[n8n-integration/](./n8n-integration/)** - Workflow automation with n8n
  - Payment workflow nodes
  - Automated payment processing
  - Integration templates

## Getting Started

### Prerequisites

**For JavaScript/TypeScript examples:**
```bash
npm install svm-pay
```

**For C++ examples:**
```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get install build-essential cmake libcurl4-openssl-dev libssl-dev

# Build and install C++ SDK
cd ../cpp-sdk
mkdir build && cd build
cmake ..
make install
```

**For Assembly-BPF examples:**
```bash
npm install svm-pay
# Assembly-BPF SDK is included with the main package
```

### Running Examples

**Web examples:**
Most HTML examples can be opened directly in a browser or served with a local HTTP server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

**React/TypeScript examples:**
```bash
# Copy example code into your React project
# Or use the examples as templates for new components
```

**C++ examples:**
```bash
cd cpp-examples
mkdir build && cd build
cmake ..
make

# Run individual examples
./basic-payment/basic_payment
./url-parsing/url_parsing
./network-adapters/network_adapter
```

## Example Categories

### Basic Payment Processing
- Simple transfers
- SPL token payments
- Payment URL creation and parsing
- Transaction validation

### Advanced Features
- Cross-chain payments
- Network adapter usage
- Asynchronous operations
- Error handling patterns

### Real-World Applications
- E-commerce integration
- Point-of-sale systems
- Subscription billing
- Multi-network support

### Integration Patterns
- React components
- Vue.js integration
- Angular services
- Server-side processing
- Mobile applications

## Documentation

For detailed documentation and tutorials:
- [Main Documentation](../docs/)
- [C++ SDK Documentation](../cpp-sdk/README.md)
- [Assembly-BPF SDK](../docs/assembly-bpf/)
- [Developer Guide](../docs/developer-guide.md)

## Contributing

To contribute new examples:
1. Follow the existing example structure
2. Include comprehensive README files
3. Add appropriate comments and documentation
4. Test across different environments
5. Submit a pull request

## Support

For questions about examples or integration:
- Check the [documentation](../docs/)
- Review existing examples for patterns
- Open an issue for specific problems
- Join our community discussions
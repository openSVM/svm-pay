# SVM-Pay C++ SDK

A comprehensive C++ SDK for SVM-Pay, providing payment solutions for SVM networks (Solana, Sonic SVM, Eclipse, s00n).

## Features

- 🔗 **URL Scheme Support**: Parse and create payment URLs following the SVM-Pay protocol
- 🌐 **Multi-Network**: Support for Solana, Sonic, Eclipse, and s00n networks  
- 🔐 **Secure Reference Generation**: Cryptographically secure reference ID generation
- 🚀 **Async Network Operations**: Asynchronous network adapter interface
- 🛡️ **Type Safety**: Strong typing with C++17 features
- 📦 **Easy Integration**: CMake-based build system with package support
- 🧪 **Well Tested**: Comprehensive unit tests included

## Quick Start

### Prerequisites

- C++17 compatible compiler
- CMake 3.16 or higher
- cURL library
- OpenSSL library
- Google Test (optional, for running tests)

### Installation

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install build-essential cmake libcurl4-openssl-dev libssl-dev libgtest-dev
```

#### macOS
```bash
brew install cmake curl openssl googletest
```

#### Windows (vcpkg)
```bash
vcpkg install curl openssl gtest
```

### Building

```bash
# Clone the repository
git clone https://github.com/openSVM/svm-pay.git
cd svm-pay/cpp-sdk

# Create build directory
mkdir build && cd build

# Configure and build
cmake ..
make

# Run tests (optional)
ctest

# Install (optional)
sudo make install
```

### Basic Usage

```cpp
#include <svm-pay/svm_pay.hpp>
#include <iostream>

int main() {
    // Initialize the SDK
    svm_pay::initialize_sdk();
    
    // Create a client
    svm_pay::Client client(svm_pay::SVMNetwork::SOLANA);
    
    // Create a payment URL
    std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
    std::string amount = "1.5";
    
    std::unordered_map<std::string, std::string> options = {
        {"label", "Coffee Shop"},
        {"message", "Payment for coffee"},
        {"memo", "Order #12345"}
    };
    
    std::string payment_url = client.create_transfer_url(recipient, amount, options);
    std::cout << "Payment URL: " << payment_url << std::endl;
    
    // Parse a payment URL
    auto request = client.parse_url(payment_url);
    std::cout << "Recipient: " << request->recipient << std::endl;
    
    // Generate a reference ID
    std::string reference = client.generate_reference();
    std::cout << "Reference: " << reference << std::endl;
    
    // Cleanup
    svm_pay::cleanup_sdk();
    
    return 0;
}
```

## API Reference

### Core Classes

#### `svm_pay::Client`

The main client class for interacting with the SVM-Pay SDK.

```cpp
class Client {
public:
    explicit Client(SVMNetwork default_network = SVMNetwork::SOLANA);
    
    // Create payment URLs
    std::string create_transfer_url(const std::string& recipient, 
                                   const std::string& amount,
                                   const std::unordered_map<std::string, std::string>& options = {});
    
    std::string create_transaction_url(const std::string& recipient,
                                      const std::string& link,
                                      const std::unordered_map<std::string, std::string>& options = {});
    
    // Parse payment URLs
    std::unique_ptr<PaymentRequest> parse_url(const std::string& url);
    
    // Generate reference IDs
    std::string generate_reference(size_t length = 32);
    
    // Network management
    void set_default_network(SVMNetwork network);
    SVMNetwork get_default_network() const;
    
    // Reference parsing configuration
    void set_max_references(size_t max_references);  // Default: 10
    size_t get_max_references() const;
    
    // Adapter management
    void register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter);
    NetworkAdapter* get_adapter(SVMNetwork network);
};
```

#### Payment Request Types

```cpp
enum class RequestType {
    TRANSFER,
    TRANSACTION,
    CROSS_CHAIN_TRANSFER
};

struct TransferRequest : public PaymentRequest {
    std::string amount;
    std::optional<std::string> spl_token;
    // ... other fields
};

struct TransactionRequest : public PaymentRequest {
    std::string link;
    // ... other fields
};

struct CrossChainTransferRequest : public PaymentRequest {
    std::string source_network;
    std::string amount;
    std::string token;
    std::optional<std::string> bridge;
    // ... other fields
};
```

#### Network Types

```cpp
enum class SVMNetwork {
    SOLANA,
    SONIC,
    ECLIPSE,
    SOON
};
```

### Network Adapters

Network adapters handle network-specific operations using **asynchronous operations**:

```cpp
class NetworkAdapter {
public:
    virtual std::future<std::string> create_transfer_transaction(const TransferRequest& request) = 0;
    virtual std::future<std::string> fetch_transaction(const TransactionRequest& request) = 0;
    virtual std::future<std::string> submit_transaction(const std::string& transaction, 
                                                       const std::string& signature) = 0;
    virtual std::future<PaymentStatus> check_transaction_status(const std::string& signature) = 0;
};
```

**Important**: All network operations return `std::future<T>` objects for asynchronous execution. You can:

1. **Block and wait for result**:
   ```cpp
   auto adapter = client.get_adapter(SVMNetwork::SOLANA);
   auto future = adapter->create_transfer_transaction(request);
   std::string transaction = future.get();  // Blocks until complete
   ```

2. **Wait with timeout**:
   ```cpp
   auto future = adapter->check_transaction_status(signature);
   if (future.wait_for(std::chrono::seconds(30)) == std::future_status::ready) {
       PaymentStatus status = future.get();
   } else {
       // Handle timeout
   }
   ```

3. **Check status without blocking**:
   ```cpp
   auto future = adapter->submit_transaction(transaction, signature);
   if (future.wait_for(std::chrono::seconds(0)) == std::future_status::ready) {
       // Result is available
       std::string signature = future.get();
   } else {
       // Still processing
   }
   ```

Currently implemented:
- `SolanaNetworkAdapter`: Solana network support with RPC integration

### URL Scheme Functions

```cpp
// Parse any payment URL
std::unique_ptr<PaymentRequest> parse_url(const std::string& url);

// Create URLs from requests
std::string create_transfer_url(const TransferRequest& request);
std::string create_transaction_url(const TransactionRequest& request);
std::string create_cross_chain_url(const CrossChainTransferRequest& request);
std::string create_url(const PaymentRequest& request);
```

### Reference Generation

```cpp
// Generate secure reference IDs
std::string generate_reference(size_t length = 32);
std::string generate_timestamped_reference(size_t length = 28);

// Validate reference IDs
bool validate_reference(const std::string& reference);
```

## URL Scheme

The SVM-Pay C++ SDK supports the same URL scheme as other SVM-Pay SDKs:

### Transfer URLs
```
solana:recipient?amount=1.5&label=Coffee%20Shop&message=Payment%20for%20coffee&memo=Order%2012345
```

### Transaction URLs
```
solana:recipient?link=https://api.example.com/transaction&label=NFT%20Purchase
```

### Cross-Chain Transfer URLs
```
solana:recipient?amount=100&token=USDC&source-network=ethereum&bridge=wormhole
```

### Supported Parameters

- `amount`: Transfer amount (required for transfers)
- `spl-token`: SPL token mint address (optional)
- `label`: Human-readable label (optional)
- `message`: Payment description (optional)
- `memo`: On-chain memo (optional)
- `reference`: Reference ID for tracking (optional, multiple allowed)
- `link`: Transaction fetch URL (required for transactions)
- `token`: Token identifier for cross-chain (required for cross-chain)
- `source-network`: Source network for cross-chain (required for cross-chain)
- `bridge`: Bridge service for cross-chain (optional)

## Examples

The SDK includes several examples demonstrating different features:

### Basic Payment Example
```bash
./build/examples/basic_payment
```

Demonstrates:
- Creating transfer and transaction URLs
- Parsing payment URLs
- Generating reference IDs
- Working with different networks

### URL Parsing Example
```bash
./build/examples/url_parsing
```

Demonstrates:
- Parsing various URL formats
- Error handling for invalid URLs
- Round-trip URL creation and parsing

### Network Adapter Example
```bash
./build/examples/network_adapter
```

Demonstrates:
- Working with network adapters
- Asynchronous network operations
- Transaction creation and status checking

## Advanced Usage

### Custom Network Adapters

You can implement custom network adapters for additional networks:

```cpp
class CustomNetworkAdapter : public svm_pay::NetworkAdapter {
public:
    CustomNetworkAdapter() : NetworkAdapter(SVMNetwork::SONIC) {}
    
    std::future<std::string> create_transfer_transaction(const TransferRequest& request) override {
        return std::async(std::launch::async, [request]() -> std::string {
            // Custom implementation
            return "custom_transaction_data";
        });
    }
    
    // Implement other virtual methods...
};

// Register the custom adapter
client.register_adapter(SVMNetwork::SONIC, std::make_unique<CustomNetworkAdapter>());
```

### Configuration Options

```cpp
svm_pay::Client client(SVMNetwork::SOLANA);

// Configure maximum number of references to parse (default: 10)
client.set_max_references(5);  // Limit to 5 references for security

// Enable debug mode
client.set_debug_enabled(true);

std::unordered_map<std::string, std::string> options = {
    {"solana_rpc_url", "https://api.devnet.solana.com"},  // Custom Solana RPC
    {"debug", "true"}  // Enable debug output
};

svm_pay::initialize_sdk(options);
```

### Security Considerations

1. **Reference Validation**: All reference IDs are validated for proper base58 encoding and length
2. **Input Sanitization**: URL parsing includes validation of all components
3. **Memory Safety**: RAII patterns ensure proper resource cleanup
4. **Thread Safety**: Network adapter factory uses mutex protection for concurrent access
5. **Reference Limits**: Configurable limits prevent parsing excessive references (DoS protection)

```cpp
// Example: Secure reference handling
try {
    std::string ref = client.generate_reference(32);  // 256-bit entropy
    if (svm_pay::validate_reference(ref)) {
        // Reference is valid base58 and proper length
    }
} catch (const std::runtime_error& e) {
    // Handle cryptographic failures
}
```

### Error Handling

The SDK uses C++ exceptions for error handling with specific exception types for better granularity:

```cpp
#include <svm-pay/core/exceptions.hpp>

try {
    auto request = client.parse_url(url);
    // Process request...
} catch (const svm_pay::URLParseException& e) {
    std::cerr << "URL parsing error: " << e.what() << std::endl;
} catch (const svm_pay::AddressValidationException& e) {
    std::cerr << "Address validation error: " << e.what() << std::endl;
} catch (const svm_pay::NetworkException& e) {
    std::cerr << "Network error: " << e.what() << std::endl;
} catch (const svm_pay::CryptographicException& e) {
    std::cerr << "Cryptographic error: " << e.what() << std::endl;
} catch (const svm_pay::ReferenceException& e) {
    std::cerr << "Reference error: " << e.what() << std::endl;
} catch (const svm_pay::SVMPayException& e) {
    std::cerr << "SVM-Pay SDK error: " << e.what() << std::endl;
} catch (const std::exception& e) {
    std::cerr << "Unexpected error: " << e.what() << std::endl;
}
```

Exception types:
- `SVMPayException`: Base exception for all SDK errors
- `NetworkException`: Network-related failures (RPC calls, HTTP requests)
- `URLParseException`: URL parsing and validation errors
- `AddressValidationException`: Address format validation errors
- `ReferenceException`: Reference ID validation errors
- `CryptographicException`: Cryptographic operation failures

## Testing

The SDK includes comprehensive unit tests:

```bash
cd build
ctest --verbose
```

Test categories:
- Core types and enums
- Reference generation and validation
- URL scheme parsing and creation
- Client functionality
- Network adapter interfaces

## Cross-Platform Support

The SDK is designed to work across different platforms:

- **Linux**: Tested on Ubuntu 20.04+
- **macOS**: Tested on macOS 12+
- **Windows**: Tested with Visual Studio 2019+

### Platform-Specific Notes

#### Windows
- Use vcpkg for dependency management
- Ensure proper OpenSSL configuration
- May require additional runtime libraries

#### macOS
- Install dependencies via Homebrew
- Ensure Xcode command line tools are installed

#### Linux
- Install development packages for curl and OpenSSL
- Some distributions may need additional configuration

## Dependencies

### Required Dependencies
- **cURL**: HTTP client functionality
- **OpenSSL**: Cryptographic operations
- **C++17 Standard Library**: Core functionality

### Optional Dependencies
- **Google Test**: Unit testing framework
- **pkg-config**: Dependency discovery

## CMake Integration

To use the SDK in your CMake project:

```cmake
find_package(svm-pay REQUIRED)
target_link_libraries(your_target svm-pay)
```

Or using FetchContent:

```cmake
include(FetchContent)
FetchContent_Declare(
    svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG main
)
FetchContent_MakeAvailable(svm-pay)
target_link_libraries(your_target svm-pay)
```

## Package Management

### vcpkg
```bash
vcpkg install svm-pay
```

### Conan (coming soon)
```bash
conan install svm-pay/1.0.0@
```

## Contributing

Contributions are welcome! Please see the main project's contributing guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style

The project follows standard C++ conventions:
- Use snake_case for variables and functions
- Use PascalCase for classes and types
- Use UPPER_CASE for constants and enums
- Include comprehensive documentation

## Security Considerations

- Reference IDs are generated using cryptographically secure random numbers
- Input validation is performed on all URL parsing operations
- Error messages are sanitized to prevent information leakage
- Network operations use secure HTTP (HTTPS) where possible

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Missing dependencies
sudo apt-get install libcurl4-openssl-dev libssl-dev

# CMake version too old
sudo snap install cmake --classic
```

#### Runtime Errors
```bash
# Missing shared libraries
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

# OpenSSL not found
export OPENSSL_ROOT_DIR=/usr/local/ssl
```

### Debug Mode

Enable debug output for troubleshooting:

```cpp
std::unordered_map<std::string, std::string> options = {
    {"debug", "true"}
};
svm_pay::initialize_sdk(options);

client.set_debug_enabled(true);
```

## License

This project is licensed under the MIT License - see the main project's LICENSE file for details.

## Support

- GitHub Issues: [https://github.com/openSVM/svm-pay/issues](https://github.com/openSVM/svm-pay/issues)
- Documentation: [https://github.com/openSVM/svm-pay/tree/main/docs](https://github.com/openSVM/svm-pay/tree/main/docs)
- Examples: [https://github.com/openSVM/svm-pay/tree/main/cpp-sdk/examples](https://github.com/openSVM/svm-pay/tree/main/cpp-sdk/examples)

---

## Roadmap

- [ ] Additional network adapters (Sonic, Eclipse, s00n)
- [ ] Enhanced cross-chain bridge support
- [ ] WebAssembly compilation support
- [ ] Package manager integration (vcpkg, Conan)
- [ ] Performance optimizations
- [ ] Additional examples and tutorials
# SVM-Pay C++ SDK Build Instructions

This directory contains a comprehensive C++ SDK for SVM-Pay, providing payment solutions for SVM networks.

## Quick Build

### Using System Dependencies (Linux/macOS)

```bash
# Install dependencies
sudo apt-get install libcurl4-openssl-dev libssl-dev libgtest-dev  # Ubuntu/Debian
brew install curl openssl googletest  # macOS

# Build
mkdir build && cd build
cmake ..
make -j4

# Run examples
./examples/basic_payment
./examples/url_parsing
```

### Using vcpkg (Windows/Cross-platform)

```bash
# Install vcpkg if not already installed
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh

# Build with vcpkg
mkdir build && cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
make -j4
```

## Features Included

✅ **Complete URL Scheme Support** - Parse and create payment URLs for all SVM networks  
✅ **Secure Reference Generation** - Cryptographically secure reference IDs using OpenSSL  
✅ **Multi-Network Support** - Solana, Sonic, Eclipse, and s00n networks  
✅ **Async Network Operations** - Future-based asynchronous network adapter interface  
✅ **Type Safety** - Modern C++17 with strong typing  
✅ **Cross-Platform** - CMake build system supporting Windows, Linux, and macOS  
✅ **Well Tested** - Comprehensive unit tests included  
✅ **Examples** - Multiple working examples demonstrating all features  
✅ **Documentation** - Complete API reference and usage guide  

## API Overview

```cpp
#include <svm-pay/svm_pay.hpp>

// Initialize SDK
svm_pay::initialize_sdk();

// Create client  
svm_pay::Client client(svm_pay::SVMNetwork::SOLANA);

// Create payment URL
std::string url = client.create_transfer_url("recipient_address", "1.5", {
    {"label", "Coffee Shop"},
    {"message", "Payment for coffee"}
});

// Parse payment URL
auto request = client.parse_url(url);

// Generate reference ID
std::string ref = client.generate_reference();
```

See the full [README.md](README.md) for complete documentation and examples.
# C++ SDK Examples

This directory contains C++ examples demonstrating SVM-Pay integration.

## Examples

- **basic-payment/** - Simple payment URL creation and processing
- **url-parsing/** - URL parsing and validation examples  
- **network-adapters/** - Working with different network adapters
- **async-operations/** - Asynchronous network operations
- **cross-platform/** - Cross-platform development examples

## Building Examples

All examples can be built using CMake:

```bash
cd cpp-examples
mkdir build && cd build
cmake ..
make

# Run examples
./basic-payment/basic_payment
./url-parsing/url_parsing  
./network-adapters/network_adapter
```

## Prerequisites

- C++17 compatible compiler
- CMake 3.16 or higher
- SVM-Pay C++ SDK installed
- cURL and OpenSSL libraries

## Integration

To use these examples in your own projects, copy the relevant code and ensure you have the SVM-Pay C++ SDK properly installed and linked.

For more information, see the [C++ SDK documentation](/docs/cpp-sdk) and [tutorials](/tutorials/cpp-sdk).
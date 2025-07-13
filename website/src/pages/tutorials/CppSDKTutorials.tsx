import { motion } from 'framer-motion'

// C++ SDK Getting Started Tutorial
export function CppSDKGettingStartedTutorial() {
  return (
    <div className="pt-20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Getting Started</h1>
        <p className="text-xl text-slate-600 mb-8">
          Learn to set up the C++ SDK and create your first payment application.
        </p>

        <div className="prose max-w-none">
          <h2>Prerequisites</h2>
          <ul>
            <li>C++17 compatible compiler (GCC 7+, Clang 5+, MSVC 2017+)</li>
            <li>CMake 3.16 or higher</li>
            <li>cURL library</li>
            <li>OpenSSL library</li>
          </ul>

          <h2>Installation</h2>
          <h3>Ubuntu/Debian</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`sudo apt-get update
sudo apt-get install build-essential cmake libcurl4-openssl-dev libssl-dev`}</code></pre>
          </div>

          <h3>macOS</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`brew install cmake curl openssl`}</code></pre>
          </div>

          <h3>Windows (vcpkg)</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`vcpkg install curl openssl`}</code></pre>
          </div>

          <h2>Building the SDK</h2>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`# Clone the repository
git clone https://github.com/openSVM/svm-pay.git
cd svm-pay/cpp-sdk

# Create build directory
mkdir build && cd build

# Configure and build
cmake ..
make

# Install (optional)
sudo make install`}</code></pre>
          </div>

          <h2>Your First Payment Application</h2>
          <p>Create a simple application that generates a payment URL:</p>
          
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`#include <iostream>
#include <svm-pay/svm_pay.hpp>

int main() {
    try {
        // Initialize the SDK
        svm_pay::initialize_sdk();
        
        // Create a client for Solana network
        svm_pay::Client client(svm_pay::SVMNetwork::SOLANA);
        
        // Create a payment URL
        std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
        std::string amount = "1.5";
        
        std::unordered_map<std::string, std::string> options = {
            {"label", "Coffee Shop"},
            {"message", "Payment for coffee"}
        };
        
        std::string payment_url = client.create_transfer_url(recipient, amount, options);
        std::cout << "Payment URL: " << payment_url << std::endl;
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}</code></pre>
          </div>

          <h2>CMake Configuration</h2>
          <p>Create a CMakeLists.txt for your project:</p>
          
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`cmake_minimum_required(VERSION 3.16)
project(my_payment_app)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find SVM-Pay package
find_package(svm-pay REQUIRED)

# Create executable
add_executable(my_payment_app main.cpp)

# Link with SVM-Pay
target_link_libraries(my_payment_app svm-pay)`}</code></pre>
          </div>

          <h2>Building Your Application</h2>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`mkdir build && cd build
cmake ..
make
./my_payment_app`}</code></pre>
          </div>

          <h2>Next Steps</h2>
          <ul>
            <li>Learn about <a href="/tutorials/cpp-sdk/url-parsing">URL parsing and validation</a></li>
            <li>Explore <a href="/tutorials/cpp-sdk/network-adapters">network adapter usage</a></li>
            <li>Build <a href="/tutorials/cpp-sdk/basic-payment">complete payment processing systems</a></li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

// C++ SDK Basic Payment Tutorial
export function CppSDKBasicPaymentTutorial() {
  return (
    <div className="pt-20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Basic Payment Processing with C++</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build a complete payment processing system using the C++ SDK.
        </p>

        <div className="prose max-w-none">
          <h2>Overview</h2>
          <p>This tutorial demonstrates how to build a payment processing application that can:</p>
          <ul>
            <li>Create payment URLs for different types of transactions</li>
            <li>Parse incoming payment requests</li>
            <li>Generate secure reference IDs</li>
            <li>Handle multiple networks (Solana, Sonic, Eclipse, s00n)</li>
          </ul>

          <h2>Complete Payment Processor Example</h2>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`#include <iostream>
#include <string>
#include <unordered_map>
#include <svm-pay/svm_pay.hpp>

class PaymentProcessor {
private:
    svm_pay::Client client;
    
public:
    PaymentProcessor(svm_pay::SVMNetwork network) : client(network) {}
    
    // Create a simple transfer request
    std::string create_payment_request(
        const std::string& recipient,
        const std::string& amount,
        const std::string& label = "",
        const std::string& message = ""
    ) {
        std::unordered_map<std::string, std::string> options;
        
        if (!label.empty()) options["label"] = label;
        if (!message.empty()) options["message"] = message;
        
        // Generate a unique reference for tracking
        std::string reference = client.generate_reference();
        options["reference"] = reference;
        
        return client.create_transfer_url(recipient, amount, options);
    }
    
    // Create a transaction request with custom link
    std::string create_transaction_request(
        const std::string& recipient,
        const std::string& link,
        const std::string& label = ""
    ) {
        std::unordered_map<std::string, std::string> options;
        options["link"] = link;
        
        if (!label.empty()) options["label"] = label;
        
        std::string reference = client.generate_reference();
        options["reference"] = reference;
        
        return client.create_transaction_url(recipient, options);
    }
    
    // Parse and validate a payment URL
    bool process_payment_url(const std::string& url) {
        try {
            auto request = client.parse_url(url);
            
            std::cout << "Payment Request Details:" << std::endl;
            std::cout << "  Type: " << static_cast<int>(request.type) << std::endl;
            std::cout << "  Recipient: " << request.recipient << std::endl;
            
            if (!request.amount.empty()) {
                std::cout << "  Amount: " << request.amount << std::endl;
            }
            
            if (!request.label.empty()) {
                std::cout << "  Label: " << request.label << std::endl;
            }
            
            if (!request.message.empty()) {
                std::cout << "  Message: " << request.message << std::endl;
            }
            
            return true;
        } catch (const std::exception& e) {
            std::cerr << "Error parsing URL: " << e.what() << std::endl;
            return false;
        }
    }
};

int main() {
    try {
        // Initialize the SDK
        svm_pay::initialize_sdk();
        
        // Create a payment processor for Solana
        PaymentProcessor processor(svm_pay::SVMNetwork::SOLANA);
        
        std::cout << "SVM-Pay C++ Payment Processor Demo" << std::endl;
        std::cout << "===================================" << std::endl;
        
        // Example 1: Simple transfer
        std::cout << "\\n1. Creating a simple transfer request..." << std::endl;
        std::string transfer_url = processor.create_payment_request(
            "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
            "1.5",
            "Coffee Shop",
            "Payment for coffee and pastry"
        );
        std::cout << "Transfer URL: " << transfer_url << std::endl;
        
        // Example 2: Transaction with custom link
        std::cout << "\\n2. Creating a transaction request..." << std::endl;
        std::string transaction_url = processor.create_transaction_request(
            "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
            "https://api.mystore.com/transactions/create",
            "NFT Purchase"
        );
        std::cout << "Transaction URL: " << transaction_url << std::endl;
        
        // Example 3: Parse a payment URL
        std::cout << "\\n3. Parsing the transfer URL..." << std::endl;
        processor.process_payment_url(transfer_url);
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Fatal error: " << e.what() << std::endl;
        return 1;
    }
}`}</code></pre>
          </div>

          <h2>Advanced Features</h2>
          
          <h3>SPL Token Payments</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`// Create SPL token payment
std::unordered_map<std::string, std::string> spl_options = {
    {"spl-token", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}, // USDC
    {"label", "USDC Payment"},
    {"reference", client.generate_reference()}
};

std::string usdc_url = client.create_transfer_url(recipient, "100", spl_options);`}</code></pre>
          </div>

          <h3>Cross-Chain Payments</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`// Create cross-chain payment
std::unordered_map<std::string, std::string> cross_chain_options = {
    {"token", "USDC"},
    {"source-network", "ethereum"},
    {"bridge", "wormhole"},
    {"label", "Cross-chain Transfer"},
    {"reference", client.generate_reference()}
};

std::string cross_chain_url = client.create_cross_chain_url(
    recipient, "50", cross_chain_options
);`}</code></pre>
          </div>

          <h2>Error Handling</h2>
          <p>The C++ SDK provides comprehensive error handling with specific exception types:</p>
          
          <div className="bg-slate-100 p-4 rounded-lg">
            <pre><code>{`try {
    auto request = client.parse_url(url);
    // Process request...
} catch (const svm_pay::URLParseException& e) {
    std::cerr << "Invalid URL format: " << e.what() << std::endl;
} catch (const svm_pay::AddressValidationException& e) {
    std::cerr << "Invalid address: " << e.what() << std::endl;
} catch (const svm_pay::NetworkException& e) {
    std::cerr << "Network error: " << e.what() << std::endl;
} catch (const std::exception& e) {
    std::cerr << "General error: " << e.what() << std::endl;
}`}</code></pre>
          </div>

          <h2>Next Steps</h2>
          <ul>
            <li>Learn about <a href="/tutorials/cpp-sdk/network-adapters">network adapters</a></li>
            <li>Explore <a href="/tutorials/cpp-sdk/async-operations">asynchronous operations</a></li>
            <li>Build <a href="/tutorials/cpp-sdk/performance">high-performance applications</a></li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

// Placeholder tutorial components
export function CppSDKUrlParsingTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK URL Parsing Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}

export function CppSDKNetworkAdaptersTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Network Adapters Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}

export function CppSDKAsyncOperationsTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Async Operations Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}

export function CppSDKCMakeIntegrationTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK CMake Integration Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}

export function CppSDKCrossPlatformTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Cross-Platform Development Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}

export function CppSDKPerformanceTutorial() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Performance Optimization Tutorial</h1>
      <p className="text-slate-600">Detailed tutorial coming soon...</p>
    </div>
  )
}
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Code, 
  FileText, 
  Database,
  Network,
  ChevronRight,
  Search,
  ExternalLink,
  Terminal,
  Zap,
  Shield,
  Settings,
  Book
} from 'lucide-react'
import { useState } from 'react'

// API Documentation Components
const CrossChainDoc = () => (
  <div className="pt-20 p-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">Cross-Chain Integration</h1>
    <p className="text-xl text-slate-600 mb-8">
      Complete guide to cross-chain payment processing with SVM-Pay.
    </p>
    <div className="prose max-w-none">
      <h2>Overview</h2>
      <p>SVM-Pay provides seamless cross-chain payment capabilities across multiple blockchain networks.</p>
      
      <h2>Supported Networks</h2>
      <ul>
        <li>Solana (SVM)</li>
        <li>Sonic SVM</li>
        <li>Eclipse</li>
        <li>Soon Network</li>
        <li>Ethereum (via bridges)</li>
      </ul>
      
      <h2>Bridge Integration</h2>
      <p>Cross-chain transfers are facilitated through secure bridge protocols including Wormhole and Native bridges.</p>
    </div>
  </div>
)

const ArchitectureDoc = () => (
  <div className="pt-20 p-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">System Architecture</h1>
    <p className="text-xl text-slate-600 mb-8">
      Understanding the core architecture and design patterns of SVM-Pay.
    </p>
    <div className="prose max-w-none">
      <h2>Core Components</h2>
      <ul>
        <li><strong>Payment Engine</strong> - Handles payment processing logic</li>
        <li><strong>Network Adapters</strong> - Abstract different blockchain networks</li>
        <li><strong>Bridge System</strong> - Manages cross-chain operations</li>
        <li><strong>Request Handlers</strong> - Process different payment types</li>
      </ul>
      
      <h2>Design Patterns</h2>
      <p>SVM-Pay uses factory patterns, adapters, and builders for extensible architecture.</p>
    </div>
  </div>
)

const SecurityDoc = () => (
  <div className="pt-20 p-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">Security Guidelines</h1>
    <p className="text-xl text-slate-600 mb-8">
      Best practices for secure payment processing with SVM-Pay.
    </p>
    <div className="prose max-w-none">
      <h2>Security Features</h2>
      <ul>
        <li>Multi-signature wallet support</li>
        <li>Transaction validation and verification</li>
        <li>Rate limiting and anti-spam measures</li>
        <li>Secure key management</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Always validate payment requests, use secure RPC endpoints, and implement proper error handling.</p>
    </div>
  </div>
)

const CppSDKDoc = () => (
  <div className="pt-20 p-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK</h1>
    <p className="text-xl text-slate-600 mb-8">
      High-performance C++ SDK for SVM-Pay with comprehensive payment functionality.
    </p>
    <div className="prose max-w-none">
      <h2>Overview</h2>
      <p>The C++ SDK provides a high-performance, type-safe interface for integrating SVM-Pay into C++ applications. Built with modern C++17 features, it offers comprehensive payment processing capabilities across all SVM networks.</p>
      
      <h2>Core Features</h2>
      <ul>
        <li><strong>URL Scheme Support</strong> - Complete parsing and creation of payment URLs</li>
        <li><strong>Multi-Network Support</strong> - Solana, Sonic, Eclipse, and s00n networks</li>
        <li><strong>Secure Reference Generation</strong> - Cryptographically secure reference IDs using OpenSSL</li>
        <li><strong>Type Safety</strong> - Modern C++17 implementation with strong typing</li>
        <li><strong>Async Network Operations</strong> - Future-based asynchronous network adapter interface</li>
        <li><strong>Cross-Platform</strong> - Works on Linux, Windows, and macOS</li>
      </ul>
      
      <h2>Architecture</h2>
      <ul>
        <li><strong>Client Class</strong> - High-level interface for payment operations</li>
        <li><strong>Network Adapters</strong> - Pluggable adapters for different blockchain networks</li>
        <li><strong>URL Parser</strong> - Robust parsing of SVM-Pay protocol URLs</li>
        <li><strong>Reference Generator</strong> - Secure random reference ID generation</li>
        <li><strong>Exception System</strong> - Comprehensive error handling with custom exception types</li>
      </ul>
      
      <h2>Getting Started</h2>
      <div className="bg-slate-100 p-4 rounded-lg">
        <pre><code>{`#include <svm-pay/svm_pay.hpp>

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
std::string ref = client.generate_reference();`}</code></pre>
      </div>
      
      <h2>Installation</h2>
      <p>The C++ SDK can be integrated into your project using CMake:</p>
      <div className="bg-slate-100 p-4 rounded-lg">
        <pre><code>{`# Prerequisites
sudo apt-get install build-essential cmake libcurl4-openssl-dev libssl-dev

# Build and install
git clone https://github.com/openSVM/svm-pay.git
cd svm-pay/cpp-sdk
mkdir build && cd build
cmake ..
make install

# CMake integration
find_package(svm-pay REQUIRED)
target_link_libraries(your_target svm-pay)`}</code></pre>
      </div>
      
      <h2>Examples</h2>
      <p>The SDK includes comprehensive examples:</p>
      <ul>
        <li><strong>Basic Payment</strong> - Simple payment URL creation and processing</li>
        <li><strong>URL Parsing</strong> - Parsing different types of payment URLs</li>
        <li><strong>Network Adapter</strong> - Working with blockchain network adapters</li>
      </ul>
    </div>
  </div>
)

const AssemblyBPFDoc = () => (
  <div className="pt-20 p-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">Assembly-BPF SDK</h1>
    <p className="text-xl text-slate-600 mb-8">
      Low-level BPF program development for advanced SVM-Pay integrations.
    </p>
    <div className="prose max-w-none">
      <h2>Overview</h2>
      <p>The Assembly-BPF SDK provides direct access to Berkeley Packet Filter (BPF) programming for creating high-performance, low-level payment programs.</p>
      
      <h2>Core Features</h2>
      <ul>
        <li><strong>AssemblyBPFSDK</strong> - Main SDK with compilation and deployment</li>
        <li><strong>BPFProgramBuilder</strong> - Fluent API for building programs</li>
        <li><strong>BPFAssembler</strong> - Assembly instruction to bytecode conversion</li>
        <li><strong>BPFSyscallHelper</strong> - Network-specific syscall wrappers</li>
        <li><strong>BPFMemoryManager</strong> - Memory allocation utilities</li>
        <li><strong>BPFProgramLoader</strong> - Program deployment and validation</li>
      </ul>
      
      <h2>Program Templates</h2>
      <p>Pre-built templates for common use cases:</p>
      <ul>
        <li>Payment Processor - Basic payment processing with fees</li>
        <li>Cross-Chain Bridge - Asset bridging between chains</li>
        <li>Payment Validator - Parameter and constraint validation</li>
        <li>Token Transfer - SPL token transfers with validation</li>
        <li>Middleware - Custom middleware with hooks</li>
      </ul>
      
      <h2>Getting Started</h2>
      <div className="bg-slate-100 p-4 rounded-lg">
        <pre><code>{`import { AssemblyBPFSDK, SVMNetwork } from 'svm-pay/assembly-bpf';

const sdk = new AssemblyBPFSDK({ 
  network: SVMNetwork.SOLANA,
  debug: true 
});

const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
  networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC]
});

const result = await sdk.compile(instructions, metadata);`}</code></pre>
      </div>
      
      <h2>Network Support</h2>
      <p>Full compatibility across all SVM networks:</p>
      <ul>
        <li>Solana - Original SVM blockchain</li>
        <li>Sonic SVM - Game-focused chain extension</li>
        <li>Eclipse - SVM on Ethereum</li>
        <li>Soon (SOON) - Ethereum L2 with SVM</li>
      </ul>
      
      <h2>Security Features</h2>
      <ul>
        <li>Program validation with size limits</li>
        <li>Instruction validation and security checks</li>
        <li>Memory safety with bounds checking</li>
        <li>Network compliance validation</li>
        <li>Sandboxed execution environment</li>
      </ul>
    </div>
  </div>
)

// API Documentation sections - focused on actual source files
const apiSections = [
  {
    title: 'Core SDK',
    items: [
      { name: 'SVMPay Class', href: '/docs/sdk/svmpay', icon: Code },
      { name: 'SVMPayServer Class', href: '/docs/sdk/server', icon: Code },
      { name: 'Core Types', href: '/docs/core/types', icon: FileText },
      { name: 'URL Scheme', href: '/docs/core/url-scheme', icon: FileText },
      { name: 'Reference Generation', href: '/docs/core/reference', icon: FileText },
    ]
  },
  {
    title: 'Network Adapters',
    items: [
      { name: 'Solana Adapter', href: '/docs/network/solana', icon: Network },
      { name: 'Sonic Adapter', href: '/docs/network/sonic', icon: Network },
      { name: 'Eclipse Adapter', href: '/docs/network/eclipse', icon: Network },
      { name: 'Soon Adapter', href: '/docs/network/soon', icon: Network },
      { name: 'Adapter Factory', href: '/docs/network/factory', icon: Network },
    ]
  },
  {
    title: 'Bridge System',
    items: [
      { name: 'Bridge Adapters', href: '/docs/bridge/adapters', icon: Network },
      { name: 'Cross-Chain Manager', href: '/docs/bridge/cross-chain', icon: Network },
      { name: 'Bridge Types', href: '/docs/bridge/types', icon: FileText },
    ]
  },
  {
    title: 'Request Handlers',
    items: [
      { name: 'Transfer Handler', href: '/docs/handlers/transfer', icon: Code },
      { name: 'Transaction Handler', href: '/docs/handlers/transaction', icon: Code },
      { name: 'Cross-Chain Handler', href: '/docs/handlers/cross-chain', icon: Code },
    ]
  },
  {
    title: 'CLI Integration',
    items: [
      { name: 'CLI Commands', href: '/docs/cli/commands', icon: FileText },
      { name: 'Configuration', href: '/docs/cli/config', icon: FileText },
      { name: 'Solana Utils', href: '/docs/cli/solana', icon: FileText },
      { name: 'History Management', href: '/docs/cli/history', icon: Database },
    ]
  },
  {
    title: 'C++ SDK',
    items: [
      { name: 'C++ SDK Overview', href: '/docs/cpp-sdk', icon: Terminal },
      { name: 'Getting Started', href: '/docs/cpp-sdk/getting-started', icon: Code },
      { name: 'Installation Guide', href: '/docs/cpp-sdk/installation', icon: Settings },
      { name: 'Basic Payment Example', href: '/docs/cpp-sdk/basic-payment', icon: Book },
      { name: 'URL Parsing', href: '/docs/cpp-sdk/url-parsing', icon: Book },
      { name: 'Network Adapters', href: '/docs/cpp-sdk/network-adapters', icon: Network },
      { name: 'Client Class', href: '/docs/cpp-sdk/client', icon: Code },
      { name: 'Exception Handling', href: '/docs/cpp-sdk/exceptions', icon: Shield },
      { name: 'CMake Integration', href: '/docs/cpp-sdk/cmake', icon: Settings },
      { name: 'API Reference', href: '/docs/cpp-sdk/api-reference', icon: FileText },
    ]
  },
  {
    title: 'Assembly-BPF SDK',
    items: [
      { name: 'Assembly-BPF Overview', href: '/docs/assembly-bpf', icon: Terminal },
      { name: 'Getting Started', href: '/docs/assembly-bpf/getting-started', icon: Code },
      { name: 'Hello World Program', href: '/docs/assembly-bpf/hello-world', icon: Terminal },
      { name: 'Payment Processor', href: '/docs/assembly-bpf/payment-processor', icon: Book },
      { name: 'Cross-Chain Bridge', href: '/docs/assembly-bpf/cross-chain-bridge', icon: Book },
      { name: 'Memory Management', href: '/docs/assembly-bpf/memory-management', icon: Book },
      { name: 'API Reference', href: '/docs/assembly-bpf/api-reference', icon: FileText },
      { name: 'Security Patterns', href: '/docs/assembly-bpf/security', icon: Shield },
      { name: 'Advanced Usage', href: '/docs/assembly-bpf/advanced', icon: Settings },
    ]
  },
  {
    title: 'WalletConnect',
    items: [
      { name: 'WalletConnect Integration', href: '/docs/walletconnect/integration', icon: Code },
      { name: 'Connection Manager', href: '/docs/walletconnect/manager', icon: Code },
    ]
  },
  {
    title: 'Advanced',
    items: [
      { name: 'Cross-Chain Payments', href: '/docs/cross-chain', icon: Zap },
      { name: 'Architecture', href: '/docs/architecture', icon: FileText },
      { name: 'Security', href: '/docs/security', icon: Shield },
    ]
  }
]

function DocsSidebar() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen pt-20">
      <div className="p-6">
        {/* Cross-navigation */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Need Step-by-Step Guides?</h3>
          <Link 
            to="/tutorials" 
            className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Go to Tutorials
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Navigation */}
        {apiSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items
                .filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-purple-600 bg-purple-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  )
                })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  )
}

function DocsHome() {
  return (
    <div className="pt-20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">API Reference</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl">
          Complete API documentation for all SVM-Pay classes, methods, types, and integrations. 
          Find detailed specifications for every component in the SVM-Pay ecosystem.
        </p>

        {/* Cross-navigation */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Looking for Tutorials?</h3>
          <p className="text-blue-800 mb-3">
            Need step-by-step guides and implementation examples? Check out our comprehensive tutorials section.
          </p>
          <Link 
            to="/tutorials" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Browse Tutorials
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiSections.flatMap(section => section.items).map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className="block group p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <item.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-600 text-sm">
                  {getApiDescription(item.name)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getApiDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'SVMPay Class': 'Main SDK class for creating payment URLs and processing transactions.',
    'SVMPayServer Class': 'Server-side SDK with additional features for transaction verification.',
    'Core Types': 'TypeScript type definitions for all SVM-Pay interfaces and enums.',
    'URL Scheme': 'Payment URL creation and parsing functionality.',
    'Reference Generation': 'Utilities for generating unique payment reference IDs.',
    'Solana Adapter': 'Network adapter for Solana blockchain integration.',
    'Sonic Adapter': 'Network adapter for Sonic SVM network integration.',
    'Eclipse Adapter': 'Network adapter for Eclipse SVM network integration.',
    'Soon Adapter': 'Network adapter for Soon SVM network integration.',
    'Adapter Factory': 'Factory pattern for managing network adapters.',
    'Bridge Adapters': 'Interface definitions for cross-chain bridge integrations.',
    'Cross-Chain Manager': 'Manager for handling cross-chain payment operations.',
    'Bridge Types': 'Type definitions for bridge operations and results.',
    'Transfer Handler': 'Handler for processing simple token transfer requests.',
    'Transaction Handler': 'Handler for processing complex transaction requests.',
    'Cross-Chain Handler': 'Handler for processing cross-chain payment requests.',
    'CLI Commands': 'Command-line interface specifications and options.',
    'Configuration': 'Configuration management for CLI and SDK settings.',
    'Solana Utils': 'Utilities for Solana-specific operations and wallet management.',
    'History Management': 'Payment history storage and retrieval functionality.',
    'WalletConnect Integration': 'Integration with WalletConnect protocol for wallet connections.',
    'Connection Manager': 'Manager for handling wallet connection states and operations.',
    // C++ SDK descriptions
    'C++ SDK Overview': 'Comprehensive C++ SDK for high-performance payment processing.',
    'C++ Getting Started': 'Quick start guide for C++ SDK with setup and basic examples.',
    'Installation Guide': 'Complete installation instructions for all platforms.',
    'Basic Payment Example': 'Simple payment URL creation and processing with C++ SDK.',
    'URL Parsing': 'Parse and validate SVM-Pay protocol URLs in C++.',
    'Network Adapters': 'Work with blockchain network adapters in C++.',
    'Client Class': 'Main C++ SDK client class for payment operations.',
    'Exception Handling': 'Comprehensive error handling with custom exception types.',
    'CMake Integration': 'Integrate C++ SDK into your CMake projects.',
    'C++ API Reference': 'Complete C++ API documentation with classes and methods.',
    // Assembly-BPF SDK descriptions
    'Assembly-BPF Overview': 'Introduction to low-level BPF program development with SVM-Pay.',
    'Assembly-BPF Getting Started': 'Quick start guide for Assembly-BPF SDK with setup and basic examples.',
    'Hello World Program': 'Simple BPF program tutorial to understand the basic structure.',
    'Payment Processor': 'Build BPF programs for payment processing with Assembly-BPF SDK.',
    'Cross-Chain Bridge': 'Create cross-chain bridge programs using low-level BPF instructions.',
    'Memory Management': 'Stack and heap management utilities for BPF programs.',
    'Assembly-BPF API Reference': 'Complete API documentation for Assembly-BPF SDK classes and methods.',
    'Security Patterns': 'Security best practices and patterns for BPF program development.',
    'Advanced Usage': 'Advanced Assembly-BPF techniques including optimization and debugging.',
    // Architecture and Security
    'System Architecture': 'Deep dive into SVM-Pay architecture and design patterns.',
    'Cross-Chain Payments': 'Technical overview of cross-chain payment implementation.',
    'Security': 'Security guidelines and best practices for payment integrations.'
  }
  return descriptions[name] || 'API documentation for SVM-Pay component.'
}

// C++ SDK documentation components
function CppSDKGettingStartedDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Getting Started</h1>
      <p className="text-xl text-slate-600 mb-8">
        Quick start guide for integrating the SVM-Pay C++ SDK into your project.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>The SVM-Pay C++ SDK provides high-performance payment processing capabilities for C++ applications. It offers comprehensive support for all SVM networks including Solana, Sonic, Eclipse, and s00n.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li><strong>URL Scheme Support</strong> - Parse and create payment URLs following the SVM-Pay protocol</li>
          <li><strong>Multi-Network Support</strong> - Support for Solana, Sonic, Eclipse, and s00n networks</li>
          <li><strong>Secure Reference Generation</strong> - Cryptographically secure reference ID generation using OpenSSL</li>
          <li><strong>Async Network Operations</strong> - Future-based asynchronous network adapter interface</li>
          <li><strong>Type Safety</strong> - Strong typing with modern C++17 features</li>
          <li><strong>Cross-Platform</strong> - Works on Linux, Windows, and macOS</li>
        </ul>
        
        <h2>Prerequisites</h2>
        <ul>
          <li>C++17 compatible compiler (GCC 7+, Clang 5+, MSVC 2017+)</li>
          <li>CMake 3.16 or higher</li>
          <li>cURL library (libcurl)</li>
          <li>OpenSSL library</li>
          <li>Google Test (optional, for running tests)</li>
        </ul>
        
        <h2>Quick Start</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
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
}`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/installation" className="text-blue-600 hover:underline">Installation Guide</Link> - Detailed installation instructions for all platforms</li>
          <li><Link to="/docs/cpp-sdk/basic-payment" className="text-blue-600 hover:underline">Basic Payment Tutorial</Link> - Step-by-step payment integration</li>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKInstallationDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Installation</h1>
      <p className="text-xl text-slate-600 mb-8">
        Complete installation guide for the SVM-Pay C++ SDK across different platforms.
      </p>
      <div className="prose max-w-none">
        <h2>System Requirements</h2>
        <ul>
          <li>C++17 compatible compiler</li>
          <li>CMake 3.16 or higher</li>
          <li>cURL development libraries</li>
          <li>OpenSSL development libraries</li>
        </ul>
        
        <h2>Platform-Specific Installation</h2>
        
        <h3>Ubuntu/Debian</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Update package list
sudo apt-get update

# Install dependencies
sudo apt-get install build-essential cmake libcurl4-openssl-dev libssl-dev

# Optional: Install Google Test for running SDK tests
sudo apt-get install libgtest-dev`}</code></pre>
        </div>
        
        <h3>CentOS/RHEL/Fedora</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# CentOS/RHEL
sudo yum groupinstall "Development Tools"
sudo yum install cmake3 libcurl-devel openssl-devel

# Fedora
sudo dnf groupinstall "Development Tools"
sudo dnf install cmake libcurl-devel openssl-devel`}</code></pre>
        </div>
        
        <h3>macOS</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Using Homebrew
brew install cmake curl openssl

# Optional: Install Google Test
brew install googletest

# Make sure to set OpenSSL paths if needed
export OPENSSL_ROOT_DIR=/usr/local/opt/openssl`}</code></pre>
        </div>
        
        <h3>Windows (vcpkg)</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Install vcpkg if not already installed
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\\bootstrap-vcpkg.bat

# Install dependencies
.\\vcpkg install curl:x64-windows openssl:x64-windows

# Optional: Install Google Test
.\\vcpkg install gtest:x64-windows`}</code></pre>
        </div>
        
        <h2>Building from Source</h2>
        
        <h3>Clone and Build</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Clone the repository
git clone https://github.com/openSVM/svm-pay.git
cd svm-pay/cpp-sdk

# Create build directory
mkdir build && cd build

# Configure the build
cmake ..

# Build the SDK
make -j$(nproc)

# Run tests (optional)
ctest --output-on-failure

# Install system-wide (optional)
sudo make install`}</code></pre>
        </div>
        
        <h3>Build Options</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Disable tests
cmake -DBUILD_TESTS=OFF ..

# Disable examples
cmake -DBUILD_EXAMPLES=OFF ..

# Debug build
cmake -DCMAKE_BUILD_TYPE=Debug ..

# Custom install prefix
cmake -DCMAKE_INSTALL_PREFIX=/usr/local ..

# Windows with vcpkg
cmake -DCMAKE_TOOLCHAIN_FILE=path/to/vcpkg/scripts/buildsystems/vcpkg.cmake ..`}</code></pre>
        </div>
        
        <h2>Integration with CMake Projects</h2>
        
        <h3>Using find_package</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# In your CMakeLists.txt
find_package(svm-pay REQUIRED)

# Link to your target
target_link_libraries(your_target_name svm-pay)`}</code></pre>
        </div>
        
        <h3>Using FetchContent</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`include(FetchContent)

FetchContent_Declare(
    svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG        main
    SOURCE_SUBDIR  cpp-sdk
)

FetchContent_MakeAvailable(svm-pay)

# Link to your target
target_link_libraries(your_target_name svm-pay)`}</code></pre>
        </div>
        
        <h2>Verification</h2>
        <p>To verify your installation, create a simple test program:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>

int main() {
    svm_pay::initialize_sdk();
    std::cout << "SVM-Pay C++ SDK initialized successfully!" << std::endl;
    svm_pay::cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <p>Compile and run:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`g++ -std=c++17 test.cpp -lsvm-pay -lcurl -lssl -lcrypto -o test
./test`}</code></pre>
        </div>
        
        <h2>Troubleshooting</h2>
        <ul>
          <li><strong>OpenSSL not found</strong>: Set OPENSSL_ROOT_DIR environment variable</li>
          <li><strong>cURL not found</strong>: Install libcurl4-openssl-dev or curl-devel</li>
          <li><strong>CMake version too old</strong>: Install CMake 3.16 or higher</li>
          <li><strong>Compiler errors</strong>: Ensure C++17 support is enabled</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKBasicPaymentDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Basic Payment</h1>
      <p className="text-xl text-slate-600 mb-8">
        Learn how to create and process basic payments using the SVM-Pay C++ SDK.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>This tutorial covers creating payment URLs, parsing payment requests, and generating reference IDs using the C++ SDK.</p>
        
        <h2>Setting Up</h2>
        <p>First, include the SDK header and initialize it:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <unordered_map>

using namespace svm_pay;

int main() {
    // Initialize the SDK
    initialize_sdk();
    
    // Your payment code here...
    
    // Cleanup when done
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Creating a Client</h2>
        <p>Create a client instance for the desired network:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Create a client for Solana network
Client client(SVMNetwork::SOLANA);

// Or specify later
Client client;
client.set_default_network(SVMNetwork::SONIC);`}</code></pre>
        </div>
        
        <h2>Creating Payment URLs</h2>
        
        <h3>Simple Transfer URL</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
std::string amount = "1.5";

std::string payment_url = client.create_transfer_url(recipient, amount);
std::cout << "Payment URL: " << payment_url << std::endl;
// Output: solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5`}</code></pre>
        </div>
        
        <h3>Transfer URL with Options</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`std::unordered_map<std::string, std::string> options = {
    {"label", "Coffee Shop"},
    {"message", "Payment for coffee and pastry"},
    {"memo", "Order #12345"}
};

std::string payment_url = client.create_transfer_url(recipient, amount, options);
// Output: solana:7v91...?amount=1.5&label=Coffee%20Shop&message=Payment%20for%20coffee%20and%20pastry&memo=Order%20%2312345`}</code></pre>
        </div>
        
        <h3>Transaction URL</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`std::string link = "https://example.com/transaction";
std::unordered_map<std::string, std::string> options = {
    {"label", "Custom Transaction"}
};

std::string tx_url = client.create_transaction_url(recipient, link, options);`}</code></pre>
        </div>
        
        <h2>Parsing Payment URLs</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto request = client.parse_url(payment_url);
    
    std::cout << "Request Type: " << request_type_to_string(request->type) << std::endl;
    std::cout << "Network: " << network_to_string(request->network) << std::endl;
    std::cout << "Recipient: " << request->recipient << std::endl;
    
    if (request->amount.has_value()) {
        std::cout << "Amount: " << request->amount.value() << std::endl;
    }
    
    if (request->label.has_value()) {
        std::cout << "Label: " << request->label.value() << std::endl;
    }
    
    if (request->message.has_value()) {
        std::cout << "Message: " << request->message.value() << std::endl;
    }
    
    if (request->memo.has_value()) {
        std::cout << "Memo: " << request->memo.value() << std::endl;
    }
    
    // Access references if any
    for (const auto& ref : request->references) {
        std::cout << "Reference: " << ref << std::endl;
    }
    
} catch (const URLParseException& e) {
    std::cerr << "Parse error: " << e.what() << std::endl;
} catch (const AddressValidationException& e) {
    std::cerr << "Address validation error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Generating Reference IDs</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Generate a default 32-character reference
std::string reference = client.generate_reference();
std::cout << "Reference: " << reference << std::endl;

// Generate a custom length reference
std::string short_ref = client.generate_reference(16);
std::cout << "Short reference: " << short_ref << std::endl;`}</code></pre>
        </div>
        
        <h2>Complete Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>

using namespace svm_pay;

int main() {
    try {
        // Initialize SDK
        initialize_sdk();
        
        // Create client
        Client client(SVMNetwork::SOLANA);
        
        // Payment details
        std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
        std::string amount = "10.0";
        
        // Generate a reference for tracking
        std::string reference = client.generate_reference();
        
        // Create payment URL with reference
        std::unordered_map<std::string, std::string> options = {
            {"label", "Online Store"},
            {"message", "Payment for premium subscription"},
            {"reference", reference}
        };
        
        std::string payment_url = client.create_transfer_url(recipient, amount, options);
        std::cout << "Created payment URL:" << std::endl;
        std::cout << payment_url << std::endl << std::endl;
        
        // Parse the URL to verify
        auto request = client.parse_url(payment_url);
        std::cout << "Parsed payment request:" << std::endl;
        std::cout << "  Type: " << request_type_to_string(request->type) << std::endl;
        std::cout << "  Network: " << network_to_string(request->network) << std::endl;
        std::cout << "  Recipient: " << request->recipient << std::endl;
        std::cout << "  Amount: " << request->amount.value_or("N/A") << std::endl;
        std::cout << "  Label: " << request->label.value_or("N/A") << std::endl;
        
        // Cleanup
        cleanup_sdk();
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Error Handling</h2>
        <p>The SDK provides specific exception types for different error conditions:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto request = client.parse_url(invalid_url);
} catch (const URLParseException& e) {
    // Handle URL parsing errors
    std::cerr << "Invalid URL format: " << e.what() << std::endl;
} catch (const AddressValidationException& e) {
    // Handle address validation errors
    std::cerr << "Invalid recipient address: " << e.what() << std::endl;
} catch (const NetworkException& e) {
    // Handle network-related errors
    std::cerr << "Network error: " << e.what() << std::endl;
} catch (const std::exception& e) {
    // Handle other errors
    std::cerr << "Unexpected error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/url-parsing" className="text-blue-600 hover:underline">Advanced URL Parsing</Link> - Handle complex payment URLs</li>
          <li><Link to="/docs/cpp-sdk/network-adapters" className="text-blue-600 hover:underline">Network Adapters</Link> - Work with blockchain networks</li>
          <li><Link to="/docs/cpp-sdk/exceptions" className="text-blue-600 hover:underline">Exception Handling</Link> - Comprehensive error handling</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKUrlParsingDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK URL Parsing</h1>
      <p className="text-xl text-slate-600 mb-8">
        Advanced URL parsing and validation techniques for different payment types and edge cases.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>The SVM-Pay C++ SDK provides robust URL parsing capabilities that handle various payment URL formats, validate parameters, and extract all relevant payment information.</p>
        
        <h2>Supported URL Schemes</h2>
        <ul>
          <li><strong>Transfer URLs</strong> - Direct token transfers</li>
          <li><strong>Transaction URLs</strong> - Custom transaction processing</li>
          <li><strong>Cross-Chain URLs</strong> - Multi-network transfers</li>
        </ul>
        
        <h2>Basic URL Parsing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

Client client(SVMNetwork::SOLANA);

// Parse a simple transfer URL
std::string url = "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5";
auto request = client.parse_url(url);

std::cout << "Type: " << request_type_to_string(request->type) << std::endl;
std::cout << "Network: " << network_to_string(request->network) << std::endl;
std::cout << "Recipient: " << request->recipient << std::endl;
std::cout << "Amount: " << request->amount.value_or("N/A") << std::endl;`}</code></pre>
        </div>
        
        <h2>Handling Optional Parameters</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`auto request = client.parse_url(complex_url);

// Check for optional fields
if (request->label.has_value()) {
    std::cout << "Label: " << request->label.value() << std::endl;
}

if (request->message.has_value()) {
    std::cout << "Message: " << request->message.value() << std::endl;
}

if (request->memo.has_value()) {
    std::cout << "Memo: " << request->memo.value() << std::endl;
}

// Handle SPL token transfers
if (request->spl_token.has_value()) {
    std::cout << "SPL Token: " << request->spl_token.value() << std::endl;
}

// Multiple references support
if (!request->references.empty()) {
    std::cout << "References:" << std::endl;
    for (const auto& ref : request->references) {
        std::cout << "  - " << ref << std::endl;
    }
}`}</code></pre>
        </div>
        
        <h2>Network-Specific Parsing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Solana URL
std::string solana_url = "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.0";

// Sonic URL  
std::string sonic_url = "sonic:8w92M8jZ0fyUdmCkrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0";

// Eclipse URL
std::string eclipse_url = "eclipse:9x93N9kA1gzVemDlrkeSmvnT5S2IrwZaH6G6GHwo?amount=3.0";

// Parse different networks
auto solana_request = client.parse_url(solana_url);
auto sonic_request = client.parse_url(sonic_url);
auto eclipse_request = client.parse_url(eclipse_url);

// Check which network each request targets
std::cout << "Solana request network: " << network_to_string(solana_request->network) << std::endl;
std::cout << "Sonic request network: " << network_to_string(sonic_request->network) << std::endl;
std::cout << "Eclipse request network: " << network_to_string(eclipse_request->network) << std::endl;`}</code></pre>
        </div>
        
        <h2>Transaction URL Parsing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Transaction URL with link parameter
std::string tx_url = "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn"
                     "?link=https://example.com/tx/abc123"
                     "&label=Custom%20Transaction";

auto tx_request = client.parse_url(tx_url);

if (tx_request->type == RequestType::TRANSACTION) {
    if (tx_request->link.has_value()) {
        std::cout << "Transaction link: " << tx_request->link.value() << std::endl;
    }
}`}</code></pre>
        </div>
        
        <h2>Cross-Chain URL Parsing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Cross-chain transfer URL
std::string cross_chain_url = "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn"
                              "?amount=100"
                              "&source_network=ethereum"
                              "&bridge=wormhole";

auto cross_request = client.parse_url(cross_chain_url);

if (cross_request->type == RequestType::CROSS_CHAIN) {
    if (cross_request->source_network.has_value()) {
        std::cout << "Source network: " << cross_request->source_network.value() << std::endl;
    }
    if (cross_request->bridge.has_value()) {
        std::cout << "Bridge: " << cross_request->bridge.value() << std::endl;
    }
}`}</code></pre>
        </div>
        
        <h2>Error Handling and Validation</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto request = client.parse_url(url);
    // Successful parsing
} catch (const URLParseException& e) {
    std::cerr << "URL parse error: " << e.what() << std::endl;
    // Handle malformed URLs
} catch (const AddressValidationException& e) {
    std::cerr << "Address validation error: " << e.what() << std::endl;
    // Handle invalid recipient addresses
} catch (const NetworkException& e) {
    std::cerr << "Network error: " << e.what() << std::endl;
    // Handle unsupported networks
}`}</code></pre>
        </div>
        
        <h2>Custom Validation</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`bool validate_payment_request(const PaymentRequest& request) {
    // Check required fields
    if (request.recipient.empty()) {
        std::cerr << "Missing recipient address" << std::endl;
        return false;
    }
    
    // Validate amount for transfer requests
    if (request.type == RequestType::TRANSFER && !request.amount.has_value()) {
        std::cerr << "Transfer requests require an amount" << std::endl;
        return false;
    }
    
    // Validate transaction link
    if (request.type == RequestType::TRANSACTION && !request.link.has_value()) {
        std::cerr << "Transaction requests require a link" << std::endl;
        return false;
    }
    
    // Check amount is positive
    if (request.amount.has_value()) {
        try {
            double amount = std::stod(request.amount.value());
            if (amount <= 0) {
                std::cerr << "Amount must be positive" << std::endl;
                return false;
            }
        } catch (const std::exception& e) {
            std::cerr << "Invalid amount format" << std::endl;
            return false;
        }
    }
    
    return true;
}

// Usage
try {
    auto request = client.parse_url(url);
    if (validate_payment_request(*request)) {
        // Process valid request
        process_payment(*request);
    }
} catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Batch URL Processing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`std::vector<std::string> urls = {
    "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.0",
    "sonic:8w92M8jZ0fyUdmCkrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0",
    "eclipse:9x93N9kA1gzVemDlrkeSmvnT5S2IrwZaH6G6GHwo?amount=3.0"
};

std::vector<std::unique_ptr<PaymentRequest>> requests;

for (const auto& url : urls) {
    try {
        auto request = client.parse_url(url);
        requests.push_back(std::move(request));
        std::cout << "Successfully parsed: " << url << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Failed to parse " << url << ": " << e.what() << std::endl;
    }
}

std::cout << "Successfully parsed " << requests.size() << " out of " 
          << urls.size() << " URLs" << std::endl;`}</code></pre>
        </div>
        
        <h2>Reference Parsing Configuration</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Configure maximum number of references to parse
client.set_max_references(5);  // Default is 10

// URL with multiple references
std::string multi_ref_url = "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn"
                           "?amount=1.0"
                           "&reference=ref1"
                           "&reference=ref2"
                           "&reference=ref3";

auto request = client.parse_url(multi_ref_url);
std::cout << "Found " << request->references.size() << " references" << std::endl;

for (size_t i = 0; i < request->references.size(); ++i) {
    std::cout << "Reference " << (i + 1) << ": " << request->references[i] << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Complete Parsing Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <vector>

using namespace svm_pay;

void parse_and_display(Client& client, const std::string& url) {
    std::cout << "\\nParsing URL: " << url << std::endl;
    std::cout << std::string(60, '-') << std::endl;
    
    try {
        auto request = client.parse_url(url);
        
        std::cout << "Type: " << request_type_to_string(request->type) << std::endl;
        std::cout << "Network: " << network_to_string(request->network) << std::endl;
        std::cout << "Recipient: " << request->recipient << std::endl;
        
        if (request->amount.has_value()) {
            std::cout << "Amount: " << request->amount.value() << std::endl;
        }
        
        if (request->label.has_value()) {
            std::cout << "Label: " << request->label.value() << std::endl;
        }
        
        if (request->message.has_value()) {
            std::cout << "Message: " << request->message.value() << std::endl;
        }
        
        if (request->memo.has_value()) {
            std::cout << "Memo: " << request->memo.value() << std::endl;
        }
        
        if (request->link.has_value()) {
            std::cout << "Link: " << request->link.value() << std::endl;
        }
        
        if (!request->references.empty()) {
            std::cout << "References: ";
            for (size_t i = 0; i < request->references.size(); ++i) {
                if (i > 0) std::cout << ", ";
                std::cout << request->references[i];
            }
            std::cout << std::endl;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

int main() {
    initialize_sdk();
    
    Client client(SVMNetwork::SOLANA);
    
    std::vector<std::string> test_urls = {
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5",
        "sonic:8w92M8jZ0fyUdmCkrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0&label=Test%20Payment",
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?link=https://example.com/tx",
        "invalid:url:format"
    };
    
    for (const auto& url : test_urls) {
        parse_and_display(client, url);
    }
    
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Always validate</strong> - Check all optional fields before using them</li>
          <li><strong>Handle exceptions</strong> - Use specific exception types for better error handling</li>
          <li><strong>Sanitize inputs</strong> - Validate amounts, addresses, and other parameters</li>
          <li><strong>Log errors</strong> - Keep track of parsing failures for debugging</li>
          <li><strong>Test edge cases</strong> - Test with malformed, empty, and boundary-case URLs</li>
        </ul>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/network-adapters" className="text-blue-600 hover:underline">Network Adapters</Link> - Process parsed requests with blockchain networks</li>
          <li><Link to="/docs/cpp-sdk/exceptions" className="text-blue-600 hover:underline">Exception Handling</Link> - Comprehensive error management</li>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKNetworkAdaptersDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Network Adapters</h1>
      <p className="text-xl text-slate-600 mb-8">
        Work with blockchain network adapters for processing payments and interacting with different SVM networks.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>Network adapters provide a standardized interface for interacting with different blockchain networks. Each adapter handles network-specific operations like transaction creation, submission, and status checking.</p>
        
        <h2>Available Adapters</h2>
        <ul>
          <li><strong>SolanaNetworkAdapter</strong> - Solana mainnet and devnet</li>
          <li><strong>SonicNetworkAdapter</strong> - Sonic SVM network</li>
          <li><strong>EclipseNetworkAdapter</strong> - Eclipse network</li>
          <li><strong>SoonNetworkAdapter</strong> - s00n network</li>
        </ul>
        
        <h2>Basic Network Adapter Usage</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <svm-pay/network/solana.hpp>

using namespace svm_pay;

int main() {
    initialize_sdk();
    
    Client client(SVMNetwork::SOLANA);
    
    // Get the Solana network adapter
    auto* adapter = client.get_adapter(SVMNetwork::SOLANA);
    
    if (adapter) {
        std::cout << "Adapter available for Solana network" << std::endl;
        
        // Use adapter for network operations
        // (adapter operations are typically async)
    }
    
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Creating Custom Network Adapters</h2>
        <p>You can create custom network adapters by implementing the NetworkAdapter interface:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/network/adapter.hpp>

class CustomNetworkAdapter : public NetworkAdapter {
public:
    std::future<std::string> create_transaction(
        const PaymentRequest& request) override {
        
        return std::async(std::launch::async, [request]() {
            // Custom transaction creation logic
            std::string transaction_id = "custom_tx_" + generate_id();
            
            // Simulate network delay
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            
            return transaction_id;
        });
    }
    
    std::future<TransactionStatus> get_transaction_status(
        const std::string& transaction_id) override {
        
        return std::async(std::launch::async, [transaction_id]() {
            // Custom status checking logic
            TransactionStatus status;
            status.confirmed = true;
            status.signature = transaction_id;
            
            return status;
        });
    }
    
private:
    std::string generate_id() {
        // Custom ID generation logic
        return "abc123def456";
    }
};`}</code></pre>
        </div>
        
        <h2>Registering Custom Adapters</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Register a custom adapter
auto custom_adapter = std::make_unique<CustomNetworkAdapter>();
client.register_adapter(SVMNetwork::SONIC, std::move(custom_adapter));

// Now you can use the custom adapter
auto* adapter = client.get_adapter(SVMNetwork::SONIC);
if (adapter) {
    // Use the custom adapter
    auto request = client.parse_url("sonic:address?amount=1.0");
    auto future_tx = adapter->create_transaction(*request);
    
    // Handle the future result
    try {
        auto transaction_id = future_tx.get();
        std::cout << "Transaction created: " << transaction_id << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Transaction creation failed: " << e.what() << std::endl;
    }
}`}</code></pre>
        </div>
        
        <h2>Asynchronous Operations</h2>
        <p>All network adapter operations are asynchronous and return std::future objects:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Async transaction creation
auto create_future = adapter->create_transaction(*request);

// Option 1: Block and wait for result
try {
    std::string tx_id = create_future.get();
    std::cout << "Transaction ID: " << tx_id << std::endl;
} catch (const NetworkException& e) {
    std::cerr << "Network error: " << e.what() << std::endl;
}

// Option 2: Wait with timeout
if (create_future.wait_for(std::chrono::seconds(30)) == std::future_status::ready) {
    std::string tx_id = create_future.get();
    std::cout << "Transaction ID: " << tx_id << std::endl;
} else {
    std::cerr << "Transaction creation timed out" << std::endl;
}

// Option 3: Check if ready (non-blocking)
if (create_future.wait_for(std::chrono::seconds(0)) == std::future_status::ready) {
    std::string tx_id = create_future.get();
    std::cout << "Transaction ID: " << tx_id << std::endl;
} else {
    std::cout << "Transaction still processing..." << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Transaction Status Checking</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Create transaction first
auto tx_future = adapter->create_transaction(*request);
std::string tx_id = tx_future.get();

// Check transaction status
auto status_future = adapter->get_transaction_status(tx_id);

try {
    TransactionStatus status = status_future.get();
    
    std::cout << "Transaction Status:" << std::endl;
    std::cout << "  Confirmed: " << (status.confirmed ? "Yes" : "No") << std::endl;
    std::cout << "  Signature: " << status.signature << std::endl;
    
    if (status.block_height.has_value()) {
        std::cout << "  Block Height: " << status.block_height.value() << std::endl;
    }
    
    if (status.confirmations.has_value()) {
        std::cout << "  Confirmations: " << status.confirmations.value() << std::endl;
    }
    
} catch (const NetworkException& e) {
    std::cerr << "Status check failed: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Solana Network Adapter</h2>
        <p>The built-in Solana adapter provides comprehensive Solana network support:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/network/solana.hpp>

// The Solana adapter is automatically registered
auto* solana_adapter = client.get_adapter(SVMNetwork::SOLANA);

// Create a payment request
auto request = client.parse_url("solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.0");

// Create transaction on Solana
auto tx_future = solana_adapter->create_transaction(*request);

// The adapter handles:
// - RPC communication with Solana nodes
// - Transaction serialization
// - Fee calculation
// - Error handling

std::string transaction_id = tx_future.get();
std::cout << "Solana transaction: " << transaction_id << std::endl;`}</code></pre>
        </div>
        
        <h2>Error Handling</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto tx_future = adapter->create_transaction(*request);
    std::string tx_id = tx_future.get();
    
} catch (const NetworkException& e) {
    // Network-related errors (RPC failures, timeouts)
    std::cerr << "Network error: " << e.what() << std::endl;
    
} catch (const AddressValidationException& e) {
    // Invalid addresses
    std::cerr << "Address error: " << e.what() << std::endl;
    
} catch (const std::runtime_error& e) {
    // General runtime errors
    std::cerr << "Runtime error: " << e.what() << std::endl;
    
} catch (const std::exception& e) {
    // Any other errors
    std::cerr << "Unexpected error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Adapter Factory Pattern</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// The SDK uses a factory pattern for adapter management
#include <svm-pay/network/factory.hpp>

// Register multiple adapters
NetworkAdapterFactory::register_adapter(
    SVMNetwork::SOLANA, 
    std::make_unique<SolanaNetworkAdapter>()
);

NetworkAdapterFactory::register_adapter(
    SVMNetwork::SONIC, 
    std::make_unique<SonicNetworkAdapter>()
);

// Get adapters through the factory
auto* solana_adapter = NetworkAdapterFactory::get_adapter(SVMNetwork::SOLANA);
auto* sonic_adapter = NetworkAdapterFactory::get_adapter(SVMNetwork::SONIC);

// The Client class uses the factory internally
Client client;  // Uses factory to get adapters`}</code></pre>
        </div>
        
        <h2>Complete Network Adapter Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <thread>
#include <chrono>

using namespace svm_pay;

void process_payment_with_adapter(Client& client, const std::string& url) {
    try {
        // Parse payment URL
        auto request = client.parse_url(url);
        std::cout << "Processing payment for " << request->recipient << std::endl;
        
        // Get appropriate network adapter
        auto* adapter = client.get_adapter(request->network);
        if (!adapter) {
            std::cerr << "No adapter available for network: " 
                      << network_to_string(request->network) << std::endl;
            return;
        }
        
        // Create transaction asynchronously
        std::cout << "Creating transaction..." << std::endl;
        auto tx_future = adapter->create_transaction(*request);
        
        // Wait for transaction creation with timeout
        if (tx_future.wait_for(std::chrono::seconds(10)) == std::future_status::ready) {
            std::string tx_id = tx_future.get();
            std::cout << "Transaction created: " << tx_id << std::endl;
            
            // Check transaction status
            std::cout << "Checking transaction status..." << std::endl;
            auto status_future = adapter->get_transaction_status(tx_id);
            
            if (status_future.wait_for(std::chrono::seconds(5)) == std::future_status::ready) {
                TransactionStatus status = status_future.get();
                
                if (status.confirmed) {
                    std::cout << "Transaction confirmed!" << std::endl;
                    std::cout << "Signature: " << status.signature << std::endl;
                } else {
                    std::cout << "Transaction pending confirmation..." << std::endl;
                }
            } else {
                std::cout << "Status check timed out" << std::endl;
            }
            
        } else {
            std::cerr << "Transaction creation timed out" << std::endl;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error processing payment: " << e.what() << std::endl;
    }
}

int main() {
    initialize_sdk();
    
    Client client(SVMNetwork::SOLANA);
    
    // Test URLs for different networks
    std::vector<std::string> test_urls = {
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.0&label=Test",
        "sonic:8w92M8jZ0fyUdmCkrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0&label=Sonic%20Test"
    };
    
    for (const auto& url : test_urls) {
        std::cout << "\\n" << std::string(50, '=') << std::endl;
        process_payment_with_adapter(client, url);
    }
    
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Configuration and Advanced Usage</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Configure adapter settings (if supported)
auto* solana_adapter = dynamic_cast<SolanaNetworkAdapter*>(
    client.get_adapter(SVMNetwork::SOLANA)
);

if (solana_adapter) {
    // Configure RPC endpoint (if supported)
    // solana_adapter->set_rpc_endpoint("https://api.mainnet-beta.solana.com");
    
    // Set request timeout (if supported)
    // solana_adapter->set_timeout(std::chrono::seconds(30));
}`}</code></pre>
        </div>
        
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Handle timeouts</strong> - Always use timeouts when waiting for futures</li>
          <li><strong>Check adapter availability</strong> - Verify adapter exists before use</li>
          <li><strong>Use async patterns</strong> - Don't block the main thread unnecessarily</li>
          <li><strong>Handle network errors</strong> - Network operations can fail, handle gracefully</li>
          <li><strong>Cache adapters</strong> - Reuse adapter instances instead of recreating them</li>
        </ul>
        
        <h2>Thread Safety</h2>
        <p>Network adapters are designed to be thread-safe for concurrent operations:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Multiple threads can safely use the same adapter
std::vector<std::thread> threads;

for (int i = 0; i < 5; ++i) {
    threads.emplace_back([&client, i]() {
        auto request = client.parse_url("solana:addr?amount=" + std::to_string(i));
        auto* adapter = client.get_adapter(SVMNetwork::SOLANA);
        
        if (adapter) {
            auto tx_future = adapter->create_transaction(*request);
            try {
                std::string tx_id = tx_future.get();
                std::cout << "Thread " << i << " created transaction: " << tx_id << std::endl;
            } catch (const std::exception& e) {
                std::cerr << "Thread " << i << " error: " << e.what() << std::endl;
            }
        }
    });
}

// Wait for all threads to complete
for (auto& thread : threads) {
    thread.join();
}`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/client" className="text-blue-600 hover:underline">Client Class</Link> - High-level client interface</li>
          <li><Link to="/docs/cpp-sdk/exceptions" className="text-blue-600 hover:underline">Exception Handling</Link> - Comprehensive error management</li>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKClientDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Client Class</h1>
      <p className="text-xl text-slate-600 mb-8">
        Complete reference for the Client class - the main interface for SVM-Pay C++ SDK operations.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>The Client class provides a high-level interface for all SVM-Pay operations. It manages network adapters, handles URL parsing and creation, and provides reference generation capabilities.</p>
        
        <h2>Class Declaration</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay {
    class Client {
    public:
        // Constructors
        explicit Client(SVMNetwork default_network = SVMNetwork::SOLANA);
        
        // Payment URL creation
        std::string create_transfer_url(
            const std::string& recipient, 
            const std::string& amount,
            const std::unordered_map<std::string, std::string>& options = {}
        );
        
        std::string create_transaction_url(
            const std::string& recipient,
            const std::string& link,
            const std::unordered_map<std::string, std::string>& options = {}
        );
        
        // URL parsing
        std::unique_ptr<PaymentRequest> parse_url(const std::string& url);
        
        // Reference generation
        std::string generate_reference(size_t length = 32);
        
        // Network management
        void set_default_network(SVMNetwork network);
        SVMNetwork get_default_network() const;
        
        // Configuration
        void set_max_references(size_t max_references);
        size_t get_max_references() const;
        
        // Adapter management
        void register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter);
        NetworkAdapter* get_adapter(SVMNetwork network);
    };
}`}</code></pre>
        </div>
        
        <h2>Constructor</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Create client with default network
Client client;  // Defaults to Solana

// Create client with specific network
Client solana_client(SVMNetwork::SOLANA);
Client sonic_client(SVMNetwork::SONIC);
Client eclipse_client(SVMNetwork::ECLIPSE);
Client soon_client(SVMNetwork::SOON);`}</code></pre>
        </div>
        
        <h2>Payment URL Creation</h2>
        
        <h3>Transfer URLs</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Basic transfer URL
std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
std::string amount = "1.5";
std::string url = client.create_transfer_url(recipient, amount);
// Output: "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5"

// Transfer URL with options
std::unordered_map<std::string, std::string> options = {
    {"label", "Coffee Shop"},
    {"message", "Payment for coffee"},
    {"memo", "Order #12345"},
    {"reference", "abc123def456"}
};

std::string url_with_options = client.create_transfer_url(recipient, amount, options);
// Output includes all encoded parameters`}</code></pre>
        </div>
        
        <h3>Transaction URLs</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Basic transaction URL
std::string link = "https://example.com/transaction/abc123";
std::string tx_url = client.create_transaction_url(recipient, link);

// Transaction URL with options
std::unordered_map<std::string, std::string> tx_options = {
    {"label", "Custom Transaction"},
    {"message", "Execute custom payment logic"}
};

std::string custom_tx_url = client.create_transaction_url(recipient, link, tx_options);`}</code></pre>
        </div>
        
        <h2>URL Parsing</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    // Parse any SVM-Pay compatible URL
    auto request = client.parse_url(payment_url);
    
    // Access parsed data
    std::cout << "Type: " << request_type_to_string(request->type) << std::endl;
    std::cout << "Network: " << network_to_string(request->network) << std::endl;
    std::cout << "Recipient: " << request->recipient << std::endl;
    
    // Check optional fields
    if (request->amount.has_value()) {
        std::cout << "Amount: " << request->amount.value() << std::endl;
    }
    
    if (request->label.has_value()) {
        std::cout << "Label: " << request->label.value() << std::endl;
    }
    
} catch (const URLParseException& e) {
    std::cerr << "Parse error: " << e.what() << std::endl;
} catch (const AddressValidationException& e) {
    std::cerr << "Address validation error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Reference Generation</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Generate default 32-character reference
std::string ref = client.generate_reference();
std::cout << "Reference: " << ref << std::endl;
// Output: "a1b2c3d4e5f6..." (32 characters)

// Generate custom length reference
std::string short_ref = client.generate_reference(16);
std::cout << "Short reference: " << short_ref << std::endl;
// Output: "a1b2c3d4e5f6a7b8" (16 characters)

// Generate long reference
std::string long_ref = client.generate_reference(64);
std::cout << "Long reference: " << long_ref << std::endl;
// Output: 64 character base58 string`}</code></pre>
        </div>
        
        <h2>Network Management</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Set default network
client.set_default_network(SVMNetwork::SONIC);

// Get current default network
SVMNetwork current = client.get_default_network();
std::cout << "Current network: " << network_to_string(current) << std::endl;

// Create URLs with different networks
client.set_default_network(SVMNetwork::SOLANA);
std::string solana_url = client.create_transfer_url(recipient, "1.0");

client.set_default_network(SVMNetwork::SONIC);
std::string sonic_url = client.create_transfer_url(recipient, "1.0");`}</code></pre>
        </div>
        
        <h2>Configuration</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Configure maximum references to parse
client.set_max_references(5);  // Default is 10
size_t max_refs = client.get_max_references();
std::cout << "Max references: " << max_refs << std::endl;

// This affects URL parsing behavior
std::string multi_ref_url = "solana:addr?amount=1&reference=ref1&reference=ref2&reference=ref3";
auto request = client.parse_url(multi_ref_url);
std::cout << "Parsed " << request->references.size() << " references" << std::endl;`}</code></pre>
        </div>
        
        <h2>Adapter Management</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Register custom network adapter
auto custom_adapter = std::make_unique<CustomNetworkAdapter>();
client.register_adapter(SVMNetwork::SONIC, std::move(custom_adapter));

// Get network adapter
auto* adapter = client.get_adapter(SVMNetwork::SOLANA);
if (adapter) {
    std::cout << "Solana adapter available" << std::endl;
    
    // Use adapter for network operations
    auto tx_future = adapter->create_transaction(*request);
    // ... handle future
} else {
    std::cout << "No Solana adapter registered" << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Error Handling</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    // Any client operation that might fail
    auto request = client.parse_url(some_url);
    std::string new_url = client.create_transfer_url(invalid_address, "1.0");
    
} catch (const URLParseException& e) {
    // URL parsing errors
    std::cerr << "URL parse error: " << e.what() << std::endl;
    
} catch (const AddressValidationException& e) {
    // Address validation errors
    std::cerr << "Address validation error: " << e.what() << std::endl;
    
} catch (const NetworkException& e) {
    // Network-related errors
    std::cerr << "Network error: " << e.what() << std::endl;
    
} catch (const std::invalid_argument& e) {
    // Invalid arguments (amount format, etc.)
    std::cerr << "Invalid argument: " << e.what() << std::endl;
    
} catch (const std::runtime_error& e) {
    // General runtime errors
    std::cerr << "Runtime error: " << e.what() << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Thread Safety</h2>
        <p>The Client class is designed to be thread-safe for concurrent operations:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Multiple threads can safely use the same client instance
Client client(SVMNetwork::SOLANA);

std::vector<std::thread> threads;
std::mutex output_mutex;

for (int i = 0; i < 5; ++i) {
    threads.emplace_back([&client, &output_mutex, i]() {
        try {
            // Generate unique references concurrently
            std::string ref = client.generate_reference();
            
            // Create URLs concurrently
            std::string url = client.create_transfer_url(
                "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn", 
                std::to_string(i + 1)
            );
            
            // Parse URLs concurrently
            auto request = client.parse_url(url);
            
            // Thread-safe output
            std::lock_guard<std::mutex> lock(output_mutex);
            std::cout << "Thread " << i << ": " << ref << std::endl;
            
        } catch (const std::exception& e) {
            std::lock_guard<std::mutex> lock(output_mutex);
            std::cerr << "Thread " << i << " error: " << e.what() << std::endl;
        }
    });
}

for (auto& thread : threads) {
    thread.join();
}`}</code></pre>
        </div>
        
        <h2>Complete Client Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <vector>

using namespace svm_pay;

class PaymentProcessor {
private:
    Client client_;
    
public:
    PaymentProcessor(SVMNetwork network = SVMNetwork::SOLANA) 
        : client_(network) {
        // Configure client
        client_.set_max_references(5);
    }
    
    std::string create_payment_link(const std::string& recipient, 
                                   const std::string& amount,
                                   const std::string& label = "",
                                   const std::string& message = "") {
        try {
            std::unordered_map<std::string, std::string> options;
            
            if (!label.empty()) {
                options["label"] = label;
            }
            
            if (!message.empty()) {
                options["message"] = message;
            }
            
            // Add tracking reference
            options["reference"] = client_.generate_reference(16);
            
            return client_.create_transfer_url(recipient, amount, options);
            
        } catch (const std::exception& e) {
            std::cerr << "Error creating payment link: " << e.what() << std::endl;
            return "";
        }
    }
    
    bool validate_payment_url(const std::string& url) {
        try {
            auto request = client_.parse_url(url);
            
            // Basic validation
            if (request->recipient.empty()) {
                return false;
            }
            
            if (request->type == RequestType::TRANSFER && !request->amount.has_value()) {
                return false;
            }
            
            // Amount validation
            if (request->amount.has_value()) {
                double amount = std::stod(request->amount.value());
                if (amount <= 0) {
                    return false;
                }
            }
            
            return true;
            
        } catch (const std::exception& e) {
            std::cerr << "Validation error: " << e.what() << std::endl;
            return false;
        }
    }
    
    void process_payment_batch(const std::vector<std::string>& urls) {
        for (size_t i = 0; i < urls.size(); ++i) {
            std::cout << "\\nProcessing payment " << (i + 1) << "/" << urls.size() << std::endl;
            
            if (validate_payment_url(urls[i])) {
                auto request = client_.parse_url(urls[i]);
                std::cout << "  Valid payment for " << request->recipient;
                
                if (request->amount.has_value()) {
                    std::cout << " (Amount: " << request->amount.value() << ")";
                }
                
                std::cout << std::endl;
                
                // Process with network adapter
                auto* adapter = client_.get_adapter(request->network);
                if (adapter) {
                    std::cout << "  Network adapter available for " 
                              << network_to_string(request->network) << std::endl;
                    // Could create transaction here
                } else {
                    std::cout << "  No adapter for " 
                              << network_to_string(request->network) << std::endl;
                }
                
            } else {
                std::cout << "  Invalid payment URL" << std::endl;
            }
        }
    }
};

int main() {
    initialize_sdk();
    
    PaymentProcessor processor(SVMNetwork::SOLANA);
    
    // Create some payment links
    std::string payment1 = processor.create_payment_link(
        "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
        "10.0",
        "Online Store",
        "Payment for premium subscription"
    );
    
    std::string payment2 = processor.create_payment_link(
        "8w92M8jZ0fyUdmCkrjdLhvmS4R1HqvYZzG5FGvn",
        "5.5",
        "Coffee Shop",
        "Morning coffee"
    );
    
    std::cout << "Created payment links:" << std::endl;
    std::cout << "1. " << payment1 << std::endl;
    std::cout << "2. " << payment2 << std::endl;
    
    // Process the payments
    std::vector<std::string> payment_urls = {payment1, payment2};
    processor.process_payment_batch(payment_urls);
    
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Initialize once</strong> - Create one Client instance and reuse it</li>
          <li><strong>Handle exceptions</strong> - Always wrap client operations in try-catch blocks</li>
          <li><strong>Validate inputs</strong> - Check recipient addresses and amounts before creating URLs</li>
          <li><strong>Use references</strong> - Include reference IDs for payment tracking</li>
          <li><strong>Configure appropriately</strong> - Set max references based on your use case</li>
          <li><strong>Thread safety</strong> - The client is thread-safe, but your own logic may need synchronization</li>
        </ul>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/exceptions" className="text-blue-600 hover:underline">Exception Handling</Link> - Comprehensive error management</li>
          <li><Link to="/docs/cpp-sdk/cmake" className="text-blue-600 hover:underline">CMake Integration</Link> - Project integration guide</li>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKExceptionsDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK Exception Handling</h1>
      <p className="text-xl text-slate-600 mb-8">
        Comprehensive guide to exception handling and error management in the SVM-Pay C++ SDK.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>The SVM-Pay C++ SDK provides a comprehensive exception hierarchy for handling different types of errors. All custom exceptions inherit from std::exception and provide detailed error information.</p>
        
        <h2>Exception Hierarchy</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`std::exception
├── std::runtime_error
│   ├── NetworkException                    // Network-related errors
│   ├── URLParseException                   // URL parsing errors
│   ├── AddressValidationException          // Address validation errors
│   └── ConfigurationException              // Configuration errors
└── std::invalid_argument
    ├── InvalidAmountException              // Invalid amount format
    ├── InvalidReferenceException           // Invalid reference format
    └── InvalidNetworkException             // Unknown network type`}</code></pre>
        </div>
        
        <h2>Exception Types</h2>
        
        <h3>NetworkException</h3>
        <p>Thrown when network operations fail (RPC errors, timeouts, connection issues).</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto* adapter = client.get_adapter(SVMNetwork::SOLANA);
    auto tx_future = adapter->create_transaction(*request);
    std::string tx_id = tx_future.get();
    
} catch (const NetworkException& e) {
    std::cerr << "Network operation failed: " << e.what() << std::endl;
    // Handle network errors:
    // - RPC endpoint unreachable
    // - Request timeout
    // - Invalid response format
    // - Rate limiting
}`}</code></pre>
        </div>
        
        <h3>URLParseException</h3>
        <p>Thrown when URL parsing fails due to malformed URLs or invalid scheme.</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto request = client.parse_url(malformed_url);
    
} catch (const URLParseException& e) {
    std::cerr << "URL parsing failed: " << e.what() << std::endl;
    // Handle parsing errors:
    // - Invalid URL scheme
    // - Malformed query parameters
    // - Missing required parameters
    // - URL encoding issues
}`}</code></pre>
        </div>
        
        <h3>AddressValidationException</h3>
        <p>Thrown when recipient addresses fail validation.</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    std::string url = client.create_transfer_url(invalid_address, "1.0");
    
} catch (const AddressValidationException& e) {
    std::cerr << "Address validation failed: " << e.what() << std::endl;
    // Handle address errors:
    // - Invalid address format
    // - Wrong address length
    // - Invalid base58 encoding
    // - Unsupported address type
}`}</code></pre>
        </div>
        
        <h3>InvalidAmountException</h3>
        <p>Thrown when amount validation fails.</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    std::string url = client.create_transfer_url(address, "invalid_amount");
    
} catch (const InvalidAmountException& e) {
    std::cerr << "Invalid amount: " << e.what() << std::endl;
    // Handle amount errors:
    // - Non-numeric amount
    // - Negative amount
    // - Zero amount
    // - Precision too high
}`}</code></pre>
        </div>
        
        <h2>Comprehensive Error Handling</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>

using namespace svm_pay;

enum class ErrorCode {
    SUCCESS = 0,
    NETWORK_ERROR = 1,
    PARSE_ERROR = 2,
    VALIDATION_ERROR = 3,
    CONFIGURATION_ERROR = 4,
    UNKNOWN_ERROR = 5
};

class PaymentErrorHandler {
public:
    static ErrorCode handle_payment_creation(
        Client& client, 
        const std::string& recipient, 
        const std::string& amount,
        std::string& result_url) {
        
        try {
            result_url = client.create_transfer_url(recipient, amount);
            return ErrorCode::SUCCESS;
            
        } catch (const AddressValidationException& e) {
            std::cerr << "Address validation error: " << e.what() << std::endl;
            return ErrorCode::VALIDATION_ERROR;
            
        } catch (const InvalidAmountException& e) {
            std::cerr << "Amount validation error: " << e.what() << std::endl;
            return ErrorCode::VALIDATION_ERROR;
            
        } catch (const ConfigurationException& e) {
            std::cerr << "Configuration error: " << e.what() << std::endl;
            return ErrorCode::CONFIGURATION_ERROR;
            
        } catch (const std::exception& e) {
            std::cerr << "Unexpected error: " << e.what() << std::endl;
            return ErrorCode::UNKNOWN_ERROR;
        }
    }
    
    static ErrorCode handle_url_parsing(
        Client& client, 
        const std::string& url,
        std::unique_ptr<PaymentRequest>& result) {
        
        try {
            result = client.parse_url(url);
            return ErrorCode::SUCCESS;
            
        } catch (const URLParseException& e) {
            std::cerr << "URL parse error: " << e.what() << std::endl;
            return ErrorCode::PARSE_ERROR;
            
        } catch (const AddressValidationException& e) {
            std::cerr << "Address validation error: " << e.what() << std::endl;
            return ErrorCode::VALIDATION_ERROR;
            
        } catch (const InvalidNetworkException& e) {
            std::cerr << "Network validation error: " << e.what() << std::endl;
            return ErrorCode::VALIDATION_ERROR;
            
        } catch (const std::exception& e) {
            std::cerr << "Unexpected error: " << e.what() << std::endl;
            return ErrorCode::UNKNOWN_ERROR;
        }
    }
    
    static ErrorCode handle_network_operation(
        NetworkAdapter* adapter,
        const PaymentRequest& request,
        std::string& transaction_id) {
        
        if (!adapter) {
            std::cerr << "No network adapter available" << std::endl;
            return ErrorCode::CONFIGURATION_ERROR;
        }
        
        try {
            auto tx_future = adapter->create_transaction(request);
            
            // Wait with timeout
            if (tx_future.wait_for(std::chrono::seconds(30)) == std::future_status::ready) {
                transaction_id = tx_future.get();
                return ErrorCode::SUCCESS;
            } else {
                std::cerr << "Network operation timed out" << std::endl;
                return ErrorCode::NETWORK_ERROR;
            }
            
        } catch (const NetworkException& e) {
            std::cerr << "Network error: " << e.what() << std::endl;
            return ErrorCode::NETWORK_ERROR;
            
        } catch (const std::exception& e) {
            std::cerr << "Unexpected network error: " << e.what() << std::endl;
            return ErrorCode::UNKNOWN_ERROR;
        }
    }
};`}</code></pre>
        </div>
        
        <h2>Exception Information</h2>
        <p>All custom exceptions provide detailed error information:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`try {
    auto request = client.parse_url(invalid_url);
    
} catch (const URLParseException& e) {
    // Get error message
    std::string error_msg = e.what();
    
    // Log detailed error information
    std::cerr << "URL Parse Error Details:" << std::endl;
    std::cerr << "  Message: " << error_msg << std::endl;
    std::cerr << "  URL: " << invalid_url << std::endl;
    std::cerr << "  Timestamp: " << std::time(nullptr) << std::endl;
    
    // You can also check specific error conditions
    if (error_msg.find("Invalid scheme") != std::string::npos) {
        std::cerr << "  Cause: URL scheme not supported" << std::endl;
    } else if (error_msg.find("Missing parameter") != std::string::npos) {
        std::cerr << "  Cause: Required parameter missing" << std::endl;
    }
}`}</code></pre>
        </div>
        
        <h2>Async Exception Handling</h2>
        <p>Handle exceptions from asynchronous operations:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`auto* adapter = client.get_adapter(SVMNetwork::SOLANA);
auto tx_future = adapter->create_transaction(*request);

try {
    // Wait for async operation to complete
    std::string tx_id = tx_future.get();
    std::cout << "Transaction created: " << tx_id << std::endl;
    
} catch (const NetworkException& e) {
    std::cerr << "Async network error: " << e.what() << std::endl;
    
} catch (const std::exception& e) {
    std::cerr << "Async operation failed: " << e.what() << std::endl;
}

// Alternative: Check if ready without blocking
if (tx_future.wait_for(std::chrono::seconds(0)) == std::future_status::ready) {
    try {
        std::string tx_id = tx_future.get();
        std::cout << "Transaction ready: " << tx_id << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Transaction failed: " << e.what() << std::endl;
    }
} else {
    std::cout << "Transaction still processing..." << std::endl;
}`}</code></pre>
        </div>
        
        <h2>Error Recovery Strategies</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`class PaymentRetryHandler {
private:
    static const int MAX_RETRIES = 3;
    static const int RETRY_DELAY_MS = 1000;
    
public:
    static bool create_transaction_with_retry(
        Client& client,
        const PaymentRequest& request,
        std::string& transaction_id) {
        
        auto* adapter = client.get_adapter(request.network);
        if (!adapter) {
            std::cerr << "No adapter available for network" << std::endl;
            return false;
        }
        
        for (int attempt = 1; attempt <= MAX_RETRIES; ++attempt) {
            try {
                std::cout << "Transaction attempt " << attempt << "/" << MAX_RETRIES << std::endl;
                
                auto tx_future = adapter->create_transaction(request);
                
                // Wait with timeout
                if (tx_future.wait_for(std::chrono::seconds(10)) == std::future_status::ready) {
                    transaction_id = tx_future.get();
                    std::cout << "Transaction successful on attempt " << attempt << std::endl;
                    return true;
                }
                
                // Timeout - treat as network error for retry
                throw NetworkException("Request timeout");
                
            } catch (const NetworkException& e) {
                std::cerr << "Network error on attempt " << attempt << ": " << e.what() << std::endl;
                
                if (attempt < MAX_RETRIES) {
                    std::cout << "Retrying in " << RETRY_DELAY_MS << "ms..." << std::endl;
                    std::this_thread::sleep_for(std::chrono::milliseconds(RETRY_DELAY_MS));
                }
                
            } catch (const AddressValidationException& e) {
                // Don't retry validation errors
                std::cerr << "Validation error (no retry): " << e.what() << std::endl;
                return false;
                
            } catch (const std::exception& e) {
                std::cerr << "Unexpected error on attempt " << attempt << ": " << e.what() << std::endl;
                
                if (attempt < MAX_RETRIES) {
                    std::this_thread::sleep_for(std::chrono::milliseconds(RETRY_DELAY_MS));
                }
            }
        }
        
        std::cerr << "All retry attempts failed" << std::endl;
        return false;
    }
};`}</code></pre>
        </div>
        
        <h2>Logging and Debugging</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <fstream>
#include <ctime>
#include <iomanip>

class ErrorLogger {
private:
    std::ofstream log_file_;
    
public:
    ErrorLogger(const std::string& filename) : log_file_(filename, std::ios::app) {}
    
    void log_exception(const std::exception& e, const std::string& context = "") {
        auto now = std::time(nullptr);
        auto* tm = std::localtime(&now);
        
        log_file_ << "[" << std::put_time(tm, "%Y-%m-%d %H:%M:%S") << "] ";
        log_file_ << "EXCEPTION: " << e.what();
        
        if (!context.empty()) {
            log_file_ << " (Context: " << context << ")";
        }
        
        log_file_ << std::endl;
        log_file_.flush();
        
        // Also log to console in debug builds
        #ifdef DEBUG
        std::cerr << "Exception logged: " << e.what() << std::endl;
        #endif
    }
    
    void log_network_error(const NetworkException& e, const std::string& operation) {
        log_exception(e, "Network operation: " + operation);
    }
    
    void log_validation_error(const std::exception& e, const std::string& input) {
        log_exception(e, "Validation failed for: " + input);
    }
};

// Usage
ErrorLogger logger("svm_pay_errors.log");

try {
    auto request = client.parse_url(url);
} catch (const URLParseException& e) {
    logger.log_validation_error(e, url);
} catch (const NetworkException& e) {
    logger.log_network_error(e, "parse_url");
}`}</code></pre>
        </div>
        
        <h2>Thread-Safe Exception Handling</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <mutex>
#include <atomic>

class ThreadSafeErrorCounter {
private:
    std::atomic<int> network_errors_{0};
    std::atomic<int> parse_errors_{0};
    std::atomic<int> validation_errors_{0};
    std::mutex error_details_mutex_;
    std::vector<std::string> recent_errors_;
    
public:
    void record_error(const std::exception& e) {
        std::string error_type = typeid(e).name();
        
        if (dynamic_cast<const NetworkException*>(&e)) {
            network_errors_++;
        } else if (dynamic_cast<const URLParseException*>(&e)) {
            parse_errors_++;
        } else if (dynamic_cast<const AddressValidationException*>(&e) ||
                   dynamic_cast<const InvalidAmountException*>(&e)) {
            validation_errors_++;
        }
        
        // Thread-safe error details storage
        std::lock_guard<std::mutex> lock(error_details_mutex_);
        recent_errors_.push_back(std::string(e.what()));
        
        // Keep only last 100 errors
        if (recent_errors_.size() > 100) {
            recent_errors_.erase(recent_errors_.begin());
        }
    }
    
    void print_statistics() const {
        std::cout << "Error Statistics:" << std::endl;
        std::cout << "  Network errors: " << network_errors_.load() << std::endl;
        std::cout << "  Parse errors: " << parse_errors_.load() << std::endl;
        std::cout << "  Validation errors: " << validation_errors_.load() << std::endl;
        std::cout << "  Total errors: " << get_total_errors() << std::endl;
    }
    
    int get_total_errors() const {
        return network_errors_.load() + parse_errors_.load() + validation_errors_.load();
    }
};`}</code></pre>
        </div>
        
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Catch specific exceptions</strong> - Handle specific exception types for better error recovery</li>
          <li><strong>Don't ignore exceptions</strong> - Always handle or log exceptions appropriately</li>
          <li><strong>Retry network operations</strong> - Network errors are often temporary and can be retried</li>
          <li><strong>Don't retry validation errors</strong> - Input validation errors should not be retried</li>
          <li><strong>Log errors</strong> - Keep detailed logs for debugging and monitoring</li>
          <li><strong>Fail fast</strong> - Validate inputs early to catch errors before expensive operations</li>
          <li><strong>Resource cleanup</strong> - Use RAII patterns to ensure proper cleanup even during exceptions</li>
        </ul>
        
        <h2>Complete Exception Handling Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <chrono>

using namespace svm_pay;

class RobustPaymentProcessor {
private:
    Client client_;
    ErrorLogger logger_;
    ThreadSafeErrorCounter error_counter_;
    
public:
    RobustPaymentProcessor() 
        : client_(SVMNetwork::SOLANA), logger_("payment_errors.log") {}
    
    bool process_payment_safely(const std::string& recipient, 
                               const std::string& amount) {
        try {
            // Step 1: Create payment URL with validation
            std::string payment_url = create_payment_url_safely(recipient, amount);
            if (payment_url.empty()) {
                return false;
            }
            
            // Step 2: Parse and validate the URL
            auto request = parse_url_safely(payment_url);
            if (!request) {
                return false;
            }
            
            // Step 3: Process with network adapter
            std::string tx_id = process_with_network_safely(*request);
            if (tx_id.empty()) {
                return false;
            }
            
            std::cout << "Payment processed successfully: " << tx_id << std::endl;
            return true;
            
        } catch (const std::exception& e) {
            error_counter_.record_error(e);
            logger_.log_exception(e, "process_payment_safely");
            std::cerr << "Unexpected error in payment processing: " << e.what() << std::endl;
            return false;
        }
    }
    
private:
    std::string create_payment_url_safely(const std::string& recipient, 
                                         const std::string& amount) {
        try {
            return client_.create_transfer_url(recipient, amount);
            
        } catch (const AddressValidationException& e) {
            error_counter_.record_error(e);
            logger_.log_validation_error(e, "recipient: " + recipient);
            std::cerr << "Invalid recipient address: " << e.what() << std::endl;
            return "";
            
        } catch (const InvalidAmountException& e) {
            error_counter_.record_error(e);
            logger_.log_validation_error(e, "amount: " + amount);
            std::cerr << "Invalid amount: " << e.what() << std::endl;
            return "";
        }
    }
    
    std::unique_ptr<PaymentRequest> parse_url_safely(const std::string& url) {
        try {
            return client_.parse_url(url);
            
        } catch (const URLParseException& e) {
            error_counter_.record_error(e);
            logger_.log_validation_error(e, "url: " + url);
            std::cerr << "URL parsing failed: " << e.what() << std::endl;
            return nullptr;
        }
    }
    
    std::string process_with_network_safely(const PaymentRequest& request) {
        auto* adapter = client_.get_adapter(request.network);
        if (!adapter) {
            std::cerr << "No adapter available for network" << std::endl;
            return "";
        }
        
        return PaymentRetryHandler::create_transaction_with_retry(
            client_, request, error_counter_, logger_
        );
    }
    
public:
    void print_error_summary() const {
        error_counter_.print_statistics();
    }
};

int main() {
    initialize_sdk();
    
    RobustPaymentProcessor processor;
    
    // Test various scenarios
    std::vector<std::pair<std::string, std::string>> test_cases = {
        {"7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn", "10.0"},  // Valid
        {"invalid_address", "5.0"},                                    // Invalid address
        {"7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn", "-1.0"},   // Invalid amount
        {"7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn", "abc"},    // Invalid amount format
    };
    
    for (const auto& [recipient, amount] : test_cases) {
        std::cout << "\\nTesting payment: " << recipient << " <- " << amount << std::endl;
        bool success = processor.process_payment_safely(recipient, amount);
        std::cout << "Result: " << (success ? "SUCCESS" : "FAILED") << std::endl;
    }
    
    std::cout << "\\n" << std::string(50, '=') << std::endl;
    processor.print_error_summary();
    
    cleanup_sdk();
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/cmake" className="text-blue-600 hover:underline">CMake Integration</Link> - Project integration guide</li>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
          <li><Link to="/docs/cpp-sdk/basic-payment" className="text-blue-600 hover:underline">Basic Payment</Link> - Return to payment tutorials</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKCMakeDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK CMake Integration</h1>
      <p className="text-xl text-slate-600 mb-8">
        Complete guide for integrating the SVM-Pay C++ SDK into your CMake projects.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>The SVM-Pay C++ SDK provides comprehensive CMake support for easy integration into your projects. You can use the SDK as an installed package, as a submodule, or via FetchContent.</p>
        
        <h2>Integration Methods</h2>
        
        <h3>Method 1: Using find_package (Recommended)</h3>
        <p>If you have installed the SDK system-wide:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# In your CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(MyProject)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find the SVM-Pay package
find_package(svm-pay REQUIRED)

# Create your executable
add_executable(my_app main.cpp)

# Link against SVM-Pay
target_link_libraries(my_app svm-pay)`}</code></pre>
        </div>
        
        <h3>Method 2: Using FetchContent</h3>
        <p>To automatically download and build the SDK:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`cmake_minimum_required(VERSION 3.16)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

# Include FetchContent module
include(FetchContent)

# Declare SVM-Pay dependency
FetchContent_Declare(
    svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG        main
    SOURCE_SUBDIR  cpp-sdk
)

# Make SVM-Pay available
FetchContent_MakeAvailable(svm-pay)

# Create your executable
add_executable(my_app main.cpp)

# Link against SVM-Pay
target_link_libraries(my_app svm-pay)`}</code></pre>
        </div>
        
        <h3>Method 3: Git Submodule</h3>
        <p>Add SVM-Pay as a submodule and include it directly:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Add as submodule
git submodule add https://github.com/openSVM/svm-pay.git external/svm-pay

# In your CMakeLists.txt
add_subdirectory(external/svm-pay/cpp-sdk)

# Create your executable
add_executable(my_app main.cpp)

# Link against SVM-Pay
target_link_libraries(my_app svm-pay)`}</code></pre>
        </div>
        
        <h2>Complete CMakeLists.txt Example</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`cmake_minimum_required(VERSION 3.16)
project(SVMPayExample VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler-specific options
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find packages
include(FetchContent)

# SVM-Pay SDK
FetchContent_Declare(
    svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG        main
    SOURCE_SUBDIR  cpp-sdk
)

FetchContent_MakeAvailable(svm-pay)

# Create executables
add_executable(basic_payment src/basic_payment.cpp)
add_executable(url_parsing src/url_parsing.cpp)
add_executable(network_demo src/network_demo.cpp)

# Link libraries
target_link_libraries(basic_payment svm-pay)
target_link_libraries(url_parsing svm-pay)
target_link_libraries(network_demo svm-pay)

# Optional: Set runtime path for shared libraries
if(UNIX AND NOT APPLE)
    set_target_properties(basic_payment PROPERTIES 
        INSTALL_RPATH "$ORIGIN/../lib")
    set_target_properties(url_parsing PROPERTIES 
        INSTALL_RPATH "$ORIGIN/../lib")
    set_target_properties(network_demo PROPERTIES 
        INSTALL_RPATH "$ORIGIN/../lib")
endif()

# Install targets
install(TARGETS basic_payment url_parsing network_demo
    RUNTIME DESTINATION bin)

# Copy shared libraries on Windows
if(WIN32)
    install(FILES $<TARGET_RUNTIME_DLLS:basic_payment> 
        DESTINATION bin)
endif()`}</code></pre>
        </div>
        
        <h2>Cross-Platform Configuration</h2>
        
        <h3>Windows with vcpkg</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Configure with vcpkg toolchain
cmake -B build -S . \\
    -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake \\
    -DVCPKG_TARGET_TRIPLET=x64-windows

# Build
cmake --build build --config Release

# Install
cmake --install build --prefix install`}</code></pre>
        </div>
        
        <h3>Linux</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Configure
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release

# Build with multiple cores
cmake --build build -j$(nproc)

# Install
sudo cmake --install build --prefix /usr/local`}</code></pre>
        </div>
        
        <h3>macOS</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Configure with Homebrew OpenSSL
cmake -B build -S . \\
    -DCMAKE_BUILD_TYPE=Release \\
    -DOPENSSL_ROOT_DIR=/usr/local/opt/openssl

# Build
cmake --build build -j$(sysctl -n hw.ncpu)

# Install
sudo cmake --install build --prefix /usr/local`}</code></pre>
        </div>
        
        <h2>Advanced CMake Configuration</h2>
        
        <h3>Custom Build Options</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# CMakeLists.txt with custom options
option(ENABLE_TESTING "Enable testing" ON)
option(BUILD_EXAMPLES "Build examples" ON)
option(USE_SYSTEM_CURL "Use system cURL" OFF)
option(STATIC_LINKING "Link statically" OFF)

# Configure SVM-Pay with options
if(USE_SYSTEM_CURL)
    set(CURL_USE_SYSTEM ON CACHE BOOL "Use system cURL")
endif()

if(STATIC_LINKING)
    set(BUILD_SHARED_LIBS OFF)
else()
    set(BUILD_SHARED_LIBS ON)
endif()

# FetchContent with options
FetchContent_Declare(
    svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG        main
    SOURCE_SUBDIR  cpp-sdk
)

# Set options before making available
set(BUILD_TESTS ${ENABLE_TESTING})
set(BUILD_EXAMPLES ${BUILD_EXAMPLES})

FetchContent_MakeAvailable(svm-pay)`}</code></pre>
        </div>
        
        <h3>Multiple Configurations</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Support for multiple build configurations
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Build type" FORCE)
    set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
        "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Configuration-specific compiler flags
target_compile_definitions(my_app PRIVATE
    $<$<CONFIG:Debug>:DEBUG_BUILD>
    $<$<CONFIG:Release>:RELEASE_BUILD>
)

# Different libraries for different configurations
target_link_libraries(my_app 
    svm-pay
    $<$<CONFIG:Debug>:debug_utils>
    $<$<CONFIG:Release>:optimization_libs>
)`}</code></pre>
        </div>
        
        <h2>Dependency Management</h2>
        
        <h3>Manual Dependency Specification</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# If not using FetchContent, specify dependencies manually
find_package(PkgConfig REQUIRED)

# Find cURL
find_package(CURL REQUIRED)
if(CURL_FOUND)
    message(STATUS "Found cURL: ${CURL_VERSION_STRING}")
else()
    message(FATAL_ERROR "cURL not found")
endif()

# Find OpenSSL
find_package(OpenSSL REQUIRED)
if(OPENSSL_FOUND)
    message(STATUS "Found OpenSSL: ${OPENSSL_VERSION}")
else()
    message(FATAL_ERROR "OpenSSL not found")
endif()

# Create target manually if needed
add_library(my_svm_pay INTERFACE)
target_include_directories(my_svm_pay INTERFACE path/to/svm-pay/include)
target_link_libraries(my_svm_pay INTERFACE 
    CURL::libcurl 
    OpenSSL::SSL 
    OpenSSL::Crypto
)`}</code></pre>
        </div>
        
        <h3>vcpkg Integration</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# vcpkg.json for your project
{
    "name": "my-svm-pay-project",
    "version": "1.0.0",
    "dependencies": [
        "curl",
        "openssl"
    ],
    "builtin-baseline": "2023.11.20"
}

# CMakeLists.txt
find_package(CURL CONFIG REQUIRED)
find_package(OpenSSL REQUIRED)

# If using vcpkg, dependencies are automatically found
target_link_libraries(my_app 
    svm-pay
    CURL::libcurl
    OpenSSL::SSL
    OpenSSL::Crypto
)`}</code></pre>
        </div>
        
        <h2>Testing Integration</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Enable testing
enable_testing()

# Find Google Test
find_package(GTest)

if(GTest_FOUND)
    # Create test executable
    add_executable(svm_pay_tests
        tests/test_url_parsing.cpp
        tests/test_client.cpp
        tests/test_reference.cpp
    )
    
    # Link test dependencies
    target_link_libraries(svm_pay_tests
        svm-pay
        GTest::gtest
        GTest::gtest_main
    )
    
    # Add test to CTest
    add_test(NAME svm_pay_unit_tests COMMAND svm_pay_tests)
    
    # Set test properties
    set_tests_properties(svm_pay_unit_tests PROPERTIES
        TIMEOUT 60
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
else()
    message(WARNING "Google Test not found, tests will not be built")
endif()`}</code></pre>
        </div>
        
        <h2>Installation and Packaging</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Installation configuration
include(GNUInstallDirs)

# Install your application
install(TARGETS my_app
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
)

# Install configuration files
install(FILES config/app.conf
    DESTINATION ${CMAKE_INSTALL_SYSCONFDIR}/my_app
)

# Create package
include(CPack)
set(CPACK_PACKAGE_NAME "MyApp")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_DESCRIPTION "Application using SVM-Pay")
set(CPACK_PACKAGE_CONTACT "your@email.com")

# Platform-specific packaging
if(WIN32)
    set(CPACK_GENERATOR "NSIS;ZIP")
elseif(APPLE)
    set(CPACK_GENERATOR "DragNDrop;TGZ")
else()
    set(CPACK_GENERATOR "DEB;RPM;TGZ")
endif()`}</code></pre>
        </div>
        
        <h2>Troubleshooting</h2>
        
        <h3>Common Issues and Solutions</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Issue: CMake can't find OpenSSL on macOS
# Solution: Specify OpenSSL path
set(OPENSSL_ROOT_DIR /usr/local/opt/openssl)
find_package(OpenSSL REQUIRED)

# Issue: cURL not found
# Solution: Install development packages
# Ubuntu: sudo apt-get install libcurl4-openssl-dev
# CentOS: sudo yum install libcurl-devel

# Issue: C++17 not supported
# Solution: Update compiler or check CMake configuration
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
    if(CMAKE_CXX_COMPILER_VERSION VERSION_LESS "7.0")
        message(FATAL_ERROR "GCC 7.0 or higher required for C++17")
    endif()
endif()

# Issue: Linking errors on Windows
# Solution: Use consistent runtime library
if(MSVC)
    set_property(TARGET my_app PROPERTY
        MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>DLL")
endif()`}</code></pre>
        </div>
        
        <h2>Build Script Examples</h2>
        
        <h3>Cross-Platform Build Script</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#!/bin/bash
# build.sh

set -e

# Configuration
BUILD_TYPE=${1:-Release}
BUILD_DIR="build"
INSTALL_PREFIX="install"

echo "Building SVM-Pay project in $BUILD_TYPE mode..."

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi

# Create build directory
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Configure
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    cmake -G "Visual Studio 16 2019" -A x64 \\
        -DCMAKE_BUILD_TYPE=$BUILD_TYPE \\
        -DCMAKE_INSTALL_PREFIX="../$INSTALL_PREFIX" \\
        ..
else
    # Unix-like
    cmake -DCMAKE_BUILD_TYPE=$BUILD_TYPE \\
        -DCMAKE_INSTALL_PREFIX="../$INSTALL_PREFIX" \\
        ..
fi

# Build
cmake --build . --config $BUILD_TYPE -j

# Test
ctest --output-on-failure

# Install
cmake --install . --config $BUILD_TYPE

echo "Build completed successfully!"`}</code></pre>
        </div>
        
        <h2>IDE Integration</h2>
        
        <h3>Visual Studio Code</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// .vscode/settings.json
{
    "cmake.configureSettings": {
        "CMAKE_BUILD_TYPE": "Debug",
        "BUILD_TESTING": "ON"
    },
    "cmake.buildDirectory": "${workspaceFolder}/build",
    "cmake.installPrefix": "${workspaceFolder}/install"
}`}</code></pre>
        </div>
        
        <h3>CLion</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# CLion CMake profiles:
# Debug profile:
-DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON

# Release profile:
-DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF

# Windows with vcpkg:
-DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake`}</code></pre>
        </div>
        
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use FetchContent</strong> - Simplifies dependency management for end users</li>
          <li><strong>Set minimum CMake version</strong> - Ensures compatibility with required features</li>
          <li><strong>Handle dependencies gracefully</strong> - Provide clear error messages when dependencies are missing</li>
          <li><strong>Support multiple platforms</strong> - Test your CMake configuration on different platforms</li>
          <li><strong>Use modern CMake</strong> - Prefer target-based commands over directory-based ones</li>
          <li><strong>Document requirements</strong> - Clearly document all build dependencies and requirements</li>
          <li><strong>Provide build scripts</strong> - Include helper scripts for common build scenarios</li>
        </ul>
        
        <h2>Complete Project Template</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`# Project structure:
my-svm-pay-app/
├── CMakeLists.txt
├── src/
│   └── main.cpp
├── tests/
│   └── test_main.cpp
├── scripts/
│   └── build.sh
└── README.md

# CMakeLists.txt template
cmake_minimum_required(VERSION 3.16)
project(MySVMPayApp VERSION 1.0.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Options
option(BUILD_TESTS "Build tests" OFF)

# SVM-Pay dependency
include(FetchContent)
FetchContent_Declare(svm-pay
    GIT_REPOSITORY https://github.com/openSVM/svm-pay.git
    GIT_TAG main
    SOURCE_SUBDIR cpp-sdk
)
FetchContent_MakeAvailable(svm-pay)

# Application
add_executable(my_svm_pay_app src/main.cpp)
target_link_libraries(my_svm_pay_app svm-pay)

# Tests
if(BUILD_TESTS)
    enable_testing()
    find_package(GTest)
    if(GTest_FOUND)
        add_executable(tests tests/test_main.cpp)
        target_link_libraries(tests svm-pay GTest::gtest_main)
        add_test(NAME unit_tests COMMAND tests)
    endif()
endif()

# Installation
install(TARGETS my_svm_pay_app DESTINATION bin)`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/api-reference" className="text-blue-600 hover:underline">API Reference</Link> - Complete API documentation</li>
          <li><Link to="/docs/cpp-sdk/getting-started" className="text-blue-600 hover:underline">Getting Started</Link> - Return to the basics</li>
          <li><Link to="/docs/cpp-sdk/examples" className="text-blue-600 hover:underline">Examples</Link> - View working examples</li>
        </ul>
      </div>
    </div>
  )
}
function CppSDKApiReferenceDoc() {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">C++ SDK API Reference</h1>
      <p className="text-xl text-slate-600 mb-8">
        Complete API reference for all classes, functions, and types in the SVM-Pay C++ SDK.
      </p>
      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>This reference covers all public APIs in the SVM-Pay C++ SDK. The SDK is organized into several namespaces and provides a clean, type-safe interface for payment processing.</p>
        
        <h2>Namespaces</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`svm_pay                    // Main namespace
├── core                   // Core types and utilities
├── network               // Network adapters and interfaces
└── exceptions           // Exception types`}</code></pre>
        </div>
        
        <h2>Core Functions</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay {
    // SDK initialization and cleanup
    void initialize_sdk();
    void cleanup_sdk();
    
    // Utility functions
    std::string network_to_string(SVMNetwork network);
    std::string request_type_to_string(RequestType type);
    SVMNetwork string_to_network(const std::string& network_str);
    RequestType string_to_request_type(const std::string& type_str);
}`}</code></pre>
        </div>
        
        <h2>Core Types</h2>
        
        <h3>SVMNetwork Enum</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`enum class SVMNetwork {
    SOLANA,      // Solana mainnet/devnet
    SONIC,       // Sonic SVM network  
    ECLIPSE,     // Eclipse network
    SOON         // s00n network
};`}</code></pre>
        </div>
        
        <h3>RequestType Enum</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`enum class RequestType {
    TRANSFER,     // Direct token transfer
    TRANSACTION,  // Custom transaction
    CROSS_CHAIN   // Cross-chain transfer
};`}</code></pre>
        </div>
        
        <h3>PaymentRequest Structure</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`struct PaymentRequest {
    RequestType type;                              // Request type
    SVMNetwork network;                            // Target network
    std::string recipient;                         // Recipient address
    
    // Optional fields
    std::optional<std::string> amount;             // Transfer amount
    std::optional<std::string> label;              // Display label
    std::optional<std::string> message;            // Display message
    std::optional<std::string> memo;               // Transaction memo
    std::optional<std::string> link;               // Transaction link
    std::optional<std::string> spl_token;          // SPL token address
    std::optional<std::string> source_network;     // Cross-chain source
    std::optional<std::string> bridge;             // Bridge protocol
    
    std::vector<std::string> references;           // Reference IDs
};`}</code></pre>
        </div>
        
        <h3>TransactionStatus Structure</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`struct TransactionStatus {
    bool confirmed;                                // Confirmation status
    std::string signature;                         // Transaction signature
    std::optional<uint64_t> block_height;          // Block height
    std::optional<uint32_t> confirmations;         // Confirmation count
    std::optional<std::string> error;              // Error message if failed
};`}</code></pre>
        </div>
        
        <h2>Client Class</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`class Client {
public:
    // Constructors
    explicit Client(SVMNetwork default_network = SVMNetwork::SOLANA);
    
    // Copy and move operations
    Client(const Client&) = delete;
    Client& operator=(const Client&) = delete;
    Client(Client&&) = default;
    Client& operator=(Client&&) = default;
    
    // Destructor
    ~Client() = default;
    
    // URL creation methods
    std::string create_transfer_url(
        const std::string& recipient, 
        const std::string& amount,
        const std::unordered_map<std::string, std::string>& options = {}
    );
    
    std::string create_transaction_url(
        const std::string& recipient,
        const std::string& link,
        const std::unordered_map<std::string, std::string>& options = {}
    );
    
    // URL parsing
    std::unique_ptr<PaymentRequest> parse_url(const std::string& url);
    
    // Reference generation
    std::string generate_reference(size_t length = 32);
    
    // Network management
    void set_default_network(SVMNetwork network);
    SVMNetwork get_default_network() const;
    
    // Configuration
    void set_max_references(size_t max_references);
    size_t get_max_references() const;
    
    // Adapter management
    void register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter);
    NetworkAdapter* get_adapter(SVMNetwork network);
    
private:
    // Implementation details hidden
    class Impl;
    std::unique_ptr<Impl> pimpl_;
};`}</code></pre>
        </div>
        
        <h3>URL Creation Options</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Supported options for create_transfer_url and create_transaction_url
std::unordered_map<std::string, std::string> options = {
    {"label", "Human-readable label for the payment"},
    {"message", "Human-readable message for the payment"},
    {"memo", "Memo to include in the transaction"},
    {"reference", "Base58-encoded reference ID"},
    {"spl_token", "SPL token mint address for token transfers"},
    {"source_network", "Source network for cross-chain transfers"},
    {"bridge", "Bridge protocol name for cross-chain transfers"}
};`}</code></pre>
        </div>
        
        <h2>Network Adapter Interface</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`class NetworkAdapter {
public:
    virtual ~NetworkAdapter() = default;
    
    // Asynchronous operations
    virtual std::future<std::string> create_transaction(
        const PaymentRequest& request
    ) = 0;
    
    virtual std::future<TransactionStatus> get_transaction_status(
        const std::string& transaction_id
    ) = 0;
    
    // Configuration (optional)
    virtual void set_rpc_endpoint(const std::string& endpoint) {}
    virtual void set_timeout(std::chrono::milliseconds timeout) {}
    
protected:
    // Helper methods for derived classes
    void validate_request(const PaymentRequest& request);
    std::string encode_transaction_data(const PaymentRequest& request);
};`}</code></pre>
        </div>
        
        <h3>SolanaNetworkAdapter</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`class SolanaNetworkAdapter : public NetworkAdapter {
public:
    SolanaNetworkAdapter();
    explicit SolanaNetworkAdapter(const std::string& rpc_endpoint);
    
    ~SolanaNetworkAdapter() override;
    
    // NetworkAdapter implementation
    std::future<std::string> create_transaction(
        const PaymentRequest& request
    ) override;
    
    std::future<TransactionStatus> get_transaction_status(
        const std::string& transaction_id
    ) override;
    
    // Configuration
    void set_rpc_endpoint(const std::string& endpoint) override;
    void set_timeout(std::chrono::milliseconds timeout) override;
    
    // Solana-specific methods
    void set_commitment_level(const std::string& commitment);
    std::string get_latest_blockhash();
    
private:
    class Impl;
    std::unique_ptr<Impl> pimpl_;
};`}</code></pre>
        </div>
        
        <h2>Exception Classes</h2>
        
        <h3>Base Exception Classes</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Network-related exceptions
class NetworkException : public std::runtime_error {
public:
    explicit NetworkException(const std::string& message);
    explicit NetworkException(const char* message);
};

// URL parsing exceptions
class URLParseException : public std::runtime_error {
public:
    explicit URLParseException(const std::string& message);
    explicit URLParseException(const char* message);
};

// Address validation exceptions
class AddressValidationException : public std::runtime_error {
public:
    explicit AddressValidationException(const std::string& message);
    explicit AddressValidationException(const char* message);
};

// Configuration exceptions
class ConfigurationException : public std::runtime_error {
public:
    explicit ConfigurationException(const std::string& message);
    explicit ConfigurationException(const char* message);
};`}</code></pre>
        </div>
        
        <h3>Specific Exception Classes</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Invalid amount format
class InvalidAmountException : public std::invalid_argument {
public:
    explicit InvalidAmountException(const std::string& message);
};

// Invalid reference format
class InvalidReferenceException : public std::invalid_argument {
public:
    explicit InvalidReferenceException(const std::string& message);
};

// Unknown network type
class InvalidNetworkException : public std::invalid_argument {
public:
    explicit InvalidNetworkException(const std::string& message);
};`}</code></pre>
        </div>
        
        <h2>Utility Classes</h2>
        
        <h3>NetworkAdapterFactory</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::network {
    class NetworkAdapterFactory {
    public:
        // Factory methods
        static void register_adapter(
            SVMNetwork network, 
            std::unique_ptr<NetworkAdapter> adapter
        );
        
        static NetworkAdapter* get_adapter(SVMNetwork network);
        
        static bool has_adapter(SVMNetwork network);
        
        static void clear_adapters();
        
        static std::vector<SVMNetwork> get_supported_networks();
        
    private:
        // Singleton implementation
        NetworkAdapterFactory() = delete;
        static std::unordered_map<SVMNetwork, std::unique_ptr<NetworkAdapter>> adapters_;
        static std::mutex adapters_mutex_;
    };
}`}</code></pre>
        </div>
        
        <h3>Base58 Utilities</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::core {
    class Base58 {
    public:
        // Encoding/decoding
        static std::string encode(const std::vector<uint8_t>& data);
        static std::vector<uint8_t> decode(const std::string& encoded);
        
        // Validation
        static bool is_valid(const std::string& encoded);
        static bool is_valid_address(const std::string& address);
        
        // Length checking
        static bool is_valid_length(const std::string& encoded, size_t expected_length);
        
    private:
        static const std::string ALPHABET;
        static const std::array<int8_t, 128> DECODE_TABLE;
    };
}`}</code></pre>
        </div>
        
        <h3>URL Utilities</h3>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::core {
    class URLUtils {
    public:
        // URL encoding/decoding
        static std::string url_encode(const std::string& value);
        static std::string url_decode(const std::string& value);
        
        // Parameter parsing
        static std::unordered_map<std::string, std::string> parse_query_params(
            const std::string& query
        );
        
        static std::string build_query_string(
            const std::unordered_map<std::string, std::string>& params
        );
        
        // URL validation
        static bool is_valid_url(const std::string& url);
        static bool is_valid_scheme(const std::string& scheme);
        
    private:
        static bool is_unreserved(char c);
        static std::string char_to_hex(char c);
        static char hex_to_char(const std::string& hex);
    };
}`}</code></pre>
        </div>
        
        <h2>Reference Generation</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::core {
    class ReferenceGenerator {
    public:
        // Generate secure random references
        static std::string generate(size_t length = 32);
        static std::string generate_with_prefix(
            const std::string& prefix, 
            size_t total_length = 32
        );
        
        // Validation
        static bool is_valid_reference(const std::string& reference);
        static bool is_valid_length(size_t length);
        
        // Configuration
        static void set_random_source(std::function<uint8_t()> source);
        static void reset_random_source();  // Reset to default OpenSSL
        
    private:
        static std::mutex random_mutex_;
        static std::function<uint8_t()> random_source_;
        static uint8_t default_random_byte();
    };
}`}</code></pre>
        </div>
        
        <h2>Constants and Limits</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::constants {
    // URL scheme constants
    constexpr const char* SOLANA_SCHEME = "solana";
    constexpr const char* SONIC_SCHEME = "sonic";
    constexpr const char* ECLIPSE_SCHEME = "eclipse";
    constexpr const char* SOON_SCHEME = "soon";
    
    // Parameter names
    constexpr const char* AMOUNT_PARAM = "amount";
    constexpr const char* LABEL_PARAM = "label";
    constexpr const char* MESSAGE_PARAM = "message";
    constexpr const char* MEMO_PARAM = "memo";
    constexpr const char* REFERENCE_PARAM = "reference";
    constexpr const char* LINK_PARAM = "link";
    constexpr const char* SPL_TOKEN_PARAM = "spl-token";
    
    // Limits
    constexpr size_t MAX_REFERENCE_LENGTH = 64;
    constexpr size_t MIN_REFERENCE_LENGTH = 8;
    constexpr size_t DEFAULT_REFERENCE_LENGTH = 32;
    constexpr size_t MAX_REFERENCES = 10;
    constexpr size_t MAX_URL_LENGTH = 2048;
    constexpr size_t SOLANA_ADDRESS_LENGTH = 44;  // Base58 encoded
    
    // Network endpoints
    constexpr const char* SOLANA_MAINNET_RPC = "https://api.mainnet-beta.solana.com";
    constexpr const char* SOLANA_DEVNET_RPC = "https://api.devnet.solana.com";
    constexpr const char* SOLANA_TESTNET_RPC = "https://api.testnet.solana.com";
}`}</code></pre>
        </div>
        
        <h2>HTTP Client Interface</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`namespace svm_pay::network {
    struct HTTPResponse {
        long status_code;
        std::string body;
        std::unordered_map<std::string, std::string> headers;
    };
    
    class HTTPClient {
    public:
        HTTPClient();
        explicit HTTPClient(std::chrono::milliseconds timeout);
        ~HTTPClient();
        
        // HTTP methods
        std::future<HTTPResponse> get(
            const std::string& url,
            const std::unordered_map<std::string, std::string>& headers = {}
        );
        
        std::future<HTTPResponse> post(
            const std::string& url,
            const std::string& body,
            const std::unordered_map<std::string, std::string>& headers = {}
        );
        
        // Configuration
        void set_timeout(std::chrono::milliseconds timeout);
        void set_user_agent(const std::string& user_agent);
        void set_proxy(const std::string& proxy_url);
        
    private:
        class Impl;
        std::unique_ptr<Impl> pimpl_;
    };
}`}</code></pre>
        </div>
        
        <h2>Thread Safety</h2>
        <p>All public APIs in the SVM-Pay C++ SDK are designed to be thread-safe:</p>
        <ul>
          <li><strong>Client class</strong> - All methods are thread-safe</li>
          <li><strong>NetworkAdapter</strong> - Implementations must be thread-safe</li>
          <li><strong>NetworkAdapterFactory</strong> - Thread-safe singleton with mutex protection</li>
          <li><strong>ReferenceGenerator</strong> - Thread-safe random number generation</li>
          <li><strong>Utility functions</strong> - All utility functions are stateless and thread-safe</li>
        </ul>
        
        <h2>Memory Management</h2>
        <p>The SDK uses modern C++ memory management patterns:</p>
        <ul>
          <li><strong>RAII</strong> - All resources are automatically managed</li>
          <li><strong>Smart pointers</strong> - std::unique_ptr and std::shared_ptr for automatic cleanup</li>
          <li><strong>Move semantics</strong> - Efficient transfer of large objects</li>
          <li><strong>No raw pointers</strong> - All public APIs use smart pointers or references</li>
        </ul>
        
        <h2>Error Handling</h2>
        <p>The SDK uses exceptions for error handling with a comprehensive hierarchy:</p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Typical error handling pattern
try {
    auto request = client.parse_url(url);
    auto* adapter = client.get_adapter(request->network);
    auto tx_future = adapter->create_transaction(*request);
    std::string tx_id = tx_future.get();
    
} catch (const NetworkException& e) {
    // Handle network errors (retry possible)
} catch (const URLParseException& e) {
    // Handle parsing errors (fix input)
} catch (const AddressValidationException& e) {
    // Handle validation errors (fix input)
} catch (const std::exception& e) {
    // Handle any other errors
}`}</code></pre>
        </div>
        
        <h2>Version Compatibility</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Version information
namespace svm_pay::version {
    constexpr int MAJOR = 1;
    constexpr int MINOR = 0;
    constexpr int PATCH = 0;
    constexpr const char* VERSION_STRING = "1.0.0";
    constexpr const char* GIT_COMMIT = "abc123def456";  // Set at build time
    
    // Compatibility checking
    bool is_compatible(int major, int minor);
    std::string get_version_string();
    std::string get_build_info();
}`}</code></pre>
        </div>
        
        <h2>Build Configuration</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`// Preprocessor definitions available at build time
#ifdef SVM_PAY_DEBUG
    // Debug build with additional logging
#endif

#ifdef SVM_PAY_STATIC
    // Static library build
#endif

#ifdef SVM_PAY_SHARED
    // Shared library build
#endif

// Feature detection
#if defined(SVM_PAY_HAS_OPENSSL)
    // OpenSSL available for cryptographic functions
#endif

#if defined(SVM_PAY_HAS_CURL)
    // cURL available for HTTP operations
#endif`}</code></pre>
        </div>
        
        <h2>Performance Considerations</h2>
        <ul>
          <li><strong>Async operations</strong> - Network operations are asynchronous by default</li>
          <li><strong>Zero-copy parsing</strong> - URL parsing minimizes string copying</li>
          <li><strong>Connection pooling</strong> - HTTP client reuses connections when possible</li>
          <li><strong>Lazy initialization</strong> - Resources are initialized only when needed</li>
          <li><strong>Memory pools</strong> - Internal memory pooling for frequent allocations</li>
        </ul>
        
        <h2>Example Usage</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <pre><code>{`#include <svm-pay/svm_pay.hpp>
#include <iostream>
#include <vector>
#include <future>

using namespace svm_pay;

int main() {
    try {
        // Initialize SDK
        initialize_sdk();
        
        // Create client
        Client client(SVMNetwork::SOLANA);
        
        // Generate reference
        std::string ref = client.generate_reference(16);
        
        // Create payment URL
        std::unordered_map<std::string, std::string> options = {
            {"label", "API Example"},
            {"reference", ref}
        };
        
        std::string url = client.create_transfer_url(
            "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn", 
            "1.0", 
            options
        );
        
        // Parse URL
        auto request = client.parse_url(url);
        
        // Process with network adapter
        auto* adapter = client.get_adapter(request->network);
        if (adapter) {
            auto tx_future = adapter->create_transaction(*request);
            
            // Wait for result with timeout
            if (tx_future.wait_for(std::chrono::seconds(10)) == std::future_status::ready) {
                std::string tx_id = tx_future.get();
                std::cout << "Transaction: " << tx_id << std::endl;
            } else {
                std::cerr << "Transaction timeout" << std::endl;
            }
        }
        
        // Cleanup
        cleanup_sdk();
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}`}</code></pre>
        </div>
        
        <h2>Next Steps</h2>
        <ul>
          <li><Link to="/docs/cpp-sdk/getting-started" className="text-blue-600 hover:underline">Getting Started</Link> - Begin with the basics</li>
          <li><Link to="/docs/cpp-sdk/basic-payment" className="text-blue-600 hover:underline">Basic Payment Tutorial</Link> - Step-by-step guide</li>
          <li><Link to="/docs/cpp-sdk/cmake" className="text-blue-600 hover:underline">CMake Integration</Link> - Project setup guide</li>
        </ul>
      </div>
    </div>
  )
}

// Placeholder documentation components
function SVMPayClassDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">SVMPay Class</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function SVMPayServerClassDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">SVMPayServer Class</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CoreTypesDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Core Types</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function URLSchemeDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">URL Scheme</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function ReferenceDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Reference Generation</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function SolanaAdapterDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Solana Adapter</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function SonicAdapterDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Sonic Adapter</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function EclipseAdapterDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Eclipse Adapter</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function SoonAdapterDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Soon Adapter</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function AdapterFactoryDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Adapter Factory</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function BridgeAdaptersDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Bridge Adapters</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CrossChainManagerDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Cross-Chain Manager</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function BridgeTypesDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Bridge Types</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function TransferHandlerDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Transfer Handler</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function TransactionHandlerDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Transaction Handler</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CrossChainHandlerDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">Cross-Chain Handler</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CLICommandsDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">CLI Commands</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CLIConfigDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">CLI Configuration</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CLISolanaDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">CLI Solana Utils</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CLIHistoryDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">CLI History Management</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function WalletConnectIntegrationDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">WalletConnect Integration</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function WalletConnectManagerDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">WalletConnect Manager</h1><p className="text-slate-600">Documentation coming soon...</p></div> }

export function DocsPage() {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DocsHome />} />
          
          {/* Core SDK */}
          <Route path="/sdk/svmpay" element={<SVMPayClassDoc />} />
          <Route path="/sdk/server" element={<SVMPayServerClassDoc />} />
          <Route path="/core/types" element={<CoreTypesDoc />} />
          <Route path="/core/url-scheme" element={<URLSchemeDoc />} />
          <Route path="/core/reference" element={<ReferenceDoc />} />
          
          {/* Network Adapters */}
          <Route path="/network/solana" element={<SolanaAdapterDoc />} />
          <Route path="/network/sonic" element={<SonicAdapterDoc />} />
          <Route path="/network/eclipse" element={<EclipseAdapterDoc />} />
          <Route path="/network/soon" element={<SoonAdapterDoc />} />
          <Route path="/network/factory" element={<AdapterFactoryDoc />} />
          
          {/* Bridge System */}
          <Route path="/bridge/adapters" element={<BridgeAdaptersDoc />} />
          <Route path="/bridge/cross-chain" element={<CrossChainManagerDoc />} />
          <Route path="/bridge/types" element={<BridgeTypesDoc />} />
          
          {/* Request Handlers */}
          <Route path="/handlers/transfer" element={<TransferHandlerDoc />} />
          <Route path="/handlers/transaction" element={<TransactionHandlerDoc />} />
          <Route path="/handlers/cross-chain" element={<CrossChainHandlerDoc />} />
          
          {/* CLI Integration */}
          <Route path="/cli/commands" element={<CLICommandsDoc />} />
          <Route path="/cli/config" element={<CLIConfigDoc />} />
          <Route path="/cli/solana" element={<CLISolanaDoc />} />
          <Route path="/cli/history" element={<CLIHistoryDoc />} />
          
          {/* C++ SDK */}
          <Route path="/cpp-sdk" element={<CppSDKDoc />} />
          <Route path="/cpp-sdk/getting-started" element={<CppSDKGettingStartedDoc />} />
          <Route path="/cpp-sdk/installation" element={<CppSDKInstallationDoc />} />
          <Route path="/cpp-sdk/basic-payment" element={<CppSDKBasicPaymentDoc />} />
          <Route path="/cpp-sdk/url-parsing" element={<CppSDKUrlParsingDoc />} />
          <Route path="/cpp-sdk/network-adapters" element={<CppSDKNetworkAdaptersDoc />} />
          <Route path="/cpp-sdk/client" element={<CppSDKClientDoc />} />
          <Route path="/cpp-sdk/exceptions" element={<CppSDKExceptionsDoc />} />
          <Route path="/cpp-sdk/cmake" element={<CppSDKCMakeDoc />} />
          <Route path="/cpp-sdk/api-reference" element={<CppSDKApiReferenceDoc />} />
          
          {/* Assembly-BPF SDK */}
          <Route path="/assembly-bpf" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/getting-started" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/hello-world" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/payment-processor" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/cross-chain-bridge" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/memory-management" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/api-reference" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/security" element={<AssemblyBPFDoc />} />
          <Route path="/assembly-bpf/advanced" element={<AssemblyBPFDoc />} />
          
          {/* WalletConnect */}
          <Route path="/walletconnect/integration" element={<WalletConnectIntegrationDoc />} />
          <Route path="/walletconnect/manager" element={<WalletConnectManagerDoc />} />
          
          {/* Advanced Documentation */}
          <Route path="/cross-chain" element={<CrossChainDoc />} />
          <Route path="/architecture" element={<ArchitectureDoc />} />
          <Route path="/security" element={<SecurityDoc />} />
        </Routes>
      </div>
    </div>
  )
}
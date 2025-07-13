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

// C++ SDK placeholder documentation components
function CppSDKGettingStartedDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Getting Started</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKInstallationDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Installation</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKBasicPaymentDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Basic Payment</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKUrlParsingDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK URL Parsing</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKNetworkAdaptersDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Network Adapters</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKClientDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Client Class</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKExceptionsDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK Exception Handling</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKCMakeDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK CMake Integration</h1><p className="text-slate-600">Documentation coming soon...</p></div> }
function CppSDKApiReferenceDoc() { return <div className="pt-20 p-8"><h1 className="text-4xl font-bold">C++ SDK API Reference</h1><p className="text-slate-600">Documentation coming soon...</p></div> }

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
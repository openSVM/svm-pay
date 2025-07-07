import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Code, 
  FileText, 
  Database,
  Network,
  ChevronRight,
  Search,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'

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
    title: 'WalletConnect',
    items: [
      { name: 'WalletConnect Integration', href: '/docs/walletconnect/integration', icon: Code },
      { name: 'Connection Manager', href: '/docs/walletconnect/manager', icon: Code },
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
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Need Tutorials?</h3>
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
            placeholder="Search API docs..."
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
    'Connection Manager': 'Manager for handling wallet connection states and operations.'
  }
  return descriptions[name] || 'API documentation for SVM-Pay component.'
}

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
          
          {/* WalletConnect */}
          <Route path="/walletconnect/integration" element={<WalletConnectIntegrationDoc />} />
          <Route path="/walletconnect/manager" element={<WalletConnectManagerDoc />} />
        </Routes>
      </div>
    </div>
  )
}

// API Documentation Components

function SVMPayClassDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">SVMPay Class</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Main SDK class for SVM-Pay operations. Handles payment URL creation, transaction processing, and payment status monitoring.
          </p>

          <h2>Import</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <pre className="text-slate-100">
{`import { SVMPay } from 'svm-pay'`}
            </pre>
          </div>

          <h2>Constructor</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">new SVMPay(config?: SVMPayConfig)</h3>
            <p className="text-slate-600 mb-4">Creates a new SVMPay SDK instance.</p>
            
            <h4 className="font-semibold mb-2">Parameters:</h4>
            <ul className="text-slate-600 space-y-1 mb-4">
              <li><code>config?: SVMPayConfig</code> - Optional configuration object</li>
              <li><code>config.defaultNetwork?: SVMNetwork</code> - Default network to use (default: 'solana')</li>
              <li><code>config.apiEndpoint?: string</code> - API endpoint for server operations</li>
              <li><code>config.debug?: boolean</code> - Enable debug logging (default: false)</li>
            </ul>

            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`const svmPay = new SVMPay({
  defaultNetwork: 'solana',
  debug: true
})`}
              </pre>
            </div>
          </div>

          <h2>Methods</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">createTransferUrl()</h3>
            <p className="text-slate-600 mb-4">Creates a payment URL for token transfers.</p>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <pre className="text-slate-100">
{`createTransferUrl(
  recipient: string,
  amount: string,
  options?: {
    network?: SVMNetwork;
    splToken?: string;
    label?: string;
    message?: string;
    memo?: string;
    references?: string[];
  }
): string`}
              </pre>
            </div>

            <h4 className="font-semibold mb-2">Parameters:</h4>
            <ul className="text-slate-600 space-y-1 mb-4">
              <li><code>recipient: string</code> - Recipient's wallet address (base58 encoded)</li>
              <li><code>amount: string</code> - Amount to transfer as string</li>
              <li><code>options.network?: SVMNetwork</code> - Target SVM network</li>
              <li><code>options.splToken?: string</code> - SPL token mint address for token transfers</li>
              <li><code>options.label?: string</code> - Display label for the payment</li>
              <li><code>options.message?: string</code> - Payment description</li>
              <li><code>options.memo?: string</code> - On-chain memo</li>
              <li><code>options.references?: string[]</code> - Reference IDs for tracking</li>
            </ul>

            <h4 className="font-semibold mb-2">Returns:</h4>
            <p className="text-slate-600 mb-4"><code>string</code> - Payment URL</p>

            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`const paymentUrl = svmPay.createTransferUrl(
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  '1.5',
  {
    label: 'Coffee Shop',
    message: 'Payment for coffee and pastry',
    splToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  }
)`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">parseUrl()</h3>
            <p className="text-slate-600 mb-4">Parses a payment URL to extract payment request details.</p>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <pre className="text-slate-100">
{`parseUrl(url: string): PaymentRequest`}
              </pre>
            </div>

            <h4 className="font-semibold mb-2">Parameters:</h4>
            <ul className="text-slate-600 space-y-1 mb-4">
              <li><code>url: string</code> - Payment URL to parse</li>
            </ul>

            <h4 className="font-semibold mb-2">Returns:</h4>
            <p className="text-slate-600 mb-4"><code>PaymentRequest</code> - Parsed payment request object</p>

            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`const request = svmPay.parseUrl('solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=1.5&label=Coffee')
console.log(request.recipient) // 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
console.log(request.amount)    // '1.5'`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">generateReference()</h3>
            <p className="text-slate-600 mb-4">Generates a unique reference ID for payment tracking.</p>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <pre className="text-slate-100">
{`generateReference(): string`}
              </pre>
            </div>

            <h4 className="font-semibold mb-2">Returns:</h4>
            <p className="text-slate-600 mb-4"><code>string</code> - Unique reference ID</p>

            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`const reference = svmPay.generateReference()
console.log(reference) // 'ref_1a2b3c4d5e6f'`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">checkWalletBalance()</h3>
            <p className="text-slate-600 mb-4">Checks wallet balance using CLI integration.</p>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <pre className="text-slate-100">
{`async checkWalletBalance(): Promise<{
  balance: any;
  address: string;
}>`}
              </pre>
            </div>

            <h4 className="font-semibold mb-2">Returns:</h4>
            <p className="text-slate-600 mb-4"><code>Promise&lt;object&gt;</code> - Wallet balance and address information</p>

            <h4 className="font-semibold mb-2">Throws:</h4>
            <ul className="text-slate-600 space-y-1 mb-4">
              <li><code>Error</code> - If private key is not configured</li>
            </ul>

            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`try {
  const result = await svmPay.checkWalletBalance()
  console.log('Balance:', result.balance)
  console.log('Address:', result.address)
} catch (error) {
  console.error('Balance check failed:', error.message)
}`}
              </pre>
            </div>
          </div>

          <h2>Related Types</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li><Link to="/docs/core/types#svmpayconfig" className="text-purple-600 hover:underline">SVMPayConfig</Link></li>
            <li><Link to="/docs/core/types#paymentrequest" className="text-purple-600 hover:underline">PaymentRequest</Link></li>
            <li><Link to="/docs/core/types#svmnetwork" className="text-purple-600 hover:underline">SVMNetwork</Link></li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

function CoreTypesDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Core Types</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            TypeScript type definitions for all SVM-Pay interfaces, enums, and data structures.
          </p>

          <h2>Import</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <pre className="text-slate-100">
{`import { 
  SVMNetwork, 
  EVMNetwork, 
  PaymentRequest, 
  TransferRequest,
  PaymentStatus
} from 'svm-pay'`}
            </pre>
          </div>

          <h2>Network Enums</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 id="svmnetwork" className="text-lg font-semibold mb-3">SVMNetwork</h3>
            <p className="text-slate-600 mb-4">Supported SVM networks for payments.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`enum SVMNetwork {
  SOLANA = 'solana',
  SONIC = 'sonic',
  ECLIPSE = 'eclipse',
  SOON = 'soon'
}`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">EVMNetwork</h3>
            <p className="text-slate-600 mb-4">Supported EVM networks for cross-chain payments.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`enum EVMNetwork {
  ETHEREUM = 'ethereum',
  BNB_CHAIN = 'bnb-chain',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  AVALANCHE = 'avalanche'
}`}
              </pre>
            </div>
          </div>

          <h2>Request Types</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 id="paymentrequest" className="text-lg font-semibold mb-3">PaymentRequest</h3>
            <p className="text-slate-600 mb-4">Base interface for all payment requests.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`interface PaymentRequest {
  /** The type of payment request */
  type: RequestType;
  
  /** The target SVM network for this payment */
  network: SVMNetwork;
  
  /** The recipient's address (base58 encoded public key) */
  recipient: string;
  
  /** Optional label describing the payment source */
  label?: string;
  
  /** Optional message describing the payment purpose */
  message?: string;
  
  /** Optional memo to be included in the transaction */
  memo?: string;
  
  /** Optional reference IDs for transaction identification */
  references?: string[];
}`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">TransferRequest</h3>
            <p className="text-slate-600 mb-4">Request for simple token transfers.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`interface TransferRequest extends PaymentRequest {
  type: RequestType.TRANSFER;
  
  /** The amount to transfer (as a string to preserve precision) */
  amount: string;
  
  /** The SPL token mint address (if transferring an SPL token) */
  splToken?: string;
}`}
              </pre>
            </div>
          </div>

          <h2>Configuration</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 id="svmpayconfig" className="text-lg font-semibold mb-3">SVMPayConfig</h3>
            <p className="text-slate-600 mb-4">Configuration options for SVMPay SDK.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`interface SVMPayConfig {
  /** Default network to use if not specified */
  defaultNetwork?: SVMNetwork;
  
  /** API endpoint for server-side operations */
  apiEndpoint?: string;
  
  /** Whether to enable debug logging */
  debug?: boolean;
}`}
              </pre>
            </div>
          </div>

          <h2>Status and Storage</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">PaymentStatus</h3>
            <p className="text-slate-600 mb-4">Status values for payment tracking.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  // Cross-chain specific statuses
  BRIDGING = 'bridging',
  BRIDGE_CONFIRMED = 'bridge-confirmed',
  BRIDGE_FAILED = 'bridge-failed'
}`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">PaymentRecord</h3>
            <p className="text-slate-600 mb-4">Complete payment record with status and metadata.</p>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`interface PaymentRecord {
  /** Unique identifier for the payment */
  id: string;
  
  /** The payment request */
  request: PaymentRequest;
  
  /** Current status of the payment */
  status: PaymentStatus;
  
  /** Transaction signature (once submitted) */
  signature?: string;
  
  /** Timestamp when the payment was created */
  createdAt: number;
  
  /** Timestamp when the payment was last updated */
  updatedAt: number;
  
  /** Error message if the payment failed */
  error?: string;
  
  /** Bridge transaction hash (for cross-chain payments) */
  bridgeTransactionHash?: string;
  
  /** Bridge used for cross-chain transfer */
  bridgeUsed?: string;
  
  /** Bridge quote used for cross-chain transfer */
  bridgeQuote?: BridgeQuote;
}`}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Placeholder components for other documentation sections
function SVMPayServerClassDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">SVMPayServer Class</h1>
        <p className="text-xl text-slate-600 mb-8">
          Server-side SDK with additional features for transaction verification and webhook handling.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            📚 This documentation section is being expanded. Please refer to the source code at 
            <code className="mx-1 px-2 py-1 bg-blue-200 rounded">src/sdk/server.ts</code> for detailed implementation.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function URLSchemeDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">URL Scheme</h1>
        <p className="text-xl text-slate-600 mb-8">
          Payment URL creation and parsing functionality for SVM-Pay protocol.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            📚 This documentation section is being expanded. Please refer to the source code at 
            <code className="mx-1 px-2 py-1 bg-blue-200 rounded">src/core/url-scheme.ts</code> for detailed implementation.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function ReferenceDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Reference Generation</h1>
        <p className="text-xl text-slate-600 mb-8">
          Utilities for generating unique payment reference IDs for transaction tracking.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            📚 This documentation section is being expanded. Please refer to the source code at 
            <code className="mx-1 px-2 py-1 bg-blue-200 rounded">src/core/reference.ts</code> for detailed implementation.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Network Adapter Documentation
function SolanaAdapterDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Solana Network Adapter</h1>
        <p className="text-xl text-slate-600 mb-8">
          Network adapter for Solana blockchain integration and transaction processing.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            📚 This documentation section is being expanded. Please refer to the source code at 
            <code className="mx-1 px-2 py-1 bg-blue-200 rounded">src/network/solana.ts</code> for detailed implementation.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Placeholder components for remaining sections
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
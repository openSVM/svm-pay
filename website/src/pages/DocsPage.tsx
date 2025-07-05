import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Terminal, 
  FileText, 
  Shield, 
  Zap,
  ChevronRight,
  Search
} from 'lucide-react'
import { useState } from 'react'
import { 
  GamingTutorials, 
  DeFiTutorials, 
  SaaSTutorials, 
  SocialTutorials 
} from '../components/TutorialSections'
import { 
  EnterpriseTutorials, 
  CrossChainTutorials, 
  MobileTutorials 
} from '../components/AdvancedTutorialSections'

// Import individual tutorial components
import { 
  OnlineStoreIntegrationTutorial, 
  MarketplaceEscrowTutorial,
  SubscriptionBoxTutorial,
  DigitalProductStoreTutorial,
  FlashSaleManagementTutorial
} from './tutorials/EcommerceTutorials'
import { 
  InGameCurrencyTutorial, 
  NFTMarketplaceTutorial,
  TournamentPrizeDistributionTutorial,
  PlayToEarnRewardsTutorial,
  GameAssetRentalTutorial
} from './tutorials/GamingTutorials'
import { 
  SaaSSubscriptionBillingTutorial, 
  FreelancePaymentEscrowTutorial,
  ConsultingTimeTrackingTutorial,
  APIUsageBillingTutorial,
  SoftwareLicenseManagementTutorial
} from './tutorials/SaaSTutorials'
import {
  YieldFarmingRewardsTutorial,
  CrossChainArbitrageBotTutorial,
  LendingProtocolIntegrationTutorial,
  DEXTradingFeeDistributionTutorial,
  AutomatedMarketMakerTutorial
} from './tutorials/DeFiTutorials'
import {
  CreatorTippingSystemTutorial,
  ContentCreatorSubscriptionsTutorial,
  NFTDropPlatformTutorial,
  CommunityRewardSystemTutorial
} from './tutorials/SocialTutorials'
import {
  MultiChainArbitrageTutorial,
  CrossChainLiquidityPoolTutorial,
  PaymentRoutingOptimizationTutorial,
  CrossChainGovernanceTutorial
} from './tutorials/CrossChainTutorials'
import {
  MobileWalletIntegrationTutorial,
  IoTMicropaymentsTutorial,
  SmartCityPaymentsTutorial,
  V2XPaymentsTutorial
} from './tutorials/MobileTutorials'

// Documentation sections
const sections = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Developer Guide', href: '/docs/developer-guide', icon: Book },
      { name: 'API Reference', href: '/docs/api', icon: Code },
      { name: 'CLI Tool', href: '/docs/cli', icon: Terminal },
    ]
  },
  {
    title: 'E-commerce Tutorials',
    items: [
      { name: 'Online Store Integration', href: '/docs/tutorials/ecommerce/online-store', icon: Book },
      { name: 'Marketplace with Escrow', href: '/docs/tutorials/ecommerce/marketplace-escrow', icon: Book },
      { name: 'Subscription Box Service', href: '/docs/tutorials/ecommerce/subscription-box', icon: Book },
      { name: 'Digital Product Store', href: '/docs/tutorials/ecommerce/digital-products', icon: Book },
      { name: 'Flash Sale Management', href: '/docs/tutorials/ecommerce/flash-sales', icon: Book },
    ]
  },
  {
    title: 'Gaming & NFT Tutorials',
    items: [
      { name: 'In-Game Currency Exchange', href: '/docs/tutorials/gaming/currency-exchange', icon: Book },
      { name: 'NFT Marketplace for Games', href: '/docs/tutorials/gaming/nft-marketplace', icon: Book },
      { name: 'Tournament Prize Distribution', href: '/docs/tutorials/gaming/tournament-prizes', icon: Book },
      { name: 'Play-to-Earn Rewards', href: '/docs/tutorials/gaming/play-to-earn', icon: Book },
      { name: 'Game Asset Rental System', href: '/docs/tutorials/gaming/asset-rental', icon: Book },
    ]
  },
  {
    title: 'SaaS & Service Tutorials',
    items: [
      { name: 'SaaS Subscription Billing', href: '/docs/tutorials/saas/subscription-billing', icon: Book },
      { name: 'Freelance Payment Escrow', href: '/docs/tutorials/saas/freelance-escrow', icon: Book },
      { name: 'Consulting Time Tracking', href: '/docs/tutorials/saas/time-tracking', icon: Book },
      { name: 'API Usage Billing', href: '/docs/tutorials/saas/api-billing', icon: Book },
      { name: 'Software License Management', href: '/docs/tutorials/saas/license-management', icon: Book },
    ]
  },
  {
    title: 'DeFi & Finance Tutorials',
    items: [
      { name: 'Yield Farming Rewards', href: '/docs/tutorials/defi/yield-farming', icon: Book },
      { name: 'Cross-Chain Arbitrage Bot', href: '/docs/tutorials/defi/arbitrage-bot', icon: Book },
      { name: 'Lending Protocol Integration', href: '/docs/tutorials/defi/lending-protocol', icon: Book },
      { name: 'DEX Trading Fee Distribution', href: '/docs/tutorials/defi/dex-fees', icon: Book },
      { name: 'Automated Market Maker', href: '/docs/tutorials/defi/amm', icon: Book },
    ]
  },
  {
    title: 'Creator & Social Tutorials',
    items: [
      { name: 'Creator Tipping System', href: '/docs/tutorials/social/creator-tipping', icon: Book },
      { name: 'Content Creator Subscriptions', href: '/docs/tutorials/social/creator-subscriptions', icon: Book },
      { name: 'NFT Drop Platform', href: '/docs/tutorials/social/nft-drops', icon: Book },
      { name: 'Social Media Monetization', href: '/docs/tutorials/social/social-monetization', icon: Book },
      { name: 'Live Streaming Donations', href: '/docs/tutorials/social/live-streaming', icon: Book },
      { name: 'Community Reward System', href: '/docs/tutorials/social/community-rewards', icon: Book },
    ]
  },
  {
    title: 'Enterprise Tutorials',
    items: [
      { name: 'B2B Invoice Processing', href: '/docs/tutorials/enterprise/b2b-invoicing', icon: Book },
      { name: 'Employee Payroll System', href: '/docs/tutorials/enterprise/payroll-system', icon: Book },
      { name: 'Supply Chain Payments', href: '/docs/tutorials/enterprise/supply-chain', icon: Book },
      { name: 'Treasury Management', href: '/docs/tutorials/enterprise/treasury-management', icon: Book },
      { name: 'Vendor Payment Management', href: '/docs/tutorials/enterprise/vendor-management', icon: Book },
    ]
  },
  {
    title: 'Cross-Chain Advanced Tutorials',
    items: [
      { name: 'Multi-Chain Arbitrage', href: '/docs/tutorials/cross-chain/arbitrage', icon: Book },
      { name: 'Cross-Chain Liquidity Pools', href: '/docs/tutorials/cross-chain/liquidity-pools', icon: Book },
      { name: 'Payment Routing Optimization', href: '/docs/tutorials/cross-chain/payment-routing', icon: Book },
      { name: 'Cross-Chain Governance', href: '/docs/tutorials/cross-chain/governance', icon: Book },
    ]
  },
  {
    title: 'Mobile & IoT Tutorials',
    items: [
      { name: 'Mobile Wallet Integration', href: '/docs/tutorials/mobile/wallet-integration', icon: Book },
      { name: 'IoT Device Micropayments', href: '/docs/tutorials/mobile/iot-micropayments', icon: Book },
      { name: 'Smart City Payments', href: '/docs/tutorials/mobile/smart-city', icon: Book },
      { name: 'Vehicle-to-Everything Payments', href: '/docs/tutorials/mobile/v2x-payments', icon: Book },
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
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Navigation */}
        {sections.map((section) => (
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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Documentation</h1>
        <p className="text-xl text-slate-600 mb-12 max-w-3xl">
          Everything you need to integrate SVM-Pay into your application and start accepting cross-chain payments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.flatMap(section => section.items).map((item, index) => (
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
                  {getDocDescription(item.name)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getDocDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Developer Guide': 'Complete guide to integrating SVM-Pay with code examples and tutorials.',
    'API Reference': 'Detailed API documentation with all methods, parameters, and responses.',
    'CLI Tool': 'Command-line interface for testing and managing SVM-Pay transactions.',
    'Cross-Chain Payments': 'Learn how to implement cross-chain payments between EVM and SVM networks.',
    'Architecture': 'Technical architecture overview and system design principles.',
    'Security': 'Security best practices and recommendations for production deployments.'
  }
  return descriptions[name] || 'Documentation for SVM-Pay integration.'
}

export function DocsPage() {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DocsHome />} />
          <Route path="/developer-guide" element={<DeveloperGuideDoc />} />
          <Route path="/api" element={<ApiDoc />} />
          <Route path="/cli" element={<CliDoc />} />
          
          {/* E-commerce Tutorials */}
          <Route path="/tutorials/ecommerce" element={<EcommerceTutorials />} />
          <Route path="/tutorials/ecommerce/online-store" element={<OnlineStoreIntegrationTutorial />} />
          <Route path="/tutorials/ecommerce/marketplace-escrow" element={<MarketplaceEscrowTutorial />} />
          <Route path="/tutorials/ecommerce/subscription-box" element={<SubscriptionBoxTutorial />} />
          <Route path="/tutorials/ecommerce/digital-products" element={<DigitalProductStoreTutorial />} />
          <Route path="/tutorials/ecommerce/flash-sales" element={<FlashSaleManagementTutorial />} />
          
          {/* Gaming Tutorials */}
          <Route path="/tutorials/gaming" element={<GamingTutorials />} />
          <Route path="/tutorials/gaming/currency-exchange" element={<InGameCurrencyTutorial />} />
          <Route path="/tutorials/gaming/nft-marketplace" element={<NFTMarketplaceTutorial />} />
          <Route path="/tutorials/gaming/tournament-prizes" element={<TournamentPrizeDistributionTutorial />} />
          <Route path="/tutorials/gaming/play-to-earn" element={<PlayToEarnRewardsTutorial />} />
          <Route path="/tutorials/gaming/asset-rental" element={<GameAssetRentalTutorial />} />
          
          {/* SaaS Tutorials */}
          <Route path="/tutorials/saas" element={<SaaSTutorials />} />
          <Route path="/tutorials/saas/subscription-billing" element={<SaaSSubscriptionBillingTutorial />} />
          <Route path="/tutorials/saas/freelance-escrow" element={<FreelancePaymentEscrowTutorial />} />
          <Route path="/tutorials/saas/time-tracking" element={<ConsultingTimeTrackingTutorial />} />
          <Route path="/tutorials/saas/api-billing" element={<APIUsageBillingTutorial />} />
          <Route path="/tutorials/saas/license-management" element={<SoftwareLicenseManagementTutorial />} />
          
          {/* DeFi Tutorials */}
          <Route path="/tutorials/defi" element={<DeFiTutorials />} />
          <Route path="/tutorials/defi/yield-farming" element={<YieldFarmingRewardsTutorial />} />
          <Route path="/tutorials/defi/arbitrage-bot" element={<CrossChainArbitrageBotTutorial />} />
          <Route path="/tutorials/defi/lending-protocol" element={<LendingProtocolIntegrationTutorial />} />
          <Route path="/tutorials/defi/dex-fees" element={<DEXTradingFeeDistributionTutorial />} />
          <Route path="/tutorials/defi/amm" element={<AutomatedMarketMakerTutorial />} />
          
          {/* Social Tutorials */}
          <Route path="/tutorials/social" element={<SocialTutorials />} />
          <Route path="/tutorials/social/creator-tipping" element={<CreatorTippingSystemTutorial />} />
          <Route path="/tutorials/social/creator-subscriptions" element={<ContentCreatorSubscriptionsTutorial />} />
          <Route path="/tutorials/social/nft-drops" element={<NFTDropPlatformTutorial />} />
          <Route path="/tutorials/social/community-rewards" element={<CommunityRewardSystemTutorial />} />
          
          {/* Other category pages */}
          <Route path="/tutorials/defi" element={<DeFiTutorials />} />
          <Route path="/tutorials/social" element={<SocialTutorials />} />
          <Route path="/tutorials/enterprise" element={<EnterpriseTutorials />} />
          <Route path="/tutorials/cross-chain" element={<CrossChainTutorials />} />
          <Route path="/tutorials/mobile" element={<MobileTutorials />} />
          
          {/* Cross-Chain Advanced Tutorial Routes */}
          <Route path="/tutorials/cross-chain/arbitrage" element={<MultiChainArbitrageTutorial />} />
          <Route path="/tutorials/cross-chain/liquidity-pools" element={<CrossChainLiquidityPoolTutorial />} />
          <Route path="/tutorials/cross-chain/payment-routing" element={<PaymentRoutingOptimizationTutorial />} />
          <Route path="/tutorials/cross-chain/governance" element={<CrossChainGovernanceTutorial />} />
          
          {/* Mobile & IoT Tutorial Routes */}
          <Route path="/tutorials/mobile/wallet-integration" element={<MobileWalletIntegrationTutorial />} />
          <Route path="/tutorials/mobile/iot-micropayments" element={<IoTMicropaymentsTutorial />} />
          <Route path="/tutorials/mobile/smart-city" element={<SmartCityPaymentsTutorial />} />
          <Route path="/tutorials/mobile/v2x-payments" element={<V2XPaymentsTutorial />} />
          
          <Route path="/cross-chain" element={<CrossChainDoc />} />
          <Route path="/architecture" element={<ArchitectureDoc />} />
          <Route path="/security" element={<SecurityDoc />} />
        </Routes>
      </div>
    </div>
  )
}

// Individual documentation components
function DeveloperGuideDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Developer Guide</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Welcome to the SVM-Pay Developer Guide! This guide will help you integrate SVM-Pay into your applications and start accepting payments across multiple SVM networks.
          </p>

          <h2>Quick Start</h2>
          <p>Get started with SVM-Pay in just a few minutes:</p>

          <h3>1. Installation</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">npm install svm-pay</code>
          </div>

          <h3>2. Basic Usage</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`import { SVMPay } from 'svm-pay'

const svmPay = new SVMPay()

// Create a payment URL
const paymentUrl = svmPay.createTransferUrl(
  'YOUR_WALLET_ADDRESS',
  '1.0',
  {
    label: 'Your Store',
    message: 'Payment for Order #123',
    references: ['order-123']
  }
)`}
            </pre>
          </div>

          <h3>3. Cross-Chain Payments</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`import { CrossChainRequestFactory, EVMNetwork, SVMNetwork } from 'svm-pay'

// Create cross-chain payment request
const request = CrossChainRequestFactory.createTransferRequest({
  sourceNetwork: EVMNetwork.ETHEREUM,
  destinationNetwork: SVMNetwork.SOLANA,
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: '100',
  token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f'
})

// Execute payment
const result = await paymentManager.executePayment(request)`}
            </pre>
          </div>

          <h2>Integration Examples</h2>
          
          <h3>React Integration</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`import { useSVMPay } from 'svm-pay/react'

function PaymentForm() {
  const { executePayment, loading, error } = useSVMPay()
  
  const handlePayment = async () => {
    await executePayment({
      recipient: walletAddress,
      amount: 50,
      token: 'USDC'
    })
  }
  
  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with SVM-Pay'}
    </button>
  )
}`}
            </pre>
          </div>

          <h3>URL Scheme</h3>
          <p>SVM-Pay supports URL schemes for easy payment links:</p>
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <code className="text-slate-800">
              solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?amount=100&token=USDC&label=Store%20Payment
            </code>
          </div>

          <h2>Error Handling</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`try {
  const result = await svmPay.executePayment(request)
  console.log('Payment successful:', result.signature)
} catch (error) {
  if (error instanceof PaymentError) {
    console.error('Payment failed:', error.message)
    // Handle specific payment errors
  } else {
    console.error('Unexpected error:', error)
  }
}`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ApiDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">API Reference</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Complete API reference for SVM-Pay with all methods, parameters, and responses.
          </p>

          <h2>Core Classes</h2>

          <h3>SVMPay</h3>
          <p>Main class for SVM-Pay operations.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Constructor</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <code className="text-green-400">new SVMPay(options?: SVMPayOptions)</code>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">createTransferUrl()</h4>
            <p className="text-sm text-slate-600 mb-2">Creates a payment URL for transfers.</p>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`createTransferUrl(
  recipient: string,
  amount: string | number,
  options?: TransferOptions
): string`}
              </pre>
            </div>
          </div>

          <h3>CrossChainPaymentManager</h3>
          <p>Manages cross-chain payment operations.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">executePayment()</h4>
            <p className="text-sm text-slate-600 mb-2">Executes a cross-chain payment.</p>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-slate-100">
{`executePayment(
  request: CrossChainTransferRequest
): Promise<PaymentResult>`}
              </pre>
            </div>
          </div>

          <h2>Types</h2>

          <h3>CrossChainTransferRequest</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`interface CrossChainTransferRequest {
  sourceNetwork: EVMNetwork
  destinationNetwork: SVMNetwork
  recipient: string
  amount: string
  token: string
  bridgePreference?: 'fastest' | 'cheapest' | 'most_reliable'
}`}
            </pre>
          </div>

          <h3>PaymentResult</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`interface PaymentResult {
  id: string
  status: PaymentStatus
  sourceTransaction?: string
  destinationTransaction?: string
  bridgeTransaction?: string
  estimatedDuration?: number
}`}
            </pre>
          </div>

          <h2>Error Handling</h2>
          <p>SVM-Pay provides specific error types for different failure scenarios:</p>

          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`class PaymentError extends Error {
  code: string
  details?: any
}

class NetworkError extends PaymentError {
  // Network-specific errors
}

class BridgeError extends PaymentError {
  // Bridge-specific errors
}`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CliDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">CLI Tool</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Command-line interface for testing and managing SVM-Pay transactions.
          </p>

          <h2>Installation</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">npm install -g svm-pay-cli</code>
          </div>

          <h2>Commands</h2>

          <h3>Create Payment URL</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">svm-pay create-url --recipient WALLET_ADDRESS --amount 1.0 --label "Test Payment"</code>
          </div>

          <h3>Test Cross-Chain Payment</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">svm-pay test-crosschain --from ethereum --to solana --amount 100 --token USDC</code>
          </div>

          <h3>Get Bridge Quotes</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">svm-pay get-quotes --from ethereum --to solana --amount 100 --token USDC</code>
          </div>

          <h3>Check Payment Status</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-green-400">svm-pay status --payment-id PAYMENT_ID</code>
          </div>

          <h2>Options</h2>
          <table className="min-w-full divide-y divide-slate-200 mb-6">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Option</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Example</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">--recipient</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Target wallet address</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">--amount</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Payment amount</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">1.0</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">--token</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Token symbol or address</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">USDC</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">--network</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Network name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">ethereum, solana</td>
              </tr>
            </tbody>
          </table>

          <h2>Configuration</h2>
          <p>Create a config file at <code>~/.svm-pay/config.json</code>:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`{
  "networks": {
    "ethereum": {
      "rpc": "https://mainnet.infura.io/v3/YOUR_KEY"
    },
    "solana": {
      "rpc": "https://api.mainnet-beta.solana.com"
    }
  },
  "bridges": {
    "wormhole": {
      "enabled": true
    },
    "allbridge": {
      "enabled": true
    }
  }
}`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CrossChainDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Cross-Chain Payments</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Learn how to implement cross-chain payments between EVM and SVM networks using SVM-Pay.
          </p>

          <h2>Supported Networks</h2>
          
          <h3>EVM Networks (Source)</h3>
          <ul>
            <li>Ethereum</li>
            <li>BNB Chain</li>
            <li>Polygon</li>
            <li>Arbitrum</li>
            <li>Optimism</li>
            <li>Avalanche</li>
          </ul>

          <h3>SVM Networks (Destination)</h3>
          <ul>
            <li>Solana</li>
            <li>Sonic</li>
            <li>Eclipse</li>
            <li>s00n</li>
          </ul>

          <h2>Bridge Partners</h2>
          
          <h3>Wormhole</h3>
          <p>Fast and secure cross-chain transfers with:</p>
          <ul>
            <li>~5 minute transfer time</li>
            <li>Support for major tokens (USDC, USDT, WETH, WBTC)</li>
            <li>High security with Guardian network</li>
          </ul>

          <h3>Allbridge</h3>
          <p>Cost-effective cross-chain solution with:</p>
          <ul>
            <li>~3 minute transfer time</li>
            <li>Lower fees compared to other bridges</li>
            <li>Wide token support</li>
          </ul>

          <h2>Implementation Example</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`import { 
  CrossChainPaymentManager, 
  CrossChainRequestFactory,
  EVMNetwork,
  SVMNetwork 
} from 'svm-pay'

// Initialize payment manager
const paymentManager = new CrossChainPaymentManager({
  bridges: ['wormhole', 'allbridge'],
  monitoring: true
})

// Create payment request
const request = CrossChainRequestFactory.createTransferRequest({
  sourceNetwork: EVMNetwork.ETHEREUM,
  destinationNetwork: SVMNetwork.SOLANA,
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: '100',
  token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f', // USDC
  bridgePreference: 'fastest'
})

// Execute payment
const result = await paymentManager.executePayment(request)

// Monitor payment status
result.on('status', (status) => {
  console.log('Payment status:', status)
  switch (status) {
    case 'INITIATED':
      console.log('Payment started')
      break
    case 'BRIDGING':
      console.log('Transferring via bridge')
      break
    case 'BRIDGE_CONFIRMED':
      console.log('Bridge transfer confirmed')
      break
    case 'COMPLETED':
      console.log('Payment completed successfully')
      break
  }
})`}
            </pre>
          </div>

          <h2>Bridge Selection</h2>
          <p>SVM-Pay automatically selects the best bridge based on:</p>
          <ul>
            <li><strong>Speed</strong>: Transfer time from source to destination</li>
            <li><strong>Cost</strong>: Bridge fees and gas costs</li>
            <li><strong>Reliability</strong>: Success rate and uptime</li>
          </ul>

          <p>You can also specify bridge preferences:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`// Fastest transfer
const request = { 
  ...baseRequest, 
  bridgePreference: 'fastest' 
}

// Cheapest fees
const request = { 
  ...baseRequest, 
  bridgePreference: 'cheapest' 
}

// Most reliable
const request = { 
  ...baseRequest, 
  bridgePreference: 'most_reliable' 
}`}
            </pre>
          </div>

          <h2>Error Handling</h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`try {
  const result = await paymentManager.executePayment(request)
} catch (error) {
  if (error instanceof BridgeError) {
    console.error('Bridge error:', error.message)
    // Retry with different bridge
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message)
    // Check network connectivity
  } else {
    console.error('Unexpected error:', error)
  }
}`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ArchitectureDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Architecture</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Technical architecture overview and system design principles of SVM-Pay.
          </p>

          <h2>System Overview</h2>
          <p>SVM-Pay is designed as a modular, extensible payment infrastructure with the following key components:</p>

          <h3>Core Components</h3>
          <ul>
            <li><strong>Payment Manager</strong>: Orchestrates payment flows</li>
            <li><strong>Network Adapters</strong>: Handle network-specific operations</li>
            <li><strong>Bridge Adapters</strong>: Integrate with cross-chain bridges</li>
            <li><strong>URL Parser</strong>: Processes payment URLs</li>
            <li><strong>Storage Layer</strong>: Persists payment data</li>
          </ul>

          <h2>Architecture Principles</h2>
          
          <h3>1. Modularity</h3>
          <p>Each component is designed as an independent module with clear interfaces:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`interface NetworkAdapter {
  createTransaction(request: TransactionRequest): Promise<Transaction>
  submitTransaction(transaction: Transaction): Promise<string>
  getTransactionStatus(hash: string): Promise<TransactionStatus>
}`}
            </pre>
          </div>

          <h3>2. Extensibility</h3>
          <p>New networks and bridges can be added without modifying core code:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`// Add new network
NetworkAdapterFactory.register('new-network', NewNetworkAdapter)

// Add new bridge
BridgeAdapterFactory.register('new-bridge', NewBridgeAdapter)`}
            </pre>
          </div>

          <h3>3. Type Safety</h3>
          <p>Full TypeScript support with comprehensive type definitions:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`interface CrossChainTransferRequest {
  sourceNetwork: EVMNetwork
  destinationNetwork: SVMNetwork
  recipient: string
  amount: string
  token: string
}`}
            </pre>
          </div>

          <h2>Data Flow</h2>
          <ol>
            <li><strong>Request Creation</strong>: User creates payment request</li>
            <li><strong>Validation</strong>: System validates request parameters</li>
            <li><strong>Bridge Selection</strong>: Optimal bridge is selected</li>
            <li><strong>Transaction Creation</strong>: Network-specific transactions are created</li>
            <li><strong>Execution</strong>: Transactions are submitted and monitored</li>
            <li><strong>Completion</strong>: Final status is reported</li>
          </ol>

          <h2>Security Considerations</h2>
          <ul>
            <li><strong>Input Validation</strong>: All inputs are validated before processing</li>
            <li><strong>Address Verification</strong>: Wallet addresses are verified for each network</li>
            <li><strong>Amount Validation</strong>: Payment amounts are checked for validity</li>
            <li><strong>Error Handling</strong>: Comprehensive error handling prevents failures</li>
          </ul>

          <h2>Performance Optimizations</h2>
          <ul>
            <li><strong>Caching</strong>: Network data is cached to reduce latency</li>
            <li><strong>Batch Processing</strong>: Multiple requests can be batched</li>
            <li><strong>Async Operations</strong>: Non-blocking operations for better performance</li>
            <li><strong>Connection Pooling</strong>: Efficient network connection management</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

function SecurityDoc() {
  return (
    <div className="pt-20 p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Security</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Security best practices and recommendations for production deployments of SVM-Pay.
          </p>

          <h2>Security Features</h2>

          <h3>Input Validation</h3>
          <p>All user inputs are thoroughly validated:</p>
          <ul>
            <li>Wallet address format validation</li>
            <li>Amount range checking</li>
            <li>Token address verification</li>
            <li>Network parameter validation</li>
          </ul>

          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`// Address validation example
function validateAddress(address: string, network: Network): boolean {
  switch (network.type) {
    case 'EVM':
      return ethers.utils.isAddress(address)
    case 'SVM':
      return isValidSolanaAddress(address)
    default:
      return false
  }
}`}
            </pre>
          </div>

          <h3>Transaction Security</h3>
          <ul>
            <li>Secure transaction signing</li>
            <li>Nonce management</li>
            <li>Gas limit validation</li>
            <li>Double-spend protection</li>
          </ul>

          <h3>Bridge Security</h3>
          <p>Cross-chain transfers use secure bridge protocols:</p>
          <ul>
            <li><strong>Wormhole</strong>: Guardian network validation</li>
            <li><strong>Allbridge</strong>: Multi-signature validation</li>
            <li>Slippage protection</li>
            <li>Transfer amount limits</li>
          </ul>

          <h2>Best Practices</h2>

          <h3>Environment Setup</h3>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`// Use environment variables for sensitive data
const config = {
  networks: {
    ethereum: {
      rpc: process.env.ETHEREUM_RPC_URL,
      privateKey: process.env.ETHEREUM_PRIVATE_KEY
    }
  }
}`}
            </pre>
          </div>

          <h3>Error Handling</h3>
          <p>Implement comprehensive error handling:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`try {
  const result = await executePayment(request)
} catch (error) {
  // Log error details for debugging
  console.error('Payment failed:', error)
  
  // Don't expose sensitive information to users
  throw new Error('Payment processing failed')
}`}
            </pre>
          </div>

          <h3>Rate Limiting</h3>
          <p>Implement rate limiting to prevent abuse:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/payments', limiter)`}
            </pre>
          </div>

          <h2>Security Checklist</h2>
          <ul>
            <li>✅ Use HTTPS for all API communications</li>
            <li>✅ Validate all inputs before processing</li>
            <li>✅ Store private keys securely</li>
            <li>✅ Implement proper error handling</li>
            <li>✅ Use rate limiting on API endpoints</li>
            <li>✅ Monitor transactions for anomalies</li>
            <li>✅ Keep dependencies updated</li>
            <li>✅ Implement logging and monitoring</li>
          </ul>

          <h2>Vulnerability Prevention</h2>

          <h3>Common Attack Vectors</h3>
          <ul>
            <li><strong>Address poisoning</strong>: Always validate recipient addresses</li>
            <li><strong>Amount manipulation</strong>: Validate payment amounts</li>
            <li><strong>Replay attacks</strong>: Use proper nonce management</li>
            <li><strong>Bridge exploits</strong>: Monitor bridge security status</li>
          </ul>

          <h3>Monitoring</h3>
          <p>Implement comprehensive monitoring:</p>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-slate-100">
{`// Monitor payment anomalies
function monitorPayment(payment: Payment) {
  if (payment.amount > LARGE_AMOUNT_THRESHOLD) {
    alerts.send('Large payment detected', payment)
  }
  
  if (payment.status === 'FAILED') {
    analytics.track('payment_failed', payment)
  }
}`}
            </pre>
          </div>

          <h2>Incident Response</h2>
          <p>Have a plan for security incidents:</p>
          <ul>
            <li>Immediate response procedures</li>
            <li>Communication protocols</li>
            <li>Recovery procedures</li>
            <li>Post-incident analysis</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

// E-commerce Tutorials
function EcommerceTutorials() {
  const tutorials = [
    {
      title: "Online Store Integration",
      description: "Complete e-commerce store with Solana payments",
      level: "Beginner",
      time: "30 minutes",
      code: `// E-commerce checkout with SVM-Pay
import { SVMPay, PaymentForm } from '@svm-pay/sdk'

const EcommerceCheckout = ({ cartItems, total }) => {
  const handlePayment = async (paymentData) => {
    const payment = SVMPay.createPayment({
      recipient: process.env.STORE_WALLET,
      amount: total,
      token: 'USDC',
      metadata: {
        orderId: generateOrderId(),
        items: cartItems,
        customerEmail: paymentData.email
      }
    })

    const result = await payment.execute()
    
    if (result.status === 'SUCCESS') {
      // Update inventory
      await updateInventory(cartItems)
      // Send confirmation email
      await sendOrderConfirmation(paymentData.email, result.transactionId)
      // Redirect to success page
      router.push('/order-success')
    }
  }

  return <PaymentForm onSubmit={handlePayment} amount={total} />
}`
    },
    {
      title: "Marketplace with Escrow",
      description: "Multi-vendor marketplace with escrow payments",
      level: "Advanced",
      time: "2 hours",
      code: `// Marketplace escrow system
import { EscrowManager, MultisigWallet } from '@svm-pay/sdk'

const MarketplaceEscrow = ({ seller, buyer, item }) => {
  const createEscrowPayment = async () => {
    // Create escrow account
    const escrow = await EscrowManager.create({
      seller: seller.wallet,
      buyer: buyer.wallet,
      arbitrator: process.env.MARKETPLACE_ARBITRATOR,
      amount: item.price,
      token: 'USDC',
      releaseConditions: {
        autoReleaseAfter: 7 * 24 * 60 * 60, // 7 days
        requiresConfirmation: true
      }
    })

    // Handle dispute resolution
    escrow.onDispute(async (dispute) => {
      await notifyArbitrator(dispute)
      await freezeEscrow(escrow.id)
    })

    return escrow
  }
}`
    },
    {
      title: "Subscription Box Service",
      description: "Recurring payments for subscription boxes",
      level: "Intermediate",
      time: "1 hour",
      code: `// Subscription box payments
import { SubscriptionManager, InventoryManager } from '@svm-pay/sdk'

const SubscriptionBox = ({ customer, plan }) => {
  const setupSubscription = async () => {
    const subscription = await SubscriptionManager.create({
      customer: customer.wallet,
      merchant: process.env.BUSINESS_WALLET,
      amount: plan.price,
      interval: plan.interval, // 'monthly', 'quarterly'
      token: 'USDC',
      metadata: {
        planId: plan.id,
        customerId: customer.id
      }
    })

    // Handle successful payments
    subscription.onPayment(async (payment) => {
      await InventoryManager.reserve({
        customerId: customer.id,
        items: plan.items,
        deliveryDate: getNextDeliveryDate()
      })
      
      await sendShippingNotification(customer.email)
    })

    // Handle failed payments
    subscription.onFailure(async (failure) => {
      await handleFailedPayment(customer, failure)
    })

    return subscription
  }
}`
    },
    {
      title: "Digital Product Store",
      description: "Instant delivery of digital products",
      level: "Beginner",
      time: "45 minutes",
      code: `// Digital product delivery
import { SVMPay, FileManager, LicenseManager } from '@svm-pay/sdk'

const DigitalStore = ({ product, customer }) => {
  const purchaseDigitalProduct = async () => {
    const payment = SVMPay.createPayment({
      recipient: process.env.STORE_WALLET,
      amount: product.price,
      token: 'USDC',
      metadata: {
        productId: product.id,
        customerId: customer.id,
        type: 'digital'
      }
    })

    payment.onSuccess(async (result) => {
      // Generate unique download link
      const downloadLink = await FileManager.generateSecureLink({
        fileId: product.fileId,
        expiresIn: 24 * 60 * 60, // 24 hours
        maxDownloads: 3
      })

      // Create software license if applicable
      if (product.type === 'software') {
        await LicenseManager.generate({
          productId: product.id,
          customerId: customer.id,
          licenseType: product.licenseType
        })
      }

      // Send download email
      await sendDownloadEmail(customer.email, downloadLink)
    })

    return payment.execute()
  }
}`
    },
    {
      title: "Flash Sale Management",
      description: "High-volume flash sale with rate limiting",
      level: "Advanced",
      time: "1.5 hours",
      code: `// Flash sale with rate limiting
import { SVMPay, RateLimiter, InventoryManager } from '@svm-pay/sdk'

const FlashSale = ({ product, saleConfig }) => {
  const rateLimiter = new RateLimiter({
    maxTransactions: 100,
    timeWindow: 60000, // 1 minute
    queueSize: 1000
  })

  const processSalePurchase = async (customer) => {
    // Check rate limit
    const canProceed = await rateLimiter.checkLimit(customer.wallet)
    if (!canProceed) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    // Reserve inventory atomically
    const reservation = await InventoryManager.reserve({
      productId: product.id,
      quantity: 1,
      customerId: customer.id,
      expiresIn: 300 // 5 minutes to complete payment
    })

    const payment = SVMPay.createPayment({
      recipient: process.env.STORE_WALLET,
      amount: saleConfig.salePrice,
      token: 'USDC',
      metadata: {
        reservationId: reservation.id,
        originalPrice: product.price,
        discount: product.price - saleConfig.salePrice
      }
    })

    payment.onSuccess(async () => {
      await reservation.confirm()
      await sendPurchaseConfirmation(customer.email)
    })

    payment.onFailure(async () => {
      await reservation.release()
    })

    return payment.execute()
  }
}`
    }
  ]

  return (
    <div className="pt-20 p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">E-commerce Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build sophisticated e-commerce solutions with Solana payments
        </p>

        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{tutorial.title}</h3>
                  <p className="text-slate-600 mb-2">{tutorial.description}</p>
                  <div className="flex space-x-4 text-sm text-slate-500">
                    <span>Level: {tutorial.level}</span>
                    <span>Time: {tutorial.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{tutorial.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
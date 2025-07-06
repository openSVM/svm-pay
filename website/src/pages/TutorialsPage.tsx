import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Book, 
  ChevronRight,
  Search,
  ExternalLink
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
  SoftwareLicenseManagementTutorial,
  N8nIntegrationTutorial
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

// Tutorial sections
const tutorialSections = [
  {
    title: 'E-commerce Tutorials',
    items: [
      { name: 'Online Store Integration', href: '/tutorials/ecommerce/online-store', icon: Book },
      { name: 'Marketplace with Escrow', href: '/tutorials/ecommerce/marketplace-escrow', icon: Book },
      { name: 'Subscription Box Service', href: '/tutorials/ecommerce/subscription-box', icon: Book },
      { name: 'Digital Product Store', href: '/tutorials/ecommerce/digital-products', icon: Book },
      { name: 'Flash Sale Management', href: '/tutorials/ecommerce/flash-sales', icon: Book },
    ]
  },
  {
    title: 'Gaming & NFT Tutorials',
    items: [
      { name: 'In-Game Currency Exchange', href: '/tutorials/gaming/currency-exchange', icon: Book },
      { name: 'NFT Marketplace for Games', href: '/tutorials/gaming/nft-marketplace', icon: Book },
      { name: 'Tournament Prize Distribution', href: '/tutorials/gaming/tournament-prizes', icon: Book },
      { name: 'Play-to-Earn Rewards', href: '/tutorials/gaming/play-to-earn', icon: Book },
      { name: 'Game Asset Rental System', href: '/tutorials/gaming/asset-rental', icon: Book },
    ]
  },
  {
    title: 'SaaS & Service Tutorials',
    items: [
      { name: 'SaaS Subscription Billing', href: '/tutorials/saas/subscription-billing', icon: Book },
      { name: 'Freelance Payment Escrow', href: '/tutorials/saas/freelance-escrow', icon: Book },
      { name: 'Consulting Time Tracking', href: '/tutorials/saas/time-tracking', icon: Book },
      { name: 'API Usage Billing', href: '/tutorials/saas/api-billing', icon: Book },
      { name: 'Software License Management', href: '/tutorials/saas/license-management', icon: Book },
      { name: 'n8n Workflow Automation', href: '/tutorials/saas/n8n-integration', icon: Book },
    ]
  },
  {
    title: 'DeFi & Finance Tutorials',
    items: [
      { name: 'Yield Farming Rewards', href: '/tutorials/defi/yield-farming', icon: Book },
      { name: 'Cross-Chain Arbitrage Bot', href: '/tutorials/defi/arbitrage-bot', icon: Book },
      { name: 'Lending Protocol Integration', href: '/tutorials/defi/lending-protocol', icon: Book },
      { name: 'DEX Trading Fee Distribution', href: '/tutorials/defi/dex-fees', icon: Book },
      { name: 'Automated Market Maker', href: '/tutorials/defi/amm', icon: Book },
    ]
  },
  {
    title: 'Creator & Social Tutorials',
    items: [
      { name: 'Creator Tipping System', href: '/tutorials/social/creator-tipping', icon: Book },
      { name: 'Content Creator Subscriptions', href: '/tutorials/social/creator-subscriptions', icon: Book },
      { name: 'NFT Drop Platform', href: '/tutorials/social/nft-drops', icon: Book },
      { name: 'Social Media Monetization', href: '/tutorials/social/social-monetization', icon: Book },
      { name: 'Live Streaming Donations', href: '/tutorials/social/live-streaming', icon: Book },
      { name: 'Community Reward System', href: '/tutorials/social/community-rewards', icon: Book },
    ]
  },
  {
    title: 'Enterprise Tutorials',
    items: [
      { name: 'B2B Invoice Processing', href: '/tutorials/enterprise/b2b-invoicing', icon: Book },
      { name: 'Employee Payroll System', href: '/tutorials/enterprise/payroll-system', icon: Book },
      { name: 'Supply Chain Payments', href: '/tutorials/enterprise/supply-chain', icon: Book },
      { name: 'Treasury Management', href: '/tutorials/enterprise/treasury-management', icon: Book },
      { name: 'Vendor Payment Management', href: '/tutorials/enterprise/vendor-management', icon: Book },
    ]
  },
  {
    title: 'Cross-Chain Advanced Tutorials',
    items: [
      { name: 'Multi-Chain Arbitrage', href: '/tutorials/cross-chain/arbitrage', icon: Book },
      { name: 'Cross-Chain Liquidity Pools', href: '/tutorials/cross-chain/liquidity-pools', icon: Book },
      { name: 'Payment Routing Optimization', href: '/tutorials/cross-chain/payment-routing', icon: Book },
      { name: 'Cross-Chain Governance', href: '/tutorials/cross-chain/governance', icon: Book },
    ]
  },
  {
    title: 'Mobile & IoT Tutorials',
    items: [
      { name: 'Mobile Wallet Integration', href: '/tutorials/mobile/wallet-integration', icon: Book },
      { name: 'IoT Device Micropayments', href: '/tutorials/mobile/iot-micropayments', icon: Book },
      { name: 'Smart City Payments', href: '/tutorials/mobile/smart-city', icon: Book },
      { name: 'Vehicle-to-Everything Payments', href: '/tutorials/mobile/v2x-payments', icon: Book },
    ]
  }
]

function TutorialsSidebar() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen pt-20">
      <div className="p-6">
        {/* Cross-navigation */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Need API Reference?</h3>
          <Link 
            to="/docs" 
            className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Go to API Docs
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Navigation */}
        {tutorialSections.map((section) => (
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

function TutorialsHome() {
  return (
    <div className="pt-20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl">
          Step-by-step guides to build sophisticated applications with SVM-Pay across various industries and use cases.
        </p>

        {/* Cross-navigation */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Looking for API Reference?</h3>
          <p className="text-blue-800 mb-3">
            Need detailed documentation on classes, methods, and types? Check out our comprehensive API reference.
          </p>
          <Link 
            to="/docs" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Browse API Documentation
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorialSections.flatMap(section => section.items).map((item, index) => (
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
                  {getTutorialDescription(item.name)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getTutorialDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Online Store Integration': 'Build a complete e-commerce store with Solana payments and order management.',
    'Marketplace with Escrow': 'Create a multi-vendor marketplace with secure escrow payment system.',
    'Subscription Box Service': 'Implement recurring payments for subscription-based businesses.',
    'Digital Product Store': 'Set up instant delivery of digital products with secure download links.',
    'Flash Sale Management': 'Handle high-volume flash sales with rate limiting and inventory management.',
    'In-Game Currency Exchange': 'Build an in-game currency system with real-world value exchange.',
    'NFT Marketplace for Games': 'Create a game-specific NFT marketplace for trading game assets.',
    'Tournament Prize Distribution': 'Automate tournament prize payouts based on player performance.',
    'Play-to-Earn Rewards': 'Implement play-to-earn mechanics with automatic reward distribution.',
    'Game Asset Rental System': 'Create a rental system for game assets and NFTs.',
    'SaaS Subscription Billing': 'Build a comprehensive subscription billing system for SaaS businesses.',
    'Freelance Payment Escrow': 'Create secure escrow payments for freelance work platforms.',
    'Consulting Time Tracking': 'Track consulting hours and automate payment processing.',
    'API Usage Billing': 'Implement usage-based billing for API services.',
    'Software License Management': 'Manage software licenses with automated payment and activation.',
    'n8n Workflow Automation': 'Integrate SVM-Pay with n8n for workflow automation.',
    'Yield Farming Rewards': 'Build yield farming protocols with automated reward distribution.',
    'Cross-Chain Arbitrage Bot': 'Create arbitrage bots for cross-chain trading opportunities.',
    'Lending Protocol Integration': 'Integrate with lending protocols for automated lending.',
    'DEX Trading Fee Distribution': 'Distribute trading fees to liquidity providers automatically.',
    'Automated Market Maker': 'Build an AMM with liquidity pools and trading functionality.',
    'Creator Tipping System': 'Enable fans to tip content creators with crypto payments.',
    'Content Creator Subscriptions': 'Build subscription systems for content creators.',
    'NFT Drop Platform': 'Create platforms for NFT drops and limited releases.',
    'Social Media Monetization': 'Monetize social media content with crypto payments.',
    'Live Streaming Donations': 'Enable real-time donations during live streams.',
    'Community Reward System': 'Reward community participation with token incentives.',
    'B2B Invoice Processing': 'Automate B2B invoice payments with smart contracts.',
    'Employee Payroll System': 'Process employee payroll with cryptocurrency.',
    'Supply Chain Payments': 'Automate supply chain payments based on delivery confirmations.',
    'Treasury Management': 'Manage corporate treasury operations with multi-signature wallets.',
    'Vendor Payment Management': 'Streamline vendor payments with automated processing.',
    'Multi-Chain Arbitrage': 'Execute arbitrage strategies across multiple blockchains.',
    'Cross-Chain Liquidity Pools': 'Create liquidity pools that span multiple networks.',
    'Payment Routing Optimization': 'Optimize payment routing for cost and speed efficiency.',
    'Cross-Chain Governance': 'Build governance systems that work across multiple chains.',
    'Mobile Wallet Integration': 'Integrate SVM-Pay into mobile applications.',
    'IoT Device Micropayments': 'Enable micropayments between IoT devices.',
    'Smart City Payments': 'Build payment systems for smart city infrastructure.',
    'Vehicle-to-Everything Payments': 'Enable payments between vehicles and infrastructure.'
  }
  return descriptions[name] || 'Learn to implement this feature with SVM-Pay.'
}

export function TutorialsPage() {
  return (
    <div className="flex min-h-screen">
      <TutorialsSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<TutorialsHome />} />
          
          {/* E-commerce Tutorials */}
          <Route path="/ecommerce" element={<EcommerceTutorials />} />
          <Route path="/ecommerce/online-store" element={<OnlineStoreIntegrationTutorial />} />
          <Route path="/ecommerce/marketplace-escrow" element={<MarketplaceEscrowTutorial />} />
          <Route path="/ecommerce/subscription-box" element={<SubscriptionBoxTutorial />} />
          <Route path="/ecommerce/digital-products" element={<DigitalProductStoreTutorial />} />
          <Route path="/ecommerce/flash-sales" element={<FlashSaleManagementTutorial />} />
          
          {/* Gaming Tutorials */}
          <Route path="/gaming" element={<GamingTutorials />} />
          <Route path="/gaming/currency-exchange" element={<InGameCurrencyTutorial />} />
          <Route path="/gaming/nft-marketplace" element={<NFTMarketplaceTutorial />} />
          <Route path="/gaming/tournament-prizes" element={<TournamentPrizeDistributionTutorial />} />
          <Route path="/gaming/play-to-earn" element={<PlayToEarnRewardsTutorial />} />
          <Route path="/gaming/asset-rental" element={<GameAssetRentalTutorial />} />
          
          {/* SaaS Tutorials */}
          <Route path="/saas" element={<SaaSTutorials />} />
          <Route path="/saas/subscription-billing" element={<SaaSSubscriptionBillingTutorial />} />
          <Route path="/saas/freelance-escrow" element={<FreelancePaymentEscrowTutorial />} />
          <Route path="/saas/time-tracking" element={<ConsultingTimeTrackingTutorial />} />
          <Route path="/saas/api-billing" element={<APIUsageBillingTutorial />} />
          <Route path="/saas/license-management" element={<SoftwareLicenseManagementTutorial />} />
          <Route path="/saas/n8n-integration" element={<N8nIntegrationTutorial />} />
          
          {/* DeFi Tutorials */}
          <Route path="/defi" element={<DeFiTutorials />} />
          <Route path="/defi/yield-farming" element={<YieldFarmingRewardsTutorial />} />
          <Route path="/defi/arbitrage-bot" element={<CrossChainArbitrageBotTutorial />} />
          <Route path="/defi/lending-protocol" element={<LendingProtocolIntegrationTutorial />} />
          <Route path="/defi/dex-fees" element={<DEXTradingFeeDistributionTutorial />} />
          <Route path="/defi/amm" element={<AutomatedMarketMakerTutorial />} />
          
          {/* Social Tutorials */}
          <Route path="/social" element={<SocialTutorials />} />
          <Route path="/social/creator-tipping" element={<CreatorTippingSystemTutorial />} />
          <Route path="/social/creator-subscriptions" element={<ContentCreatorSubscriptionsTutorial />} />
          <Route path="/social/nft-drops" element={<NFTDropPlatformTutorial />} />
          <Route path="/social/community-rewards" element={<CommunityRewardSystemTutorial />} />
          
          {/* Other category pages */}
          <Route path="/enterprise" element={<EnterpriseTutorials />} />
          <Route path="/cross-chain" element={<CrossChainTutorials />} />
          <Route path="/mobile" element={<MobileTutorials />} />
          
          {/* Cross-Chain Advanced Tutorial Routes */}
          <Route path="/cross-chain/arbitrage" element={<MultiChainArbitrageTutorial />} />
          <Route path="/cross-chain/liquidity-pools" element={<CrossChainLiquidityPoolTutorial />} />
          <Route path="/cross-chain/payment-routing" element={<PaymentRoutingOptimizationTutorial />} />
          <Route path="/cross-chain/governance" element={<CrossChainGovernanceTutorial />} />
          
          {/* Mobile & IoT Tutorial Routes */}
          <Route path="/mobile/wallet-integration" element={<MobileWalletIntegrationTutorial />} />
          <Route path="/mobile/iot-micropayments" element={<IoTMicropaymentsTutorial />} />
          <Route path="/mobile/smart-city" element={<SmartCityPaymentsTutorial />} />
          <Route path="/mobile/v2x-payments" element={<V2XPaymentsTutorial />} />
        </Routes>
      </div>
    </div>
  )
}
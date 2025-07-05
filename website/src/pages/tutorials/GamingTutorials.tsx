import { TutorialLayout } from '../../components/ui/TutorialLayout'

export function InGameCurrencyTutorial() {
  return (
    <TutorialLayout
      title="In-Game Currency Exchange"
      description="Convert real money to in-game tokens seamlessly with automated exchange rates"
      level="Intermediate"
      time="1 hour"
      category="Gaming & NFT Tutorials"
      categoryPath="/docs/tutorials/gaming"
      overview="Build a system that allows players to purchase in-game currency using real cryptocurrency. This tutorial covers exchange rate management, token minting, player balance updates, and transaction logging for audit purposes."
      prerequisites={[
        "Basic understanding of game economies",
        "Knowledge of token minting on Solana",
        "Database management skills",
        "Understanding of exchange rate concepts"
      ]}
      steps={[
        {
          title: "Set Up Game Economy System",
          description: "Initialize the game economy with exchange rates and token management.",
          code: `import { SVMPay, TokenMint, GameEconomy } from '@svm-pay/sdk'

// Initialize game economy
const gameEconomy = new GameEconomy({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  treasuryWallet: process.env.GAME_TREASURY,
  gameTokenMint: process.env.GAME_TOKEN_MINT,
  baseExchangeRate: 100, // 1 USDC = 100 Game Tokens
  minimumPurchase: 5, // Minimum $5 USDC
  maximumPurchase: 1000, // Maximum $1000 USDC per transaction
  feePercentage: 2.5 // 2.5% platform fee
})

// Define exchange rate tiers for bulk purchases
const exchangeRateTiers = [
  { threshold: 0, rate: 100, bonus: 0 },      // Base rate
  { threshold: 50, rate: 105, bonus: 5 },     // $50+ gets 5% bonus
  { threshold: 100, rate: 110, bonus: 10 },   // $100+ gets 10% bonus
  { threshold: 250, rate: 115, bonus: 15 },   // $250+ gets 15% bonus
  { threshold: 500, rate: 120, bonus: 20 }    // $500+ gets 20% bonus
]

// Get effective exchange rate based on purchase amount
function getExchangeRate(usdcAmount) {
  const tier = exchangeRateTiers
    .reverse()
    .find(tier => usdcAmount >= tier.threshold)
    
  return tier ? tier.rate : exchangeRateTiers[0].rate
}`,
          language: "JavaScript",
          notes: [
            "Set reasonable minimum and maximum purchase limits",
            "Implement tiered exchange rates to encourage larger purchases",
            "Configure platform fees transparently",
            "Use environment variables for network-specific configurations"
          ]
        },
        {
          title: "Implement Currency Exchange Function",
          description: "Create the core function that handles the exchange from USDC to game tokens.",
          code: `async function exchangeToGameCurrency(player, usdcAmount) {
  try {
    // Validate purchase amount
    if (usdcAmount < gameEconomy.minimumPurchase) {
      throw new Error(\`Minimum purchase amount is $\${gameEconomy.minimumPurchase} USDC\`)
    }
    
    if (usdcAmount > gameEconomy.maximumPurchase) {
      throw new Error(\`Maximum purchase amount is $\${gameEconomy.maximumPurchase} USDC\`)
    }

    // Calculate exchange rate and bonus tokens
    const exchangeRate = getExchangeRate(usdcAmount)
    const baseTokens = usdcAmount * gameEconomy.baseExchangeRate
    const bonusTokens = usdcAmount * (exchangeRate - gameEconomy.baseExchangeRate)
    const totalTokens = baseTokens + bonusTokens

    // Calculate platform fee
    const platformFee = usdcAmount * (gameEconomy.feePercentage / 100)
    const netAmount = usdcAmount - platformFee

    console.log(\`Exchange: $\${usdcAmount} USDC -> \${totalTokens} Game Tokens (Rate: \${exchangeRate})\`)

    // Create payment transaction
    const payment = SVMPay.createPayment({
      recipient: gameEconomy.treasuryWallet,
      amount: usdcAmount,
      token: 'USDC',
      metadata: {
        playerId: player.id,
        playerWallet: player.wallet,
        exchangeRate,
        baseTokens,
        bonusTokens,
        totalTokens,
        platformFee,
        transactionType: 'CURRENCY_EXCHANGE',
        timestamp: new Date().toISOString()
      }
    })

    // Set up success handler
    payment.onSuccess(async (result) => {
      await processCurrencyExchange(player, {
        usdcAmount,
        totalTokens,
        baseTokens,
        bonusTokens,
        exchangeRate,
        transactionId: result.transactionId,
        platformFee
      })
    })

    // Set up failure handler
    payment.onFailure(async (error) => {
      await logFailedExchange(player.id, usdcAmount, error)
      throw new Error(\`Currency exchange failed: \${error.message}\`)
    })

    return payment.execute()

  } catch (error) {
    console.error('Currency exchange error:', error)
    throw error
  }
}`,
          language: "JavaScript",
          notes: [
            "Always validate purchase amounts before processing",
            "Calculate bonus tokens for promotional offers",
            "Include comprehensive metadata for transaction tracking",
            "Implement proper error handling for failed exchanges"
          ]
        },
        {
          title: "Mint Game Tokens to Player",
          description: "Implement the token minting process to add game currency to player wallets.",
          code: `async function processCurrencyExchange(player, exchangeData) {
  const { 
    totalTokens, 
    baseTokens, 
    bonusTokens, 
    transactionId, 
    exchangeRate 
  } = exchangeData

  try {
    // 1. Mint game tokens to player's wallet
    const mintResult = await TokenMint.mintToPlayer({
      playerWallet: player.wallet,
      amount: totalTokens,
      tokenMint: gameEconomy.gameTokenMint,
      authority: gameEconomy.mintAuthority,
      metadata: {
        source: 'CURRENCY_EXCHANGE',
        transactionId,
        baseTokens,
        bonusTokens
      }
    })

    console.log(\`Minted \${totalTokens} tokens to player \${player.id}\`)

    // 2. Update player balance in game database
    const updatedBalance = await updatePlayerBalance(player.id, {
      tokensAdded: totalTokens,
      balanceChange: totalTokens,
      transactionId,
      mintTransactionId: mintResult.signature
    })

    // 3. Log transaction for audit trail
    await logCurrencyExchange({
      playerId: player.id,
      playerWallet: player.wallet,
      usdcAmount: exchangeData.usdcAmount,
      tokensReceived: totalTokens,
      baseTokens,
      bonusTokens,
      exchangeRate,
      platformFee: exchangeData.platformFee,
      paymentTransactionId: transactionId,
      mintTransactionId: mintResult.signature,
      timestamp: new Date().toISOString(),
      playerBalanceAfter: updatedBalance.newBalance
    })

    // 4. Send confirmation notification to player
    await sendExchangeConfirmation(player, {
      usdcSpent: exchangeData.usdcAmount,
      tokensReceived: totalTokens,
      bonusTokens,
      newBalance: updatedBalance.newBalance,
      transactionId
    })

    // 5. Update game statistics
    await updateGameStats({
      totalUSDCReceived: exchangeData.usdcAmount,
      totalTokensMinted: totalTokens,
      activePlayersCount: 1,
      averageTransactionSize: exchangeData.usdcAmount
    })

    return {
      success: true,
      tokensReceived: totalTokens,
      newBalance: updatedBalance.newBalance,
      transactionId,
      mintTransactionId: mintResult.signature
    }

  } catch (error) {
    console.error('Token minting failed:', error)
    
    // If minting fails, we should refund the player
    await handleMintingFailure(player, exchangeData, error)
    throw new Error(\`Failed to mint tokens: \${error.message}\`)
  }
}

async function updatePlayerBalance(playerId, balanceUpdate) {
  // Update player balance in your game database
  const player = await database.players.findById(playerId)
  const newBalance = player.gameTokenBalance + balanceUpdate.tokensAdded

  await database.players.update(playerId, {
    gameTokenBalance: newBalance,
    lastPurchaseDate: new Date(),
    totalPurchaseAmount: player.totalPurchaseAmount + balanceUpdate.tokensAdded,
    transactionHistory: [
      ...player.transactionHistory,
      {
        type: 'CURRENCY_EXCHANGE',
        amount: balanceUpdate.tokensAdded,
        transactionId: balanceUpdate.transactionId,
        timestamp: new Date()
      }
    ]
  })

  return { newBalance, previousBalance: player.gameTokenBalance }
}`,
          language: "JavaScript",
          notes: [
            "Always mint tokens on-chain for transparency",
            "Update both on-chain and off-chain player balances",
            "Maintain detailed audit logs for all transactions",
            "Send confirmation notifications to enhance user experience",
            "Implement refund logic for failed minting operations"
          ]
        },
        {
          title: "Handle Exchange Rate Updates",
          description: "Implement dynamic exchange rate management based on game economy conditions.",
          code: `// Dynamic exchange rate management
class ExchangeRateManager {
  constructor(gameEconomy) {
    this.gameEconomy = gameEconomy
    this.rateHistory = []
    this.lastUpdate = Date.now()
    this.updateInterval = 60 * 60 * 1000 // Update every hour
  }

  async updateExchangeRates() {
    try {
      // Get current game economy metrics
      const metrics = await this.getEconomyMetrics()
      
      // Calculate new base rate based on economy health
      const newBaseRate = this.calculateOptimalRate(metrics)
      
      // Apply rate change gradually to avoid shocks
      const maxChangePercent = 5 // Maximum 5% change per update
      const currentRate = this.gameEconomy.baseExchangeRate
      const maxChange = currentRate * (maxChangePercent / 100)
      
      const proposedChange = newBaseRate - currentRate
      const actualChange = Math.sign(proposedChange) * Math.min(Math.abs(proposedChange), maxChange)
      const finalRate = currentRate + actualChange

      // Update exchange rate
      await this.setExchangeRate(finalRate, metrics)
      
      console.log(\`Exchange rate updated: \${currentRate} -> \${finalRate}\`)
      
    } catch (error) {
      console.error('Failed to update exchange rates:', error)
    }
  }

  async getEconomyMetrics() {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000)
    
    return {
      tokenSupply: await this.getTotalTokenSupply(),
      activeUsers: await this.getActiveUsersCount(last24Hours),
      tokenVelocity: await this.getTokenVelocity(last24Hours),
      inflationRate: await this.getInflationRate(),
      userRetention: await this.getUserRetentionRate(),
      averageSessionValue: await this.getAverageSessionValue(last24Hours)
    }
  }

  calculateOptimalRate(metrics) {
    // Base rate calculation based on multiple factors
    let optimalRate = this.gameEconomy.baseExchangeRate

    // Adjust for token supply (more tokens = lower rate)
    const supplyFactor = 1 - (metrics.tokenSupply / 10000000) * 0.1 // Max 10% reduction
    optimalRate *= Math.max(supplyFactor, 0.8) // Min 80% of base rate

    // Adjust for user activity (more users = higher rate)
    const activityFactor = 1 + (metrics.activeUsers / 1000) * 0.05 // Max 5% increase
    optimalRate *= Math.min(activityFactor, 1.2) // Max 120% of base rate

    // Adjust for token velocity (higher velocity = higher rate)
    const velocityFactor = 1 + (metrics.tokenVelocity - 1) * 0.03
    optimalRate *= Math.max(Math.min(velocityFactor, 1.15), 0.9)

    return Math.round(optimalRate)
  }

  async setExchangeRate(newRate, metrics) {
    // Update in game economy config
    this.gameEconomy.baseExchangeRate = newRate
    
    // Save to database
    await database.gameSettings.update({
      baseExchangeRate: newRate,
      lastRateUpdate: new Date(),
      economyMetrics: metrics
    })

    // Add to rate history
    this.rateHistory.push({
      rate: newRate,
      timestamp: new Date(),
      metrics: metrics
    })

    // Keep only last 30 days of history
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    this.rateHistory = this.rateHistory.filter(entry => 
      new Date(entry.timestamp).getTime() > thirtyDaysAgo
    )

    // Notify administrators of rate change
    await this.notifyRateChange(newRate, metrics)
  }
}

// Initialize and start rate management
const rateManager = new ExchangeRateManager(gameEconomy)

// Update rates periodically
setInterval(() => {
  rateManager.updateExchangeRates()
}, rateManager.updateInterval)`,
          language: "JavaScript",
          notes: [
            "Implement gradual rate changes to prevent economic shocks",
            "Consider multiple economic factors when calculating rates",
            "Maintain historical data for analysis and debugging",
            "Set reasonable bounds on rate changes to maintain stability",
            "Notify administrators of significant rate changes"
          ]
        },
        {
          title: "Create Exchange Dashboard",
          description: "Build an admin dashboard to monitor currency exchange metrics and trends.",
          code: `import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Users, Coins } from 'lucide-react'

export function CurrencyExchangeDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [exchangeHistory, setExchangeHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [metricsData, historyData] = await Promise.all([
        fetch('/api/game/economy-metrics').then(r => r.json()),
        fetch('/api/game/exchange-history').then(r => r.json())
      ])
      
      setMetrics(metricsData)
      setExchangeHistory(historyData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading exchange dashboard...</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Currency Exchange Dashboard
      </h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue (24h)</p>
              <p className="text-2xl font-bold text-gray-900">
                \${metrics.dailyRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.revenueChange > 0 ? '+' : ''}{metrics.revenueChange.toFixed(1)}% from yesterday
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tokens Sold (24h)</p>
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.tokensSold / 1000).toFixed(1)}K
              </p>
            </div>
            <Coins className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.tokensChange > 0 ? '+' : ''}{metrics.tokensChange.toFixed(1)}% from yesterday
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Buyers</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.activeBuyers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.buyersChange > 0 ? '+' : ''}{metrics.buyersChange.toFixed(1)}% from yesterday
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Exchange Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.currentExchangeRate}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tokens per USDC
          </p>
        </div>
      </div>

      {/* Exchange Rate Chart */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Exchange Rate History (7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={exchangeHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value) => [\`\${value} tokens/USDC\`, 'Exchange Rate']}
            />
            <Line 
              type="monotone" 
              dataKey="exchangeRate" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Exchanges</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  USDC Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tokens Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.recentExchanges.map((exchange) => (
                <tr key={exchange.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exchange.playerName || exchange.playerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    \${exchange.usdcAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exchange.tokensReceived.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exchange.exchangeRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exchange.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}`,
          language: "React Component",
          notes: [
            "Display key performance indicators prominently",
            "Include historical trends for better decision making",
            "Show real-time updates to monitor system health",
            "Provide detailed transaction history for audit purposes",
            "Use charts to visualize exchange rate trends over time"
          ]
        }
      ]}
      conclusion="You've successfully built a comprehensive in-game currency exchange system! Players can now seamlessly convert real cryptocurrency into game tokens with dynamic exchange rates, bonus tiers, and comprehensive tracking. The system includes proper audit trails and administrative oversight."
      nextSteps={[
        "Implement player-to-player token trading",
        "Add seasonal exchange rate promotions",
        "Create token burning mechanisms for item purchases",
        "Set up automated economy rebalancing",
        "Implement VIP tiers with better exchange rates",
        "Add analytics for player spending patterns"
      ]}
      relatedTutorials={[
        { title: "NFT Marketplace for Game Items", path: "/docs/tutorials/gaming/nft-marketplace" },
        { title: "Tournament Prize Distribution", path: "/docs/tutorials/gaming/tournament-prizes" },
        { title: "Play-to-Earn Rewards", path: "/docs/tutorials/gaming/play-to-earn" }
      ]}
    />
  )
}

export function NFTMarketplaceTutorial() {
  return (
    <TutorialLayout
      title="NFT Marketplace for Game Items"
      description="Build a marketplace for trading game items as NFTs with royalty distribution"
      level="Advanced"
      time="2 hours"
      category="Gaming & NFT Tutorials"
      categoryPath="/docs/tutorials/gaming"
      overview="Create a sophisticated NFT marketplace specifically for game items where players can trade, sell, and auction their in-game assets. This tutorial covers NFT minting, marketplace operations, royalty management, and automated asset transfers."
      prerequisites={[
        "Understanding of NFTs and Solana's token standard",
        "Experience with Metaplex SDK",
        "Knowledge of marketplace mechanics",
        "Smart contract development basics"
      ]}
      steps={[
        {
          title: "Initialize NFT Marketplace",
          description: "Set up the marketplace infrastructure with NFT standards and royalty management.",
          code: `import { NFTMarketplace, RoyaltyManager, MetaplexSDK } from '@svm-pay/sdk'
import { Connection, PublicKey } from '@solana/web3.js'

// Initialize marketplace with game-specific configuration
const marketplace = new NFTMarketplace({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  marketplaceAuthority: new PublicKey(process.env.MARKETPLACE_AUTHORITY),
  gameId: process.env.GAME_ID,
  royaltySettings: {
    gameDevRoyalty: 5, // 5% to game developer
    platformFee: 2.5,  // 2.5% to marketplace platform
    maxCreatorRoyalty: 10 // Maximum 10% to item creator
  },
  listingSettings: {
    minimumPrice: 1, // Minimum 1 USDC
    maximumDuration: 30 * 24 * 60 * 60, // 30 days max listing
    allowAuctions: true,
    allowDirectSales: true
  }
})

// Configure supported game item types
const gameItemTypes = {
  WEAPON: {
    category: 'weapon',
    subcategories: ['sword', 'bow', 'staff', 'axe'],
    rarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    tradeable: true,
    maxSupply: 1000
  },
  ARMOR: {
    category: 'armor',
    subcategories: ['helmet', 'chest', 'legs', 'boots'],
    rarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    tradeable: true,
    maxSupply: 1000
  },
  COSMETIC: {
    category: 'cosmetic',
    subcategories: ['skin', 'emote', 'mount'],
    rarities: ['rare', 'epic', 'legendary', 'mythic'],
    tradeable: true,
    maxSupply: 500
  },
  CONSUMABLE: {
    category: 'consumable',
    subcategories: ['potion', 'scroll', 'food'],
    rarities: ['common', 'uncommon', 'rare'],
    tradeable: false, // Consumables are not tradeable
    maxSupply: null
  }
}`,
          language: "JavaScript",
          notes: [
            "Configure royalty percentages to benefit all stakeholders",
            "Set reasonable minimum prices to prevent spam listings",
            "Define clear item categories for better organization",
            "Consider which item types should be tradeable"
          ]
        }
      ]}
      conclusion="You've created a comprehensive NFT marketplace for game items! Players can now trade their valuable in-game assets as NFTs with proper royalty distribution and secure transfer mechanisms."
      nextSteps={[
        "Implement auction system with automatic bidding",
        "Add bulk listing and transfer features",
        "Create item authentication and verification",
        "Set up cross-game item compatibility",
        "Implement item rental system",
        "Add marketplace analytics and trends"
      ]}
      relatedTutorials={[
        { title: "In-Game Currency Exchange", path: "/docs/tutorials/gaming/currency-exchange" },
        { title: "Tournament Prize Distribution", path: "/docs/tutorials/gaming/tournament-prizes" },
        { title: "Game Asset Rental System", path: "/docs/tutorials/gaming/asset-rental" }
      ]}
    />
  )
}
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

export function TournamentPrizeDistributionTutorial() {
  return (
    <TutorialLayout
      title="Tournament Prize Distribution"
      description="Automate esports tournament prize distribution with smart contracts and instant payouts"
      level="Advanced"
      time="2 hours"
      category="Gaming & NFT Tutorials"
      categoryPath="/docs/tutorials/gaming"
      overview="Build an automated tournament system that handles registration, bracket management, and prize distribution. This tutorial covers multi-tier prize pools, automatic payouts based on tournament results, and transparent prize distribution."
      prerequisites={[
        "Understanding of tournament structures",
        "Experience with smart contracts",
        "Knowledge of bracket systems",
        "Multi-signature wallet concepts"
      ]}
      steps={[
        {
          title: "Set Up Tournament Manager",
          description: "Initialize the tournament system with prize pool management.",
          code: `import { TournamentManager, PrizePool, MultisigWallet } from '@svm-pay/sdk'

const tournamentManager = new TournamentManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  organizerWallet: process.env.TOURNAMENT_ORGANIZER,
  escrowWallet: process.env.TOURNAMENT_ESCROW,
  platformFee: 5, // 5% platform fee
  minimumPrizePool: 100, // Minimum $100 USDC prize pool
  maxParticipants: 128
})

// Create tournament with prize distribution
async function createTournament(tournamentConfig) {
  const tournament = await tournamentManager.create({
    name: tournamentConfig.name,
    game: tournamentConfig.game,
    format: tournamentConfig.format, // 'single-elimination', 'double-elimination', 'round-robin'
    maxParticipants: tournamentConfig.maxParticipants,
    entryFee: tournamentConfig.entryFee,
    startTime: tournamentConfig.startTime,
    registrationDeadline: tournamentConfig.registrationDeadline,
    prizeDistribution: {
      first: 50,  // 50% to winner
      second: 30, // 30% to runner-up
      third: 15,  // 15% to third place
      fourth: 5   // 5% to fourth place
    }
  })

  return tournament
}`,
          language: "JavaScript",
          notes: [
            "Set clear prize distribution percentages upfront",
            "Use escrow wallets to hold prize pools securely",
            "Implement reasonable platform fees for sustainability",
            "Set participant limits based on tournament format"
          ]
        },
        {
          title: "Handle Tournament Registration and Prize Pool",
          description: "Manage player registration and build the prize pool from entry fees.",
          code: `async function registerPlayer(tournamentId, playerData) {
  const tournament = await tournamentManager.getTournament(tournamentId)
  
  if (!tournament) {
    throw new Error('Tournament not found')
  }

  if (tournament.participants.length >= tournament.maxParticipants) {
    throw new Error('Tournament is full')
  }

  if (new Date() > tournament.registrationDeadline) {
    throw new Error('Registration deadline has passed')
  }

  try {
    // Create entry fee payment
    const entryPayment = SVMPay.createPayment({
      recipient: tournament.escrowWallet,
      amount: tournament.entryFee,
      token: 'USDC',
      metadata: {
        tournamentId: tournamentId,
        playerId: playerData.id,
        playerName: playerData.name,
        registrationTime: new Date().toISOString()
      }
    })

    // Process entry fee payment
    const paymentResult = await entryPayment.execute()

    if (paymentResult.status === 'SUCCESS') {
      // Add player to tournament
      await tournament.addParticipant({
        id: playerData.id,
        name: playerData.name,
        wallet: playerData.wallet,
        registrationTime: new Date(),
        entryPaymentId: paymentResult.id
      })

      // Update prize pool
      const platformFee = tournament.entryFee * (tournamentManager.platformFee / 100)
      const prizeContribution = tournament.entryFee - platformFee
      
      await tournament.updatePrizePool(prizeContribution)

      // Send confirmation
      await sendRegistrationConfirmation(playerData, tournament)

      return {
        success: true,
        participantNumber: tournament.participants.length,
        totalPrizePool: tournament.prizePool
      }
    }

  } catch (error) {
    console.error('Tournament registration failed:', error)
    throw new Error(\`Registration failed: \${error.message}\`)
  }
}`,
          language: "JavaScript",
          notes: [
            "Validate tournament capacity and deadlines before registration",
            "Deduct platform fees transparently from entry fees",
            "Update prize pool in real-time for transparency",
            "Send immediate confirmations to registered players"
          ]
        },
        {
          title: "Automate Prize Distribution",
          description: "Distribute prizes automatically based on tournament results.",
          code: `async function distributePrizes(tournamentId, results) {
  const tournament = await tournamentManager.getTournament(tournamentId)
  
  if (tournament.status !== 'COMPLETED') {
    throw new Error('Tournament must be completed before prize distribution')
  }

  try {
    const totalPrizePool = tournament.prizePool
    const prizeDistribution = tournament.prizeDistribution

    // Calculate prize amounts
    const prizes = {
      first: totalPrizePool * (prizeDistribution.first / 100),
      second: totalPrizePool * (prizeDistribution.second / 100),
      third: totalPrizePool * (prizeDistribution.third / 100),
      fourth: totalPrizePool * (prizeDistribution.fourth / 100)
    }

    // Create prize distribution transactions
    const prizePayments = []

    // First place
    if (results.first) {
      prizePayments.push(createPrizePayment(results.first, prizes.first, 'Champion'))
    }

    // Second place
    if (results.second) {
      prizePayments.push(createPrizePayment(results.second, prizes.second, 'Runner-up'))
    }

    // Third place
    if (results.third) {
      prizePayments.push(createPrizePayment(results.third, prizes.third, 'Third Place'))
    }

    // Fourth place
    if (results.fourth) {
      prizePayments.push(createPrizePayment(results.fourth, prizes.fourth, 'Fourth Place'))
    }

    // Execute all prize payments
    const paymentResults = await Promise.all(prizePayments)

    // Update tournament with distribution results
    await tournament.updatePrizeDistribution({
      distributedAt: new Date(),
      payments: paymentResults,
      totalDistributed: Object.values(prizes).reduce((sum, prize) => sum + prize, 0)
    })

    // Send notifications to winners
    await notifyWinners(results, prizes, paymentResults)

    // Create public results announcement
    await publishResults(tournament, results, prizes)

    return {
      success: true,
      prizesDistributed: paymentResults.length,
      totalAmount: Object.values(prizes).reduce((sum, prize) => sum + prize, 0)
    }

  } catch (error) {
    console.error('Prize distribution failed:', error)
    throw new Error(\`Failed to distribute prizes: \${error.message}\`)
  }
}

async function createPrizePayment(player, amount, placement) {
  const payment = SVMPay.createPayment({
    recipient: player.wallet,
    amount: amount,
    token: 'USDC',
    metadata: {
      tournamentId: tournament.id,
      playerId: player.id,
      placement: placement,
      prizeAmount: amount,
      distributionTime: new Date().toISOString()
    }
  })

  const result = await payment.execute()
  
  return {
    playerId: player.id,
    playerName: player.name,
    placement: placement,
    amount: amount,
    transactionId: result.transactionId,
    status: result.status
  }
}`,
          language: "JavaScript",
          notes: [
            "Only distribute prizes after tournament completion verification",
            "Calculate prize amounts based on predefined percentages",
            "Execute all prize payments simultaneously for fairness",
            "Maintain transparent records of all prize distributions"
          ]
        }
      ]}
      conclusion="You've built a comprehensive tournament system with automated prize distribution! The system handles player registration, entry fee collection, prize pool management, and instant prize distribution based on tournament results. Winners receive their prizes automatically and transparently."
      nextSteps={[
        "Add bracket visualization and live updates",
        "Implement tournament streaming integration",
        "Create reputation system for players",
        "Add sponsorship integration for prize pools",
        "Implement anti-cheat verification systems",
        "Create tournament statistics and analytics"
      ]}
      relatedTutorials={[
        { title: "In-Game Currency Exchange", path: "/docs/tutorials/gaming/currency-exchange" },
        { title: "Play-to-Earn Rewards", path: "/docs/tutorials/gaming/play-to-earn" },
        { title: "NFT Marketplace for Games", path: "/docs/tutorials/gaming/nft-marketplace" }
      ]}
    />
  )
}

export function PlayToEarnRewardsTutorial() {
  return (
    <TutorialLayout
      title="Play-to-Earn Rewards"
      description="Build a play-to-earn system with achievement-based cryptocurrency rewards"
      level="Intermediate"
      time="1.5 hours"
      category="Gaming & NFT Tutorials"
      categoryPath="/docs/tutorials/gaming"
      overview="Create a play-to-earn gaming system that rewards players with cryptocurrency for achievements, playtime, and skill-based accomplishments. This tutorial covers reward calculation, achievement tracking, and automated payout systems."
      prerequisites={[
        "Understanding of game mechanics",
        "Knowledge of achievement systems",
        "Experience with reward algorithms",
        "Database management skills"
      ]}
      steps={[
        {
          title: "Set Up Play-to-Earn Framework",
          description: "Initialize the P2E system with reward pools and achievement tracking.",
          code: `import { PlayToEarnManager, AchievementTracker, RewardPool } from '@svm-pay/sdk'

const p2eManager = new PlayToEarnManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  rewardTokenMint: process.env.P2E_REWARD_TOKEN,
  treasuryWallet: process.env.P2E_TREASURY,
  dailyRewardPool: 1000, // 1000 tokens per day
  minimumPayout: 1, // Minimum 1 token to claim
  cooldownPeriod: 24 * 60 * 60 // 24 hours between claims
})

// Define achievement categories and rewards
const achievementSystem = {
  // Skill-based achievements
  skill: {
    firstKill: { reward: 5, repeatable: false },
    killStreak10: { reward: 25, repeatable: true },
    perfectGame: { reward: 100, repeatable: true },
    topPlayer: { reward: 200, repeatable: false }
  },
  
  // Time-based achievements
  playtime: {
    hour1: { reward: 2, repeatable: false },
    hour10: { reward: 20, repeatable: false },
    hour100: { reward: 200, repeatable: false },
    dailyLogin: { reward: 5, repeatable: true }
  },
  
  // Social achievements
  social: {
    inviteFriend: { reward: 50, repeatable: true },
    joinClan: { reward: 25, repeatable: false },
    helpNewbie: { reward: 10, repeatable: true }
  },
  
  // Competitive achievements
  competitive: {
    winMatch: { reward: 10, repeatable: true },
    rankUp: { reward: 100, repeatable: true },
    tournamentWin: { reward: 500, repeatable: true }
  }
}`,
          language: "JavaScript",
          notes: [
            "Balance reward amounts to maintain token value",
            "Set reasonable cooldown periods to prevent farming",
            "Create diverse achievement categories to engage different player types",
            "Implement both repeatable and one-time achievements"
          ]
        },
        {
          title: "Track Player Achievements",
          description: "Implement real-time achievement tracking and reward calculation.",
          code: `class PlayerAchievementTracker {
  constructor(playerId) {
    this.playerId = playerId
    this.pendingRewards = 0
    this.totalEarned = 0
    this.lastClaim = null
  }

  async trackAchievement(category, achievement, gameData = {}) {
    try {
      const achievementConfig = achievementSystem[category]?.[achievement]
      if (!achievementConfig) {
        throw new Error('Achievement not found')
      }

      // Check if achievement is repeatable
      if (!achievementConfig.repeatable) {
        const hasAchievement = await this.hasCompletedAchievement(category, achievement)
        if (hasAchievement) {
          return { success: false, reason: 'Achievement already completed' }
        }
      }

      // Validate achievement criteria
      const isValid = await this.validateAchievement(category, achievement, gameData)
      if (!isValid) {
        return { success: false, reason: 'Achievement criteria not met' }
      }

      // Calculate reward amount
      let rewardAmount = achievementConfig.reward

      // Apply multipliers based on game state
      if (gameData.difficulty === 'hard') {
        rewardAmount *= 1.5
      }
      if (gameData.isRanked) {
        rewardAmount *= 1.2
      }

      // Add to pending rewards
      this.pendingRewards += rewardAmount

      // Log achievement
      await this.logAchievement({
        category,
        achievement,
        rewardAmount,
        gameData,
        timestamp: new Date()
      })

      // Send achievement notification
      await this.sendAchievementNotification(category, achievement, rewardAmount)

      return {
        success: true,
        achievement: \`\${category}.\${achievement}\`,
        rewardAmount,
        totalPending: this.pendingRewards
      }

    } catch (error) {
      console.error('Achievement tracking failed:', error)
      return { success: false, reason: error.message }
    }
  }

  async validateAchievement(category, achievement, gameData) {
    switch (\`\${category}.\${achievement}\`) {
      case 'skill.firstKill':
        return gameData.kills >= 1
      
      case 'skill.killStreak10':
        return gameData.killStreak >= 10
      
      case 'skill.perfectGame':
        return gameData.deaths === 0 && gameData.kills >= 5
      
      case 'playtime.hour1':
        const totalPlaytime = await this.getTotalPlaytime()
        return totalPlaytime >= 60 * 60 * 1000 // 1 hour in milliseconds
      
      case 'competitive.winMatch':
        return gameData.matchResult === 'win'
      
      case 'competitive.rankUp':
        return gameData.rankChanged && gameData.newRank > gameData.oldRank
      
      default:
        return false
    }
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement server-side validation to prevent cheating",
            "Apply multipliers for difficulty and game modes",
            "Log all achievements for audit and analytics",
            "Send immediate feedback to keep players engaged"
          ]
        },
        {
          title: "Handle Reward Claims and Payouts",
          description: "Process reward claims with anti-farming measures and automated payouts.",
          code: `async function claimRewards(playerId) {
  const player = await getPlayerData(playerId)
  const tracker = new PlayerAchievementTracker(playerId)

  try {
    // Check cooldown period
    if (tracker.lastClaim) {
      const timeSinceLastClaim = Date.now() - tracker.lastClaim.getTime()
      if (timeSinceLastClaim < p2eManager.cooldownPeriod * 1000) {
        const remainingTime = p2eManager.cooldownPeriod * 1000 - timeSinceLastClaim
        throw new Error(\`Claim cooldown active. \${Math.ceil(remainingTime / 1000 / 60)} minutes remaining\`)
      }
    }

    // Check minimum payout threshold
    if (tracker.pendingRewards < p2eManager.minimumPayout) {
      throw new Error(\`Minimum payout is \${p2eManager.minimumPayout} tokens\`)
    }

    // Check daily reward pool availability
    const dailyPoolUsed = await getDailyPoolUsage()
    if (dailyPoolUsed >= p2eManager.dailyRewardPool) {
      throw new Error('Daily reward pool exhausted. Try again tomorrow.')
    }

    // Calculate final payout amount
    const availablePool = p2eManager.dailyRewardPool - dailyPoolUsed
    const payoutAmount = Math.min(tracker.pendingRewards, availablePool)

    // Create payout transaction
    const payout = SVMPay.createPayment({
      recipient: player.wallet,
      amount: payoutAmount,
      token: 'REWARD_TOKEN',
      metadata: {
        playerId: playerId,
        payoutType: 'p2e-rewards',
        achievementsCount: await getPlayerAchievementCount(playerId),
        claimDate: new Date().toISOString()
      }
    })

    // Execute payout
    const result = await payout.execute()

    if (result.status === 'SUCCESS') {
      // Update player records
      await updatePlayerRewards({
        playerId: playerId,
        pendingRewards: tracker.pendingRewards - payoutAmount,
        totalEarned: tracker.totalEarned + payoutAmount,
        lastClaim: new Date(),
        lastClaimAmount: payoutAmount,
        lastTransactionId: result.transactionId
      })

      // Update daily pool usage
      await updateDailyPoolUsage(payoutAmount)

      // Send claim confirmation
      await sendClaimConfirmation(player, payoutAmount, result.transactionId)

      // Update leaderboards
      await updateEarningsLeaderboard(playerId, payoutAmount)

      return {
        success: true,
        amountClaimed: payoutAmount,
        transactionId: result.transactionId,
        newTotalEarned: tracker.totalEarned + payoutAmount,
        remainingPending: tracker.pendingRewards - payoutAmount
      }
    }

  } catch (error) {
    console.error('Reward claim failed:', error)
    throw new Error(\`Claim failed: \${error.message}\`)
  }
}

// Background job to reset daily limits
async function resetDailyLimits() {
  const now = new Date()
  const lastReset = await getLastResetTime()
  
  if (!lastReset || now.getDate() !== lastReset.getDate()) {
    await database.query('UPDATE daily_pool_usage SET amount_used = 0')
    await database.query('UPDATE daily_limits SET last_reset = ?', [now])
    console.log('Daily limits reset successfully')
  }
}

// Run reset check every hour
setInterval(resetDailyLimits, 60 * 60 * 1000)`,
          language: "JavaScript",
          notes: [
            "Implement cooldown periods to prevent farming abuse",
            "Set daily reward pool limits to control token inflation",
            "Use minimum payout thresholds to reduce transaction costs",
            "Automatically reset daily limits to maintain game economy"
          ]
        }
      ]}
      conclusion="You've created a comprehensive play-to-earn system that rewards players for skill, time, and engagement! The system tracks achievements in real-time, calculates fair rewards, and handles automated payouts with anti-farming measures. Players are incentivized to improve their skills and stay engaged with meaningful cryptocurrency rewards."
      nextSteps={[
        "Add seasonal events with bonus rewards",
        "Implement guild-based achievements and rewards",
        "Create staking mechanisms for earned tokens",
        "Add NFT rewards for major achievements",
        "Implement dynamic reward pools based on game popularity",
        "Create marketplace for spending earned tokens"
      ]}
      relatedTutorials={[
        { title: "In-Game Currency Exchange", path: "/docs/tutorials/gaming/currency-exchange" },
        { title: "Tournament Prize Distribution", path: "/docs/tutorials/gaming/tournament-prizes" },
        { title: "NFT Game Asset Rental", path: "/docs/tutorials/gaming/asset-rental" }
      ]}
    />
  )
}

export function GameAssetRentalTutorial() {
  return (
    <TutorialLayout
      title="Game Asset Rental System"
      description="Build an NFT rental marketplace for game assets with automated revenue sharing"
      level="Advanced"
      time="2.5 hours"
      category="Gaming & NFT Tutorials"
      categoryPath="/docs/tutorials/gaming"
      overview="Create a rental system for game NFTs where owners can rent out their valuable assets to other players. This tutorial covers rental agreements, escrow systems, automated revenue sharing, and asset usage tracking."
      prerequisites={[
        "Understanding of NFTs and metadata",
        "Experience with smart contracts",
        "Knowledge of rental economics",
        "Escrow and custody concepts"
      ]}
      steps={[
        {
          title: "Set Up NFT Rental Infrastructure",
          description: "Initialize the rental system with asset management and escrow.",
          code: `import { NFTRentalManager, EscrowManager, AssetCustody } from '@svm-pay/sdk'

const rentalManager = new NFTRentalManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  custodyProgram: process.env.CUSTODY_PROGRAM_ID,
  escrowWallet: process.env.RENTAL_ESCROW,
  platformFee: 10, // 10% platform fee on rental income
  minimumRentalPeriod: 24 * 60 * 60, // 24 hours minimum
  maximumRentalPeriod: 30 * 24 * 60 * 60, // 30 days maximum
  defaultInsurance: 110 // 110% insurance coverage
})

// Define rental asset categories and pricing
const assetCategories = {
  weapons: {
    common: { basePrice: 5, multiplier: 1.0 },
    rare: { basePrice: 15, multiplier: 1.5 },
    epic: { basePrice: 30, multiplier: 2.0 },
    legendary: { basePrice: 100, multiplier: 3.0 }
  },
  armor: {
    common: { basePrice: 3, multiplier: 1.0 },
    rare: { basePrice: 10, multiplier: 1.3 },
    epic: { basePrice: 25, multiplier: 1.8 },
    legendary: { basePrice: 80, multiplier: 2.5 }
  },
  vehicles: {
    common: { basePrice: 20, multiplier: 1.2 },
    rare: { basePrice: 50, multiplier: 1.8 },
    epic: { basePrice: 120, multiplier: 2.5 },
    legendary: { basePrice: 300, multiplier: 4.0 }
  },
  land: {
    common: { basePrice: 10, multiplier: 1.0 },
    rare: { basePrice: 50, multiplier: 2.0 },
    epic: { basePrice: 200, multiplier: 4.0 },
    legendary: { basePrice: 1000, multiplier: 8.0 }
  }
}`,
          language: "JavaScript",
          notes: [
            "Set reasonable rental periods to balance owner and renter needs",
            "Implement tiered pricing based on asset rarity and utility",
            "Use insurance coverage to protect against asset loss",
            "Configure platform fees to sustain the rental marketplace"
          ]
        },
        {
          title: "Create Asset Rental Listings",
          description: "Allow asset owners to list their NFTs for rental with custom terms.",
          code: `async function createRentalListing(ownerData, assetData, rentalTerms) {
  try {
    // Validate asset ownership
    const ownership = await validateAssetOwnership(ownerData.wallet, assetData.mintAddress)
    if (!ownership.isOwner) {
      throw new Error('Asset ownership verification failed')
    }

    // Get asset metadata and calculate pricing
    const assetMetadata = await getAssetMetadata(assetData.mintAddress)
    const suggestedPricing = calculateSuggestedPricing(assetMetadata)

    // Create custody escrow for the asset
    const custodyEscrow = await AssetCustody.create({
      assetMint: assetData.mintAddress,
      owner: ownerData.wallet,
      custodyProgram: rentalManager.custodyProgram,
      insuranceAmount: rentalTerms.insuranceAmount || suggestedPricing.insurance
    })

    // Transfer asset to custody
    await custodyEscrow.depositAsset()

    // Create rental listing
    const listing = await rentalManager.createListing({
      assetMint: assetData.mintAddress,
      owner: ownerData.wallet,
      custodyEscrow: custodyEscrow.address,
      rentalTerms: {
        pricePerDay: rentalTerms.pricePerDay || suggestedPricing.dailyRate,
        minimumPeriod: rentalTerms.minimumPeriod || 24 * 60 * 60,
        maximumPeriod: rentalTerms.maximumPeriod || 7 * 24 * 60 * 60,
        insuranceRequired: rentalTerms.insuranceRequired || true,
        autoRenewal: rentalTerms.autoRenewal || false,
        restrictions: rentalTerms.restrictions || []
      },
      metadata: {
        assetName: assetMetadata.name,
        assetType: assetMetadata.type,
        rarity: assetMetadata.rarity,
        gameCompatibility: assetMetadata.games,
        description: rentalTerms.description,
        images: assetMetadata.images
      }
    })

    // Index listing for search
    await indexRentalListing(listing)

    // Notify interested renters
    await notifyInterestedRenters(listing)

    return {
      success: true,
      listingId: listing.id,
      custodyEscrow: custodyEscrow.address,
      suggestedPricing: suggestedPricing
    }

  } catch (error) {
    console.error('Rental listing creation failed:', error)
    throw new Error(\`Failed to create listing: \${error.message}\`)
  }
}

function calculateSuggestedPricing(assetMetadata) {
  const category = assetCategories[assetMetadata.type] || assetCategories.weapons
  const rarityPricing = category[assetMetadata.rarity] || category.common

  // Base daily rate calculation
  let dailyRate = rarityPricing.basePrice * rarityPricing.multiplier

  // Adjust for asset utility and demand
  if (assetMetadata.utility?.powerLevel) {
    dailyRate *= (1 + assetMetadata.utility.powerLevel / 100)
  }

  // Market demand adjustment
  const demandMultiplier = await getMarketDemandMultiplier(assetMetadata.type, assetMetadata.rarity)
  dailyRate *= demandMultiplier

  return {
    dailyRate: Math.ceil(dailyRate * 100) / 100, // Round to 2 decimals
    weeklyRate: Math.ceil(dailyRate * 6 * 100) / 100, // 1 day discount for weekly
    monthlyRate: Math.ceil(dailyRate * 25 * 100) / 100, // 5 days discount for monthly
    insurance: Math.ceil(dailyRate * 30 * 100) / 100 // 30 days worth as insurance
  }
}`,
          language: "JavaScript",
          notes: [
            "Always verify asset ownership before creating listings",
            "Use custody programs to secure assets during rental",
            "Implement dynamic pricing based on market demand",
            "Index listings for efficient search and discovery"
          ]
        },
        {
          title: "Handle Rental Agreements and Revenue Sharing",
          description: "Process rental requests and automate revenue distribution.",
          code: `async function processRentalRequest(listingId, renterData, rentalPeriod) {
  try {
    const listing = await rentalManager.getListing(listingId)
    if (!listing || listing.status !== 'active') {
      throw new Error('Listing not available')
    }

    // Validate rental period
    if (rentalPeriod < listing.rentalTerms.minimumPeriod || 
        rentalPeriod > listing.rentalTerms.maximumPeriod) {
      throw new Error('Invalid rental period')
    }

    // Calculate total cost
    const dailyRate = listing.rentalTerms.pricePerDay
    const totalDays = Math.ceil(rentalPeriod / (24 * 60 * 60))
    const rentalCost = dailyRate * totalDays
    const insuranceCost = listing.rentalTerms.insuranceRequired ? 
      listing.metadata.insuranceAmount : 0
    const totalCost = rentalCost + insuranceCost

    // Create rental escrow
    const rentalEscrow = await EscrowManager.create({
      renter: renterData.wallet,
      owner: listing.owner,
      amount: totalCost,
      token: 'USDC',
      releaseConditions: {
        autoReleaseAfter: rentalPeriod + (24 * 60 * 60), // 1 day grace period
        requiresConfirmation: false
      },
      metadata: {
        listingId: listingId,
        assetMint: listing.assetMint,
        rentalPeriod: rentalPeriod,
        rentalCost: rentalCost,
        insuranceCost: insuranceCost
      }
    })

    // Process rental payment
    const rentalPayment = SVMPay.createPayment({
      recipient: rentalEscrow.address,
      amount: totalCost,
      token: 'USDC',
      metadata: {
        listingId: listingId,
        renterId: renterData.id,
        rentalPeriod: rentalPeriod,
        paymentType: 'rental-agreement'
      }
    })

    const paymentResult = await rentalPayment.execute()

    if (paymentResult.status === 'SUCCESS') {
      // Transfer asset usage rights to renter
      await transferAssetUsageRights(listing.assetMint, renterData.wallet, rentalPeriod)

      // Create rental agreement
      const rentalAgreement = await createRentalAgreement({
        listingId: listingId,
        renter: renterData.wallet,
        owner: listing.owner,
        assetMint: listing.assetMint,
        startTime: new Date(),
        endTime: new Date(Date.now() + rentalPeriod * 1000),
        totalCost: totalCost,
        escrowAddress: rentalEscrow.address,
        paymentId: paymentResult.id
      })

      // Schedule automatic revenue distribution
      await scheduleRevenueDistribution(rentalAgreement)

      // Update listing status
      await rentalManager.updateListingStatus(listingId, 'rented')

      return {
        success: true,
        agreementId: rentalAgreement.id,
        endTime: rentalAgreement.endTime,
        totalCost: totalCost
      }
    }

  } catch (error) {
    console.error('Rental processing failed:', error)
    throw new Error(\`Rental failed: \${error.message}\`)
  }
}

async function scheduleRevenueDistribution(rentalAgreement) {
  // Schedule distribution for when rental ends
  const distributionTime = rentalAgreement.endTime

  setTimeout(async () => {
    await distributeRentalRevenue(rentalAgreement)
  }, distributionTime.getTime() - Date.now())
}

async function distributeRentalRevenue(rentalAgreement) {
  try {
    const rentalCost = rentalAgreement.rentalCost
    const platformFee = rentalCost * (rentalManager.platformFee / 100)
    const ownerRevenue = rentalCost - platformFee

    // Distribute to owner
    const ownerPayment = SVMPay.createPayment({
      recipient: rentalAgreement.owner,
      amount: ownerRevenue,
      token: 'USDC',
      metadata: {
        agreementId: rentalAgreement.id,
        paymentType: 'rental-revenue',
        period: \`\${rentalAgreement.startTime.toISOString()} to \${rentalAgreement.endTime.toISOString()}\`
      }
    })

    // Distribute platform fee
    const platformPayment = SVMPay.createPayment({
      recipient: process.env.PLATFORM_WALLET,
      amount: platformFee,
      token: 'USDC',
      metadata: {
        agreementId: rentalAgreement.id,
        paymentType: 'platform-fee'
      }
    })

    // Execute distributions
    await Promise.all([
      ownerPayment.execute(),
      platformPayment.execute()
    ])

    // Return insurance if no issues
    await returnInsuranceDeposit(rentalAgreement)

    // Log revenue distribution
    await logRevenueDistribution(rentalAgreement, ownerRevenue, platformFee)

  } catch (error) {
    console.error('Revenue distribution failed:', error)
    // Queue for manual processing
    await queueForManualDistribution(rentalAgreement)
  }
}`,
          language: "JavaScript",
          notes: [
            "Validate rental periods against listing requirements",
            "Use escrow systems to secure payments and insurance",
            "Schedule automatic revenue distribution for efficiency",
            "Implement proper error handling with manual fallbacks"
          ]
        }
      ]}
      conclusion="You've built a sophisticated NFT rental marketplace for game assets! The system enables asset owners to monetize their valuable NFTs while giving other players access to premium game items. With automated escrow, revenue sharing, and insurance coverage, the platform provides security and trust for all participants."
      nextSteps={[
        "Add reputation system for renters and owners",
        "Implement rental history and performance analytics",
        "Create insurance claim processing for lost/damaged assets",
        "Add bulk rental options for gaming guilds",
        "Implement cross-game asset compatibility",
        "Create mobile app for rental management"
      ]}
      relatedTutorials={[
        { title: "NFT Marketplace for Games", path: "/docs/tutorials/gaming/nft-marketplace" },
        { title: "In-Game Currency Exchange", path: "/docs/tutorials/gaming/currency-exchange" },
        { title: "Tournament Prize Distribution", path: "/docs/tutorials/gaming/tournament-prizes" }
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
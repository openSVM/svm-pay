import { motion } from 'framer-motion'

// Gaming & NFT Tutorials
export function GamingTutorials() {
  const tutorials = [
    {
      title: "In-Game Currency Exchange",
      description: "Convert real money to in-game tokens seamlessly",
      level: "Intermediate",
      time: "1 hour",
      code: `// In-game currency exchange
import { SVMPay, TokenMint, GameEconomy } from '@svm-pay/sdk'

const GameCurrencyExchange = ({ player, gameToken }) => {
  const exchangeToGameCurrency = async (usdcAmount) => {
    // Calculate exchange rate
    const exchangeRate = await GameEconomy.getExchangeRate('USDC', gameToken.symbol)
    const gameTokenAmount = usdcAmount * exchangeRate

    const payment = SVMPay.createPayment({
      recipient: process.env.GAME_TREASURY,
      amount: usdcAmount,
      token: 'USDC',
      metadata: {
        playerId: player.id,
        gameTokenAmount,
        exchangeRate
      }
    })

    payment.onSuccess(async (result) => {
      // Mint game tokens to player
      await TokenMint.mintToPlayer({
        playerWallet: player.wallet,
        amount: gameTokenAmount,
        tokenMint: gameToken.mint
      })

      // Update player balance in game database
      await GameEconomy.updatePlayerBalance(player.id, gameTokenAmount)
      
      // Log transaction for audit
      await GameEconomy.logTransaction({
        playerId: player.id,
        type: 'CURRENCY_EXCHANGE',
        usdcAmount,
        gameTokenAmount,
        transactionId: result.transactionId
      })
    })

    return payment.execute()
  }
}`
    },
    {
      title: "NFT Marketplace for Game Items",
      description: "Trade game items as NFTs with royalties",
      level: "Advanced",
      time: "2 hours",
      code: `// Game NFT marketplace
import { NFTMarketplace, RoyaltyManager, MetaplexSDK } from '@svm-pay/sdk'

const GameNFTMarketplace = ({ game, item, seller, buyer }) => {
  const listGameItem = async () => {
    const marketplace = new NFTMarketplace({
      gameId: game.id,
      royaltyRecipient: game.developerWallet,
      royaltyPercentage: 5 // 5% royalty to game developer
    })

    const listing = await marketplace.listItem({
      nftMint: item.nftMint,
      seller: seller.wallet,
      price: item.price,
      token: 'USDC',
      metadata: {
        itemType: item.type,
        rarity: item.rarity,
        stats: item.gameStats
      }
    })

    return listing
  }

  const purchaseGameItem = async (listingId) => {
    const purchase = await marketplace.purchase({
      listingId,
      buyer: buyer.wallet,
      onSuccess: async (result) => {
        // Transfer NFT ownership
        await MetaplexSDK.transferNFT({
          mint: item.nftMint,
          from: seller.wallet,
          to: buyer.wallet
        })

        // Update game database
        await game.database.updateItemOwnership({
          itemId: item.id,
          newOwner: buyer.id,
          transactionId: result.transactionId
        })

        // Distribute royalties
        await RoyaltyManager.distribute({
          totalAmount: item.price,
          royalties: [
            { recipient: game.developerWallet, percentage: 5 },
            { recipient: seller.wallet, percentage: 95 }
          ]
        })
      }
    })

    return purchase
  }
}`
    },
    {
      title: "Tournament Prize Distribution",
      description: "Automatic prize distribution for esports tournaments",
      level: "Advanced",
      time: "1.5 hours",
      code: `// Tournament prize distribution
import { SVMPay, TournamentManager, PrizePool } from '@svm-pay/sdk'

const TournamentPrizes = ({ tournament, results }) => {
  const distributePrizes = async () => {
    const prizePool = new PrizePool({
      totalAmount: tournament.prizePool,
      token: 'USDC',
      distribution: tournament.prizeDistribution
    })

    // Validate tournament results
    const validatedResults = await TournamentManager.validateResults({
      tournamentId: tournament.id,
      results,
      requiresSignatures: true
    })

    // Calculate prize amounts
    const prizeCalculations = prizePool.calculatePrizes(validatedResults)

    // Distribute prizes automatically
    for (const prize of prizeCalculations) {
      const payment = SVMPay.createPayment({
        recipient: prize.playerWallet,
        amount: prize.amount,
        token: 'USDC',
        metadata: {
          tournamentId: tournament.id,
          placement: prize.placement,
          playerId: prize.playerId
        }
      })

      await payment.execute()

      // Update tournament database
      await TournamentManager.recordPrizePayment({
        tournamentId: tournament.id,
        playerId: prize.playerId,
        amount: prize.amount,
        placement: prize.placement
      })
    }

    // Send prize notifications
    await TournamentManager.notifyWinners(prizeCalculations)
  }
}`
    },
    {
      title: "Play-to-Earn Rewards",
      description: "Daily and achievement-based reward distribution",
      level: "Intermediate",
      time: "1 hour",
      code: `// Play-to-earn reward system
import { SVMPay, RewardCalculator, AchievementSystem } from '@svm-pay/sdk'

const PlayToEarnRewards = ({ player, gameSession }) => {
  const calculateAndDistributeRewards = async () => {
    // Calculate base rewards from gameplay
    const baseRewards = RewardCalculator.calculate({
      sessionDuration: gameSession.duration,
      performance: gameSession.performance,
      difficulty: gameSession.difficulty
    })

    // Check for achievement bonuses
    const achievements = await AchievementSystem.checkAchievements({
      playerId: player.id,
      sessionData: gameSession
    })

    const achievementBonuses = achievements.reduce((total, achievement) => {
      return total + achievement.rewardAmount
    }, 0)

    const totalReward = baseRewards + achievementBonuses

    // Distribute rewards if above minimum threshold
    if (totalReward >= process.env.MIN_REWARD_THRESHOLD) {
      const payment = SVMPay.createPayment({
        recipient: player.wallet,
        amount: totalReward,
        token: process.env.GAME_REWARD_TOKEN,
        metadata: {
          playerId: player.id,
          sessionId: gameSession.id,
          baseRewards,
          achievementBonuses,
          achievements: achievements.map(a => a.id)
        }
      })

      await payment.execute()

      // Update player statistics
      await player.updateStats({
        totalEarned: player.totalEarned + totalReward,
        lastRewardDate: new Date(),
        achievements: [...player.achievements, ...achievements]
      })
    }
  }
}`
    },
    {
      title: "Game Asset Rental System",
      description: "Rent high-value game items with automatic returns",
      level: "Advanced",
      time: "2 hours",
      code: `// Game asset rental system
import { SVMPay, NFTRental, EscrowManager } from '@svm-pay/sdk'

const GameAssetRental = ({ asset, renter, owner }) => {
  const createRental = async (rentalPeriod, rentalPrice) => {
    // Create escrow for security deposit
    const securityDeposit = asset.value * 0.1 // 10% of asset value
    
    const escrow = await EscrowManager.create({
      depositor: renter.wallet,
      amount: securityDeposit,
      token: 'USDC',
      releaseConditions: {
        autoReleaseAfter: rentalPeriod,
        requiresOwnerConfirmation: true
      }
    })

    // Create rental payment
    const rentalPayment = SVMPay.createPayment({
      recipient: owner.wallet,
      amount: rentalPrice,
      token: 'USDC',
      metadata: {
        assetId: asset.id,
        renterId: renter.id,
        rentalPeriod,
        securityDepositId: escrow.id
      }
    })

    rentalPayment.onSuccess(async () => {
      // Transfer NFT to rental contract
      const rental = await NFTRental.create({
        nftMint: asset.nftMint,
        owner: owner.wallet,
        renter: renter.wallet,
        duration: rentalPeriod,
        onExpiry: async () => {
          // Auto-return asset and release deposit
          await NFTRental.returnAsset(asset.nftMint, owner.wallet)
          await escrow.release()
        }
      })

      // Update game database
      await asset.updateRentalStatus({
        isRented: true,
        currentRenter: renter.id,
        rentalExpiry: new Date(Date.now() + rentalPeriod * 1000)
      })
    })

    return rentalPayment.execute()
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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Gaming & NFT Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build immersive gaming experiences with blockchain-based economies
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

// DeFi Integration Tutorials
export function DeFiTutorials() {
  const tutorials = [
    {
      title: "Yield Farming Rewards",
      description: "Distribute farming rewards to liquidity providers",
      level: "Advanced",
      time: "2 hours",
      code: `// Yield farming reward distribution
import { SVMPay, LiquidityCalculator, YieldFarm } from '@svm-pay/sdk'

const YieldFarmRewards = ({ farm, epoch }) => {
  const distributeRewards = async () => {
    // Get all liquidity providers for this epoch
    const providers = await farm.getLiquidityProviders(epoch)
    
    // Calculate rewards based on liquidity provided
    const totalRewards = farm.epochRewards[epoch]
    const totalLiquidity = providers.reduce((sum, p) => sum + p.liquidity, 0)
    
    for (const provider of providers) {
      const rewardShare = (provider.liquidity / totalLiquidity) * totalRewards
      
      if (rewardShare > 0) {
        const payment = SVMPay.createPayment({
          recipient: provider.wallet,
          amount: rewardShare,
          token: farm.rewardToken,
          metadata: {
            farmId: farm.id,
            epoch,
            liquidityProvided: provider.liquidity,
            rewardShare
          }
        })

        await payment.execute()

        // Update provider statistics
        await farm.updateProviderStats(provider.wallet, {
          totalRewardsEarned: provider.totalRewardsEarned + rewardShare,
          lastRewardEpoch: epoch
        })
      }
    }

    // Mark epoch as distributed
    await farm.markEpochDistributed(epoch)
  }
}`
    },
    {
      title: "Cross-Chain Arbitrage Bot",
      description: "Automated arbitrage with cross-chain transfers",
      level: "Expert",
      time: "3 hours",
      code: `// Cross-chain arbitrage bot
import { SVMPay, PriceOracle, CrossChainBridge } from '@svm-pay/sdk'

const ArbitrageBot = ({ tokens, exchanges, minProfitThreshold }) => {
  const findArbitrageOpportunities = async () => {
    for (const token of tokens) {
      const prices = await Promise.all(
        exchanges.map(exchange => PriceOracle.getPrice(token, exchange))
      )

      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)
      const profit = maxPrice - minPrice
      const profitPercent = (profit / minPrice) * 100

      if (profitPercent > minProfitThreshold) {
        await executeArbitrage({
          token,
          buyExchange: exchanges[prices.indexOf(minPrice)],
          sellExchange: exchanges[prices.indexOf(maxPrice)],
          buyPrice: minPrice,
          sellPrice: maxPrice,
          profit
        })
      }
    }
  }

  const executeArbitrage = async ({ token, buyExchange, sellExchange, buyPrice, sellPrice, profit }) => {
    const amount = calculateOptimalAmount(profit, buyPrice)
    
    // Buy on cheaper exchange
    const buyPayment = SVMPay.createPayment({
      recipient: buyExchange.wallet,
      amount: amount * buyPrice,
      token: 'USDC',
      metadata: {
        type: 'ARBITRAGE_BUY',
        targetToken: token,
        expectedPrice: buyPrice
      }
    })

    await buyPayment.execute()

    // Bridge tokens if exchanges are on different chains
    if (buyExchange.chain !== sellExchange.chain) {
      await CrossChainBridge.transfer({
        token,
        amount,
        from: buyExchange.chain,
        to: sellExchange.chain
      })
    }

    // Sell on more expensive exchange
    const sellPayment = SVMPay.createPayment({
      recipient: process.env.ARBITRAGE_WALLET,
      amount: amount * sellPrice,
      token: 'USDC',
      metadata: {
        type: 'ARBITRAGE_SELL',
        profit: profit * amount
      }
    })

    await sellPayment.execute()
  }
}`
    },
    {
      title: "Lending Protocol Integration",
      description: "Automate loan payments and liquidations",
      level: "Advanced",
      time: "2.5 hours",
      code: `// Lending protocol automation
import { SVMPay, LendingProtocol, PriceOracle } from '@svm-pay/sdk'

const LendingAutomation = ({ protocol, loans }) => {
  const processLoanPayments = async () => {
    for (const loan of loans) {
      const currentPrice = await PriceOracle.getPrice(loan.collateralToken)
      const collateralValue = loan.collateralAmount * currentPrice
      const healthFactor = collateralValue / loan.debtAmount

      // Auto-liquidate unhealthy loans
      if (healthFactor < protocol.liquidationThreshold) {
        await liquidateLoan(loan)
      }
      
      // Process regular payments
      if (loan.nextPaymentDue <= Date.now()) {
        await processLoanPayment(loan)
      }
    }
  }

  const liquidateLoan = async (loan) => {
    const liquidationAmount = loan.debtAmount * protocol.liquidationPenalty
    
    const liquidationPayment = SVMPay.createPayment({
      recipient: protocol.treasuryWallet,
      amount: liquidationAmount,
      token: loan.collateralToken,
      metadata: {
        type: 'LIQUIDATION',
        loanId: loan.id,
        borrower: loan.borrower,
        healthFactor: loan.healthFactor
      }
    })

    await liquidationPayment.execute()

    // Release remaining collateral to borrower
    const remainingCollateral = loan.collateralAmount - liquidationAmount
    if (remainingCollateral > 0) {
      await protocol.releaseCollateral(loan.borrower, remainingCollateral)
    }

    // Update loan status
    await protocol.markLoanLiquidated(loan.id)
  }

  const processLoanPayment = async (loan) => {
    const interestPayment = loan.debtAmount * (loan.interestRate / 365)
    
    const payment = SVMPay.createPayment({
      recipient: protocol.treasuryWallet,
      amount: interestPayment,
      token: loan.debtToken,
      metadata: {
        type: 'INTEREST_PAYMENT',
        loanId: loan.id,
        borrower: loan.borrower
      }
    })

    await payment.execute()

    // Update loan with new payment date
    await protocol.updateLoan(loan.id, {
      lastPaymentDate: Date.now(),
      nextPaymentDue: Date.now() + (24 * 60 * 60 * 1000)
    })
  }
}`
    },
    {
      title: "DEX Trading Fee Distribution",
      description: "Distribute trading fees to token holders",
      level: "Intermediate",
      time: "1.5 hours",
      code: `// DEX fee distribution
import { SVMPay, TokenHolderRegistry, FeeCollector } from '@svm-pay/sdk'

const DEXFeeDistribution = ({ dex, governanceToken }) => {
  const distributeTradingFees = async (epoch) => {
    // Get total fees collected this epoch
    const fees = await FeeCollector.getEpochFees(epoch)
    
    // Get all governance token holders
    const holders = await TokenHolderRegistry.getHolders(governanceToken)
    const totalSupply = await TokenHolderRegistry.getTotalSupply(governanceToken)
    
    for (const holder of holders) {
      const sharePercentage = holder.balance / totalSupply
      const feeShare = fees.total * sharePercentage
      
      if (feeShare > process.env.MIN_FEE_DISTRIBUTION) {
        const payment = SVMPay.createPayment({
          recipient: holder.wallet,
          amount: feeShare,
          token: fees.token,
          metadata: {
            type: 'FEE_DISTRIBUTION',
            epoch,
            governanceTokenBalance: holder.balance,
            sharePercentage
          }
        })

        await payment.execute()

        // Update holder statistics
        await dex.updateHolderStats(holder.wallet, {
          totalFeesEarned: holder.totalFeesEarned + feeShare,
          lastFeeEpoch: epoch
        })
      }
    }

    // Mark epoch as distributed
    await dex.markEpochDistributed(epoch)
  }
}`
    },
    {
      title: "Automated Market Maker",
      description: "AMM with dynamic fee adjustment and liquidity mining",
      level: "Expert",
      time: "3.5 hours",
      code: `// Automated Market Maker with dynamic fees
import { SVMPay, AMMPool, LiquidityMining } from '@svm-pay/sdk'

const DynamicAMM = ({ poolConfig, feeStructure }) => {
  const executeSwap = async (swapParams) => {
    const { tokenIn, tokenOut, amountIn, trader } = swapParams
    
    // Calculate dynamic fee based on volatility and liquidity
    const volatility = await calculateVolatility(tokenIn, tokenOut)
    const liquidity = await pool.getCurrentLiquidity()
    const dynamicFee = calculateDynamicFee(volatility, liquidity, feeStructure)
    
    // Calculate swap amounts
    const feeAmount = amountIn * dynamicFee
    const amountAfterFee = amountIn - feeAmount
    const amountOut = calculateSwapOutput(amountAfterFee, tokenIn, tokenOut)
    
    // Execute swap payment
    const swapPayment = SVMPay.createPayment({
      recipient: pool.address,
      amount: amountIn,
      token: tokenIn,
      metadata: {
        type: 'AMM_SWAP',
        tokenOut,
        expectedAmountOut: amountOut,
        fee: feeAmount,
        dynamicFeeRate: dynamicFee
      }
    })

    swapPayment.onSuccess(async () => {
      // Send output tokens to trader
      await pool.transferTokens(tokenOut, amountOut, trader)
      
      // Distribute fees to liquidity providers
      await distributeFees(feeAmount, tokenIn)
      
      // Update pool state
      await pool.updateReserves(tokenIn, tokenOut, amountIn, amountOut)
      
      // Mint liquidity mining rewards
      await LiquidityMining.mintRewards(trader, calculateRewards(amountIn))
    })

    return swapPayment.execute()
  }

  const calculateDynamicFee = (volatility, liquidity, feeStructure) => {
    const baseFee = feeStructure.baseFee
    const volatilityMultiplier = Math.min(volatility * feeStructure.volatilityFactor, feeStructure.maxVolatilityFee)
    const liquidityDiscount = Math.max(liquidity * feeStructure.liquidityFactor, feeStructure.minLiquidityDiscount)
    
    return Math.max(baseFee + volatilityMultiplier - liquidityDiscount, feeStructure.minFee)
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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">DeFi Integration Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build sophisticated DeFi protocols with automated payment systems
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

// SaaS & Service Tutorials
export function SaaSTutorials() {
  const tutorials = [
    {
      title: "SaaS Subscription Billing",
      description: "Flexible subscription billing with usage-based pricing",
      level: "Intermediate",
      time: "1.5 hours",
      code: `// SaaS subscription with usage billing
import { SVMPay, SubscriptionManager, UsageTracker } from '@svm-pay/sdk'

const SaaSBilling = ({ customer, plan }) => {
  const processMonthlyBilling = async () => {
    // Get base subscription fee
    const baseFee = plan.baseFee
    
    // Calculate usage charges
    const usage = await UsageTracker.getMonthlyUsage(customer.id)
    const usageCharges = calculateUsageCharges(usage, plan.usageTiers)
    
    const totalAmount = baseFee + usageCharges
    
    const payment = SVMPay.createPayment({
      recipient: process.env.COMPANY_WALLET,
      amount: totalAmount,
      token: 'USDC',
      metadata: {
        customerId: customer.id,
        planId: plan.id,
        baseFee,
        usageCharges,
        billingPeriod: getCurrentBillingPeriod(),
        usageDetails: usage
      }
    })

    payment.onSuccess(async () => {
      // Extend subscription
      await SubscriptionManager.extendSubscription(customer.id, plan.billingCycle)
      
      // Reset usage counters
      await UsageTracker.resetMonthlyUsage(customer.id)
      
      // Send invoice
      await sendInvoice(customer, {
        baseFee,
        usageCharges,
        totalAmount,
        usage
      })
    })

    payment.onFailure(async () => {
      // Handle failed payment
      await handleFailedPayment(customer, totalAmount)
    })

    return payment.execute()
  }

  const calculateUsageCharges = (usage, tiers) => {
    let charges = 0
    let remainingUsage = usage.total

    for (const tier of tiers) {
      if (remainingUsage <= 0) break
      
      const tierUsage = Math.min(remainingUsage, tier.limit - tier.start)
      charges += tierUsage * tier.pricePerUnit
      remainingUsage -= tierUsage
    }

    return charges
  }
}`
    },
    {
      title: "Freelance Payment Escrow",
      description: "Milestone-based payments for freelance projects",
      level: "Intermediate",
      time: "1 hour",
      code: `// Freelance milestone payments
import { SVMPay, EscrowManager, ProjectManager } from '@svm-pay/sdk'

const FreelanceEscrow = ({ project, client, freelancer }) => {
  const createMilestoneEscrow = async (milestone) => {
    const escrow = await EscrowManager.create({
      client: client.wallet,
      freelancer: freelancer.wallet,
      arbitrator: process.env.PLATFORM_ARBITRATOR,
      amount: milestone.amount,
      token: 'USDC',
      releaseConditions: {
        requiresClientApproval: true,
        autoReleaseAfter: milestone.autoReleaseDays * 24 * 60 * 60,
        disputeWindow: 7 * 24 * 60 * 60 // 7 days
      }
    })

    // Handle milestone completion
    escrow.onMilestoneSubmitted(async (submission) => {
      await ProjectManager.notifyClient({
        projectId: project.id,
        milestoneId: milestone.id,
        submissionDetails: submission,
        reviewDeadline: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 days
      })
    })

    // Handle client approval
    escrow.onClientApproval(async () => {
      const platformFee = milestone.amount * process.env.PLATFORM_FEE_RATE
      const freelancerAmount = milestone.amount - platformFee
      
      // Pay freelancer
      const freelancerPayment = SVMPay.createPayment({
        recipient: freelancer.wallet,
        amount: freelancerAmount,
        token: 'USDC',
        metadata: {
          projectId: project.id,
          milestoneId: milestone.id,
          type: 'MILESTONE_PAYMENT'
        }
      })

      // Pay platform fee
      const platformPayment = SVMPay.createPayment({
        recipient: process.env.PLATFORM_WALLET,
        amount: platformFee,
        token: 'USDC',
        metadata: {
          projectId: project.id,
          type: 'PLATFORM_FEE'
        }
      })

      await Promise.all([
        freelancerPayment.execute(),
        platformPayment.execute()
      ])

      // Update project status
      await ProjectManager.completeMilestone(project.id, milestone.id)
    })

    return escrow
  }
}`
    },
    {
      title: "Consulting Time Tracking",
      description: "Automated billing based on tracked hours",
      level: "Beginner",
      time: "45 minutes",
      code: `// Time-based consulting billing
import { SVMPay, TimeTracker, InvoiceGenerator } from '@svm-pay/sdk'

const ConsultingBilling = ({ consultant, client, project }) => {
  const processWeeklyBilling = async () => {
    // Get tracked hours for the week
    const weeklyHours = await TimeTracker.getWeeklyHours({
      consultantId: consultant.id,
      projectId: project.id,
      weekOf: getCurrentWeek()
    })

    if (weeklyHours.total === 0) return

    // Calculate billing amount
    const amount = weeklyHours.total * consultant.hourlyRate
    
    // Generate invoice
    const invoice = await InvoiceGenerator.create({
      consultant: consultant.id,
      client: client.id,
      project: project.id,
      hours: weeklyHours.total,
      rate: consultant.hourlyRate,
      amount,
      timeEntries: weeklyHours.entries
    })

    // Create payment request
    const payment = SVMPay.createPayment({
      recipient: consultant.wallet,
      amount,
      token: 'USDC',
      metadata: {
        invoiceId: invoice.id,
        consultantId: consultant.id,
        projectId: project.id,
        hoursWorked: weeklyHours.total,
        hourlyRate: consultant.hourlyRate
      }
    })

    payment.onSuccess(async () => {
      // Mark invoice as paid
      await InvoiceGenerator.markPaid(invoice.id)
      
      // Update consultant earnings
      await consultant.updateEarnings(amount)
      
      // Send payment confirmation
      await sendPaymentConfirmation(consultant.email, invoice)
    })

    // Send invoice to client
    await sendInvoiceToClient(client.email, invoice)
    
    return invoice
  }
}`
    },
    {
      title: "API Usage Billing",
      description: "Pay-per-use API with real-time billing",
      level: "Advanced",
      time: "2 hours",
      code: `// API usage-based billing
import { SVMPay, APIGateway, UsageMeter } from '@svm-pay/sdk'

const APIBilling = ({ apiKey, customer, pricingTier }) => {
  const processAPIRequest = async (request) => {
    // Check customer balance
    const balance = await customer.getBalance()
    const requestCost = calculateRequestCost(request, pricingTier)
    
    if (balance < requestCost) {
      throw new Error('Insufficient balance')
    }

    // Process API request
    const response = await APIGateway.processRequest(request)
    
    // Charge for usage
    await chargeForUsage(customer, requestCost, request)
    
    return response
  }

  const chargeForUsage = async (customer, cost, request) => {
    const payment = SVMPay.createPayment({
      recipient: process.env.API_REVENUE_WALLET,
      amount: cost,
      token: customer.billingToken || 'USDC',
      metadata: {
        customerId: customer.id,
        apiKey: request.apiKey,
        endpoint: request.endpoint,
        requestSize: request.size,
        responseSize: request.responseSize,
        processingTime: request.processingTime
      }
    })

    await payment.execute()

    // Update usage statistics
    await UsageMeter.recordUsage({
      customerId: customer.id,
      cost,
      requests: 1,
      dataTransfer: request.size + request.responseSize,
      timestamp: Date.now()
    })

    // Check if customer needs to be notified about low balance
    const newBalance = await customer.getBalance()
    if (newBalance < process.env.LOW_BALANCE_THRESHOLD) {
      await notifyLowBalance(customer)
    }
  }

  const calculateRequestCost = (request, tier) => {
    let cost = tier.baseCostPerRequest
    
    // Add data transfer costs
    const totalData = request.size + request.responseSize
    cost += totalData * tier.costPerMB
    
    // Add processing time costs for expensive operations
    if (request.processingTime > tier.freeProcessingTime) {
      const extraTime = request.processingTime - tier.freeProcessingTime
      cost += extraTime * tier.costPerSecond
    }
    
    return cost
  }
}`
    },
    {
      title: "Software License Management",
      description: "Automated license provisioning and renewals",
      level: "Intermediate",
      time: "1.5 hours",
      code: `// Software license management
import { SVMPay, LicenseManager, ActivationServer } from '@svm-pay/sdk'

const SoftwareLicensing = ({ software, customer, licenseType }) => {
  const purchaseLicense = async () => {
    const licensePrice = software.pricing[licenseType]
    
    const payment = SVMPay.createPayment({
      recipient: software.vendorWallet,
      amount: licensePrice,
      token: 'USDC',
      metadata: {
        softwareId: software.id,
        customerId: customer.id,
        licenseType,
        version: software.currentVersion
      }
    })

    payment.onSuccess(async (result) => {
      // Generate license key
      const license = await LicenseManager.generate({
        softwareId: software.id,
        customerId: customer.id,
        licenseType,
        expiresAt: calculateExpiry(licenseType),
        features: software.features[licenseType],
        maxActivations: licenseType === 'enterprise' ? 100 : 1
      })

      // Register with activation server
      await ActivationServer.registerLicense({
        licenseKey: license.key,
        customerId: customer.id,
        allowedActivations: license.maxActivations
      })

      // Send license to customer
      await sendLicenseEmail(customer.email, license)
      
      // Update customer records
      await customer.addLicense(license)
    })

    return payment.execute()
  }

  const renewLicense = async (existingLicense) => {
    const renewalPrice = software.pricing[existingLicense.type] * 0.8 // 20% renewal discount
    
    const payment = SVMPay.createPayment({
      recipient: software.vendorWallet,
      amount: renewalPrice,
      token: 'USDC',
      metadata: {
        type: 'LICENSE_RENEWAL',
        existingLicenseId: existingLicense.id,
        customerId: customer.id
      }
    })

    payment.onSuccess(async () => {
      // Extend license expiry
      await LicenseManager.extend({
        licenseId: existingLicense.id,
        extensionPeriod: calculateExtension(existingLicense.type)
      })

      // Update activation server
      await ActivationServer.extendLicense(existingLicense.key)
      
      // Send renewal confirmation
      await sendRenewalConfirmation(customer.email, existingLicense)
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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">SaaS & Service Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build scalable service businesses with automated billing and payments
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

// Social & Creator Tutorials
export function SocialTutorials() {
  const tutorials = [
    {
      title: "Content Creator Tips",
      description: "Accept tips and donations from your audience",
      level: "Beginner",
      time: "30 minutes",
      code: `// Content creator tipping system
import { SVMPay, TipJar, CreatorProfile } from '@svm-pay/sdk'

const CreatorTips = ({ creator, content }) => {
  const setupTipJar = async () => {
    const tipJar = await TipJar.create({
      creator: creator.wallet,
      content: content.id,
      currency: ['USDC', 'SOL'],
      suggestedAmounts: [1, 5, 10, 25],
      customAmountEnabled: true
    })

    // Handle incoming tips
    tipJar.onTip(async (tip) => {
      // Send thank you message
      await sendThankYouMessage(tip.sender, creator, tip.amount)
      
      // Update creator earnings
      await creator.addEarnings({
        amount: tip.amount,
        source: 'tips',
        contentId: content.id,
        timestamp: Date.now()
      })
      
      // Trigger achievement if applicable
      await checkTipAchievements(creator, tip)
    })

    return tipJar
  }

  const createTipButton = () => {
    return (
      <TipButton
        creatorWallet={creator.wallet}
        contentId={content.id}
        onSuccess={(tip) => {
          showThankYouAnimation()
          updateTipCounter(tip.amount)
        }}
      />
    )
  }
}`
    },
    {
      title: "Subscription Monetization",
      description: "Monthly subscriptions for exclusive content",
      level: "Intermediate",
      time: "1 hour",
      code: `// Creator subscription system
import { SVMPay, SubscriptionManager, ContentGating } from '@svm-pay/sdk'

const CreatorSubscriptions = ({ creator, tiers }) => {
  const setupSubscriptionTiers = async () => {
    const subscriptions = await Promise.all(
      tiers.map(tier => SubscriptionManager.create({
        creator: creator.wallet,
        tier: tier.name,
        price: tier.price,
        benefits: tier.benefits,
        duration: 'monthly'
      }))
    )

    return subscriptions
  }

  const handleSubscription = async (subscriber, tier) => {
    const subscription = SVMPay.createSubscription({
      creator: creator.wallet,
      subscriber: subscriber.wallet,
      amount: tier.price,
      token: 'USDC',
      interval: 'monthly',
      metadata: {
        tierName: tier.name,
        benefits: tier.benefits
      }
    })

    subscription.onSuccess(async () => {
      // Grant access to exclusive content
      await ContentGating.grantAccess({
        subscriber: subscriber.wallet,
        creator: creator.wallet,
        tier: tier.name,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      })

      // Send welcome message
      await sendWelcomeMessage(subscriber, tier)
      
      // Update subscriber count
      await creator.updateStats({
        subscriberCount: creator.subscriberCount + 1,
        monthlyRevenue: creator.monthlyRevenue + tier.price
      })
    })

    return subscription.execute()
  }
}`
    },
    {
      title: "NFT Drop Platform",
      description: "Launch and sell NFT collections with royalties",
      level: "Advanced",
      time: "2.5 hours",
      code: `// NFT drop platform
import { SVMPay, NFTMinter, RoyaltyDistribution } from '@svm-pay/sdk'

const NFTDropPlatform = ({ artist, collection }) => {
  const launchNFTDrop = async () => {
    const drop = await NFTMinter.createDrop({
      artist: artist.wallet,
      collection: collection.metadata,
      mintPrice: collection.mintPrice,
      maxSupply: collection.maxSupply,
      royaltyPercentage: 5,
      launchDate: collection.launchDate
    })

    // Handle NFT purchases
    drop.onPurchase(async (purchase) => {
      const payment = SVMPay.createPayment({
        recipient: artist.wallet,
        amount: collection.mintPrice,
        token: 'USDC',
        metadata: {
          dropId: drop.id,
          tokenId: purchase.tokenId,
          buyer: purchase.buyer
        }
      })

      await payment.execute()

      // Mint NFT to buyer
      await NFTMinter.mintToWallet({
        tokenId: purchase.tokenId,
        collection: collection.id,
        recipient: purchase.buyer,
        metadata: collection.tokenMetadata[purchase.tokenId]
      })

      // Update drop statistics
      await drop.updateStats({
        totalMinted: drop.totalMinted + 1,
        totalRevenue: drop.totalRevenue + collection.mintPrice
      })
    })

    return drop
  }

  const handleSecondaryRoyalties = async (sale) => {
    const royaltyAmount = sale.price * collection.royaltyPercentage / 100
    
    const royaltyPayment = SVMPay.createPayment({
      recipient: artist.wallet,
      amount: royaltyAmount,
      token: 'USDC',
      metadata: {
        type: 'SECONDARY_ROYALTY',
        tokenId: sale.tokenId,
        salePrice: sale.price,
        royaltyPercentage: collection.royaltyPercentage
      }
    })

    await royaltyPayment.execute()

    // Update artist royalty earnings
    await artist.addRoyaltyEarnings({
      amount: royaltyAmount,
      tokenId: sale.tokenId,
      salePrice: sale.price
    })
  }
}`
    },
    {
      title: "Social Media Monetization",
      description: "Monetize social media posts with microtransactions",
      level: "Intermediate",
      time: "1.5 hours",
      code: `// Social media monetization
import { SVMPay, SocialPlatform, MicroPayments } from '@svm-pay/sdk'

const SocialMonetization = ({ user, platform }) => {
  const setupPaidContent = async (post) => {
    const paidPost = await SocialPlatform.createPaidPost({
      author: user.wallet,
      content: post.content,
      price: post.price || 0.1, // $0.10 default
      previewLength: 100, // Preview first 100 characters
      accessDuration: 24 * 60 * 60 // 24 hours access
    })

    // Handle content purchases
    paidPost.onPurchase(async (purchase) => {
      const payment = SVMPay.createPayment({
        recipient: user.wallet,
        amount: post.price,
        token: 'USDC',
        metadata: {
          postId: post.id,
          buyer: purchase.buyer,
          accessDuration: paidPost.accessDuration
        }
      })

      await payment.execute()

      // Grant access to full content
      await SocialPlatform.grantContentAccess({
        postId: post.id,
        buyer: purchase.buyer,
        expiresAt: Date.now() + paidPost.accessDuration * 1000
      })

      // Update user earnings
      await user.addEarnings({
        amount: post.price,
        source: 'paid_content',
        postId: post.id
      })
    })

    return paidPost
  }

  const setupSuperLikes = async () => {
    const superLike = await MicroPayments.create({
      recipient: user.wallet,
      amount: 0.01, // $0.01 per super like
      token: 'USDC',
      label: 'Super Like'
    })

    superLike.onPayment(async (payment) => {
      // Add special effects to the like
      await SocialPlatform.addSuperLike({
        postId: payment.metadata.postId,
        sender: payment.sender,
        amount: payment.amount
      })

      // Update user engagement metrics
      await user.updateEngagement({
        superLikes: user.superLikes + 1,
        earnings: user.earnings + payment.amount
      })
    })

    return superLike
  }
}`
    },
    {
      title: "Live Stream Donations",
      description: "Real-time donations during live streams",
      level: "Intermediate",
      time: "1 hour",
      code: `// Live stream donation system
import { SVMPay, StreamingPlatform, DonationAlerts } from '@svm-pay/sdk'

const LiveStreamDonations = ({ streamer, stream }) => {
  const setupDonationSystem = async () => {
    const donationHandler = await StreamingPlatform.createDonationHandler({
      streamer: streamer.wallet,
      streamId: stream.id,
      minDonation: 1,
      maxDonation: 1000,
      currency: 'USDC'
    })

    // Handle real-time donations
    donationHandler.onDonation(async (donation) => {
      const payment = SVMPay.createPayment({
        recipient: streamer.wallet,
        amount: donation.amount,
        token: 'USDC',
        metadata: {
          streamId: stream.id,
          donor: donation.donor,
          message: donation.message,
          timestamp: Date.now()
        }
      })

      await payment.execute()

      // Show donation alert on stream
      await DonationAlerts.show({
        streamer: streamer.id,
        donor: donation.donorName,
        amount: donation.amount,
        message: donation.message,
        duration: 5000 // 5 seconds
      })

      // Update stream statistics
      await stream.updateStats({
        totalDonations: stream.totalDonations + donation.amount,
        donorCount: stream.donorCount + (donation.isNewDonor ? 1 : 0)
      })

      // Check for donation milestones
      await checkDonationMilestones(stream, donation)
    })

    return donationHandler
  }

  const setupDonationGoals = async (goals) => {
    const goalTracker = await StreamingPlatform.createGoalTracker({
      streamId: stream.id,
      goals: goals.map(goal => ({
        target: goal.target,
        description: goal.description,
        reward: goal.reward
      }))
    })

    goalTracker.onGoalReached(async (goal) => {
      // Notify viewers of goal completion
      await StreamingPlatform.announceGoalReached({
        streamId: stream.id,
        goal: goal.description,
        reward: goal.reward
      })

      // Execute goal reward (e.g., special content, giveaway)
      await executeGoalReward(goal, stream)
    })

    return goalTracker
  }
}`
    },
    {
      title: "Community Rewards Program",
      description: "Reward active community members with tokens",
      level: "Advanced",
      time: "2 hours",
      code: `// Community rewards program
import { SVMPay, CommunityManager, RewardDistributor } from '@svm-pay/sdk'

const CommunityRewards = ({ community, rewardToken }) => {
  const setupRewardProgram = async () => {
    const program = await CommunityManager.createRewardProgram({
      community: community.id,
      rewardToken: rewardToken.mint,
      activities: {
        'post_creation': 10,
        'helpful_comment': 5,
        'event_attendance': 25,
        'referral': 50,
        'monthly_active': 100
      }
    })

    // Track user activities
    program.onActivity(async (activity) => {
      const reward = program.activities[activity.type]
      
      if (reward > 0) {
        const payment = SVMPay.createPayment({
          recipient: activity.user,
          amount: reward,
          token: rewardToken.symbol,
          metadata: {
            communityId: community.id,
            activityType: activity.type,
            activityId: activity.id,
            earnedAt: Date.now()
          }
        })

        await payment.execute()

        // Update user community score
        await CommunityManager.updateUserScore({
          userId: activity.user,
          communityId: community.id,
          scoreIncrease: reward,
          activityType: activity.type
        })
      }
    })

    return program
  }

  const distributeMonthlyCommunityRewards = async () => {
    const topContributors = await CommunityManager.getTopContributors(community.id, 30)
    const monthlyRewardPool = community.monthlyRewardPool
    
    for (let i = 0; i < topContributors.length; i++) {
      const contributor = topContributors[i]
      const rewardPercentage = calculateRewardPercentage(i + 1, topContributors.length)
      const rewardAmount = monthlyRewardPool * rewardPercentage

      const payment = SVMPay.createPayment({
        recipient: contributor.wallet,
        amount: rewardAmount,
        token: rewardToken.symbol,
        metadata: {
          type: 'MONTHLY_COMMUNITY_REWARD',
          rank: i + 1,
          contributionScore: contributor.score,
          rewardPercentage
        }
      })

      await payment.execute()

      // Send achievement notification
      await CommunityManager.sendAchievementNotification({
        userId: contributor.wallet,
        achievement: 'Top ' + (i + 1) + ' Community Contributor',
        reward: rewardAmount
      })
    }
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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Creator & Social Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Monetize content and build engaged communities with crypto payments
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
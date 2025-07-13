import { motion } from 'framer-motion'
import { ArrowRight, Copy, Check, Github, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const examples = [
  {
    id: 'basic-payment',
    title: 'Basic Payment Integration',
    description: 'Simple payment acceptance with Solana wallet connection',
    category: 'Getting Started',
    difficulty: 'Beginner',
    tech: ['React', 'TypeScript', 'Solana Web3'],
    preview: `import { SVMPay } from '@svm-pay/sdk'

const payment = SVMPay.createPayment({
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: 100,
  token: 'USDC'
})

await payment.execute()`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/basic-payment',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/basic-payment'
  },
  {
    id: 'cross-chain',
    title: 'Cross-Chain Payment',
    description: 'Accept payments from Ethereum to Solana via Wormhole bridge',
    category: 'Cross-Chain',
    difficulty: 'Intermediate',
    tech: ['React', 'Ethereum', 'Wormhole', 'Solana'],
    preview: `import { CrossChainRequestFactory } from '@svm-pay/sdk'

const request = CrossChainRequestFactory.createTransferRequest({
  sourceNetwork: EVMNetwork.ETHEREUM,
  destinationNetwork: SVMNetwork.SOLANA,
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: '100',
  token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f'
})

const result = await paymentManager.executePayment(request)`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cross-chain',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cross-chain'
  },
  {
    id: 'subscription',
    title: 'Subscription Payments',
    description: 'Recurring subscription payments with automated billing',
    category: 'Advanced',
    difficulty: 'Advanced',
    tech: ['Node.js', 'Express', 'Solana', 'Clockwork'],
    preview: `import { SubscriptionManager } from '@svm-pay/sdk'

const subscription = await SubscriptionManager.create({
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: 10,
  interval: 'monthly',
  token: 'USDC'
})

subscription.on('payment', (payment) => {
  console.log('Payment processed:', payment.id)
})`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/subscription',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/subscription'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Checkout',
    description: 'Complete checkout flow with cart integration and order management',
    category: 'E-commerce',
    difficulty: 'Intermediate',
    tech: ['Next.js', 'Stripe', 'Solana', 'PostgreSQL'],
    preview: `import { CheckoutManager } from '@svm-pay/sdk'

const checkout = new CheckoutManager({
  items: cartItems,
  currency: 'USDC',
  onSuccess: (payment) => {
    // Fulfill order
    fulfillOrder(payment.orderId)
  }
})

await checkout.process()`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/ecommerce',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/ecommerce'
  },
  {
    id: 'payment-links',
    title: 'Payment Links',
    description: 'Generate shareable payment links with QR codes',
    category: 'Tools',
    difficulty: 'Beginner',
    tech: ['React', 'QR Code', 'URL Schemes'],
    preview: `import { PaymentLinkGenerator } from '@svm-pay/sdk'

const link = PaymentLinkGenerator.create({
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: 50,
  token: 'SOL',
  description: 'Coffee payment'
})

// Generate QR code
const qrCode = await link.generateQR()`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/payment-links',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/payment-links'
  },
  {
    id: 'nft-marketplace',
    title: 'NFT Marketplace Integration',
    description: 'NFT buying and selling with instant settlement',
    category: 'NFT',
    difficulty: 'Advanced',
    tech: ['React', 'Metaplex', 'Solana', 'IPFS'],
    preview: `import { NFTPaymentManager } from '@svm-pay/sdk'

const nftSale = await NFTPaymentManager.create({
  nftMint: 'EpjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  price: 2.5,
  token: 'SOL',
  seller: sellerWallet.publicKey,
  buyer: buyerWallet.publicKey
})

await nftSale.execute()`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/nft-marketplace',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/nft-marketplace'
  },
  // E-commerce Advanced Examples
  {
    id: 'online-store',
    title: 'E-commerce Store Integration',
    description: 'Complete online store with cart, inventory, and crypto payments',
    category: 'E-commerce',
    difficulty: 'Intermediate',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Solana'],
    preview: `import { SVMPay, PaymentForm } from '@svm-pay/sdk'

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

    await payment.execute()
    await updateInventory(cartItems)
    await sendOrderConfirmation(paymentData.email)
  }

  return <PaymentForm onSubmit={handlePayment} amount={total} />
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/ecommerce-store',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/ecommerce-store'
  },
  {
    id: 'marketplace-escrow',
    title: 'Marketplace with Escrow',
    description: 'Multi-vendor marketplace with escrow payments and dispute resolution',
    category: 'E-commerce',
    difficulty: 'Advanced',
    tech: ['React', 'Node.js', 'Escrow Contracts', 'Solana'],
    preview: `import { EscrowManager, MultisigWallet } from '@svm-pay/sdk'

const MarketplaceEscrow = ({ seller, buyer, item }) => {
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

  escrow.onDispute(async (dispute) => {
    await notifyArbitrator(dispute)
    await freezeEscrow(escrow.id)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/marketplace-escrow',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/marketplace-escrow'
  },
  {
    id: 'subscription-box',
    title: 'Subscription Box Service',
    description: 'Recurring payments for subscription boxes with inventory management',
    category: 'E-commerce',
    difficulty: 'Intermediate',
    tech: ['React', 'Express', 'Subscription Manager', 'Solana'],
    preview: `import { SubscriptionManager, InventoryManager } from '@svm-pay/sdk'

const SubscriptionBox = ({ customer, plan }) => {
  const subscription = await SubscriptionManager.create({
    customer: customer.wallet,
    merchant: process.env.BUSINESS_WALLET,
    amount: plan.price,
    interval: plan.interval,
    token: 'USDC'
  })

  subscription.onPayment(async (payment) => {
    await InventoryManager.reserve({
      customerId: customer.id,
      items: plan.items,
      deliveryDate: getNextDeliveryDate()
    })
    await sendShippingNotification(customer.email)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/subscription-box',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/subscription-box'
  },
  {
    id: 'digital-store',
    title: 'Digital Product Store',
    description: 'Instant delivery of digital products with license management',
    category: 'E-commerce',
    difficulty: 'Beginner',
    tech: ['React', 'File Manager', 'License Manager', 'Solana'],
    preview: `import { SVMPay, FileManager, LicenseManager } from '@svm-pay/sdk'

const DigitalStore = ({ product, customer }) => {
  const payment = SVMPay.createPayment({
    recipient: process.env.STORE_WALLET,
    amount: product.price,
    token: 'USDC'
  })

  payment.onSuccess(async (result) => {
    const downloadLink = await FileManager.generateSecureLink({
      fileId: product.fileId,
      expiresIn: 24 * 60 * 60,
      maxDownloads: 3
    })

    if (product.type === 'software') {
      await LicenseManager.generate({
        productId: product.id,
        customerId: customer.id
      })
    }

    await sendDownloadEmail(customer.email, downloadLink)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/digital-store',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/digital-store'
  },
  // Gaming Examples
  {
    id: 'game-currency',
    title: 'In-Game Currency Exchange',
    description: 'Convert real money to in-game tokens with exchange rate management',
    category: 'Gaming',
    difficulty: 'Intermediate',
    tech: ['Unity', 'C#', 'Token Mint', 'Solana'],
    preview: `import { SVMPay, TokenMint, GameEconomy } from '@svm-pay/sdk'

const GameCurrencyExchange = ({ player, gameToken }) => {
  const exchangeRate = await GameEconomy.getExchangeRate('USDC', gameToken.symbol)
  const gameTokenAmount = usdcAmount * exchangeRate

  const payment = SVMPay.createPayment({
    recipient: process.env.GAME_TREASURY,
    amount: usdcAmount,
    token: 'USDC'
  })

  payment.onSuccess(async (result) => {
    await TokenMint.mintToPlayer({
      playerWallet: player.wallet,
      amount: gameTokenAmount,
      tokenMint: gameToken.mint
    })
    await GameEconomy.updatePlayerBalance(player.id, gameTokenAmount)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/game-currency',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/game-currency'
  },
  {
    id: 'nft-marketplace-game',
    title: 'Game NFT Marketplace',
    description: 'Trade game items as NFTs with royalties for developers',
    category: 'Gaming',
    difficulty: 'Advanced',
    tech: ['React', 'NFT Standards', 'Metaplex', 'Solana'],
    preview: `import { NFTMarketplace, RoyaltyManager, MetaplexSDK } from '@svm-pay/sdk'

const GameNFTMarketplace = ({ game, item, seller, buyer }) => {
  const marketplace = new NFTMarketplace({
    gameId: game.id,
    royaltyRecipient: game.developerWallet,
    royaltyPercentage: 5
  })

  const purchase = await marketplace.purchase({
    listingId,
    buyer: buyer.wallet,
    onSuccess: async (result) => {
      await MetaplexSDK.transferNFT({
        mint: item.nftMint,
        from: seller.wallet,
        to: buyer.wallet
      })
      await RoyaltyManager.distribute({
        totalAmount: item.price,
        royalties: [
          { recipient: game.developerWallet, percentage: 5 },
          { recipient: seller.wallet, percentage: 95 }
        ]
      })
    }
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/game-nft-marketplace',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/game-nft-marketplace'
  },
  {
    id: 'tournament-prizes',
    title: 'Tournament Prize Distribution',
    description: 'Automatic prize distribution for esports tournaments',
    category: 'Gaming',
    difficulty: 'Advanced',
    tech: ['Node.js', 'Tournament Manager', 'Prize Pool', 'Solana'],
    preview: `import { SVMPay, TournamentManager, PrizePool } from '@svm-pay/sdk'

const TournamentPrizes = ({ tournament, results }) => {
  const prizePool = new PrizePool({
    totalAmount: tournament.prizePool,
    token: 'USDC',
    distribution: tournament.prizeDistribution
  })

  const validatedResults = await TournamentManager.validateResults({
    tournamentId: tournament.id,
    results,
    requiresSignatures: true
  })

  const prizeCalculations = prizePool.calculatePrizes(validatedResults)

  for (const prize of prizeCalculations) {
    const payment = SVMPay.createPayment({
      recipient: prize.playerWallet,
      amount: prize.amount,
      token: 'USDC'
    })
    await payment.execute()
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/tournament-prizes',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/tournament-prizes'
  },
  {
    id: 'play-to-earn',
    title: 'Play-to-Earn Rewards',
    description: 'Achievement-based reward distribution for gaming',
    category: 'Gaming',
    difficulty: 'Intermediate',
    tech: ['Unity', 'Reward Calculator', 'Achievement System', 'Solana'],
    preview: `import { SVMPay, RewardCalculator, AchievementSystem } from '@svm-pay/sdk'

const PlayToEarnRewards = ({ player, gameSession }) => {
  const baseRewards = RewardCalculator.calculate({
    sessionDuration: gameSession.duration,
    performance: gameSession.performance,
    difficulty: gameSession.difficulty
  })

  const achievements = await AchievementSystem.checkAchievements({
    playerId: player.id,
    sessionData: gameSession
  })

  const achievementBonuses = achievements.reduce((total, achievement) => {
    return total + achievement.rewardAmount
  }, 0)

  const totalReward = baseRewards + achievementBonuses

  if (totalReward >= process.env.MIN_REWARD_THRESHOLD) {
    const payment = SVMPay.createPayment({
      recipient: player.wallet,
      amount: totalReward,
      token: process.env.GAME_REWARD_TOKEN
    })
    await payment.execute()
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/play-to-earn',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/play-to-earn'
  },
  // DeFi Examples
  {
    id: 'yield-farming',
    title: 'Yield Farming Rewards',
    description: 'Distribute farming rewards to liquidity providers',
    category: 'DeFi',
    difficulty: 'Advanced',
    tech: ['Solana', 'Liquidity Pools', 'Yield Farming', 'Token Distribution'],
    preview: `import { SVMPay, LiquidityCalculator, YieldFarm } from '@svm-pay/sdk'

const YieldFarmRewards = ({ farm, epoch }) => {
  const providers = await farm.getLiquidityProviders(epoch)
  const totalRewards = farm.epochRewards[epoch]
  const totalLiquidity = providers.reduce((sum, p) => sum + p.liquidity, 0)
  
  for (const provider of providers) {
    const rewardShare = (provider.liquidity / totalLiquidity) * totalRewards
    
    if (rewardShare > 0) {
      const payment = SVMPay.createPayment({
        recipient: provider.wallet,
        amount: rewardShare,
        token: farm.rewardToken
      })
      await payment.execute()
    }
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/yield-farming',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/yield-farming'
  },
  {
    id: 'lending-protocol',
    title: 'Lending Protocol Integration',
    description: 'Automate loan payments and liquidations',
    category: 'DeFi',
    difficulty: 'Advanced',
    tech: ['Solana', 'Lending Protocols', 'Price Oracles', 'Liquidations'],
    preview: `import { SVMPay, LendingProtocol, PriceOracle } from '@svm-pay/sdk'

const LendingAutomation = ({ protocol, loans }) => {
  for (const loan of loans) {
    const currentPrice = await PriceOracle.getPrice(loan.collateralToken)
    const collateralValue = loan.collateralAmount * currentPrice
    const healthFactor = collateralValue / loan.debtAmount

    if (healthFactor < protocol.liquidationThreshold) {
      await liquidateLoan(loan)
    }
    
    if (loan.nextPaymentDue <= Date.now()) {
      await processLoanPayment(loan)
    }
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/lending-protocol',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/lending-protocol'
  },
  // SaaS Examples
  {
    id: 'saas-subscription',
    title: 'SaaS Subscription Billing',
    description: 'Flexible subscription billing with usage-based pricing',
    category: 'SaaS',
    difficulty: 'Intermediate',
    tech: ['Node.js', 'Subscription Manager', 'Usage Tracking', 'Billing'],
    preview: `import { SVMPay, SubscriptionManager, UsageTracker } from '@svm-pay/sdk'

const SaaSBilling = ({ customer, plan }) => {
  const baseFee = plan.baseFee
  const usage = await UsageTracker.getMonthlyUsage(customer.id)
  const usageCharges = calculateUsageCharges(usage, plan.usageTiers)
  const totalAmount = baseFee + usageCharges
  
  const payment = SVMPay.createPayment({
    recipient: process.env.COMPANY_WALLET,
    amount: totalAmount,
    token: 'USDC'
  })

  payment.onSuccess(async () => {
    await SubscriptionManager.extendSubscription(customer.id, plan.billingCycle)
    await UsageTracker.resetMonthlyUsage(customer.id)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/saas-subscription',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/saas-subscription'
  },
  {
    id: 'freelance-escrow',
    title: 'Freelance Payment Escrow',
    description: 'Milestone-based payments for freelance projects',
    category: 'SaaS',
    difficulty: 'Intermediate',
    tech: ['React', 'Escrow Manager', 'Project Management', 'Milestones'],
    preview: `import { SVMPay, EscrowManager, ProjectManager } from '@svm-pay/sdk'

const FreelanceEscrow = ({ project, client, freelancer }) => {
  const escrow = await EscrowManager.create({
    client: client.wallet,
    freelancer: freelancer.wallet,
    arbitrator: process.env.PLATFORM_ARBITRATOR,
    amount: milestone.amount,
    token: 'USDC',
    releaseConditions: {
      requiresClientApproval: true,
      autoReleaseAfter: milestone.autoReleaseDays * 24 * 60 * 60
    }
  })

  escrow.onClientApproval(async () => {
    const platformFee = milestone.amount * process.env.PLATFORM_FEE_RATE
    const freelancerAmount = milestone.amount - platformFee
    
    await Promise.all([
      SVMPay.createPayment({ recipient: freelancer.wallet, amount: freelancerAmount }).execute(),
      SVMPay.createPayment({ recipient: process.env.PLATFORM_WALLET, amount: platformFee }).execute()
    ])
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/freelance-escrow',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/freelance-escrow'
  },
  {
    id: 'api-billing',
    title: 'API Usage Billing',
    description: 'Pay-per-use API with real-time billing',
    category: 'SaaS',
    difficulty: 'Advanced',
    tech: ['Express', 'API Gateway', 'Usage Metering', 'Real-time Billing'],
    preview: `import { SVMPay, APIGateway, UsageMeter } from '@svm-pay/sdk'

const APIBilling = ({ apiKey, customer, pricingTier }) => {
  const processAPIRequest = async (request) => {
    const balance = await customer.getBalance()
    const requestCost = calculateRequestCost(request, pricingTier)
    
    if (balance < requestCost) {
      throw new Error('Insufficient balance')
    }

    const response = await APIGateway.processRequest(request)
    
    const payment = SVMPay.createPayment({
      recipient: process.env.API_REVENUE_WALLET,
      amount: requestCost,
      token: customer.billingToken || 'USDC'
    })
    
    await payment.execute()
    await UsageMeter.recordUsage({ customerId: customer.id, cost: requestCost })
    
    return response
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/api-billing',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/api-billing'
  },
  // Social & Creator Examples
  {
    id: 'creator-tips',
    title: 'Content Creator Tips',
    description: 'Accept tips and donations from your audience',
    category: 'Social',
    difficulty: 'Beginner',
    tech: ['React', 'Tip Jar', 'Creator Profile', 'Social Integration'],
    preview: `import { SVMPay, TipJar, CreatorProfile } from '@svm-pay/sdk'

const CreatorTips = ({ creator, content }) => {
  const tipJar = await TipJar.create({
    creator: creator.wallet,
    content: content.id,
    currency: ['USDC', 'SOL'],
    suggestedAmounts: [1, 5, 10, 25],
    customAmountEnabled: true
  })

  tipJar.onTip(async (tip) => {
    await sendThankYouMessage(tip.sender, creator, tip.amount)
    await creator.addEarnings({
      amount: tip.amount,
      source: 'tips',
      contentId: content.id
    })
    await checkTipAchievements(creator, tip)
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/creator-tips',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/creator-tips'
  },
  {
    id: 'nft-drop',
    title: 'NFT Drop Platform',
    description: 'Launch and sell NFT collections with royalties',
    category: 'Social',
    difficulty: 'Advanced',
    tech: ['React', 'NFT Minter', 'Metaplex', 'Royalty Distribution'],
    preview: `import { SVMPay, NFTMinter, RoyaltyDistribution } from '@svm-pay/sdk'

const NFTDropPlatform = ({ artist, collection }) => {
  const drop = await NFTMinter.createDrop({
    artist: artist.wallet,
    collection: collection.metadata,
    mintPrice: collection.mintPrice,
    maxSupply: collection.maxSupply,
    royaltyPercentage: 5,
    launchDate: collection.launchDate
  })

  drop.onPurchase(async (purchase) => {
    const payment = SVMPay.createPayment({
      recipient: artist.wallet,
      amount: collection.mintPrice,
      token: 'USDC'
    })

    await payment.execute()
    
    await NFTMinter.mintToWallet({
      tokenId: purchase.tokenId,
      collection: collection.id,
      recipient: purchase.buyer
    })
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/nft-drop',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/nft-drop'
  },
  // Enterprise Examples
  {
    id: 'b2b-invoicing',
    title: 'B2B Invoice Processing',
    description: 'Automated invoice processing for enterprise clients',
    category: 'Enterprise',
    difficulty: 'Advanced',
    tech: ['Node.js', 'Invoice Processor', 'Compliance Manager', 'Tax Calculation'],
    preview: `import { SVMPay, InvoiceProcessor, ComplianceManager } from '@svm-pay/sdk'

const EnterpriseInvoicing = ({ vendor, client, invoice }) => {
  const compliance = await ComplianceManager.validateInvoice({
    invoice,
    vendor: vendor.taxId,
    client: client.taxId,
    jurisdiction: invoice.jurisdiction
  })

  if (!compliance.isValid) {
    throw new Error('Compliance violation: ' + compliance.violations.join(', '))
  }

  const payment = SVMPay.createPayment({
    recipient: vendor.corporateWallet,
    amount: invoice.amount,
    token: 'USDC',
    metadata: {
      invoiceId: invoice.id,
      vendorTaxId: vendor.taxId,
      clientTaxId: client.taxId
    }
  })

  payment.onSuccess(async (result) => {
    await InvoiceProcessor.generateReceipt({ payment: result, invoice })
    await updateAccountingSystems({ vendor, client, invoice, payment: result })
  })
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/b2b-invoicing',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/b2b-invoicing'
  },
  {
    id: 'payroll-system',
    title: 'Corporate Payroll System',
    description: 'Multi-currency payroll with compliance features',
    category: 'Enterprise',
    difficulty: 'Expert',
    tech: ['Node.js', 'Payroll Manager', 'Tax Calculator', 'Multi-Currency'],
    preview: `import { SVMPay, PayrollManager, TaxCalculator } from '@svm-pay/sdk'

const CorporatePayroll = ({ company, employees, payPeriod }) => {
  const payrollRun = await PayrollManager.createPayrollRun({
    company: company.id,
    payPeriod,
    employees: employees.map(emp => emp.id)
  })

  for (const employee of employees) {
    const grossPay = calculateGrossPay(employee, payPeriod)
    const taxCalculation = await TaxCalculator.calculate({
      employee: employee.taxInfo,
      grossPay,
      jurisdiction: employee.workLocation,
      payPeriod
    })

    const netPay = grossPay - taxCalculation.totalDeductions

    const payment = SVMPay.createPayment({
      recipient: employee.wallet,
      amount: netPay,
      token: employee.preferredCurrency || 'USDC'
    })

    await payment.execute()
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/payroll-system',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/payroll-system'
  },
  // Mobile & IoT Examples
  {
    id: 'mobile-wallet',
    title: 'Mobile Wallet Integration',
    description: 'Mobile wallet with biometric authentication',
    category: 'Mobile',
    difficulty: 'Intermediate',
    tech: ['React Native', 'Biometric Auth', 'Mobile Wallet', 'Security'],
    preview: `import { SVMPay, BiometricAuth, MobileWallet } from '@svm-pay/sdk'

const MobilePaymentApp = ({ user, device }) => {
  const biometric = await BiometricAuth.initialize({
    types: ['fingerprint', 'face', 'voice'],
    fallbackToPin: true,
    maxAttempts: 3
  })

  const wallet = await MobileWallet.create({
    userId: user.id,
    deviceId: device.id,
    biometricAuth: biometric,
    securityLevel: 'high'
  })

  const processMobilePayment = async (paymentRequest) => {
    const authResult = await BiometricAuth.authenticate({
      promptMessage: 'Authenticate to complete payment',
      paymentAmount: paymentRequest.amount
    })

    if (!authResult.success) {
      throw new Error('Authentication failed')
    }

    const payment = SVMPay.createPayment({
      recipient: paymentRequest.recipient,
      amount: paymentRequest.amount,
      token: paymentRequest.token
    })

    return payment.execute()
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/mobile-wallet',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/mobile-wallet'
  },
  {
    id: 'iot-micropayments',
    title: 'IoT Device Micropayments',
    description: 'Enable micropayments for IoT devices and sensors',
    category: 'IoT',
    difficulty: 'Advanced',
    tech: ['Node.js', 'IoT Manager', 'Micropayment Channels', 'Sensors'],
    preview: `import { SVMPay, IoTManager, MicropaymentChannel } from '@svm-pay/sdk'

const IoTMicropayments = ({ devices, services }) => {
  const iotPayments = await IoTManager.initialize({
    devices: devices.map(device => ({
      id: device.id,
      type: device.type,
      paymentAddress: device.wallet,
      rateLimit: device.maxTransactionsPerHour
    })),
    micropaymentThreshold: 0.01,
    batchSize: 100
  })

  const createMicropaymentChannel = async (device, service) => {
    const channel = await MicropaymentChannel.create({
      device: device.wallet,
      service: service.wallet,
      initialDeposit: 10,
      channelDuration: 24 * 60 * 60,
      minPayment: 0.001,
      maxPayment: 1
    })

    channel.onUsage(async (usage) => {
      const cost = calculateUsageCost(usage, service.pricing)
      
      if (cost > 0) {
        const micropayment = SVMPay.createMicropayment({
          channel: channel.id,
          amount: cost,
          token: 'USDC'
        })
        await micropayment.execute()
      }
    })
  }
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/iot-micropayments',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/iot-micropayments'
  },
  {
    id: 'assembly-bpf-hello-world',
    title: 'Assembly-BPF Hello World',
    description: 'Simple BPF program using Assembly-BPF SDK for debugging and basic operations',
    category: 'Assembly-BPF',
    difficulty: 'Beginner',
    tech: ['Assembly-BPF SDK', 'BPF', 'TypeScript'],
    preview: `import { examples } from 'svm-pay/assembly-bpf';

// Create a simple hello world program
const { sdk, compilationResult, metadata } = await examples.createHelloWorld();

console.log('Program compiled:', compilationResult.success);
console.log('Assembly listing:', compilationResult.assembly);`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf'
  },
  {
    id: 'assembly-bpf-payment-processor',
    title: 'Assembly-BPF Payment Processor',
    description: 'Low-level payment processing program built with Assembly-BPF SDK',
    category: 'Assembly-BPF',
    difficulty: 'Intermediate',
    tech: ['Assembly-BPF SDK', 'BPF', 'Payment Processing'],
    preview: `import { AssemblyBPFSDK, BPFTemplates, SVMNetwork } from 'svm-pay/assembly-bpf';

const sdk = new AssemblyBPFSDK({ 
  network: SVMNetwork.SOLANA,
  debug: true 
});

const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
  networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC]
});

const result = await sdk.compile(instructions, metadata);`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf'
  },
  {
    id: 'assembly-bpf-cross-chain-bridge',
    title: 'Assembly-BPF Cross-Chain Bridge',
    description: 'Cross-chain bridge implementation using low-level BPF instructions',
    category: 'Assembly-BPF',
    difficulty: 'Advanced',
    tech: ['Assembly-BPF SDK', 'BPF', 'Cross-Chain', 'Bridge'],
    preview: `import { 
  AssemblyBPFSDK, 
  BPFTemplates, 
  BPFHelpers,
  SVMNetwork,
  SVMPayBPFProgramType 
} from 'svm-pay/assembly-bpf';

const { metadata, instructions } = BPFTemplates.createCrossChainBridge({
  supportedChains: [1, 137, 42161], // Ethereum, Polygon, Arbitrum
  bridgeAuthority: bridgeAuthorityKey,
  networks: [SVMNetwork.SOLANA, SVMNetwork.ECLIPSE]
});

const result = await sdk.compile(instructions, metadata);`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf'
  },
  {
    id: 'assembly-bpf-custom-validator',
    title: 'Assembly-BPF Custom Validator',
    description: 'Custom payment validation logic using Assembly-BPF program builder',
    category: 'Assembly-BPF',
    difficulty: 'Advanced',
    tech: ['Assembly-BPF SDK', 'BPF', 'Validation', 'Memory Management'],
    preview: `import { 
  AssemblyBPFSDK, 
  BPFHelpers, 
  BPFInstruction, 
  BPFRegister,
  SVMNetwork,
  SVMPayBPFProgramType 
} from 'svm-pay/assembly-bpf';

const sdk = new AssemblyBPFSDK({ network: SVMNetwork.SONIC });
const metadata = BPFHelpers.createProgramMetadata(
  'Custom Validator',
  SVMPayBPFProgramType.VALIDATOR,
  [SVMNetwork.SONIC]
);

const builder = sdk.createProgram(metadata);
builder.addInstructions([
  {
    opcode: BPFInstruction.LOAD,
    dst: BPFRegister.R2,
    src: BPFRegister.R1,
    offset: 8,
    comment: 'Load payment amount'
  }
]);

const result = await builder.compile();`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf'
  },
  {
    id: 'assembly-bpf-memory-management',
    title: 'Assembly-BPF Memory Management',
    description: 'Demonstrate memory allocation and structure management in BPF programs',
    category: 'Assembly-BPF',
    difficulty: 'Intermediate',
    tech: ['Assembly-BPF SDK', 'BPF', 'Memory Management', 'Data Structures'],
    preview: `import { AssemblyBPFSDK, SVMNetwork } from 'svm-pay/assembly-bpf';

const sdk = new AssemblyBPFSDK({ network: SVMNetwork.SOLANA });
const memoryManager = sdk.getMemoryManager();

// Create a payment data structure
const structInstructions = memoryManager.createStructureLayout([
  { name: 'header', size: 8, value: 0x1234 },
  { name: 'amount', size: 8, value: 1000000 },
  { name: 'recipient', size: 32 },
  { name: 'memo', size: 64 }
]);

// Calculate total memory requirements
const totalSize = memoryManager.calculateStackSpace([
  { name: 'header', size: 8 },
  { name: 'amount', size: 8 },
  { name: 'recipient', size: 32 },
  { name: 'memo', size: 64 }
]);

console.log('Total structure size:', totalSize, 'bytes');`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/assembly-bpf'
  },
  // C++ SDK Examples
  {
    id: 'cpp-basic-payment',
    title: 'C++ Basic Payment Integration',
    description: 'Simple payment URL creation and processing using C++ SDK',
    category: 'C++',
    difficulty: 'Beginner',
    tech: ['C++17', 'CMake', 'SVM-Pay C++ SDK'],
    preview: `#include <iostream>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    // Initialize the SDK
    initialize_sdk();
    
    // Create a client
    Client client(SVMNetwork::SOLANA);
    
    // Create a simple transfer URL
    std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
    std::string amount = "1.5";
    
    std::unordered_map<std::string, std::string> options = {
        {"label", "Coffee Shop"},
        {"message", "Payment for coffee and pastry"},
        {"memo", "Order #12345"}
    };
    
    std::string payment_url = client.create_transfer_url(recipient, amount, options);
    std::cout << "Payment URL: " << payment_url << std::endl;
    
    return 0;
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/basic-payment',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/basic-payment'
  },
  {
    id: 'cpp-url-parsing',
    title: 'C++ URL Parsing and Validation',
    description: 'Parse and validate different types of SVM-Pay URLs with C++',
    category: 'C++',
    difficulty: 'Intermediate',
    tech: ['C++17', 'URL Parsing', 'SVM-Pay C++ SDK'],
    preview: `#include <iostream>
#include <vector>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    initialize_sdk();
    Client client;
    
    // Test URLs for different networks and types
    std::vector<std::string> test_urls = {
        // Solana transfer
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5&label=Coffee%20Shop",
        
        // USDC transfer
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=100&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        
        // Cross-chain transfer
        "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=50&source-network=ethereum&bridge=wormhole",
        
        // Sonic network
        "sonic:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0&memo=Sonic%20payment"
    };
    
    for (const auto& url : test_urls) {
        auto request = client.parse_url(url);
        std::cout << "Network: " << network_to_string(request->network) << std::endl;
    }
    
    return 0;
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/url-parsing',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/url-parsing'
  },
  {
    id: 'cpp-network-adapters',
    title: 'C++ Network Adapters',
    description: 'Working with different network adapters for multi-chain support',
    category: 'C++',
    difficulty: 'Advanced',
    tech: ['C++17', 'Network Adapters', 'Async Operations', 'SVM-Pay C++ SDK'],
    preview: `#include <iostream>
#include <thread>
#include <chrono>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    initialize_sdk();
    Client client;
    
    // Check available network adapters
    NetworkAdapter* solana_adapter = client.get_adapter(SVMNetwork::SOLANA);
    if (solana_adapter) {
        std::cout << "✓ Solana adapter available" << std::endl;
        
        // Create transfer transaction
        TransferRequest transfer_request(
            SVMNetwork::SOLANA,
            "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
            "1.5"
        );
        transfer_request.label = "Test Payment";
        transfer_request.memo = "SDK Example";
        
        // Submit transaction asynchronously
        auto future = solana_adapter->submit_transaction(transfer_request);
        
        // Wait for result
        auto result = future.get();
        std::cout << "Transaction submitted: " << result.transaction_id << std::endl;
    }
    
    return 0;
}`,
    demoUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/network-adapters',
    sourceUrl: 'https://github.com/openSVM/svm-pay/tree/main/examples/cpp-examples/network-adapters'
  }
]

const categories = ['All', 'Getting Started', 'Cross-Chain', 'Advanced', 'E-commerce', 'Gaming', 'DeFi', 'SaaS', 'Social', 'Enterprise', 'Mobile', 'IoT', 'Assembly-BPF', 'C++', 'Tools', 'NFT']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

export function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredExamples = examples.filter(example => {
    const categoryMatch = selectedCategory === 'All' || example.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'All' || example.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Code Examples
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Production-ready examples to help you integrate SVM-Pay quickly and efficiently
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                React
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Next.js
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                TypeScript
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Node.js
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedDifficulty === difficulty
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredExamples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{example.title}</h3>
                    <p className="text-slate-600 mb-4">{example.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      example.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      example.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {example.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {example.tech.map((tech) => (
                    <span
                      key={tech}
                      className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Code Preview */}
                <div className="bg-slate-900 rounded-lg p-4 mb-6 relative">
                  <button
                    onClick={() => copyCode(example.preview, example.id)}
                    className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {copiedCode === example.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{example.preview}</code>
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={example.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                  <a
                    href={example.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg font-medium text-center transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive documentation and start integrating payments today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/docs"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                View Documentation
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/openSVM/svm-pay"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
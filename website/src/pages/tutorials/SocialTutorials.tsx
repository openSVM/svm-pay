import { TutorialLayout } from '../../components/ui/TutorialLayout'

export function CreatorTippingSystemTutorial() {
  return (
    <TutorialLayout
      title="Creator Tipping System"
      description="Build a comprehensive tipping system for content creators with multi-platform integration"
      level="Intermediate"
      time="1.5 hours"
      category="Creator & Social Tutorials"
      categoryPath="/docs/tutorials/social"
      overview="Create a universal tipping system that allows fans to support their favorite creators across multiple platforms. This tutorial covers tip processing, creator verification, analytics, and integration with popular content platforms."
      prerequisites={[
        "Understanding of creator economy concepts",
        "Experience with social platform APIs",
        "Basic payment processing knowledge",
        "Content creator workflow understanding"
      ]}
      steps={[
        {
          title: "Set Up Creator Tipping Infrastructure",
          description: "Initialize the tipping system with creator profiles and payment processing.",
          code: `import { CreatorTippingManager, CreatorProfile, TipProcessor } from '@svm-pay/sdk'

const tippingManager = new CreatorTippingManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  supportedPlatforms: ['youtube', 'twitch', 'twitter', 'instagram', 'tiktok'],
  minimumTip: 1, // $1 minimum tip
  maximumTip: 10000, // $10,000 maximum tip
  platformFee: 2.5, // 2.5% platform fee
  instantPayouts: true
})

// Creator profile management
class CreatorProfileManager {
  constructor() {
    this.creators = new Map()
    this.verificationRequirements = {
      minimumFollowers: 1000,
      accountAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      contentPolicy: true,
      identityVerification: true
    }
  }

  async createCreatorProfile(creatorData) {
    // Validate creator data
    await this.validateCreatorData(creatorData)
    
    const creator = {
      id: generateCreatorId(),
      username: creatorData.username,
      displayName: creatorData.displayName,
      email: creatorData.email,
      wallet: creatorData.wallet,
      platforms: creatorData.platforms,
      bio: creatorData.bio,
      profileImage: creatorData.profileImage,
      bannerImage: creatorData.bannerImage,
      verified: false,
      status: 'pending_verification',
      totalTipsReceived: 0,
      totalTippers: 0,
      averageTip: 0,
      tippingGoals: [],
      customMessages: {
        welcome: 'Thanks for the tip! 🙏',
        milestone: 'Amazing! You helped me reach a milestone! 🎉'
      },
      createdAt: new Date()
    }

    // Start verification process
    await this.initiateVerification(creator)
    
    this.creators.set(creator.id, creator)
    return creator
  }

  async verifyCreator(creatorId, platformVerifications) {
    const creator = this.creators.get(creatorId)
    if (!creator) {
      throw new Error('Creator not found')
    }

    // Verify each platform
    for (const platform of creator.platforms) {
      const verification = platformVerifications[platform.name]
      if (!verification) {
        throw new Error(\`Verification missing for \${platform.name}\`)
      }

      // Check follower count
      if (verification.followers < this.verificationRequirements.minimumFollowers) {
        throw new Error(\`Insufficient followers on \${platform.name}\`)
      }

      // Verify account age
      const accountAge = Date.now() - new Date(verification.createdDate).getTime()
      if (accountAge < this.verificationRequirements.accountAge) {
        throw new Error(\`Account too new on \${platform.name}\`)
      }

      // Verify content policy compliance
      if (!verification.contentCompliant) {
        throw new Error(\`Content policy violation on \${platform.name}\`)
      }
    }

    // Update creator status
    creator.verified = true
    creator.status = 'active'
    creator.verifiedAt = new Date()
    
    this.creators.set(creatorId, creator)
    
    // Send verification confirmation
    await this.sendVerificationConfirmation(creator)
    
    return creator
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement comprehensive creator verification to prevent fraud",
            "Set reasonable minimum requirements for platform integrity",
            "Support multiple social platforms for broader reach",
            "Use real-time verification APIs when available"
          ]
        },
        {
          title: "Process Tips with Analytics",
          description: "Handle tip processing with real-time analytics and creator insights.",
          code: `class TipProcessor {
  async processTip(tipData) {
    try {
      const { creatorId, amount, currency, message, isAnonymous, fanData } = tipData
      
      // Validate tip
      await this.validateTip(tipData)
      
      const creator = await tippingManager.getCreator(creatorId)
      if (!creator || creator.status !== 'active') {
        throw new Error('Creator not available for tipping')
      }

      // Calculate fees
      const platformFee = amount * (tippingManager.platformFee / 100)
      const creatorAmount = amount - platformFee

      // Create tip payment
      const tipPayment = SVMPay.createPayment({
        recipient: creator.wallet,
        amount: creatorAmount,
        token: currency || 'USDC',
        metadata: {
          type: 'creator-tip',
          creatorId: creatorId,
          fanId: fanData?.id,
          message: message,
          isAnonymous: isAnonymous,
          platformFee: platformFee,
          timestamp: new Date().toISOString()
        }
      })

      // Execute payment
      const result = await tipPayment.execute()

      if (result.status === 'SUCCESS') {
        // Update creator analytics
        await this.updateCreatorAnalytics(creatorId, amount)
        
        // Send notifications
        await this.sendTipNotifications(creator, tipData, result)
        
        // Track tip in database
        await this.recordTip({
          id: generateTipId(),
          creatorId: creatorId,
          fanId: fanData?.id,
          amount: amount,
          creatorAmount: creatorAmount,
          platformFee: platformFee,
          currency: currency,
          message: message,
          isAnonymous: isAnonymous,
          transactionId: result.transactionId,
          timestamp: new Date()
        })

        return {
          success: true,
          tipId: result.id,
          transactionId: result.transactionId,
          message: creator.customMessages.welcome
        }
      }

    } catch (error) {
      console.error('Tip processing failed:', error)
      throw new Error(\`Tip failed: \${error.message}\`)
    }
  }

  async updateCreatorAnalytics(creatorId, tipAmount) {
    const creator = tippingManager.creators.get(creatorId)
    
    // Update totals
    creator.totalTipsReceived += tipAmount
    creator.totalTippers += 1
    creator.averageTip = creator.totalTipsReceived / creator.totalTippers
    
    // Update daily/weekly/monthly stats
    await this.updateTimeBasedStats(creatorId, tipAmount)
    
    // Check for milestones
    await this.checkMilestones(creator, tipAmount)
    
    // Update trending status
    await this.updateTrendingStatus(creatorId)
  }

  async sendTipNotifications(creator, tipData, paymentResult) {
    // Notify creator
    await this.sendCreatorNotification({
      creatorId: creator.id,
      type: 'tip_received',
      amount: tipData.amount,
      currency: tipData.currency,
      fanName: tipData.isAnonymous ? 'Anonymous' : tipData.fanData?.username,
      message: tipData.message,
      transactionId: paymentResult.transactionId
    })

    // Notify fan (if not anonymous)
    if (!tipData.isAnonymous && tipData.fanData?.email) {
      await this.sendFanConfirmation({
        fanEmail: tipData.fanData.email,
        creatorName: creator.displayName,
        amount: tipData.amount,
        currency: tipData.currency,
        message: creator.customMessages.welcome,
        transactionId: paymentResult.transactionId
      })
    }

    // Post to creator's social platforms (if enabled)
    if (creator.socialSharing?.enabled) {
      await this.postTipAnnouncement(creator, tipData)
    }
  }

  async generateCreatorAnalytics(creatorId, timeframe = '30d') {
    const creator = tippingManager.creators.get(creatorId)
    const tips = await this.getTipsForPeriod(creatorId, timeframe)
    
    return {
      totalTips: tips.length,
      totalAmount: tips.reduce((sum, tip) => sum + tip.amount, 0),
      averageTip: tips.length > 0 ? tips.reduce((sum, tip) => sum + tip.amount, 0) / tips.length : 0,
      topTippers: this.getTopTippers(tips),
      tippingTrends: this.analyzeTippingTrends(tips),
      platformBreakdown: this.getPlatformBreakdown(tips),
      timeDistribution: this.getTimeDistribution(tips),
      messageAnalysis: this.analyzeMessages(tips)
    }
  }
}`,
          language: "JavaScript",
          notes: [
            "Track comprehensive analytics for creator insights",
            "Send real-time notifications to both creators and fans",
            "Implement milestone tracking to celebrate achievements",
            "Provide detailed analytics for creator growth strategies"
          ]
        }
      ]}
      conclusion="You've built a comprehensive creator tipping system that enables fans to support their favorite creators across multiple platforms! The system handles verification, payment processing, analytics, and notifications while providing creators with valuable insights into their supporter base."
      nextSteps={[
        "Add recurring support/subscription options",
        "Implement tip matching campaigns",
        "Create creator collaboration features",
        "Add NFT rewards for top supporters",
        "Implement tax reporting for creators",
        "Create mobile app for easier tipping"
      ]}
      relatedTutorials={[
        { title: "Content Creator Subscriptions", path: "/docs/tutorials/social/creator-subscriptions" },
        { title: "Live Streaming Donations", path: "/docs/tutorials/social/live-streaming" },
        { title: "Community Reward System", path: "/docs/tutorials/social/community-rewards" }
      ]}
    />
  )
}

export function ContentCreatorSubscriptionsTutorial() {
  return (
    <TutorialLayout
      title="Content Creator Subscriptions"
      description="Build a subscription platform for content creators with tiered membership and exclusive content"
      level="Advanced"
      time="2.5 hours"
      category="Creator & Social Tutorials"
      categoryPath="/docs/tutorials/social"
      overview="Create a comprehensive subscription platform that allows creators to monetize their content through tiered memberships. This tutorial covers subscription management, content gating, exclusive perks, and automated billing."
      prerequisites={[
        "Understanding of subscription business models",
        "Experience with content management systems",
        "Knowledge of membership tiers and perks",
        "Recurring payment processing experience"
      ]}
      steps={[
        {
          title: "Set Up Creator Subscription Platform",
          description: "Initialize the subscription system with tiered memberships and content management.",
          code: `import { CreatorSubscriptionManager, ContentGating, MembershipTiers } from '@svm-pay/sdk'

const subscriptionManager = new CreatorSubscriptionManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  platformFee: 5, // 5% platform fee
  maxTiers: 5, // Maximum 5 membership tiers
  freeTrialPeriod: 7 * 24 * 60 * 60, // 7 days free trial
  gracePeriod: 3 * 24 * 60 * 60, // 3 days grace period for failed payments
  contentTypes: ['video', 'audio', 'text', 'image', 'live-stream', 'community']
})

// Creator subscription tiers configuration
class CreatorMembershipManager {
  constructor(creatorId) {
    this.creatorId = creatorId
    this.tiers = new Map()
    this.subscribers = new Map()
    this.content = new Map()
  }

  async createMembershipTier(tierData) {
    const tier = {
      id: generateTierId(),
      creatorId: this.creatorId,
      name: tierData.name,
      description: tierData.description,
      price: tierData.price,
      currency: tierData.currency || 'USDC',
      billingInterval: tierData.billingInterval || 'monthly',
      benefits: tierData.benefits,
      perks: {
        exclusiveContent: tierData.perks?.exclusiveContent || false,
        earlyAccess: tierData.perks?.earlyAccess || false,
        communityAccess: tierData.perks?.communityAccess || false,
        liveChatAccess: tierData.perks?.liveChatAccess || false,
        monthlyCallAccess: tierData.perks?.monthlyCallAccess || false,
        merchandiseDiscount: tierData.perks?.merchandiseDiscount || 0,
        customBadge: tierData.perks?.customBadge || null
      },
      maxSubscribers: tierData.maxSubscribers || null,
      currentSubscribers: 0,
      contentAccess: tierData.contentAccess || [],
      status: 'active',
      createdAt: new Date()
    }

    this.tiers.set(tier.id, tier)
    return tier
  }

  async subscribeToTier(subscriberData, tierId) {
    try {
      const tier = this.tiers.get(tierId)
      if (!tier) {
        throw new Error('Membership tier not found')
      }

      // Check subscriber limits
      if (tier.maxSubscribers && tier.currentSubscribers >= tier.maxSubscribers) {
        throw new Error('Membership tier is full')
      }

      // Check if user is already subscribed
      const existingSubscription = Array.from(this.subscribers.values())
        .find(sub => sub.subscriberId === subscriberData.id && sub.status === 'active')

      if (existingSubscription) {
        throw new Error('Already subscribed to this creator')
      }

      // Create subscription
      const subscription = {
        id: generateSubscriptionId(),
        subscriberId: subscriberData.id,
        subscriberWallet: subscriberData.wallet,
        creatorId: this.creatorId,
        tierId: tierId,
        price: tier.price,
        currency: tier.currency,
        billingInterval: tier.billingInterval,
        startDate: new Date(),
        nextBillingDate: this.calculateNextBilling(tier.billingInterval),
        freeTrialEnd: new Date(Date.now() + subscriptionManager.freeTrialPeriod * 1000),
        status: 'trial',
        totalPaid: 0,
        billingHistory: [],
        createdAt: new Date()
      }

      // Set up recurring payment
      await this.setupRecurringPayment(subscription, tier)

      // Grant immediate access
      await this.grantTierAccess(subscriberData.id, tier)

      // Update tier subscriber count
      tier.currentSubscribers++
      this.tiers.set(tierId, tier)

      // Save subscription
      this.subscribers.set(subscription.id, subscription)

      // Send welcome message
      await this.sendWelcomeMessage(subscriberData, tier)

      return {
        success: true,
        subscriptionId: subscription.id,
        freeTrialEnd: subscription.freeTrialEnd,
        nextBillingDate: subscription.nextBillingDate,
        accessGranted: tier.perks
      }

    } catch (error) {
      console.error('Subscription failed:', error)
      throw new Error(\`Subscription failed: \${error.message}\`)
    }
  }

  async setupRecurringPayment(subscription, tier) {
    const recurringPayment = SVMPay.createRecurringPayment({
      payer: subscription.subscriberWallet,
      recipient: await this.getCreatorWallet(),
      amount: tier.price,
      currency: tier.currency,
      interval: tier.billingInterval,
      startDate: subscription.freeTrialEnd,
      metadata: {
        type: 'creator-subscription',
        subscriptionId: subscription.id,
        tierId: tier.id,
        creatorId: this.creatorId
      }
    })

    // Handle successful payments
    recurringPayment.onSuccess(async (payment) => {
      await this.processSuccessfulBilling(subscription.id, payment)
    })

    // Handle failed payments
    recurringPayment.onFailure(async (error) => {
      await this.handleFailedBilling(subscription.id, error)
    })

    return recurringPayment
  }

  async processSuccessfulBilling(subscriptionId, payment) {
    const subscription = this.subscribers.get(subscriptionId)
    
    // Update subscription
    subscription.status = 'active'
    subscription.totalPaid += payment.amount
    subscription.nextBillingDate = this.calculateNextBilling(subscription.billingInterval)
    subscription.billingHistory.push({
      date: new Date(),
      amount: payment.amount,
      transactionId: payment.transactionId,
      status: 'success'
    })

    this.subscribers.set(subscriptionId, subscription)

    // Send payment confirmation
    await this.sendBillingConfirmation(subscription, payment)

    // Ensure continued access
    await this.renewTierAccess(subscription.subscriberId, subscription.tierId)
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement flexible tier structures to meet different creator needs",
            "Provide free trials to increase conversion rates",
            "Handle billing failures gracefully with grace periods",
            "Track detailed billing history for transparency"
          ]
        }
      ]}
      conclusion="You've created a comprehensive creator subscription platform with tiered memberships and automated billing! The system enables creators to monetize their content through recurring subscriptions while providing subscribers with exclusive access and perks based on their membership level."
      nextSteps={[
        "Add content recommendation algorithms",
        "Implement creator collaboration features",
        "Create mobile app for content consumption",
        "Add analytics dashboard for creators",
        "Implement fan engagement tools",
        "Create affiliate program for creators"
      ]}
      relatedTutorials={[
        { title: "Creator Tipping System", path: "/docs/tutorials/social/creator-tipping" },
        { title: "NFT Drop Platform", path: "/docs/tutorials/social/nft-drops" },
        { title: "Community Reward System", path: "/docs/tutorials/social/community-rewards" }
      ]}
    />
  )
}
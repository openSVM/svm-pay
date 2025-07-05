import { TutorialLayout } from '../../components/ui/TutorialLayout'

export function SaaSSubscriptionBillingTutorial() {
  return (
    <TutorialLayout
      title="SaaS Subscription Billing"
      description="Implement recurring subscription billing for SaaS applications with crypto payments"
      level="Intermediate"
      time="1.5 hours"
      category="SaaS & Service Tutorials"
      categoryPath="/docs/tutorials/saas"
      overview="Build a comprehensive subscription billing system that handles recurring payments, plan changes, usage tracking, and automatic renewals. This tutorial covers everything from basic subscription setup to advanced billing scenarios like proration and dunning management."
      prerequisites={[
        "Understanding of subscription business models",
        "Basic database design knowledge",
        "Experience with webhook handling",
        "Knowledge of recurring payment concepts"
      ]}
      steps={[
        {
          title: "Set Up Subscription Manager",
          description: "Initialize the subscription system with billing cycles and plan management.",
          code: `import { SubscriptionManager, BillingEngine, UsageTracker } from '@svm-pay/sdk'

// Initialize subscription manager
const subscriptionManager = new SubscriptionManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  businessWallet: process.env.BUSINESS_WALLET,
  defaultCurrency: 'USDC',
  billingIntervals: {
    monthly: 30 * 24 * 60 * 60 * 1000,
    quarterly: 90 * 24 * 60 * 60 * 1000,
    yearly: 365 * 24 * 60 * 60 * 1000
  },
  gracePeriod: 3 * 24 * 60 * 60 * 1000, // 3 days
  retrySettings: {
    maxAttempts: 3,
    retryDelays: [24, 72, 168] // 1 day, 3 days, 7 days (in hours)
  }
})

// Define subscription plans
const subscriptionPlans = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    price: 29,
    interval: 'monthly',
    features: {
      apiCalls: 10000,
      storage: 5, // GB
      users: 3,
      support: 'email'
    },
    limits: {
      rateLimit: 100, // requests per minute
      bandwidth: 1000 // MB per month
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional Plan', 
    price: 99,
    interval: 'monthly',
    features: {
      apiCalls: 100000,
      storage: 50,
      users: 25,
      support: 'priority'
    },
    limits: {
      rateLimit: 1000,
      bandwidth: 10000
    }
  }
}`,
          language: "JavaScript",
          notes: [
            "Define clear billing intervals and grace periods",
            "Set up progressive retry logic for failed payments",
            "Structure plans with clear features and limits",
            "Consider different support levels for each plan"
          ]
        },
        {
          title: "Create Subscription Flow",
          description: "Implement the subscription creation and management process.",
          code: `async function createSubscription(customer, planId, paymentMethod) {
  try {
    // Validate plan exists
    const plan = subscriptionPlans[planId]
    if (!plan) {
      throw new Error('Invalid subscription plan: ' + planId)
    }

    // Calculate billing dates
    const now = new Date()
    const billingCycleStart = now
    const nextBillingDate = new Date(now.getTime() + plan.interval)
    const trialEndDate = customer.isNewCustomer ? 
      new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)) : // 14-day trial
      billingCycleStart

    // Create subscription record
    const subscription = await subscriptionManager.create({
      customerId: customer.id,
      customerWallet: customer.wallet,
      planId: plan.id,
      status: customer.isNewCustomer ? 'trialing' : 'active',
      billingCycleStart,
      nextBillingDate: customer.isNewCustomer ? trialEndDate : nextBillingDate,
      trialEndDate,
      paymentMethod,
      metadata: {
        customerEmail: customer.email,
        companyName: customer.companyName,
        planFeatures: plan.features,
        planLimits: plan.limits
      }
    })

    // Set up billing automation
    await setupBillingAutomation(subscription)

    // Initialize usage tracking
    await initializeUsageTracking(subscription)

    // Send welcome email with subscription details
    await sendSubscriptionWelcome(customer, subscription, plan)

    // Provision services immediately
    await provisionServices(customer, plan)

    return subscription

  } catch (error) {
    console.error('Subscription creation failed:', error)
    throw new Error('Failed to create subscription: ' + error.message)
  }
}`,
          language: "JavaScript",
          notes: [
            "Always validate plan selection before creating subscriptions",
            "Calculate billing dates accurately including trials",
            "Set up automated billing jobs for recurring payments",
            "Provision services immediately upon subscription creation"
          ]
        }
      ]}
      conclusion="You've successfully built a comprehensive SaaS subscription billing system! The implementation handles recurring payments, usage tracking, plan limits, and automatic billing cycles. Your SaaS application can now accept cryptocurrency payments for subscriptions with full automation."
      nextSteps={[
        "Implement plan upgrade and downgrade workflows",
        "Add dunning management for failed payments",
        "Create customer self-service portal",
        "Set up automated invoicing and receipts",
        "Implement usage-based pricing tiers",
        "Add subscription analytics and churn prediction"
      ]}
      relatedTutorials={[
        { title: "API Usage Billing", path: "/docs/tutorials/saas/api-billing" },
        { title: "Freelance Payment Escrow", path: "/docs/tutorials/saas/freelance-escrow" },
        { title: "Software License Management", path: "/docs/tutorials/saas/license-management" }
      ]}
    />
  )
}

export function FreelancePaymentEscrowTutorial() {
  return (
    <TutorialLayout
      title="Freelance Payment Escrow"
      description="Build a secure escrow system for freelance payments with milestone-based releases"
      level="Advanced"
      time="2 hours"
      category="SaaS & Service Tutorials"
      categoryPath="/docs/tutorials/saas"
      overview="Create a comprehensive freelance payment system that protects both clients and freelancers through escrow services. This tutorial covers milestone-based payments, dispute resolution, and automatic fund release mechanisms."
      prerequisites={[
        "Understanding of escrow concepts",
        "Knowledge of milestone-based project management",
        "Experience with dispute resolution systems",
        "Basic understanding of multisig wallets"
      ]}
      steps={[
        {
          title: "Set Up Freelance Escrow System",
          description: "Initialize the escrow system with freelance-specific configurations.",
          code: `import { EscrowManager, MilestoneManager, DisputeResolver } from '@svm-pay/sdk'

// Initialize freelance escrow manager
const freelanceEscrow = new EscrowManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  platformWallet: process.env.PLATFORM_WALLET,
  arbitratorWallet: process.env.ARBITRATOR_WALLET,
  defaultToken: 'USDC',
  feeStructure: {
    platformFee: 5, // 5% platform fee
    arbitrationFee: 25, // $25 USDC flat fee for disputes
    processingFee: 0.5 // 0.5% processing fee
  },
  escrowSettings: {
    defaultDuration: 30 * 24 * 60 * 60, // 30 days default
    gracePeriod: 7 * 24 * 60 * 60, // 7 days grace period
    autoReleaseEnabled: true,
    requireMilestones: true
  }
})`,
          language: "JavaScript",
          notes: [
            "Configure appropriate fee structures for sustainability",
            "Set reasonable escrow durations and grace periods",
            "Define clear milestone structures with deliverables",
            "Consider auto-release for final payments to reduce friction"
          ]
        }
      ]}
      conclusion="You've created a robust freelance payment escrow system! Clients and freelancers can now work together with confidence, knowing that payments are secured and released based on project milestones."
      nextSteps={[
        "Implement reputation system for freelancers and clients",
        "Add time tracking integration for hourly projects",
        "Create automated contract generation",
        "Set up dispute mediation services",
        "Implement multi-party escrow for team projects",
        "Add insurance options for high-value projects"
      ]}
      relatedTutorials={[
        { title: "SaaS Subscription Billing", path: "/docs/tutorials/saas/subscription-billing" },
        { title: "Marketplace with Escrow", path: "/docs/tutorials/ecommerce/marketplace-escrow" },
        { title: "B2B Invoice Processing", path: "/docs/tutorials/enterprise/b2b-invoicing" }
      ]}
    />
  )
}
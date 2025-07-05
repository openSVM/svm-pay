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

export function ConsultingTimeTrackingTutorial() {
  return (
    <TutorialLayout
      title="Consulting Time Tracking"
      description="Build a time tracking system for consultants with automated invoicing and payments"
      level="Intermediate"
      time="1.5 hours"
      category="SaaS & Service Tutorials"
      categoryPath="/docs/tutorials/saas"
      overview="Create a comprehensive time tracking system for consultants and service providers. This tutorial covers time tracking, project management, automated invoicing, and payment processing for billable hours."
      prerequisites={[
        "Understanding of time tracking concepts",
        "Basic project management knowledge",
        "Experience with interval-based calculations",
        "Database management skills"
      ]}
      steps={[
        {
          title: "Set Up Time Tracking Infrastructure",
          description: "Initialize the time tracking system with project and client management.",
          code: `import { TimeTracker, ProjectManager, InvoiceGenerator } from '@svm-pay/sdk'

const timeTrackingSystem = new TimeTracker({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  consultantWallet: process.env.CONSULTANT_WALLET,
  defaultHourlyRate: 150, // $150/hour default rate
  minimumBillableTime: 15 * 60, // 15 minutes minimum
  roundingIncrement: 15 * 60, // Round to 15-minute increments
  autoInvoicing: true,
  paymentTerms: 30 // 30 days payment terms
})

// Client and project management
class ConsultingProjectManager {
  constructor() {
    this.clients = new Map()
    this.projects = new Map()
    this.timeEntries = new Map()
  }

  async createClient(clientData) {
    const client = {
      id: generateClientId(),
      name: clientData.name,
      email: clientData.email,
      wallet: clientData.wallet,
      hourlyRate: clientData.hourlyRate || timeTrackingSystem.defaultHourlyRate,
      currency: clientData.currency || 'USDC',
      paymentTerms: clientData.paymentTerms || 30,
      address: clientData.address,
      taxId: clientData.taxId,
      status: 'active',
      createdAt: new Date()
    }

    this.clients.set(client.id, client)
    return client
  }

  async createProject(clientId, projectData) {
    const client = this.clients.get(clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    const project = {
      id: generateProjectId(),
      clientId: clientId,
      name: projectData.name,
      description: projectData.description,
      hourlyRate: projectData.hourlyRate || client.hourlyRate,
      budget: projectData.budget,
      deadline: projectData.deadline,
      status: 'active',
      totalHours: 0,
      totalAmount: 0,
      createdAt: new Date()
    }

    this.projects.set(project.id, project)
    return project
  }
}`,
          language: "JavaScript",
          notes: [
            "Set appropriate minimum billable time to prevent micro-billing",
            "Use rounding increments that match industry standards",
            "Store client-specific rates for flexible pricing",
            "Implement proper project organization for complex engagements"
          ]
        },
        {
          title: "Implement Time Tracking",
          description: "Build time tracking functionality with start/stop capabilities and validation.",
          code: `class TimeEntry {
  constructor(projectId, consultantId, description) {
    this.id = generateTimeEntryId()
    this.projectId = projectId
    this.consultantId = consultantId
    this.description = description
    this.startTime = null
    this.endTime = null
    this.duration = 0
    this.billableHours = 0
    this.status = 'created'
    this.createdAt = new Date()
  }

  startTimer() {
    if (this.startTime) {
      throw new Error('Timer already started')
    }
    
    this.startTime = new Date()
    this.status = 'running'
    
    // Auto-save to prevent data loss
    this.autoSave()
  }

  stopTimer() {
    if (!this.startTime) {
      throw new Error('Timer not started')
    }
    
    if (this.endTime) {
      throw new Error('Timer already stopped')
    }

    this.endTime = new Date()
    this.duration = this.endTime.getTime() - this.startTime.getTime()
    this.billableHours = this.calculateBillableHours()
    this.status = 'completed'
    
    return {
      duration: this.duration,
      billableHours: this.billableHours,
      amount: this.calculateAmount()
    }
  }

  calculateBillableHours() {
    const durationMinutes = this.duration / (1000 * 60)
    
    // Apply minimum billable time
    if (durationMinutes < timeTrackingSystem.minimumBillableTime / 60) {
      return timeTrackingSystem.minimumBillableTime / (1000 * 60 * 60)
    }

    // Round to nearest increment
    const roundingMinutes = timeTrackingSystem.roundingIncrement / 60
    const roundedMinutes = Math.ceil(durationMinutes / roundingMinutes) * roundingMinutes
    
    return roundedMinutes / 60 // Convert to hours
  }

  calculateAmount() {
    const project = projectManager.projects.get(this.projectId)
    const client = projectManager.clients.get(project.clientId)
    
    return this.billableHours * project.hourlyRate
  }

  autoSave() {
    // Save every 30 seconds while timer is running
    if (this.status === 'running') {
      setTimeout(() => {
        this.save()
        this.autoSave()
      }, 30000)
    }
  }

  async save() {
    await database.query(
      'INSERT OR REPLACE INTO time_entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [this.id, this.projectId, this.consultantId, this.description, 
       this.startTime, this.endTime, this.duration, this.billableHours, this.status]
    )
  }
}

// Time tracking API
async function startTimeTracking(projectId, consultantId, description) {
  // Check for any running timers
  const runningEntry = await getRunningTimeEntry(consultantId)
  if (runningEntry) {
    throw new Error('Another timer is already running. Please stop it first.')
  }

  const timeEntry = new TimeEntry(projectId, consultantId, description)
  timeEntry.startTimer()
  
  return {
    timeEntryId: timeEntry.id,
    startTime: timeEntry.startTime,
    message: 'Timer started successfully'
  }
}

async function stopTimeTracking(timeEntryId) {
  const timeEntry = await getTimeEntry(timeEntryId)
  if (!timeEntry) {
    throw new Error('Time entry not found')
  }

  const result = timeEntry.stopTimer()
  await timeEntry.save()
  
  // Update project totals
  await updateProjectTotals(timeEntry.projectId, timeEntry.billableHours, result.amount)
  
  return {
    timeEntryId: timeEntry.id,
    duration: result.duration,
    billableHours: result.billableHours,
    amount: result.amount,
    message: 'Timer stopped successfully'
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement auto-save functionality to prevent data loss",
            "Apply proper rounding rules for billing accuracy",
            "Prevent multiple concurrent timers per consultant",
            "Update project totals in real-time for accurate budgeting"
          ]
        },
        {
          title: "Generate Automated Invoices",
          description: "Create invoice generation with payment integration and tracking.",
          code: `class InvoiceManager {
  constructor() {
    this.invoiceNumber = 1000
  }

  async generateInvoice(projectId, timeEntries, invoiceData = {}) {
    const project = projectManager.projects.get(projectId)
    const client = projectManager.clients.get(project.clientId)
    
    if (!project || !client) {
      throw new Error('Project or client not found')
    }

    // Calculate invoice totals
    const lineItems = timeEntries.map(entry => ({
      date: entry.startTime.toISOString().split('T')[0],
      description: entry.description,
      hours: entry.billableHours,
      rate: project.hourlyRate,
      amount: entry.billableHours * project.hourlyRate
    }))

    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxRate = invoiceData.taxRate || 0
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    // Generate invoice
    const invoice = {
      id: generateInvoiceId(),
      number: \`INV-\${String(this.invoiceNumber++).padStart(4, '0')}\`,
      projectId: projectId,
      clientId: client.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + client.paymentTerms * 24 * 60 * 60 * 1000),
      lineItems: lineItems,
      subtotal: subtotal,
      taxRate: taxRate,
      taxAmount: taxAmount,
      total: total,
      currency: client.currency,
      status: 'draft',
      paymentStatus: 'pending',
      createdAt: new Date()
    }

    // Save invoice
    await this.saveInvoice(invoice)

    // Generate payment link
    const paymentLink = await this.generatePaymentLink(invoice)

    return {
      invoice: invoice,
      paymentLink: paymentLink
    }
  }

  async generatePaymentLink(invoice) {
    const client = projectManager.clients.get(invoice.clientId)
    
    const payment = SVMPay.createPayment({
      recipient: timeTrackingSystem.consultantWallet,
      amount: invoice.total,
      token: invoice.currency,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        clientId: client.id,
        projectId: invoice.projectId,
        paymentType: 'consulting-invoice'
      }
    })

    // Set up payment handlers
    payment.onSuccess(async (result) => {
      await this.handleInvoicePayment(invoice.id, result)
    })

    payment.onFailure(async (error) => {
      await this.handlePaymentFailure(invoice.id, error)
    })

    return payment.getPaymentUrl()
  }

  async handleInvoicePayment(invoiceId, paymentResult) {
    try {
      // Update invoice status
      await database.query(
        'UPDATE invoices SET payment_status = ?, paid_at = ?, transaction_id = ? WHERE id = ?',
        ['paid', new Date(), paymentResult.transactionId, invoiceId]
      )

      // Update project revenue
      const invoice = await this.getInvoice(invoiceId)
      await updateProjectRevenue(invoice.projectId, invoice.total)

      // Send payment confirmation
      const client = projectManager.clients.get(invoice.clientId)
      await sendPaymentConfirmation(client.email, invoice, paymentResult)

      // Generate receipt
      await generateReceipt(invoice, paymentResult)

    } catch (error) {
      console.error('Invoice payment processing failed:', error)
      await queueForManualReview(invoiceId, paymentResult)
    }
  }

  async sendInvoice(invoiceId) {
    const invoice = await this.getInvoice(invoiceId)
    const client = projectManager.clients.get(invoice.clientId)
    const project = projectManager.projects.get(invoice.projectId)

    // Generate PDF invoice
    const invoicePDF = await generateInvoicePDF(invoice, client, project)

    // Send email with payment link
    await sendInvoiceEmail({
      to: client.email,
      subject: \`Invoice \${invoice.number} - \${project.name}\`,
      invoicePDF: invoicePDF,
      paymentLink: await this.generatePaymentLink(invoice),
      dueDate: invoice.dueDate
    })

    // Update invoice status
    invoice.status = 'sent'
    invoice.sentAt = new Date()
    await this.saveInvoice(invoice)

    return { success: true, sentAt: invoice.sentAt }
  }
}`,
          language: "JavaScript",
          notes: [
            "Generate unique invoice numbers for proper accounting",
            "Calculate taxes and totals accurately for compliance",
            "Create secure payment links with metadata tracking",
            "Automate payment confirmation and receipt generation"
          ]
        }
      ]}
      conclusion="You've built a comprehensive time tracking and invoicing system for consulting services! The system tracks billable hours accurately, generates professional invoices, and processes payments automatically. Consultants can focus on their work while the system handles the administrative tasks seamlessly."
      nextSteps={[
        "Add expense tracking and reimbursement features",
        "Implement project budgeting and progress tracking",
        "Create client portal for viewing invoices and payments",
        "Add team collaboration features for multi-consultant projects",
        "Implement automated late payment reminders",
        "Create comprehensive reporting and analytics dashboard"
      ]}
      relatedTutorials={[
        { title: "SaaS Subscription Billing", path: "/docs/tutorials/saas/subscription-billing" },
        { title: "Freelance Payment Escrow", path: "/docs/tutorials/saas/freelance-escrow" },
        { title: "B2B Invoice Processing", path: "/docs/tutorials/enterprise/b2b-invoicing" }
      ]}
    />
  )
}

export function APIUsageBillingTutorial() {
  return (
    <TutorialLayout
      title="API Usage Billing"
      description="Build a usage-based billing system for API services with real-time metering and automated invoicing"
      level="Advanced"
      time="2 hours"
      category="SaaS & Service Tutorials"
      categoryPath="/docs/tutorials/saas"
      overview="Create a sophisticated API billing system that tracks usage in real-time, calculates costs based on different pricing tiers, and automatically generates invoices. This tutorial covers rate limiting, usage tracking, and complex pricing models."
      prerequisites={[
        "Understanding of API architecture",
        "Experience with usage metering",
        "Knowledge of pricing strategies",
        "Database optimization skills"
      ]}
      steps={[
        {
          title: "Set Up API Metering Infrastructure",
          description: "Initialize the API billing system with usage tracking and rate limiting.",
          code: `import { APIBillingManager, UsageMeter, RateLimiter } from '@svm-pay/sdk'
import Redis from 'ioredis'

const apiBillingManager = new APIBillingManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  serviceWallet: process.env.API_SERVICE_WALLET,
  meteringStore: new Redis(process.env.REDIS_URL),
  billingCycle: 'monthly',
  currency: 'USDC',
  gracePeriod: 7 * 24 * 60 * 60 // 7 days
})

// Define pricing tiers and models
const pricingTiers = {
  starter: {
    monthlyFee: 29,
    includedRequests: 10000,
    overageRate: 0.001, // $0.001 per request over limit
    rateLimits: {
      requestsPerSecond: 10,
      requestsPerHour: 1000
    },
    features: ['basic-api', 'email-support']
  },
  professional: {
    monthlyFee: 99,
    includedRequests: 100000,
    overageRate: 0.0008,
    rateLimits: {
      requestsPerSecond: 50,
      requestsPerHour: 10000
    },
    features: ['basic-api', 'premium-api', 'priority-support', 'webhooks']
  },
  enterprise: {
    monthlyFee: 499,
    includedRequests: 1000000,
    overageRate: 0.0005,
    rateLimits: {
      requestsPerSecond: 200,
      requestsPerHour: 100000
    },
    features: ['all-apis', 'dedicated-support', 'custom-integrations', 'sla']
  }
}

// API endpoint types with different pricing
const endpointPricing = {
  'basic': { cost: 1, description: 'Basic API calls' },
  'premium': { cost: 5, description: 'Premium API calls with enhanced data' },
  'ai': { cost: 10, description: 'AI-powered API calls' },
  'bulk': { cost: 0.1, description: 'Bulk processing API calls' }
}`,
          language: "JavaScript",
          notes: [
            "Design pricing tiers that scale with customer needs",
            "Implement different endpoint pricing for value-based billing",
            "Set appropriate rate limits to manage system load",
            "Use Redis for high-performance usage tracking"
          ]
        },
        {
          title: "Implement Real-time Usage Tracking",
          description: "Track API usage with detailed metering and analytics.",
          code: `class APIUsageTracker {
  constructor(customerId, tier) {
    this.customerId = customerId
    this.tier = tier
    this.redis = apiBillingManager.meteringStore
  }

  async trackAPICall(endpoint, requestData) {
    const timestamp = Date.now()
    const endpointType = this.getEndpointType(endpoint)
    const cost = endpointPricing[endpointType].cost
    
    try {
      // Check rate limits first
      await this.checkRateLimit(endpoint)
      
      // Track the usage
      const usageKey = \`usage:\${this.customerId}:\${this.getCurrentBillingPeriod()}\`
      const detailKey = \`details:\${this.customerId}:\${this.getCurrentBillingPeriod()}\`
      
      // Atomic update of usage counters
      const pipeline = this.redis.pipeline()
      
      // Update total requests
      pipeline.hincrby(usageKey, 'total_requests', 1)
      pipeline.hincrby(usageKey, \`\${endpointType}_requests\`, 1)
      pipeline.hincrby(usageKey, 'total_cost', cost)
      
      // Store detailed usage record
      pipeline.lpush(detailKey, JSON.stringify({
        timestamp,
        endpoint,
        endpointType,
        cost,
        requestId: requestData.requestId,
        responseTime: requestData.responseTime,
        statusCode: requestData.statusCode
      }))
      
      // Set expiration for detailed logs (keep for 90 days)
      pipeline.expire(detailKey, 90 * 24 * 60 * 60)
      
      await pipeline.exec()
      
      // Check for overage alerts
      await this.checkOverageAlerts()
      
      return {
        success: true,
        cost: cost,
        requestsThisPeriod: await this.getCurrentUsage()
      }
      
    } catch (error) {
      console.error('Usage tracking failed:', error)
      // Don't fail the API call, but log for review
      await this.logTrackingError(endpoint, error)
      throw error
    }
  }

  async checkRateLimit(endpoint) {
    const tierLimits = pricingTiers[this.tier].rateLimits
    const endpointType = this.getEndpointType(endpoint)
    
    // Check requests per second
    const rpsKey = \`rps:\${this.customerId}:\${Math.floor(Date.now() / 1000)}\`
    const currentRPS = await this.redis.incr(rpsKey)
    await this.redis.expire(rpsKey, 1)
    
    if (currentRPS > tierLimits.requestsPerSecond) {
      throw new Error('Rate limit exceeded: requests per second')
    }
    
    // Check requests per hour
    const rphKey = \`rph:\${this.customerId}:\${Math.floor(Date.now() / (60 * 60 * 1000))}\`
    const currentRPH = await this.redis.incr(rphKey)
    await this.redis.expire(rphKey, 3600)
    
    if (currentRPH > tierLimits.requestsPerHour) {
      throw new Error('Rate limit exceeded: requests per hour')
    }
  }

  async getCurrentUsage() {
    const usageKey = \`usage:\${this.customerId}:\${this.getCurrentBillingPeriod()}\`
    const usage = await this.redis.hgetall(usageKey)
    
    return {
      totalRequests: parseInt(usage.total_requests || 0),
      totalCost: parseFloat(usage.total_cost || 0),
      basicRequests: parseInt(usage.basic_requests || 0),
      premiumRequests: parseInt(usage.premium_requests || 0),
      aiRequests: parseInt(usage.ai_requests || 0),
      bulkRequests: parseInt(usage.bulk_requests || 0)
    }
  }

  async checkOverageAlerts() {
    const usage = await this.getCurrentUsage()
    const tierConfig = pricingTiers[this.tier]
    const overageCount = Math.max(0, usage.totalRequests - tierConfig.includedRequests)
    
    if (overageCount > 0) {
      const overageCost = overageCount * tierConfig.overageRate
      
      // Send alerts at different thresholds
      const usagePercentage = (usage.totalRequests / tierConfig.includedRequests) * 100
      
      if (usagePercentage >= 80 && !await this.hasAlertBeenSent(80)) {
        await this.sendUsageAlert(80, usage, overageCost)
      }
      
      if (usagePercentage >= 100 && !await this.hasAlertBeenSent(100)) {
        await this.sendUsageAlert(100, usage, overageCost)
      }
    }
  }

  getCurrentBillingPeriod() {
    const now = new Date()
    return \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}\`
  }

  getEndpointType(endpoint) {
    if (endpoint.includes('/ai/')) return 'ai'
    if (endpoint.includes('/premium/')) return 'premium'
    if (endpoint.includes('/bulk/')) return 'bulk'
    return 'basic'
  }
}`,
          language: "JavaScript",
          notes: [
            "Use Redis pipelines for atomic usage updates",
            "Implement comprehensive rate limiting at multiple levels",
            "Send proactive overage alerts to prevent surprise bills",
            "Store detailed logs for usage analysis and billing disputes"
          ]
        },
        {
          title: "Generate Usage-Based Invoices",
          description: "Create automated invoicing based on metered usage and pricing tiers.",
          code: `class UsageInvoiceGenerator {
  async generateMonthlyInvoice(customerId, billingPeriod) {
    try {
      const customer = await getCustomer(customerId)
      const tierConfig = pricingTiers[customer.tier]
      const usage = await this.getUsageForPeriod(customerId, billingPeriod)
      
      // Calculate charges
      const charges = this.calculateCharges(usage, tierConfig)
      
      // Generate invoice
      const invoice = {
        id: generateInvoiceId(),
        customerId: customerId,
        billingPeriod: billingPeriod,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        charges: charges,
        subtotal: charges.total,
        taxes: charges.total * 0.1, // 10% tax
        total: charges.total * 1.1,
        currency: 'USDC',
        status: 'generated'
      }
      
      // Create payment for invoice
      const payment = await this.createInvoicePayment(invoice, customer)
      
      // Send invoice to customer
      await this.sendInvoiceEmail(invoice, customer, usage)
      
      return { invoice, paymentLink: payment.getPaymentUrl() }
      
    } catch (error) {
      console.error('Invoice generation failed:', error)
      throw new Error(\`Failed to generate invoice: \${error.message}\`)
    }
  }

  calculateCharges(usage, tierConfig) {
    const charges = {
      monthlyFee: tierConfig.monthlyFee,
      includedRequests: tierConfig.includedRequests,
      actualRequests: usage.totalRequests,
      overageRequests: Math.max(0, usage.totalRequests - tierConfig.includedRequests),
      overageRate: tierConfig.overageRate,
      overageCharges: 0,
      breakdown: {}
    }
    
    // Calculate overage charges
    charges.overageCharges = charges.overageRequests * charges.overageRate
    
    // Calculate breakdown by endpoint type
    Object.keys(endpointPricing).forEach(type => {
      const requestCount = usage[\`\${type}Requests\`] || 0
      const unitCost = endpointPricing[type].cost
      
      charges.breakdown[type] = {
        requests: requestCount,
        unitCost: unitCost,
        total: requestCount * unitCost * charges.overageRate
      }
    })
    
    charges.total = charges.monthlyFee + charges.overageCharges
    
    return charges
  }

  async createInvoicePayment(invoice, customer) {
    const payment = SVMPay.createPayment({
      recipient: apiBillingManager.serviceWallet,
      amount: invoice.total,
      token: invoice.currency,
      metadata: {
        customerId: customer.id,
        invoiceId: invoice.id,
        billingPeriod: invoice.billingPeriod,
        paymentType: 'api-usage-invoice'
      }
    })

    payment.onSuccess(async (result) => {
      await this.handleInvoicePayment(invoice.id, result)
      await this.updateCustomerStatus(customer.id, 'active')
    })

    payment.onFailure(async (error) => {
      await this.handlePaymentFailure(invoice.id, error)
      // Start grace period
      await this.startGracePeriod(customer.id)
    })

    return payment
  }

  async handleInvoicePayment(invoiceId, paymentResult) {
    // Update invoice status
    await database.query(
      'UPDATE invoices SET status = ?, paid_at = ?, transaction_id = ? WHERE id = ?',
      ['paid', new Date(), paymentResult.transactionId, invoiceId]
    )

    // Reset usage counters for new billing period
    const invoice = await getInvoice(invoiceId)
    await this.resetUsageCounters(invoice.customerId)

    // Send payment confirmation
    await sendPaymentConfirmation(invoice, paymentResult)
  }

  async startGracePeriod(customerId) {
    const gracePeriodEnd = new Date(Date.now() + apiBillingManager.gracePeriod * 1000)
    
    await database.query(
      'UPDATE customers SET status = ?, grace_period_end = ? WHERE id = ?',
      ['grace_period', gracePeriodEnd, customerId]
    )

    // Send grace period notification
    await sendGracePeriodNotification(customerId, gracePeriodEnd)
    
    // Schedule account suspension if payment not received
    setTimeout(async () => {
      await this.checkGracePeriodExpiry(customerId)
    }, apiBillingManager.gracePeriod * 1000)
  }
}

// Background job to generate monthly invoices
async function generateMonthlyInvoices() {
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const billingPeriod = \`\${lastMonth.getFullYear()}-\${String(lastMonth.getMonth() + 1).padStart(2, '0')}\`
  
  const activeCustomers = await getActiveCustomers()
  const invoiceGenerator = new UsageInvoiceGenerator()
  
  for (const customer of activeCustomers) {
    try {
      await invoiceGenerator.generateMonthlyInvoice(customer.id, billingPeriod)
    } catch (error) {
      console.error(\`Failed to generate invoice for customer \${customer.id}:\`, error)
    }
  }
}

// Run on the 1st of each month
cron.schedule('0 0 1 * *', generateMonthlyInvoices)`,
          language: "JavaScript",
          notes: [
            "Calculate charges accurately including overages and taxes",
            "Implement grace periods for failed payments to maintain service",
            "Automate monthly invoice generation with proper error handling",
            "Track payment status and update customer service levels accordingly"
          ]
        }
      ]}
      conclusion="You've built a comprehensive API usage billing system with real-time metering and automated invoicing! The system tracks usage accurately, enforces rate limits, calculates charges based on complex pricing models, and handles payments seamlessly. API service providers can now monetize their services effectively with transparent usage-based billing."
      nextSteps={[
        "Add usage analytics dashboard for customers",
        "Implement custom pricing for enterprise customers",
        "Create API key management and rotation",
        "Add usage forecasting and budgeting tools",
        "Implement multi-region usage aggregation",
        "Create detailed usage reports and insights"
      ]}
      relatedTutorials={[
        { title: "SaaS Subscription Billing", path: "/docs/tutorials/saas/subscription-billing" },
        { title: "Software License Management", path: "/docs/tutorials/saas/license-management" },
        { title: "Enterprise Treasury Management", path: "/docs/tutorials/enterprise/treasury-management" }
      ]}
    />
  )
}

export function SoftwareLicenseManagementTutorial() {
  return (
    <TutorialLayout
      title="Software License Management"
      description="Build a comprehensive software licensing system with activation, validation, and automated renewals"
      level="Advanced"
      time="2.5 hours"
      category="SaaS & Service Tutorials"
      categoryPath="/docs/tutorials/saas"
      overview="Create a complete software licensing system that handles license generation, activation, validation, and renewal. This tutorial covers different license types, hardware fingerprinting, offline validation, and automated license management."
      prerequisites={[
        "Understanding of software licensing concepts",
        "Experience with encryption and digital signatures",
        "Knowledge of hardware fingerprinting",
        "Understanding of software activation flows"
      ]}
      steps={[
        {
          title: "Set Up License Management Infrastructure",
          description: "Initialize the licensing system with generation, validation, and storage.",
          code: `import { LicenseManager, CryptographicSigner, HardwareFingerprint } from '@svm-pay/sdk'
import crypto from 'crypto'

const licenseManager = new LicenseManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  vendorWallet: process.env.SOFTWARE_VENDOR_WALLET,
  signingKey: process.env.LICENSE_SIGNING_KEY,
  encryptionKey: process.env.LICENSE_ENCRYPTION_KEY,
  validationEndpoint: process.env.LICENSE_VALIDATION_ENDPOINT,
  allowOfflineValidation: true,
  maxOfflineDays: 30
})

// Define license types and features
const licenseTypes = {
  trial: {
    duration: 30 * 24 * 60 * 60, // 30 days
    features: ['basic-features'],
    maxActivations: 1,
    allowOffline: true,
    price: 0
  },
  personal: {
    duration: 365 * 24 * 60 * 60, // 1 year
    features: ['basic-features', 'advanced-features'],
    maxActivations: 2,
    allowOffline: true,
    price: 99
  },
  professional: {
    duration: 365 * 24 * 60 * 60, // 1 year
    features: ['basic-features', 'advanced-features', 'pro-features'],
    maxActivations: 5,
    allowOffline: true,
    price: 299
  },
  enterprise: {
    duration: 365 * 24 * 60 * 60, // 1 year
    features: ['all-features'],
    maxActivations: -1, // Unlimited
    allowOffline: true,
    price: 999,
    requiresApproval: true
  }
}

// License data structure
class SoftwareLicense {
  constructor(licenseData) {
    this.id = licenseData.id || generateLicenseId()
    this.key = licenseData.key || generateLicenseKey()
    this.type = licenseData.type
    this.customerId = licenseData.customerId
    this.productId = licenseData.productId
    this.features = licenseTypes[this.type].features
    this.issueDate = new Date()
    this.expiryDate = new Date(Date.now() + licenseTypes[this.type].duration * 1000)
    this.maxActivations = licenseTypes[this.type].maxActivations
    this.currentActivations = 0
    this.activatedDevices = []
    this.status = 'active'
    this.renewalToken = generateRenewalToken()
  }

  generateLicenseFile() {
    const licenseData = {
      id: this.id,
      key: this.key,
      type: this.type,
      productId: this.productId,
      features: this.features,
      issueDate: this.issueDate.toISOString(),
      expiryDate: this.expiryDate.toISOString(),
      maxActivations: this.maxActivations,
      signature: this.generateSignature()
    }

    // Encrypt sensitive data
    const encryptedData = this.encryptLicenseData(licenseData)
    
    return {
      license: encryptedData,
      publicKey: licenseManager.getPublicKey(),
      version: '1.0'
    }
  }

  generateSignature() {
    const dataToSign = [
      this.id,
      this.key,
      this.type,
      this.productId,
      this.expiryDate.toISOString(),
      this.maxActivations
    ].join('|')

    return CryptographicSigner.sign(dataToSign, licenseManager.signingKey)
  }

  encryptLicenseData(data) {
    const algorithm = 'aes-256-gcm'
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(algorithm, licenseManager.encryptionKey)
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    }
  }
}`,
          language: "JavaScript",
          notes: [
            "Use strong encryption for license data protection",
            "Implement digital signatures to prevent license tampering",
            "Design flexible license types to meet different customer needs",
            "Generate cryptographically secure license keys and tokens"
          ]
        },
        {
          title: "Implement License Activation and Validation",
          description: "Handle software activation with hardware fingerprinting and validation.",
          code: `class LicenseActivationManager {
  async activateLicense(licenseKey, hardwareInfo, softwareInfo) {
    try {
      // Validate license key format
      if (!this.isValidLicenseKeyFormat(licenseKey)) {
        throw new Error('Invalid license key format')
      }

      // Retrieve license from database
      const license = await this.getLicenseByKey(licenseKey)
      if (!license) {
        throw new Error('License not found')
      }

      // Check license status
      if (license.status !== 'active') {
        throw new Error(\`License is \${license.status}\`)
      }

      // Check expiry
      if (new Date() > license.expiryDate) {
        throw new Error('License has expired')
      }

      // Generate hardware fingerprint
      const hardwareFingerprint = HardwareFingerprint.generate(hardwareInfo)

      // Check if device is already activated
      const existingActivation = license.activatedDevices.find(
        device => device.fingerprint === hardwareFingerprint
      )

      if (existingActivation) {
        // Return existing activation
        return {
          success: true,
          activationId: existingActivation.id,
          licenseInfo: this.createLicenseInfo(license),
          message: 'Device already activated'
        }
      }

      // Check activation limits
      if (license.maxActivations !== -1 && 
          license.currentActivations >= license.maxActivations) {
        throw new Error('Maximum activations exceeded')
      }

      // Create new activation
      const activation = {
        id: generateActivationId(),
        licenseId: license.id,
        fingerprint: hardwareFingerprint,
        deviceInfo: {
          hostname: hardwareInfo.hostname,
          platform: hardwareInfo.platform,
          architecture: hardwareInfo.architecture,
          cpuModel: hardwareInfo.cpuModel,
          totalMemory: hardwareInfo.totalMemory
        },
        softwareInfo: {
          version: softwareInfo.version,
          buildNumber: softwareInfo.buildNumber
        },
        activatedAt: new Date(),
        lastValidation: new Date(),
        validationCount: 1
      }

      // Save activation
      license.activatedDevices.push(activation)
      license.currentActivations++
      await this.saveLicense(license)

      // Generate activation token
      const activationToken = this.generateActivationToken(license, activation)

      // Log activation
      await this.logActivation(license.id, activation.id, hardwareFingerprint)

      return {
        success: true,
        activationId: activation.id,
        activationToken: activationToken,
        licenseInfo: this.createLicenseInfo(license),
        nextValidation: this.calculateNextValidation()
      }

    } catch (error) {
      console.error('License activation failed:', error)
      await this.logActivationFailure(licenseKey, error)
      throw error
    }
  }

  async validateLicense(activationToken, hardwareInfo) {
    try {
      // Decrypt and verify activation token
      const tokenData = this.verifyActivationToken(activationToken)
      
      // Get license and activation
      const license = await this.getLicense(tokenData.licenseId)
      const activation = license.activatedDevices.find(
        device => device.id === tokenData.activationId
      )

      if (!activation) {
        throw new Error('Activation not found')
      }

      // Verify hardware fingerprint
      const currentFingerprint = HardwareFingerprint.generate(hardwareInfo)
      if (activation.fingerprint !== currentFingerprint) {
        throw new Error('Hardware fingerprint mismatch')
      }

      // Check license status and expiry
      if (license.status !== 'active') {
        throw new Error(\`License is \${license.status}\`)
      }

      if (new Date() > license.expiryDate) {
        throw new Error('License has expired')
      }

      // Update validation timestamp
      activation.lastValidation = new Date()
      activation.validationCount++
      await this.saveLicense(license)

      return {
        valid: true,
        licenseInfo: this.createLicenseInfo(license),
        activationInfo: {
          activatedAt: activation.activatedAt,
          validationCount: activation.validationCount,
          nextValidation: this.calculateNextValidation()
        }
      }

    } catch (error) {
      console.error('License validation failed:', error)
      return {
        valid: false,
        error: error.message,
        allowGracePeriod: this.shouldAllowGracePeriod(error)
      }
    }
  }

  generateActivationToken(license, activation) {
    const tokenData = {
      licenseId: license.id,
      activationId: activation.id,
      fingerprint: activation.fingerprint,
      issueTime: Date.now(),
      expiryTime: license.expiryDate.getTime()
    }

    return CryptographicSigner.signAndEncrypt(
      JSON.stringify(tokenData),
      licenseManager.signingKey,
      licenseManager.encryptionKey
    )
  }

  createLicenseInfo(license) {
    return {
      type: license.type,
      features: license.features,
      expiryDate: license.expiryDate,
      activationsUsed: license.currentActivations,
      maxActivations: license.maxActivations,
      renewable: true,
      renewalUrl: \`\${process.env.LICENSE_PORTAL_URL}/renew/\${license.renewalToken}\`
    }
  }

  calculateNextValidation() {
    // Require validation every 7 days when online
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
}`,
          language: "JavaScript",
          notes: [
            "Use hardware fingerprinting to prevent license sharing",
            "Implement graceful handling of validation failures",
            "Track activation attempts and validation frequency",
            "Provide clear error messages for different failure scenarios"
          ]
        },
        {
          title: "Handle License Renewals and Payments",
          description: "Automate license renewal process with payment integration.",
          code: `class LicenseRenewalManager {
  async initiateRenewal(renewalToken, renewalOptions = {}) {
    try {
      // Validate renewal token
      const license = await this.getLicenseByRenewalToken(renewalToken)
      if (!license) {
        throw new Error('Invalid renewal token')
      }

      // Check if renewal is allowed
      if (!this.isRenewalAllowed(license)) {
        throw new Error('License renewal not allowed')
      }

      // Calculate renewal pricing
      const renewalPricing = this.calculateRenewalPricing(license, renewalOptions)

      // Create renewal order
      const renewalOrder = {
        id: generateRenewalOrderId(),
        licenseId: license.id,
        customerId: license.customerId,
        currentType: license.type,
        newType: renewalOptions.upgradeType || license.type,
        pricing: renewalPricing,
        discounts: this.calculateDiscounts(license, renewalOptions),
        expiryDate: license.expiryDate,
        newExpiryDate: this.calculateNewExpiryDate(license, renewalOptions),
        status: 'pending',
        createdAt: new Date()
      }

      // Generate payment for renewal
      const renewalPayment = await this.createRenewalPayment(renewalOrder)

      return {
        renewalOrder: renewalOrder,
        paymentLink: renewalPayment.getPaymentUrl(),
        pricing: renewalPricing
      }

    } catch (error) {
      console.error('License renewal initiation failed:', error)
      throw new Error(\`Renewal failed: \${error.message}\`)
    }
  }

  calculateRenewalPricing(license, options) {
    const currentType = licenseTypes[license.type]
    const newType = licenseTypes[options.upgradeType || license.type]
    
    let basePrice = newType.price
    
    // Apply early renewal discount
    const daysUntilExpiry = Math.ceil(
      (license.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    
    let discount = 0
    if (daysUntilExpiry > 30) {
      discount = 0.1 // 10% early renewal discount
    }

    // Apply loyalty discount
    const licenseAge = Date.now() - license.issueDate.getTime()
    const yearsAsCustomer = Math.floor(licenseAge / (365 * 24 * 60 * 60 * 1000))
    
    if (yearsAsCustomer >= 3) {
      discount += 0.15 // 15% loyalty discount for 3+ years
    } else if (yearsAsCustomer >= 1) {
      discount += 0.05 // 5% loyalty discount for 1+ years
    }

    // Calculate upgrade credit if downgrading
    let upgradeCredit = 0
    if (options.upgradeType && options.upgradeType !== license.type) {
      const remainingValue = this.calculateRemainingValue(license)
      const newTypeValue = newType.price
      upgradeCredit = Math.max(0, remainingValue - newTypeValue)
    }

    const discountAmount = basePrice * Math.min(discount, 0.3) // Max 30% discount
    const total = Math.max(basePrice - discountAmount - upgradeCredit, 0)

    return {
      basePrice: basePrice,
      discountPercentage: discount * 100,
      discountAmount: discountAmount,
      upgradeCredit: upgradeCredit,
      total: total
    }
  }

  async createRenewalPayment(renewalOrder) {
    const payment = SVMPay.createPayment({
      recipient: licenseManager.vendorWallet,
      amount: renewalOrder.pricing.total,
      token: 'USDC',
      metadata: {
        renewalOrderId: renewalOrder.id,
        licenseId: renewalOrder.licenseId,
        customerId: renewalOrder.customerId,
        currentType: renewalOrder.currentType,
        newType: renewalOrder.newType,
        paymentType: 'license-renewal'
      }
    })

    payment.onSuccess(async (result) => {
      await this.processSuccessfulRenewal(renewalOrder, result)
    })

    payment.onFailure(async (error) => {
      await this.handleRenewalPaymentFailure(renewalOrder, error)
    })

    return payment
  }

  async processSuccessfulRenewal(renewalOrder, paymentResult) {
    try {
      const license = await this.getLicense(renewalOrder.licenseId)
      
      // Update license
      license.type = renewalOrder.newType
      license.features = licenseTypes[renewalOrder.newType].features
      license.expiryDate = renewalOrder.newExpiryDate
      license.maxActivations = licenseTypes[renewalOrder.newType].maxActivations
      license.lastRenewalDate = new Date()
      license.renewalPaymentId = paymentResult.transactionId

      // Generate new renewal token for next renewal
      license.renewalToken = generateRenewalToken()

      // Save updated license
      await this.saveLicense(license)

      // Update renewal order status
      renewalOrder.status = 'completed'
      renewalOrder.completedAt = new Date()
      renewalOrder.transactionId = paymentResult.transactionId
      await this.saveRenewalOrder(renewalOrder)

      // Generate new license file for customer
      const newLicenseFile = license.generateLicenseFile()
      
      // Send renewal confirmation
      await this.sendRenewalConfirmation(license, renewalOrder, newLicenseFile)

      // Log successful renewal
      await this.logRenewal(license.id, renewalOrder.id, 'success')

      return {
        success: true,
        newExpiryDate: license.expiryDate,
        licenseFile: newLicenseFile
      }

    } catch (error) {
      console.error('Renewal processing failed:', error)
      await this.handleRenewalProcessingError(renewalOrder, error)
    }
  }

  async sendRenewalReminders(license) {
    const daysUntilExpiry = Math.ceil(
      (license.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    const customer = await getCustomer(license.customerId)
    const renewalUrl = \`\${process.env.LICENSE_PORTAL_URL}/renew/\${license.renewalToken}\`

    // Send reminders at different intervals
    if ([30, 14, 7, 1].includes(daysUntilExpiry)) {
      await sendRenewalReminder({
        to: customer.email,
        licenseType: license.type,
        productName: license.productName,
        expiryDate: license.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        renewalUrl: renewalUrl,
        discountAvailable: daysUntilExpiry > 7
      })
    }
  }
}

// Background job to check for expiring licenses
async function checkExpiringLicenses() {
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const expiringLicenses = await getExpiringLicenses(thirtyDaysFromNow)
  
  const renewalManager = new LicenseRenewalManager()
  
  for (const license of expiringLicenses) {
    try {
      await renewalManager.sendRenewalReminders(license)
    } catch (error) {
      console.error(\`Failed to send renewal reminder for license \${license.id}:\`, error)
    }
  }
}

// Run daily to check for expiring licenses
cron.schedule('0 9 * * *', checkExpiringLicenses)`,
          language: "JavaScript",
          notes: [
            "Implement flexible pricing with discounts for loyalty and early renewal",
            "Handle license upgrades and downgrades with prorated pricing",
            "Send proactive renewal reminders at appropriate intervals",
            "Generate new license files automatically upon successful renewal"
          ]
        }
      ]}
      conclusion="You've built a comprehensive software licensing system with activation, validation, and automated renewals! The system handles different license types, enforces activation limits with hardware fingerprinting, processes payments securely, and manages the complete license lifecycle. Software vendors can now protect their intellectual property while providing a smooth experience for legitimate customers."
      nextSteps={[
        "Add license analytics and usage reporting",
        "Implement license transfer between devices",
        "Create customer self-service portal for license management",
        "Add integration with software update systems",
        "Implement license pooling for enterprise customers",
        "Create comprehensive audit logs for compliance"
      ]}
      relatedTutorials={[
        { title: "Digital Product Store", path: "/docs/tutorials/ecommerce/digital-products" },
        { title: "SaaS Subscription Billing", path: "/docs/tutorials/saas/subscription-billing" },
        { title: "API Usage Billing", path: "/docs/tutorials/saas/api-billing" }
      ]}
    />
  )
}
import { TutorialLayout } from '../../components/ui/TutorialLayout'

export function OnlineStoreIntegrationTutorial() {
  return (
    <TutorialLayout
      title="Online Store Integration"
      description="Build a complete e-commerce store with Solana payments integration"
      level="Beginner"
      time="30 minutes"
      category="E-commerce Tutorials"
      categoryPath="/docs/tutorials/ecommerce"
      overview="Learn how to integrate SVM-Pay into your e-commerce store for seamless cryptocurrency payments. This tutorial covers everything from basic setup to handling order confirmation and inventory management."
      prerequisites={[
        "Basic React/JavaScript knowledge",
        "Understanding of e-commerce concepts",
        "Node.js development environment",
        "SVM-Pay SDK installed"
      ]}
      steps={[
        {
          title: "Install and Initialize SVM-Pay",
          description: "Set up SVM-Pay in your e-commerce application with the necessary dependencies.",
          code: `npm install @svm-pay/sdk @svm-pay/react

// Initialize SVM-Pay in your main app file
import { SVMPay } from '@svm-pay/sdk'

const svmPay = new SVMPay({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  apiKey: process.env.SVM_PAY_API_KEY
})`,
          language: "Shell / JavaScript",
          notes: [
            "Store your API keys securely in environment variables",
            "Use devnet for testing and mainnet for production",
            "The SDK automatically handles network detection"
          ]
        },
        {
          title: "Create Payment Component",
          description: "Build a reusable payment component that can be used throughout your store.",
          code: `import React, { useState } from 'react'
import { useSVMPay } from '@svm-pay/react'

export function CheckoutPayment({ cartItems, total, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const { executePayment } = useSVMPay()

  const handlePayment = async (paymentData) => {
    setLoading(true)
    try {
      // Generate unique order ID
      const orderId = generateOrderId()
      
      const payment = await executePayment({
        recipient: process.env.REACT_APP_STORE_WALLET,
        amount: total,
        token: 'USDC',
        metadata: {
          orderId,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          customerEmail: paymentData.email,
          timestamp: new Date().toISOString()
        }
      })

      if (payment.status === 'SUCCESS') {
        await onSuccess(payment, orderId)
      }
    } catch (error) {
      await onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-form">
      <PaymentForm 
        onSubmit={handlePayment} 
        amount={total}
        loading={loading}
      />
    </div>
  )
}

function generateOrderId() {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}`,
          language: "React Component",
          notes: [
            "Always generate unique order IDs to prevent duplicates",
            "Include comprehensive metadata for order tracking",
            "Handle loading states for better user experience"
          ]
        },
        {
          title: "Handle Payment Success",
          description: "Implement order processing logic that runs after successful payment confirmation.",
          code: `async function handlePaymentSuccess(payment, orderId) {
  try {
    // 1. Update inventory
    await updateInventory(cartItems)
    
    // 2. Create order record in database
    const order = await createOrder({
      id: orderId,
      transactionId: payment.transactionId,
      customerEmail: payment.metadata.customerEmail,
      items: payment.metadata.items,
      total: payment.amount,
      status: 'PAID',
      paymentMethod: 'CRYPTO',
      createdAt: new Date()
    })

    // 3. Send order confirmation email
    await sendOrderConfirmation({
      to: payment.metadata.customerEmail,
      orderId,
      transactionId: payment.transactionId,
      items: cartItems,
      total: payment.amount
    })

    // 4. Clear shopping cart
    clearCart()

    // 5. Redirect to success page
    window.location.href = \`/order-success?id=\${orderId}\`
    
  } catch (error) {
    console.error('Post-payment processing failed:', error)
    // Even if post-processing fails, payment was successful
    // Handle this gracefully - maybe queue for retry
    await queueForRetry(payment, orderId)
  }
}

async function updateInventory(cartItems) {
  for (const item of cartItems) {
    await fetch('/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: item.id,
        quantityChange: -item.quantity,
        reason: 'PURCHASE'
      })
    })
  }
}`,
          language: "JavaScript",
          notes: [
            "Always update inventory to prevent overselling",
            "Send confirmation emails for customer satisfaction",
            "Implement retry logic for failed post-processing",
            "Keep transaction IDs for reconciliation"
          ]
        }
      ]}
      conclusion="You've successfully integrated SVM-Pay into your e-commerce store! Your customers can now pay with USDC and other supported cryptocurrencies. The integration handles inventory management, order confirmation, and provides a smooth user experience."
      nextSteps={[
        "Test the integration thoroughly on devnet before going live",
        "Set up webhook endpoints for payment status updates",
        "Implement refund functionality for returned orders",
        "Add support for multiple cryptocurrencies",
        "Set up monitoring and alerting for payment failures",
        "Consider implementing subscription payments for recurring orders"
      ]}
      relatedTutorials={[
        { title: "Marketplace with Escrow", path: "/docs/tutorials/ecommerce/marketplace-escrow" },
        { title: "Subscription Box Service", path: "/docs/tutorials/ecommerce/subscription-box" },
        { title: "Digital Product Store", path: "/docs/tutorials/ecommerce/digital-products" }
      ]}
    />
  )
}

export function MarketplaceEscrowTutorial() {
  return (
    <TutorialLayout
      title="Marketplace with Escrow"
      description="Build a multi-vendor marketplace with secure escrow payments and dispute resolution"
      level="Advanced"
      time="2 hours"
      category="E-commerce Tutorials"
      categoryPath="/docs/tutorials/ecommerce"
      overview="Create a sophisticated marketplace where buyers and sellers can transact safely using escrow services. This tutorial covers escrow creation, fund holding, automatic release conditions, and dispute resolution mechanisms."
      prerequisites={[
        "Completed Online Store Integration tutorial",
        "Understanding of escrow concepts",
        "Experience with smart contracts",
        "Knowledge of multisig wallets"
      ]}
      steps={[
        {
          title: "Set Up Escrow Manager",
          description: "Initialize the escrow system and configure the basic escrow parameters.",
          code: `import { EscrowManager, MultisigWallet } from '@svm-pay/sdk'

// Initialize escrow manager with configuration
const escrowManager = new EscrowManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  arbitrator: process.env.MARKETPLACE_ARBITRATOR_WALLET,
  defaultTimeout: 7 * 24 * 60 * 60, // 7 days in seconds
  feePercentage: 2.5, // 2.5% marketplace fee
  minimumEscrowAmount: 10 // Minimum $10 USDC
})

// Configure escrow rules
const escrowRules = {
  autoReleaseAfter: 7 * 24 * 60 * 60, // Auto-release after 7 days
  requiresBuyerConfirmation: true,
  allowsPartialRelease: false,
  maxDisputePeriod: 30 * 24 * 60 * 60, // 30 days dispute window
  arbitrationFee: 5 // $5 USDC arbitration fee
}`,
          language: "JavaScript",
          notes: [
            "Set reasonable timeouts to balance security and user experience",
            "Configure arbitrator wallet with multisig for security",
            "Adjust fees based on your marketplace economics"
          ]
        },
        {
          title: "Create Escrow for Marketplace Transaction",
          description: "Implement escrow creation when a buyer purchases from a seller.",
          code: `async function createMarketplaceEscrow(transaction) {
  const { seller, buyer, item, agreedPrice } = transaction

  try {
    // Validate all parties and item
    await validateTransaction(transaction)

    // Calculate fees
    const marketplaceFee = agreedPrice * (escrowRules.feePercentage / 100)
    const arbitrationFee = escrowRules.arbitrationFee
    const totalAmount = agreedPrice + marketplaceFee + arbitrationFee

    // Create escrow account
    const escrow = await escrowManager.create({
      buyer: buyer.wallet,
      seller: seller.wallet,
      arbitrator: process.env.MARKETPLACE_ARBITRATOR_WALLET,
      amount: totalAmount,
      token: 'USDC',
      metadata: {
        itemId: item.id,
        itemTitle: item.title,
        sellerId: seller.id,
        buyerId: buyer.id,
        agreedPrice,
        marketplaceFee,
        arbitrationFee,
        createdAt: new Date().toISOString()
      },
      releaseConditions: {
        autoReleaseAfter: escrowRules.autoReleaseAfter,
        requiresConfirmation: escrowRules.requiresBuyerConfirmation,
        allowsPartialRelease: escrowRules.allowsPartialRelease
      }
    })

    // Set up event handlers
    setupEscrowEventHandlers(escrow, transaction)

    // Notify both parties
    await notifyEscrowCreated(escrow, seller, buyer)

    // Update item status to "pending"
    await updateItemStatus(item.id, 'PENDING_PAYMENT')

    return escrow

  } catch (error) {
    console.error('Escrow creation failed:', error)
    throw new Error(\`Failed to create escrow: \${error.message}\`)
  }
}`,
          language: "JavaScript",
          notes: [
            "Always validate all transaction parameters before creating escrow",
            "Include all necessary metadata for dispute resolution",
            "Notify all parties when escrow is created",
            "Update item status to prevent double-selling"
          ]
        }
      ]}
      conclusion="You've built a comprehensive marketplace with secure escrow functionality! Buyers and sellers can now transact safely with automatic fund holding, delivery confirmation, and dispute resolution. The system provides transparency and security for all parties involved."
      nextSteps={[
        "Implement reputation system for buyers and sellers",
        "Add automated delivery tracking integration",
        "Create mobile app for marketplace access",
        "Set up automated compliance reporting",
        "Implement multi-currency escrow support",
        "Add insurance options for high-value transactions"
      ]}
      relatedTutorials={[
        { title: "Online Store Integration", path: "/docs/tutorials/ecommerce/online-store" },
        { title: "B2B Invoice Processing", path: "/docs/tutorials/enterprise/b2b-invoicing" },
        { title: "Freelance Payment Escrow", path: "/docs/tutorials/saas/freelance-escrow" }
      ]}
    />
  )
}

export function SubscriptionBoxTutorial() {
  return (
    <TutorialLayout
      title="Subscription Box Service"
      description="Build a recurring subscription service with automated payments and box curation"
      level="Intermediate"
      time="1.5 hours"
      category="E-commerce Tutorials"
      categoryPath="/docs/tutorials/ecommerce"
      overview="Create a subscription box service that automatically charges customers monthly, curates products, and manages inventory. This tutorial covers subscription management, recurring payments, and automated fulfillment."
      prerequisites={[
        "Completed Online Store Integration tutorial",
        "Understanding of subscription billing",
        "Experience with cron jobs or scheduling",
        "Knowledge of inventory management"
      ]}
      steps={[
        {
          title: "Set Up Subscription Manager",
          description: "Initialize the subscription system with recurring payment capabilities.",
          code: `import { SubscriptionManager, RecurringPayment } from '@svm-pay/sdk'

const subscriptionManager = new SubscriptionManager({
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
  merchantWallet: process.env.MERCHANT_WALLET,
  defaultCurrency: 'USDC',
  gracePeriod: 3 * 24 * 60 * 60, // 3 days grace period
  maxRetries: 3,
  retryInterval: 24 * 60 * 60 // 24 hours between retries
})

// Define subscription plans
const subscriptionPlans = {
  starter: {
    id: 'starter',
    name: 'Starter Box',
    price: 29.99,
    interval: 'monthly',
    items: 3,
    description: '3 curated items monthly'
  },
  premium: {
    id: 'premium',
    name: 'Premium Box',
    price: 49.99,
    interval: 'monthly',
    items: 5,
    description: '5 premium items monthly'
  },
  deluxe: {
    id: 'deluxe',
    name: 'Deluxe Box',
    price: 79.99,
    interval: 'monthly',
    items: 8,
    description: '8 luxury items monthly'
  }
}`,
          language: "JavaScript",
          notes: [
            "Set appropriate grace periods for failed payments",
            "Configure retry logic to handle temporary payment failures",
            "Design flexible subscription plans to meet different customer needs"
          ]
        },
        {
          title: "Create Subscription",
          description: "Implement subscription creation with customer onboarding.",
          code: `async function createSubscription(customerData, planId) {
  const plan = subscriptionPlans[planId]
  if (!plan) {
    throw new Error('Invalid subscription plan')
  }

  try {
    // Create subscription
    const subscription = await subscriptionManager.create({
      customerId: customerData.id,
      customerWallet: customerData.wallet,
      planId: plan.id,
      amount: plan.price,
      interval: plan.interval,
      startDate: new Date(),
      metadata: {
        customerEmail: customerData.email,
        customerName: customerData.name,
        shippingAddress: customerData.shippingAddress,
        preferences: customerData.preferences
      }
    })

    // Set up recurring payment
    const recurringPayment = await subscription.setupRecurring({
      paymentMethod: 'CRYPTO',
      token: 'USDC',
      autoRetry: true,
      notifyOnFailure: true
    })

    // Schedule first box curation
    await scheduleBoxCuration(subscription.id, plan)

    // Send welcome email
    await sendWelcomeEmail(customerData.email, subscription, plan)

    // Set up payment event handlers
    subscription.onPaymentSuccess(async (payment) => {
      await handleSuccessfulPayment(subscription, payment)
    })

    subscription.onPaymentFailure(async (failure) => {
      await handleFailedPayment(subscription, failure)
    })

    return subscription

  } catch (error) {
    console.error('Subscription creation failed:', error)
    throw new Error(\`Failed to create subscription: \${error.message}\`)
  }
}`,
          language: "JavaScript",
          notes: [
            "Always validate subscription plan before creation",
            "Set up proper event handlers for payment success/failure",
            "Send immediate welcome communications to engage customers",
            "Schedule the first box curation to ensure timely delivery"
          ]
        },
        {
          title: "Handle Recurring Payments",
          description: "Process monthly subscription payments and handle box fulfillment.",
          code: `async function handleSuccessfulPayment(subscription, payment) {
  try {
    // Update subscription status
    await subscription.updateStatus('ACTIVE')

    // Get customer's plan
    const plan = subscriptionPlans[subscription.planId]

    // Curate items for this month's box
    const curatedItems = await curateBoxItems(subscription, plan)

    // Create shipping order
    const shippingOrder = await createShippingOrder({
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      items: curatedItems,
      shippingAddress: subscription.metadata.shippingAddress,
      deliveryDate: getNextDeliveryDate()
    })

    // Update inventory
    await updateInventoryForItems(curatedItems)

    // Send shipment notification
    await sendShipmentNotification(
      subscription.metadata.customerEmail,
      shippingOrder,
      curatedItems
    )

    // Log successful billing
    await logBillingEvent({
      subscriptionId: subscription.id,
      amount: payment.amount,
      status: 'SUCCESS',
      paymentId: payment.id,
      billingDate: new Date()
    })

  } catch (error) {
    console.error('Post-payment processing failed:', error)
    // Even if fulfillment fails, payment was successful
    // Queue for manual review
    await queueForManualReview(subscription, payment, error)
  }
}

async function curateBoxItems(subscription, plan) {
  const customerPreferences = subscription.metadata.preferences || {}
  
  // Get available items based on customer preferences
  const availableItems = await getAvailableItems({
    category: customerPreferences.category || 'all',
    priceRange: plan.price / plan.items,
    excludeAllergies: customerPreferences.allergies || [],
    preferredBrands: customerPreferences.brands || []
  })

  // Select items for the box
  const selectedItems = await selectItems(availableItems, {
    count: plan.items,
    maxValue: plan.price * 0.8, // 80% of plan price for items
    variety: true,
    newItems: true
  })

  return selectedItems
}`,
          language: "JavaScript",
          notes: [
            "Always update subscription status after successful payment",
            "Implement intelligent curation based on customer preferences",
            "Handle fulfillment failures gracefully with manual review queues",
            "Keep detailed logs for billing and customer service"
          ]
        }
      ]}
      conclusion="You've created a complete subscription box service with automated recurring payments! The system handles monthly billing, intelligent product curation, inventory management, and shipping coordination. Customers receive curated boxes based on their preferences with seamless payment processing."
      nextSteps={[
        "Add subscription pause/resume functionality",
        "Implement customer feedback system for curation improvement",
        "Create admin dashboard for subscription management",
        "Add gift subscription capabilities",
        "Implement loyalty rewards program",
        "Set up analytics and reporting for business insights"
      ]}
      relatedTutorials={[
        { title: "Online Store Integration", path: "/docs/tutorials/ecommerce/online-store" },
        { title: "SaaS Subscription Billing", path: "/docs/tutorials/saas/subscription-billing" },
        { title: "Inventory Management System", path: "/docs/tutorials/enterprise/inventory-management" }
      ]}
    />
  )
}

export function DigitalProductStoreTutorial() {
  return (
    <TutorialLayout
      title="Digital Product Store"
      description="Build a digital product store with instant delivery and license management"
      level="Beginner"
      time="45 minutes"
      category="E-commerce Tutorials"
      categoryPath="/docs/tutorials/ecommerce"
      overview="Create a digital product store that sells software, ebooks, courses, and other digital goods with instant delivery. This tutorial covers secure file delivery, license generation, and customer access management."
      prerequisites={[
        "Basic understanding of digital products",
        "File storage and CDN knowledge",
        "Basic security concepts",
        "SVM-Pay SDK installed"
      ]}
      steps={[
        {
          title: "Set Up Digital Product Manager",
          description: "Initialize the digital product system with secure file delivery.",
          code: `import { SVMPay, FileManager, LicenseManager } from '@svm-pay/sdk'

const digitalProductManager = {
  // Configure secure file storage
  fileStorage: new FileManager({
    provider: 'aws-s3', // or 'gcp', 'azure'
    bucket: process.env.DIGITAL_PRODUCTS_BUCKET,
    region: process.env.AWS_REGION,
    encryption: true,
    accessControl: 'private'
  }),

  // Configure license management
  licenseManager: new LicenseManager({
    issuer: process.env.LICENSE_ISSUER,
    signingKey: process.env.LICENSE_SIGNING_KEY,
    defaultDuration: 365 * 24 * 60 * 60, // 1 year
    maxActivations: 5
  }),

  // Product catalog
  products: {
    'ebook-trading-crypto': {
      id: 'ebook-trading-crypto',
      name: 'Crypto Trading Masterclass',
      type: 'ebook',
      price: 29.99,
      fileId: 'crypto-trading-book.pdf',
      requiresLicense: false,
      maxDownloads: 10,
      description: 'Complete guide to cryptocurrency trading'
    },
    'software-portfolio-tracker': {
      id: 'software-portfolio-tracker',
      name: 'Portfolio Tracker Pro',
      type: 'software',
      price: 99.99,
      fileId: 'portfolio-tracker-v2.zip',
      requiresLicense: true,
      licenseType: 'single-user',
      description: 'Professional portfolio tracking software'
    }
  }
}`,
          language: "JavaScript",
          notes: [
            "Use secure cloud storage with private access control",
            "Implement proper encryption for sensitive digital products",
            "Configure license management based on your business model",
            "Set reasonable download limits to prevent abuse"
          ]
        },
        {
          title: "Create Digital Product Purchase Flow",
          description: "Implement the purchase process with instant delivery.",
          code: `async function purchaseDigitalProduct(productId, customerData) {
  const product = digitalProductManager.products[productId]
  if (!product) {
    throw new Error('Product not found')
  }

  try {
    // Create payment
    const payment = SVMPay.createPayment({
      recipient: process.env.MERCHANT_WALLET,
      amount: product.price,
      token: 'USDC',
      metadata: {
        productId: product.id,
        productName: product.name,
        customerId: customerData.id,
        customerEmail: customerData.email,
        purchaseType: 'digital-product',
        timestamp: new Date().toISOString()
      }
    })

    // Set up payment success handler
    payment.onSuccess(async (result) => {
      await processDigitalProductDelivery(product, customerData, result)
    })

    // Execute payment
    const result = await payment.execute()
    return result

  } catch (error) {
    console.error('Digital product purchase failed:', error)
    throw new Error(\`Purchase failed: \${error.message}\`)
  }
}

async function processDigitalProductDelivery(product, customerData, paymentResult) {
  try {
    // Generate secure download link
    const downloadLink = await digitalProductManager.fileStorage.generateSecureLink({
      fileId: product.fileId,
      customerId: customerData.id,
      expiresIn: 7 * 24 * 60 * 60, // 7 days
      maxDownloads: product.maxDownloads || 3,
      ipRestriction: false // Set to true for higher security
    })

    // Generate license if required
    let licenseKey = null
    if (product.requiresLicense) {
      licenseKey = await digitalProductManager.licenseManager.generate({
        productId: product.id,
        customerId: customerData.id,
        licenseType: product.licenseType,
        metadata: {
          purchaseId: paymentResult.id,
          customerEmail: customerData.email,
          purchaseDate: new Date().toISOString()
        }
      })
    }

    // Send delivery email
    await sendDigitalProductEmail({
      to: customerData.email,
      product: product,
      downloadLink: downloadLink,
      licenseKey: licenseKey,
      paymentResult: paymentResult
    })

    // Create customer access record
    await createCustomerAccess({
      customerId: customerData.id,
      productId: product.id,
      downloadLink: downloadLink,
      licenseKey: licenseKey,
      purchaseDate: new Date(),
      accessExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    })

    // Log successful delivery
    await logDeliveryEvent({
      productId: product.id,
      customerId: customerData.id,
      deliveryMethod: 'email',
      status: 'SUCCESS',
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Digital product delivery failed:', error)
    // Queue for manual processing
    await queueForManualDelivery(product, customerData, paymentResult, error)
  }
}`,
          language: "JavaScript",
          notes: [
            "Generate secure, time-limited download links",
            "Implement license management for software products",
            "Send immediate delivery emails for good customer experience",
            "Keep access records for customer support and re-downloads"
          ]
        },
        {
          title: "Customer Access Management",
          description: "Implement customer portal for managing digital product access.",
          code: `// Customer access portal
class CustomerAccessPortal {
  constructor(customerId) {
    this.customerId = customerId
  }

  async getMyProducts() {
    // Get all products owned by customer
    const purchases = await database.query(
      'SELECT * FROM customer_access WHERE customer_id = ?',
      [this.customerId]
    )

    return purchases.map(purchase => ({
      id: purchase.product_id,
      name: purchase.product_name,
      purchaseDate: purchase.purchase_date,
      accessExpiry: purchase.access_expiry,
      downloadsUsed: purchase.downloads_used,
      maxDownloads: purchase.max_downloads,
      licenseKey: purchase.license_key,
      status: purchase.access_expiry > new Date() ? 'active' : 'expired'
    }))
  }

  async downloadProduct(productId) {
    // Validate access
    const access = await this.validateAccess(productId)
    if (!access) {
      throw new Error('Access denied or expired')
    }

    // Check download limits
    if (access.downloads_used >= access.max_downloads) {
      throw new Error('Download limit exceeded')
    }

    // Generate new secure download link
    const downloadLink = await digitalProductManager.fileStorage.generateSecureLink({
      fileId: access.file_id,
      customerId: this.customerId,
      expiresIn: 60 * 60, // 1 hour
      maxDownloads: 1,
      singleUse: true
    })

    // Update download count
    await database.query(
      'UPDATE customer_access SET downloads_used = downloads_used + 1 WHERE customer_id = ? AND product_id = ?',
      [this.customerId, productId]
    )

    return downloadLink
  }

  async validateAccess(productId) {
    const access = await database.query(
      'SELECT * FROM customer_access WHERE customer_id = ? AND product_id = ?',
      [this.customerId, productId]
    )

    if (!access || access.access_expiry < new Date()) {
      return null
    }

    return access
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement proper access validation for all download requests",
            "Track download usage to prevent abuse",
            "Provide clear access status information to customers",
            "Generate single-use links for enhanced security"
          ]
        }
      ]}
      conclusion="You've built a complete digital product store with secure delivery and access management! Customers can purchase digital products with instant delivery, receive license keys for software, and access their purchases through a customer portal. The system handles security, download limits, and provides a smooth user experience."
      nextSteps={[
        "Add product preview functionality",
        "Implement customer reviews and ratings",
        "Create affiliate program for digital products",
        "Add bundle pricing for multiple products",
        "Implement automatic product updates for software",
        "Set up analytics to track popular products"
      ]}
      relatedTutorials={[
        { title: "Online Store Integration", path: "/docs/tutorials/ecommerce/online-store" },
        { title: "Software License Management", path: "/docs/tutorials/saas/license-management" },
        { title: "Content Creator Subscriptions", path: "/docs/tutorials/social/creator-subscriptions" }
      ]}
    />
  )
}

export function FlashSaleManagementTutorial() {
  return (
    <TutorialLayout
      title="Flash Sale Management"
      description="Build a high-volume flash sale system with rate limiting and inventory management"
      level="Advanced"
      time="2 hours"
      category="E-commerce Tutorials"
      categoryPath="/docs/tutorials/ecommerce"
      overview="Create a flash sale system that can handle thousands of concurrent users competing for limited inventory. This tutorial covers rate limiting, inventory reservation, queue management, and high-performance payment processing."
      prerequisites={[
        "Completed Online Store Integration tutorial",
        "Understanding of high-traffic systems",
        "Experience with caching and queues",
        "Knowledge of race conditions and concurrency"
      ]}
      steps={[
        {
          title: "Set Up Flash Sale Infrastructure",
          description: "Configure the high-performance infrastructure for flash sales.",
          code: `import { SVMPay, RateLimiter, InventoryManager, Queue } from '@svm-pay/sdk'
import Redis from 'ioredis'

// Configure Redis for caching and rate limiting
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: 0
})

// Flash sale manager
class FlashSaleManager {
  constructor() {
    this.rateLimiter = new RateLimiter({
      store: redis,
      windowMs: 60 * 1000, // 1 minute window
      max: 5, // 5 attempts per user per minute
      keyGenerator: (req) => req.user.wallet, // Use wallet address as key
      standardHeaders: true
    })

    this.inventoryManager = new InventoryManager({
      store: redis,
      reservationTimeout: 10 * 60 * 1000, // 10 minutes to complete purchase
      atomic: true // Ensure atomic operations
    })

    this.purchaseQueue = new Queue('flash-purchase', {
      redis: redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    })

    // Process purchase queue
    this.purchaseQueue.process(10, this.processPurchase.bind(this))
  }

  async createFlashSale(saleConfig) {
    const saleId = \`flash-\${Date.now()}\`
    
    // Store sale configuration in Redis
    await redis.hset(\`sale:\${saleId}\`, {
      productId: saleConfig.productId,
      originalPrice: saleConfig.originalPrice,
      salePrice: saleConfig.salePrice,
      totalQuantity: saleConfig.totalQuantity,
      availableQuantity: saleConfig.totalQuantity,
      startTime: saleConfig.startTime,
      endTime: saleConfig.endTime,
      maxPerCustomer: saleConfig.maxPerCustomer || 1,
      status: 'scheduled'
    })

    // Schedule sale start
    await this.scheduleSaleStart(saleId, saleConfig.startTime)

    return saleId
  }
}`,
          language: "JavaScript",
          notes: [
            "Use Redis for high-performance caching and atomic operations",
            "Implement rate limiting to prevent abuse and ensure fair access",
            "Configure job queues to handle high-volume purchase processing",
            "Set reasonable reservation timeouts to prevent inventory hoarding"
          ]
        },
        {
          title: "Handle Flash Sale Purchases",
          description: "Implement the purchase flow with inventory reservation and queue management.",
          code: `async function attemptFlashSalePurchase(saleId, customerId, quantity = 1) {
  try {
    // Check rate limit
    const rateLimitResult = await flashSaleManager.rateLimiter.checkLimit(customerId)
    if (!rateLimitResult.allowed) {
      throw new Error(\`Rate limit exceeded. Try again in \${rateLimitResult.resetTime}ms\`)
    }

    // Get sale details
    const sale = await redis.hgetall(\`sale:\${saleId}\`)
    if (!sale.productId) {
      throw new Error('Sale not found')
    }

    // Check sale timing
    const now = new Date()
    if (now < new Date(sale.startTime)) {
      throw new Error('Sale has not started yet')
    }
    if (now > new Date(sale.endTime)) {
      throw new Error('Sale has ended')
    }

    // Check customer purchase limit
    const customerPurchases = await redis.get(\`sale:\${saleId}:customer:\${customerId}\`)
    if (customerPurchases && parseInt(customerPurchases) >= parseInt(sale.maxPerCustomer)) {
      throw new Error('Purchase limit exceeded for this customer')
    }

    // Attempt atomic inventory reservation
    const reservation = await flashSaleManager.inventoryManager.reserve({
      itemId: \`sale:\${saleId}\`,
      quantity: quantity,
      customerId: customerId,
      expiresIn: 10 * 60 * 1000 // 10 minutes
    })

    if (!reservation.success) {
      throw new Error('Item sold out')
    }

    // Add to purchase queue
    const purchaseJob = await flashSaleManager.purchaseQueue.add('process-purchase', {
      saleId: saleId,
      customerId: customerId,
      quantity: quantity,
      reservationId: reservation.id,
      timestamp: new Date().toISOString()
    }, {
      priority: 10,
      delay: 0
    })

    return {
      success: true,
      queuePosition: await purchaseJob.opts.priority,
      reservationId: reservation.id,
      estimatedWaitTime: await estimateWaitTime(purchaseJob.id)
    }

  } catch (error) {
    console.error('Flash sale purchase attempt failed:', error)
    throw error
  }
}

async function processPurchase(job) {
  const { saleId, customerId, quantity, reservationId } = job.data

  try {
    // Verify reservation is still valid
    const reservation = await flashSaleManager.inventoryManager.getReservation(reservationId)
    if (!reservation || reservation.expired) {
      throw new Error('Reservation expired')
    }

    // Get sale details
    const sale = await redis.hgetall(\`sale:\${saleId}\`)
    const customer = await getCustomerById(customerId)

    // Create payment
    const payment = SVMPay.createPayment({
      recipient: process.env.MERCHANT_WALLET,
      amount: sale.salePrice * quantity,
      token: 'USDC',
      metadata: {
        saleId: saleId,
        productId: sale.productId,
        customerId: customerId,
        quantity: quantity,
        reservationId: reservationId,
        originalPrice: sale.originalPrice,
        salePrice: sale.salePrice,
        discount: (sale.originalPrice - sale.salePrice) * quantity
      }
    })

    // Process payment
    const result = await payment.execute()

    if (result.status === 'SUCCESS') {
      // Confirm reservation
      await flashSaleManager.inventoryManager.confirmReservation(reservationId)

      // Update customer purchase count
      await redis.incr(\`sale:\${saleId}:customer:\${customerId}\`)

      // Send confirmation
      await sendFlashSaleConfirmation(customer, sale, result)

      return { success: true, paymentId: result.id }
    } else {
      // Release reservation on payment failure
      await flashSaleManager.inventoryManager.releaseReservation(reservationId)
      throw new Error('Payment failed')
    }

  } catch (error) {
    // Release reservation on any error
    await flashSaleManager.inventoryManager.releaseReservation(reservationId)
    throw error
  }
}`,
          language: "JavaScript",
          notes: [
            "Implement atomic inventory operations to prevent overselling",
            "Use job queues to handle high-volume purchase processing",
            "Set up proper error handling with reservation cleanup",
            "Track customer purchase limits to ensure fair distribution"
          ]
        },
        {
          title: "Real-time Sale Status and Monitoring",
          description: "Implement real-time updates and monitoring for flash sales.",
          code: `import { WebSocketServer } from 'ws'
import { EventEmitter } from 'events'

class FlashSaleMonitor extends EventEmitter {
  constructor() {
    super()
    this.wss = new WebSocketServer({ port: 8080 })
    this.clients = new Map()
    
    this.setupWebSocketHandlers()
    this.startMonitoring()
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      const clientId = req.headers['x-client-id']
      this.clients.set(clientId, ws)

      ws.on('message', (message) => {
        const data = JSON.parse(message)
        if (data.type === 'subscribe' && data.saleId) {
          this.subscribeToSale(clientId, data.saleId)
        }
      })

      ws.on('close', () => {
        this.clients.delete(clientId)
      })
    })
  }

  async subscribeToSale(clientId, saleId) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Send initial sale status
    const saleStatus = await this.getSaleStatus(saleId)
    client.send(JSON.stringify({
      type: 'sale-status',
      saleId: saleId,
      data: saleStatus
    }))

    // Set up real-time updates
    this.on(\`sale-update:\${saleId}\`, (data) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'sale-update',
          saleId: saleId,
          data: data
        }))
      }
    })
  }

  async getSaleStatus(saleId) {
    const sale = await redis.hgetall(\`sale:\${saleId}\`)
    const queueLength = await flashSaleManager.purchaseQueue.waiting()
    const processing = await flashSaleManager.purchaseQueue.active()

    return {
      saleId: saleId,
      productId: sale.productId,
      originalPrice: parseFloat(sale.originalPrice),
      salePrice: parseFloat(sale.salePrice),
      totalQuantity: parseInt(sale.totalQuantity),
      availableQuantity: parseInt(sale.availableQuantity),
      soldQuantity: parseInt(sale.totalQuantity) - parseInt(sale.availableQuantity),
      queueLength: queueLength,
      processing: processing,
      status: sale.status,
      startTime: sale.startTime,
      endTime: sale.endTime,
      percentSold: ((parseInt(sale.totalQuantity) - parseInt(sale.availableQuantity)) / parseInt(sale.totalQuantity)) * 100
    }
  }

  startMonitoring() {
    setInterval(async () => {
      const activeSales = await redis.keys('sale:*')
      for (const saleKey of activeSales) {
        const saleId = saleKey.split(':')[1]
        const status = await this.getSaleStatus(saleId)
        this.emit(\`sale-update:\${saleId}\`, status)
      }
    }, 1000) // Update every second
  }
}

// Initialize monitoring
const saleMonitor = new FlashSaleMonitor()`,
          language: "JavaScript",
          notes: [
            "Use WebSockets for real-time updates to create engaging user experience",
            "Monitor queue length and processing status for transparency",
            "Implement proper client connection management",
            "Update sale status frequently to show real-time progress"
          ]
        }
      ]}
      conclusion="You've built a high-performance flash sale system capable of handling thousands of concurrent users! The system uses rate limiting, inventory reservation, queue management, and real-time updates to provide a fair and engaging flash sale experience. The infrastructure scales to handle high traffic while preventing overselling and ensuring payment security."
      nextSteps={[
        "Add load testing to validate system capacity",
        "Implement advanced queue prioritization algorithms",
        "Add fraud detection for suspicious purchase patterns",
        "Create analytics dashboard for sale performance",
        "Implement automatic scaling based on traffic",
        "Add notification system for sale start/end alerts"
      ]}
      relatedTutorials={[
        { title: "Online Store Integration", path: "/docs/tutorials/ecommerce/online-store" },
        { title: "High-Traffic Payment Processing", path: "/docs/tutorials/enterprise/high-traffic-payments" },
        { title: "Real-time Inventory Management", path: "/docs/tutorials/enterprise/inventory-management" }
      ]}
    />
  )
}
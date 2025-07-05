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
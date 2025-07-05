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
  }
]

const categories = ['All', 'Getting Started', 'Cross-Chain', 'Advanced', 'E-commerce', 'Tools', 'NFT']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

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
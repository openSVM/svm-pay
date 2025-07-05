import { motion } from 'framer-motion'
import { MessageCircle, Mail, FileText, Clock, Search, ArrowRight, CheckCircle, Book } from 'lucide-react'
import { useState } from 'react'

const supportOptions = [
  {
    title: 'Discord Community',
    description: 'Join our active Discord server for real-time help and community support',
    icon: MessageCircle,
    link: 'https://discord.gg/svmpay',
    responseTime: 'Usually within 1 hour',
    availability: '24/7 Community',
    color: 'indigo'
  },
  {
    title: 'Email Support',
    description: 'Send us detailed questions and get personalized assistance',
    icon: Mail,
    link: 'mailto:support@svm-pay.com',
    responseTime: 'Within 24 hours',
    availability: 'Business hours',
    color: 'blue'
  },
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API reference for all features',
    icon: Book,
    link: '/docs',
    responseTime: 'Instant',
    availability: 'Always available',
    color: 'green'
  },
  {
    title: 'GitHub Issues',
    description: 'Report bugs and request features on our public repository',
    icon: FileText,
    link: 'https://github.com/openSVM/svm-pay/issues',
    responseTime: 'Within 48 hours',
    availability: 'Business hours',
    color: 'slate'
  }
]

const faqCategories = [
  {
    name: 'Getting Started',
    questions: [
      {
        question: 'How do I integrate SVM-Pay into my application?',
        answer: 'Start by installing our SDK with `npm install @svm-pay/sdk`, then follow our quickstart guide to set up your first payment. Our documentation includes examples for React, Vue, Angular, and vanilla JavaScript.'
      },
      {
        question: 'Which networks and tokens are supported?',
        answer: 'SVM-Pay supports 6 EVM networks (Ethereum, Polygon, BNB Chain, Arbitrum, Optimism, Avalanche) and 4 SVM networks (Solana, Sonic, Eclipse, s00n). We support major tokens like USDC, USDT, WETH, WBTC, and native tokens.'
      },
      {
        question: 'Do I need to handle private keys?',
        answer: 'No, SVM-Pay integrates with existing wallet solutions. Users connect their own wallets (MetaMask, Phantom, etc.) and SVM-Pay facilitates the payment without touching private keys.'
      }
    ]
  },
  {
    name: 'Cross-Chain Payments',
    questions: [
      {
        question: 'How do cross-chain payments work?',
        answer: 'Cross-chain payments use secure bridge protocols like Wormhole and Allbridge. When a user pays from Ethereum to a Solana address, the payment is bridged automatically and the recipient receives the equivalent tokens on Solana.'
      },
      {
        question: 'What are the fees for cross-chain transfers?',
        answer: 'Bridge fees typically range from 0.1% to 0.5% of the transfer amount, plus network gas fees on both source and destination chains. Our SDK automatically calculates and displays total fees before payment.'
      },
      {
        question: 'How long do cross-chain transfers take?',
        answer: 'Transfer times vary by bridge: Wormhole typically takes 5-10 minutes, while Allbridge takes 3-5 minutes. The exact time depends on network congestion and confirmation requirements.'
      }
    ]
  },
  {
    name: 'Technical Support',
    questions: [
      {
        question: 'My transactions are failing, what should I check?',
        answer: 'Common issues include insufficient balance for gas fees, network congestion, or incorrect token addresses. Check our troubleshooting guide and ensure you\'re using the latest SDK version.'
      },
      {
        question: 'Can I test payments without real money?',
        answer: 'Yes! Use our testnet support to test payments with testnet tokens on Solana devnet and Ethereum testnets. All features work identically to mainnet.'
      },
      {
        question: 'How do I handle payment confirmations?',
        answer: 'Use our webhook system or polling APIs to track payment status. The SDK provides real-time status updates and confirmation callbacks for seamless UX.'
      }
    ]
  },
  {
    name: 'Business & Billing',
    questions: [
      {
        question: 'What are your pricing plans?',
        answer: 'We offer a free tier with 1,000 transactions/month, Professional plan at $49/month for 50,000 transactions, and custom Enterprise plans. See our pricing page for full details.'
      },
      {
        question: 'Do you provide invoices and receipts?',
        answer: 'Yes, all paid plans include automatic invoicing and receipt generation. Enterprise customers get detailed usage reports and custom billing terms.'
      },
      {
        question: 'Can I get a refund if I\'m not satisfied?',
        answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact our support team to process your refund request.'
      }
    ]
  }
]

const statusItems = [
  { service: 'Payment API', status: 'operational', uptime: '99.98%' },
  { service: 'Cross-Chain Bridges', status: 'operational', uptime: '99.95%' },
  { service: 'Webhook Delivery', status: 'operational', uptime: '99.97%' },
  { service: 'Documentation', status: 'operational', uptime: '99.99%' },
  { service: 'Dashboard', status: 'operational', uptime: '99.96%' }
]

export function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('Getting Started')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  })

  const filteredQuestions = faqCategories
    .find(cat => cat.name === selectedCategory)
    ?.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Support form submitted:', formData)
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
              Support Center
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Get help, find answers, and connect with our community
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How can we help?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the support channel that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.link}
                target={option.link.startsWith('http') ? '_blank' : '_self'}
                rel={option.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  option.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  option.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  option.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{option.title}</h3>
                <p className="text-slate-600 mb-4">{option.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">{option.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-500">{option.availability}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">System Status</h2>
            <p className="text-xl text-slate-600">All systems operational</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {statusItems.map((item) => (
                <div key={item.service} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.service}</h3>
                  <p className="text-sm text-slate-500">{item.uptime} uptime</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <a
                href="https://status.svm-pay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2"
              >
                View detailed status page
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {faqCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {filteredQuestions.map((qa, index) => (
                <div key={index} className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">{qa.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{qa.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Contact Support</h2>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Low - General question</option>
                  <option value="normal">Normal - Need help</option>
                  <option value="high">High - Issue affecting users</option>
                  <option value="urgent">Urgent - Production down</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Please provide as much detail as possible..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
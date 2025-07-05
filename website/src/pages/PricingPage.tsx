import { motion } from 'framer-motion'
import { Check, ArrowRight, Star, Users, Zap, Shield, Globe, Clock } from 'lucide-react'
import { useState } from 'react'

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small projects and testing',
    price: 'Free',
    period: 'forever',
    features: [
      'Up to 1,000 transactions/month',
      'Basic Solana payments',
      'Standard support',
      'Community access',
      'Basic analytics',
      'API access'
    ],
    limitations: [
      'No cross-chain payments',
      'Limited customization',
      'Community support only'
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'slate'
  },
  {
    name: 'Professional',
    description: 'For growing businesses and applications',
    price: '$49',
    period: 'per month',
    features: [
      'Up to 50,000 transactions/month',
      'Cross-chain payments (All networks)',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Webhook notifications',
      'Multi-signature support',
      'Payment links & QR codes'
    ],
    limitations: [
      '$0.005 per transaction over limit'
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'purple'
  },
  {
    name: 'Enterprise',
    description: 'For large-scale applications and organizations',
    price: 'Custom',
    period: 'contact sales',
    features: [
      'Unlimited transactions',
      'All payment methods',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment',
      'Advanced security features',
      'Custom reporting',
      'White-label solution'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'blue'
  }
]

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second confirmation times on Solana with instant settlement'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Multi-signature wallets, secure key management, and audit trails'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: '10+ networks supported with automatic currency conversion'
  },
  {
    icon: Clock,
    title: '99.9% Uptime',
    description: 'Enterprise-grade infrastructure with redundancy and monitoring'
  }
]

const faq = [
  {
    question: 'What payment methods do you support?',
    answer: 'We support all major cryptocurrencies including SOL, USDC, USDT, WETH, WBTC across 10+ networks including Solana, Ethereum, Polygon, BNB Chain, and more.'
  },
  {
    question: 'How do cross-chain payments work?',
    answer: 'Cross-chain payments use secure bridge protocols like Wormhole and Allbridge to transfer assets between networks. Users can pay from any supported EVM network to Solana addresses.'
  },
  {
    question: 'What are the transaction fees?',
    answer: 'Network fees vary by blockchain. Solana fees are typically under $0.001, while Ethereum fees depend on network congestion. Bridge fees range from 0.1% to 0.5%.'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees for any plan. You only pay for what you use, and our Starter plan is completely free for up to 1,000 transactions per month.'
  },
  {
    question: 'Can I integrate with my existing application?',
    answer: 'Yes! Our SDK supports React, Vue, Angular, Node.js, and more. We also provide REST APIs and webhook notifications for seamless integration.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer community support for free users, priority email support for Professional users, and dedicated support with SLA for Enterprise customers.'
  }
]

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your needs. Start free, scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-full p-2 max-w-xs mx-auto">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-purple-600' 
                    : 'text-white hover:text-purple-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'yearly' 
                    ? 'bg-white text-purple-600' 
                    : 'text-white hover:text-purple-100'
                }`}
              >
                Yearly
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">Save 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-500 scale-105' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      {plan.price === 'Custom' ? plan.price : plan.price}
                    </span>
                    {plan.price !== 'Custom' && plan.price !== 'Free' && (
                      <span className="text-slate-500">
                        /{billingCycle === 'yearly' ? 'year' : plan.period}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.price !== 'Free' && plan.price !== 'Custom' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${Math.floor(parseInt(plan.price.replace('$', '')) * 12 * 0.2)} per year
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {/* Handle plan selection */}}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 mb-8 ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Features included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="text-sm text-slate-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SVM-Pay?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built for developers, trusted by businesses worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faq.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.question}</h3>
                  <p className="text-slate-600">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <Users className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building the future of payments with SVM-Pay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  Code, 
  Globe, 
  Layers, 
  Coins, 
  Clock, 
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Cross-chain transactions complete in under 5 minutes with optimized bridge routing.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  {
    icon: Shield,
    title: 'Battle Tested',
    description: 'Built on proven bridge infrastructure with comprehensive security audits and monitoring.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    icon: Code,
    title: 'Developer First',
    description: 'TypeScript-native SDK with comprehensive docs, examples, and stellar developer experience.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    icon: Globe,
    title: 'Multi-Network',
    description: 'Support for 10+ networks including Ethereum, Polygon, BNB Chain, Solana, and more.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    icon: Layers,
    title: 'Bridge Agnostic',
    description: 'Automatically routes through Wormhole, Allbridge, and other bridges for optimal rates.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200'
  },
  {
    icon: Coins,
    title: 'Multi-Token',
    description: 'Native support for USDC, USDT, WETH, WBTC and other major tokens across all networks.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  }
]

const useCases = [
  {
    title: 'E-commerce',
    description: 'Accept payments from any network, receive on your preferred chain',
    icon: '🛒'
  },
  {
    title: 'Subscriptions',
    description: 'Recurring payments across different blockchains seamlessly',
    icon: '📱'
  },
  {
    title: 'DeFi',
    description: 'Bridge assets for yield farming, lending, and other DeFi activities',
    icon: '🌾'
  },
  {
    title: 'Gaming',
    description: 'In-game purchases and rewards across multiple gaming ecosystems',
    icon: '🎮'
  }
]

export function Features() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-8">
            Everything you need to build
            <br />
            <span className="gradient-text">cross-chain payments</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A complete toolkit for accepting payments across any blockchain with enterprise-grade reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className={`bg-white rounded-3xl p-8 border-2 ${feature.borderColor} hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full`}>
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
            Perfect for any use case
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From simple e-commerce to complex DeFi protocols, SVM-Pay adapts to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {useCase.title}
                </h4>
                <p className="text-slate-600 text-sm">
                  {useCase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-3xl p-12">
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Ready to get started?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building the future of payments. Get up and running in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center">
                <Code className="w-5 h-5 mr-3" />
                View Documentation
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center">
                <Clock className="w-5 h-5 mr-3" />
                Live Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
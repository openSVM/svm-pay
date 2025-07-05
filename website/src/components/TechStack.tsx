import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

const networks = [
  {
    category: 'EVM Networks',
    items: [
      { name: 'Ethereum', color: 'bg-blue-100 text-blue-700', fees: '~$15', time: '15 min' },
      { name: 'Polygon', color: 'bg-purple-100 text-purple-700', fees: '~$0.01', time: '2 min' },
      { name: 'BNB Chain', color: 'bg-yellow-100 text-yellow-700', fees: '~$0.30', time: '3 min' },
      { name: 'Arbitrum', color: 'bg-cyan-100 text-cyan-700', fees: '~$2', time: '10 min' },
      { name: 'Optimism', color: 'bg-red-100 text-red-700', fees: '~$1', time: '7 min' },
      { name: 'Avalanche', color: 'bg-orange-100 text-orange-700', fees: '~$0.50', time: '5 min' }
    ]
  },
  {
    category: 'SVM Networks',
    items: [
      { name: 'Solana', color: 'bg-emerald-100 text-emerald-700', fees: '~$0.0001', time: '1 min' },
      { name: 'Sonic', color: 'bg-indigo-100 text-indigo-700', fees: '~$0.0001', time: '1 min' },
      { name: 'Eclipse', color: 'bg-slate-100 text-slate-700', fees: '~$0.0001', time: '1 min' },
      { name: 's00n', color: 'bg-pink-100 text-pink-700', fees: '~$0.0001', time: '1 min' }
    ]
  }
]

const bridges = [
  {
    name: 'Wormhole',
    description: 'Industry-leading cross-chain bridge with $8B+ volume',
    networks: '30+ networks',
    time: '5-15 min',
    fees: '0.1-0.5%',
    color: 'bg-purple-100 text-purple-700',
    url: 'https://wormhole.com'
  },
  {
    name: 'Allbridge',
    description: 'Fast and cost-effective bridge for smaller transfers',
    networks: '15+ networks',
    time: '3-8 min',
    fees: '0.05-0.3%',
    color: 'bg-blue-100 text-blue-700',
    url: 'https://allbridge.io'
  }
]

const tokens = [
  { name: 'USDC', networks: '10+', icon: '💰' },
  { name: 'USDT', networks: '8+', icon: '🪙' },
  { name: 'WETH', networks: '6+', icon: '💎' },
  { name: 'WBTC', networks: '5+', icon: '₿' }
]

export function TechStack() {
  return (
    <section className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-8">
            Comprehensive
            <br />
            <span className="gradient-text">cross-chain infrastructure</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Built on proven infrastructure with support for major networks, bridges, and tokens
          </p>
        </motion.div>

        {/* Network Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {networks.map((networkCategory, categoryIndex) => (
            <motion.div
              key={networkCategory.category}
              initial={{ opacity: 0, x: categoryIndex === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {networkCategory.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {networkCategory.items.map((network, index) => (
                    <motion.div
                      key={network.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-50 hover:bg-slate-100 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${network.color}`}>
                          {network.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>Fees: {network.fees}</div>
                        <div>Time: {network.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bridge Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8 text-center">
            Trusted Bridge Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bridges.map((bridge, index) => (
              <motion.div
                key={bridge.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-4 py-2 rounded-full text-lg font-bold ${bridge.color}`}>
                      {bridge.name}
                    </span>
                    <a 
                      href={bridge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-slate-600 mb-6">
                    {bridge.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500">Networks</div>
                      <div className="font-semibold text-slate-900">{bridge.networks}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Time</div>
                      <div className="font-semibold text-slate-900">{bridge.time}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Fees</div>
                      <div className="font-semibold text-slate-900">{bridge.fees}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Token Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">
            Major Token Support
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tokens.map((token, index) => (
              <motion.div
                key={token.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{token.icon}</div>
                <div className="text-lg font-bold text-slate-900 mb-1">{token.name}</div>
                <div className="text-sm text-slate-500">{token.networks} networks</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            How Cross-Chain Payments Work
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Source Network</h4>
              <p className="text-sm text-slate-600">User initiates payment</p>
            </div>
            
            <ArrowRight className="w-8 h-8 text-slate-400 rotate-90 md:rotate-0" />
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🌉</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Bridge</h4>
              <p className="text-sm text-slate-600">Secure cross-chain transfer</p>
            </div>
            
            <ArrowRight className="w-8 h-8 text-slate-400 rotate-90 md:rotate-0" />
            
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Destination</h4>
              <p className="text-sm text-slate-600">Funds received</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
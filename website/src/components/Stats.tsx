import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import { formatNumber, formatCurrency } from '../lib/utils'

const stats = [
  {
    icon: DollarSign,
    value: 15700000,
    label: 'Total Volume Processed',
    format: 'currency',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    icon: Users,
    value: 12500,
    label: 'Active Developers',
    format: 'number',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Zap,
    value: 850000,
    label: 'Cross-Chain Transactions',
    format: 'number',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: TrendingUp,
    value: 99.97,
    label: 'Success Rate',
    format: 'percentage',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

export function Stats() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Trusted by developers worldwide
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join thousands of developers building the future of cross-chain payments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                
                <div className="space-y-2">
                  <div className={`text-3xl font-black ${stat.color}`}>
                    {stat.format === 'currency' ? formatCurrency(stat.value) :
                     stat.format === 'percentage' ? `${stat.value}%` :
                     formatNumber(stat.value)}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 mb-8">Supported networks and growing</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum', 'Solana', 'Sonic', 'Eclipse', 's00n'].map((network) => (
              <div key={network} className="text-slate-400 font-semibold hover:text-slate-600 transition-colors">
                {network}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
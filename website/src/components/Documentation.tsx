import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Book, 
  Code, 
  PlayCircle, 
  Download, 
  ArrowRight, 
  Terminal,
  Zap
} from 'lucide-react'

const quickStartSteps = [
  {
    step: '1',
    title: 'Install',
    code: 'npm install svm-pay',
    description: 'Add SVM-Pay to your project with npm, yarn, or pnpm'
  },
  {
    step: '2',
    title: 'Import',
    code: "import { SVMPay } from 'svm-pay'",
    description: 'Import the main library with full TypeScript support'
  },
  {
    step: '3',
    title: 'Execute',
    code: 'await SVMPay.crossChain({ ... })',
    description: 'Start accepting cross-chain payments immediately'
  }
]

const examples = [
  {
    title: 'Simple Payment',
    description: 'Accept USDC from Ethereum to Solana',
    language: 'TypeScript',
    code: `import { SVMPay, EVMNetwork, SVMNetwork } from 'svm-pay'

const payment = await SVMPay.crossChain({
  from: {
    network: EVMNetwork.ETHEREUM,
    token: 'USDC'
  },
  to: {
    network: SVMNetwork.SOLANA,
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  },
  amount: 100
})

console.log('Payment hash:', payment.hash)`
  },
  {
    title: 'React Integration',
    description: 'Building a payment form with React',
    language: 'React',
    code: `import { useSVMPay } from 'svm-pay/react'

function PaymentForm() {
  const { executePayment, loading, error } = useSVMPay()
  
  const handlePayment = async () => {
    await executePayment({
      from: { network: 'polygon', token: 'USDC' },
      to: { network: 'solana', address: walletAddress },
      amount: 50
    })
  }
  
  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with Polygon'}
    </button>
  )
}`
  },
  {
    title: 'Advanced Configuration',
    description: 'Custom bridge selection and monitoring',
    language: 'TypeScript',
    code: `import { CrossChainPaymentManager } from 'svm-pay'

const manager = new CrossChainPaymentManager({
  bridges: ['wormhole', 'allbridge'],
  monitoring: true,
  fallback: true
})

const payment = await manager.executePayment({
  sourceNetwork: EVMNetwork.BNB_CHAIN,
  destinationNetwork: SVMNetwork.SONIC,
  amount: '1000',
  token: '0x...',
  recipient: 'wallet_address',
  bridgePreference: 'fastest'
})

// Monitor payment status
payment.on('status', (status) => {
  console.log('Payment status:', status)
})`
  }
]

const resources = [
  {
    icon: Book,
    title: 'API Documentation',
    description: 'Complete API reference with examples',
    link: '/docs/api',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: PlayCircle,
    title: 'Interactive Demo',
    description: 'Try cross-chain payments in your browser',
    link: '/demo',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Code,
    title: 'GitHub Repository',
    description: 'Source code, examples, and community',
    link: 'https://github.com/openSVM/svm-pay',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Terminal,
    title: 'CLI Tool',
    description: 'Command-line interface for testing',
    link: '/docs/cli',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

export function Documentation() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-8">
            Start building in
            <br />
            <span className="gradient-text">minutes, not hours</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to integrate cross-chain payments: comprehensive docs, live examples, and developer tools
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Quick Start Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 font-bold text-lg">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-4 mb-4">
                    <code className="text-emerald-400 font-mono text-sm">
                      {step.code}
                    </code>
                  </div>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
                
                {index < quickStartSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Code Examples
          </h3>
          <div className="space-y-8">
            {examples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <h4 className="text-2xl font-bold text-slate-900 mb-4">
                        {example.title}
                      </h4>
                      <p className="text-slate-600 mb-4">
                        {example.description}
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-200 text-slate-700">
                        {example.language}
                      </span>
                    </div>
                    <div className="lg:w-2/3">
                      <div className="bg-slate-900 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 bg-slate-800 border-b border-slate-700">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <span className="text-slate-400 font-mono text-sm ml-4">
                            {example.title.toLowerCase().replace(' ', '-')}.ts
                          </span>
                        </div>
                        <div className="p-6 overflow-x-auto">
                          <pre className="text-slate-100 font-mono text-sm leading-relaxed">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Developer Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                {resource.link.startsWith('http') ? (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg group-hover:scale-105 transition-all duration-300 h-full">
                      <div className={`w-12 h-12 ${resource.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <resource.icon className={`w-6 h-6 ${resource.color}`} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {resource.title}
                      </h4>
                      <p className="text-slate-600 text-sm mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link to={resource.link} className="block">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg group-hover:scale-105 transition-all duration-300 h-full">
                      <div className={`w-12 h-12 ${resource.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <resource.icon className={`w-6 h-6 ${resource.color}`} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {resource.title}
                      </h4>
                      <p className="text-slate-600 text-sm mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 bg-slate-900 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            Ready to revolutionize payments?
          </h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the cross-chain payment revolution. Install SVM-Pay and start building the future of money transfer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center">
              <Download className="w-5 h-5 mr-3" />
              Install SDK
            </button>
            <Link 
              to="/demo"
              className="border-2 border-slate-600 text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              <Zap className="w-5 h-5 mr-3" />
              Try Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
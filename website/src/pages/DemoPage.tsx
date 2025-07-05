import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Zap, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Shield, 
  CheckCircle,
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react'

// Mock data for demo
const networks = {
  source: [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-500' },
    { id: 'bnb', name: 'BNB Chain', color: 'bg-yellow-500' },
    { id: 'arbitrum', name: 'Arbitrum', color: 'bg-cyan-500' },
    { id: 'optimism', name: 'Optimism', color: 'bg-red-500' },
    { id: 'avalanche', name: 'Avalanche', color: 'bg-pink-500' },
  ],
  destination: [
    { id: 'solana', name: 'Solana', color: 'bg-green-500' },
    { id: 'sonic', name: 'Sonic', color: 'bg-blue-600' },
    { id: 'eclipse', name: 'Eclipse', color: 'bg-orange-500' },
    { id: 's00n', name: 's00n', color: 'bg-indigo-500' },
  ]
}

const tokens = [
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { symbol: 'WETH', name: 'Wrapped Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
]

const bridgeOptions = [
  {
    name: 'Wormhole',
    fee: '0.8%',
    time: '~5 minutes',
    output: '99.2',
    reliability: 'High',
    color: 'border-blue-200 bg-blue-50'
  },
  {
    name: 'Allbridge',
    fee: '0.5%',
    time: '~3 minutes',
    output: '99.5',
    reliability: 'High',
    color: 'border-green-200 bg-green-50'
  }
]

type PaymentStep = 'setup' | 'quotes' | 'executing' | 'completed'

export function DemoPage() {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('setup')
  const [formData, setFormData] = useState({
    sourceNetwork: 'ethereum',
    destinationNetwork: 'solana',
    token: 'USDC',
    amount: '100',
    recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    selectedBridge: 'allbridge'
  })
  const [paymentUrl, setPaymentUrl] = useState('')
  const [executionProgress, setExecutionProgress] = useState(0)

  const handleGetQuotes = () => {
    setCurrentStep('quotes')
    // Generate payment URL
    const url = `solana:${formData.recipient}?amount=${formData.amount}&token=${formData.token}&source-network=${formData.sourceNetwork}&bridge=${formData.selectedBridge}`
    setPaymentUrl(url)
  }

  const handleExecutePayment = () => {
    setCurrentStep('executing')
    setExecutionProgress(0)
    
    // Simulate payment execution progress
    const interval = setInterval(() => {
      setExecutionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setCurrentStep('completed')
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const resetDemo = () => {
    setCurrentStep('setup')
    setExecutionProgress(0)
    setPaymentUrl('')
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Interactive Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Try SVM-Pay's cross-chain payment functionality. This demo simulates the complete payment flow from EVM networks to SVM networks.
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { step: 'setup', label: 'Setup', icon: '1' },
              { step: 'quotes', label: 'Get Quotes', icon: '2' },
              { step: 'executing', label: 'Execute', icon: '3' },
              { step: 'completed', label: 'Complete', icon: '✓' }
            ].map((item, index) => {
              const isActive = currentStep === item.step
              const isCompleted = ['setup', 'quotes', 'executing'].indexOf(currentStep) > ['setup', 'quotes', 'executing'].indexOf(item.step)
              
              return (
                <div key={item.step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted || isActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isCompleted || isActive ? 'text-purple-600' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 text-slate-300 mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Setup Step */}
          {currentStep === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Configure Payment</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Source Network */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Source Network (Pay From)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {networks.source.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => setFormData(prev => ({ ...prev, sourceNetwork: network.id }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.sourceNetwork === network.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${network.color} mr-2`} />
                          <span className="text-sm font-medium">{network.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Network */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Destination Network (Pay To)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {networks.destination.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => setFormData(prev => ({ ...prev, destinationNetwork: network.id }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.destinationNetwork === network.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${network.color} mr-2`} />
                          <span className="text-sm font-medium">{network.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Token Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Token
                  </label>
                  <select
                    value={formData.token}
                    onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {tokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100"
                  />
                </div>

                {/* Recipient Address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    placeholder="DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
                  />
                </div>
              </div>

              <button
                onClick={handleGetQuotes}
                className="w-full mt-8 bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Bridge Quotes
              </button>
            </motion.div>
          )}

          {/* Quotes Step */}
          {currentStep === 'quotes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Bridge Options</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {bridgeOptions.map((bridge) => (
                    <div
                      key={bridge.name}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.selectedBridge === bridge.name.toLowerCase()
                          ? 'border-purple-500 bg-purple-50'
                          : bridge.color
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedBridge: bridge.name.toLowerCase() }))}
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">{bridge.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Output:</span>
                          <span className="font-semibold">{bridge.output} {formData.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fee:</span>
                          <span className="font-semibold text-red-600">{bridge.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Time:</span>
                          <span className="font-semibold text-blue-600">{bridge.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Reliability:</span>
                          <span className="font-semibold text-green-600">{bridge.reliability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generated Payment URL */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Generated Payment URL</h3>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono break-all">
                      {paymentUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(paymentUrl)}
                      className="p-3 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleExecutePayment}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Execute Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* Executing Step */}
          {currentStep === 'executing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment in Progress</h2>
              
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                    <span>Processing Payment</span>
                    <span>{executionProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${executionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Status Steps */}
                <div className="space-y-4">
                  {[
                    { label: 'Payment Initiated', completed: executionProgress > 20 },
                    { label: 'Source Transaction Confirmed', completed: executionProgress > 40 },
                    { label: 'Bridge Transfer Started', completed: executionProgress > 60 },
                    { label: 'Destination Transaction Pending', completed: executionProgress > 80 },
                    { label: 'Payment Completed', completed: executionProgress >= 100 }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-slate-400 mr-3 animate-spin" />
                      )}
                      <span className={step.completed ? 'text-slate-900' : 'text-slate-500'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mock Transaction Hashes */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Source Tx:</span>
                    <span className="ml-2 font-mono text-slate-600">0x1234...abcd</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Bridge Tx:</span>
                    <span className="ml-2 font-mono text-slate-600">wh_567...890</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Completed Step */}
          {currentStep === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Completed!</h2>
              <p className="text-slate-600 mb-8">
                Your cross-chain payment of {formData.amount} {formData.token} has been successfully transferred from {formData.sourceNetwork} to {formData.destinationNetwork}.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-semibold">{formData.amount} {formData.token}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">From:</span>
                    <span className="font-semibold capitalize">{formData.sourceNetwork}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">To:</span>
                    <span className="font-semibold capitalize">{formData.destinationNetwork}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bridge:</span>
                    <span className="font-semibold capitalize">{formData.selectedBridge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-semibold">3.2 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetDemo}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Another Payment
                </button>
                <a
                  href="https://github.com/openSVM/svm-pay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-slate-400 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Choose SVM-Pay?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Fast Transfers</h3>
              <p className="text-slate-600">
                Cross-chain payments complete in 3-5 minutes with automatic bridge selection for optimal speed.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Low Fees</h3>
              <p className="text-slate-600">
                Competitive fees starting from 0.5% with intelligent routing to minimize costs.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure</h3>
              <p className="text-slate-600">
                Enterprise-grade security with trusted bridge partners and comprehensive validation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
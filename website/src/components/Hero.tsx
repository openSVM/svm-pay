import { motion } from 'framer-motion'
import { ArrowRight, Github, Zap, Shield, Globe } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-stone-50" />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Status badge */}
          <Badge className="mb-8">
            <Zap className="w-4 h-4 mr-2 text-emerald-500" />
            Production Ready • Cross-Chain Payments
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-semibold">
              v2.0
            </span>
          </Badge>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">
            Accept payments from
            <br />
            <span className="gradient-text">any blockchain</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Enable cross-chain payments from Ethereum, Polygon, BNB Chain → Solana, Sonic, Eclipse. 
            <span className="font-medium text-slate-900"> One SDK, all networks, zero hassle.</span>
          </p>

          {/* Quick demo code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-slate-400 font-mono text-sm ml-4">cross-chain-payment.js</span>
              </div>
              <pre className="text-left text-slate-100 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
                <code className="language-javascript">
{`import { SVMPay } from 'svm-pay'

// Accept USDC from Ethereum → Solana
const payment = await SVMPay.crossChain({
  from: { network: 'ethereum', token: 'USDC' },
  to: { network: 'solana', address: 'DezX...' },
  amount: 100
})

console.log('Payment completed:', payment.hash)`}
                </code>
              </pre>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Button size="xl" className="shadow-glow">
              <Zap className="w-5 h-5 mr-3" />
              Start Building
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
            
            <a 
              href="https://github.com/openSVM/svm-pay" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-16 px-12 py-5 text-xl border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 hover:scale-105 active:scale-95 rounded-2xl font-semibold transition-all duration-300"
            >
              <Github className="w-5 h-5 mr-3" />
              View on GitHub
            </a>
          </motion.div>

          {/* Network support indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-medium">6 EVM Networks</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">4 SVM Networks</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-medium">2 Bridge Partners</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
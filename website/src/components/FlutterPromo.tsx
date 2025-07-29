import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Smartphone, 
  Zap, 
  Shield, 
  Code, 
  ArrowRight,
  Download,
  CheckCircle
} from 'lucide-react'

export function FlutterPromo() {
  return (
    <section className="py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-8">
            Now Available for
            <br />
            <span className="gradient-text inline-flex items-center">
              <Smartphone className="w-16 h-16 mr-4" />
              Flutter
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Build cross-platform mobile payment apps with our new Flutter SDK. Native performance, 
            enterprise security, and all the power of SVM-Pay in your Flutter applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Cross-Platform Native</h3>
                  <p className="text-slate-600">Single Dart codebase runs natively on both iOS and Android with platform-specific optimizations.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Performance</h3>
                  <p className="text-slate-600">70% faster address validation with native method channels and optimized network adapters.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Security</h3>
                  <p className="text-slate-600">OWASP Mobile Security compliant with comprehensive security audits and 73+ passing tests.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ready-to-Use Widgets</h3>
                  <p className="text-slate-600">Drop-in PaymentButton, PaymentForm, and PaymentQRCode widgets with built-in validation.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Code Example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-slate-400 text-sm font-mono">main.dart</span>
              </div>
              <pre className="text-blue-300 font-mono text-sm leading-relaxed overflow-x-auto">
{`// Initialize Flutter SDK
final svmPay = SVMPay(
  config: SVMPayConfig(
    defaultNetwork: SVMNetwork.solana,
  ),
);

// Ready-to-use payment widget
PaymentButton(
  recipient: 'recipient_address',
  amount: '1.0',
  label: 'Pay 1.0 SOL',
  onPayment: (result) async {
    if (result.status == PaymentStatus.confirmed) {
      print('Payment successful!');
    }
  },
)`}
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 mb-2">73+</div>
            <div className="text-slate-600">Security Tests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 mb-2">70%</div>
            <div className="text-slate-600">Faster Performance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 mb-2">10+</div>
            <div className="text-slate-600">SVM Networks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 mb-2">100%</div>
            <div className="text-slate-600">Type Safe</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/flutter"
              className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              <Smartphone className="w-5 h-5 mr-3" />
              Explore Flutter SDK
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
            <button className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center">
              <Download className="w-5 h-5 mr-3" />
              Quick Install
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mt-4">
            <code className="bg-slate-100 px-2 py-1 rounded font-mono">flutter pub add svm_pay</code>
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-16 border-t border-slate-200"
        >
          <div className="flex items-center text-slate-600">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span>Production Ready</span>
          </div>
          <div className="flex items-center text-slate-600">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span>Security Audited</span>
          </div>
          <div className="flex items-center text-slate-600">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span>Open Source</span>
          </div>
          <div className="flex items-center text-slate-600">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span>Enterprise Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
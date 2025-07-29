import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Zap, 
  Shield, 
  Code, 
  Layers, 
  Download, 
  PlayCircle, 
  ExternalLink,
  ArrowRight,
  Check,
  Copy,
  Globe
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Smartphone,
    title: 'Cross-Platform Native',
    description: 'Single Dart codebase runs natively on both iOS and Android with platform-specific optimizations.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Method channels with native Kotlin/Swift implementations for maximum payment processing speed.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'OWASP Mobile Security compliant with cryptographic security and comprehensive input validation.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    icon: Code,
    title: 'Type-Safe API',
    description: 'Full Dart type safety with comprehensive error handling and null safety throughout.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    icon: Layers,
    title: 'Ready-to-Use Widgets',
    description: 'Pre-built PaymentButton, PaymentForm, and PaymentQRCode widgets with proper lifecycle management.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200'
  },
  {
    icon: Globe,
    title: 'Multi-Network Support',
    description: 'Support for Solana, Sonic SVM, Eclipse, Soon and all major SVM networks with unified API.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200'
  }
]

const widgets = [
  {
    name: 'PaymentButton',
    description: 'Ready-to-use payment button with memory leak protection and double-submission prevention',
    code: `PaymentButton(
  recipient: 'recipient_address',
  amount: '1.0',
  label: 'Pay 1.0 SOL',
  onPayment: (result) async {
    if (result.status == PaymentStatus.confirmed) {
      print('Payment successful!');
    }
  },
)`
  },
  {
    name: 'PaymentForm',
    description: 'Complete payment form with enhanced validation and secure state management',
    code: `PaymentForm(
  onSubmit: (paymentData) async {
    final result = await svmPay.processPayment(paymentData);
    return result;
  },
  networks: [SVMNetwork.solana, SVMNetwork.sonic],
  validators: [AmountValidator(), AddressValidator()],
)`
  },
  {
    name: 'PaymentQRCode',
    description: 'QR code generator for payment URLs with copy-to-clipboard functionality',
    code: `PaymentQRCode(
  paymentUrl: paymentUrl,
  size: 200.0,
  showCopyButton: true,
  onCopy: () {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Payment URL copied!')),
    );
  },
)`
  }
]

const stats = [
  { label: 'Mobile Apps Supported', value: 'iOS & Android', icon: Smartphone },
  { label: 'Security Tests Passing', value: '73+', icon: Shield },
  { label: 'Performance Improvement', value: '70%', icon: Zap },
  { label: 'Networks Supported', value: '10+', icon: Globe }
]

export function FlutterPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const installationCode = `# Add to pubspec.yaml
dependencies:
  svm_pay: ^1.0.0

# Install dependencies
flutter pub get

# Import in your Dart code
import 'package:svm_pay/svm_pay.dart';`

  const usageCode = `// Initialize SDK with secure configuration
final svmPay = SVMPay(
  config: const SVMPayConfig(
    defaultNetwork: SVMNetwork.solana,
    debug: false, // Sanitized logging in production
  ),
);

// Create payment URL with comprehensive validation
final url = svmPay.createTransferUrl(
  'recipient_address',
  '1.5',
  label: 'Coffee Shop',
  message: 'Payment for coffee',
);

// Proper resource disposal
@override
void dispose() {
  svmPay.dispose(); // Prevents memory leaks
  super.dispose();
}`

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900">
                Flutter SDK
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              Build cross-platform mobile payment apps with enterprise-grade security, 
              native performance, and comprehensive SVM network support
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => copyToClipboard('flutter pub add svm_pay', 'install')}
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <Download className="w-5 h-5 mr-3" />
                {copiedCode === 'install' ? 'Copied!' : 'Install SDK'}
                {copiedCode !== 'install' && <Copy className="w-5 h-5 ml-3" />}
              </button>
              <a
                href="https://github.com/openSVM/svm-pay/tree/main/flutter_sdk/example"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <PlayCircle className="w-5 h-5 mr-3" />
                View Example App
                <ExternalLink className="w-5 h-5 ml-3" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                >
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Why Choose Flutter SDK?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Production-ready mobile payment solution with enterprise-grade security and native performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Quick Installation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with the Flutter SDK in under 5 minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-slate-900 rounded-3xl p-8 relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Installation</h3>
              <button
                onClick={() => copyToClipboard(installationCode, 'installation')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                {copiedCode === 'installation' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
              {installationCode}
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-slate-900 rounded-3xl p-8 relative mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Basic Usage</h3>
              <button
                onClick={() => copyToClipboard(usageCode, 'usage')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                {copiedCode === 'usage' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="text-blue-400 font-mono text-sm leading-relaxed overflow-x-auto">
              {usageCode}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Widgets Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Ready-to-Use Widgets
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Drop-in Flutter widgets with built-in security, validation, and lifecycle management
            </p>
          </motion.div>

          <div className="space-y-8">
            {widgets.map((widget, index) => (
              <motion.div
                key={widget.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {widget.name}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {widget.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Memory leak protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Type-safe API</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Comprehensive validation</span>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-semibold">{widget.name}</span>
                      <button
                        onClick={() => copyToClipboard(widget.code, widget.name)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors inline-flex items-center"
                      >
                        {copiedCode === widget.name ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-blue-300 font-mono text-sm leading-relaxed overflow-x-auto">
                      {widget.code}
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Performance Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              OWASP Mobile Security compliant with comprehensive security audits and performance optimizations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Security Features</h3>
              <ul className="space-y-4">
                {[
                  'Cryptographically secure random generation',
                  'Comprehensive input validation',
                  'DoS protection with computational limits',
                  'Memory leak prevention',
                  'Error sanitization',
                  'Race condition protection'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Performance</h3>
              <ul className="space-y-4">
                {[
                  '70% faster address validation',
                  'Native platform channel optimization',
                  'Efficient memory management',
                  'Optimized network adapters',
                  'Concurrent operation handling',
                  'Resource disposal automation'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Build?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Join developers building the future of mobile payments with Flutter and SVM-Pay
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/openSVM/svm-pay/tree/main/flutter_sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <Code className="w-5 h-5 mr-3" />
                View on GitHub
                <ExternalLink className="w-5 h-5 ml-3" />
              </a>
              <a
                href="https://pub.dev/packages/svm_pay"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <Download className="w-5 h-5 mr-3" />
                View on Pub.dev
                <ArrowRight className="w-5 h-5 ml-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
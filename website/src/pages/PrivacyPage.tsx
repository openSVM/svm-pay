import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Globe, Mail, Calendar } from 'lucide-react'

const sections = [
  {
    title: 'Information We Collect',
    icon: Eye,
    content: [
      {
        subtitle: 'Account Information',
        details: 'When you create an account, we collect your name, email address, and company information. This helps us provide personalized support and billing.'
      },
      {
        subtitle: 'Transaction Data',
        details: 'We collect transaction metadata such as amounts, timestamps, and network information. We never store private keys or sensitive wallet information.'
      },
      {
        subtitle: 'Usage Analytics',
        details: 'We track how you use our platform to improve our services. This includes API calls, feature usage, and error logs.'
      },
      {
        subtitle: 'Technical Information',
        details: 'We automatically collect IP addresses, browser information, and device characteristics to ensure security and optimal performance.'
      }
    ]
  },
  {
    title: 'How We Use Your Information',
    icon: Lock,
    content: [
      {
        subtitle: 'Service Delivery',
        details: 'We use your information to process payments, provide customer support, and deliver the SVM-Pay services you requested.'
      },
      {
        subtitle: 'Security & Fraud Prevention',
        details: 'We analyze transaction patterns and user behavior to detect and prevent fraudulent activities and security threats.'
      },
      {
        subtitle: 'Product Improvement',
        details: 'We use aggregated, anonymized data to improve our services, develop new features, and optimize performance.'
      },
      {
        subtitle: 'Communication',
        details: 'We send important service updates, security alerts, and marketing communications (which you can opt out of at any time).'
      }
    ]
  },
  {
    title: 'Information Sharing',
    icon: Globe,
    content: [
      {
        subtitle: 'Service Providers',
        details: 'We share data with trusted third-party services like hosting providers, analytics tools, and payment processors who help us operate our platform.'
      },
      {
        subtitle: 'Legal Requirements',
        details: 'We may disclose information when required by law, court order, or to protect the rights, property, or safety of SVM-Pay, our users, or others.'
      },
      {
        subtitle: 'Business Transfers',
        details: 'If we are acquired or merge with another company, your information may be transferred as part of the transaction.'
      },
      {
        subtitle: 'With Your Consent',
        details: 'We may share your information for other purposes with your explicit consent or at your direction.'
      }
    ]
  },
  {
    title: 'Data Security',
    icon: Shield,
    content: [
      {
        subtitle: 'Encryption',
        details: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We regularly update our security protocols.'
      },
      {
        subtitle: 'Access Controls',
        details: 'We implement strict access controls, multi-factor authentication, and regular security audits to protect your data.'
      },
      {
        subtitle: 'Data Retention',
        details: 'We retain your data only as long as necessary to provide services and comply with legal obligations. Transaction data is kept for 7 years.'
      },
      {
        subtitle: 'Incident Response',
        details: 'We have a comprehensive incident response plan and will notify you within 72 hours of any security breaches affecting your data.'
      }
    ]
  }
]

const rights = [
  {
    title: 'Access Your Data',
    description: 'Request a copy of all personal information we have about you'
  },
  {
    title: 'Correct Information',
    description: 'Update or correct any inaccurate personal information'
  },
  {
    title: 'Delete Your Data',
    description: 'Request deletion of your personal information (subject to legal requirements)'
  },
  {
    title: 'Data Portability',
    description: 'Export your data in a machine-readable format'
  },
  {
    title: 'Opt-Out',
    description: 'Unsubscribe from marketing communications at any time'
  },
  {
    title: 'Restrict Processing',
    description: 'Limit how we use your personal information'
  }
]

export function PrivacyPage() {
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
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Your privacy is important to us. This policy explains how we collect, use, 
              and protect your personal information.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                Last updated: December 15, 2024
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                GDPR Compliant
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                CCPA Compliant
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Quick Summary</h2>
            <div className="space-y-3 text-blue-800">
              <p>• We collect minimal data necessary to provide our payment services</p>
              <p>• We never store your private keys or sensitive wallet information</p>
              <p>• We use industry-standard encryption and security practices</p>
              <p>• You have full control over your data and can request deletion at any time</p>
              <p>• We don't sell your personal information to third parties</p>
            </div>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.subtitle}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.details}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              You have the following rights regarding your personal information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{right.title}</h3>
                <p className="text-slate-600">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cookies & Tracking</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for basic functionality like authentication and security.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how you use our platform to improve our services.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Marketing Cookies</h3>
                  <p className="text-sm">Used to show you relevant advertisements and measure campaign effectiveness.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Preference Cookies</h3>
                  <p className="text-sm">Remember your settings and preferences for a personalized experience.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* International Transfers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">International Data Transfers</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                SVM-Pay operates globally, and your information may be transferred to and processed in countries 
                other than your own. We ensure adequate protection through:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  EU-US Data Privacy Framework compliance
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Standard Contractual Clauses (SCCs) with service providers
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Adequacy decisions from relevant authorities
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Additional safeguards and encryption for sensitive data
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              If you have any questions about this privacy policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@svm-pay.com"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                privacy@svm-pay.com
              </a>
              <a
                href="/support"
                className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/30 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>

        {/* Changes to Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-slate-50 rounded-2xl p-8 border">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors.
              </p>
              <p>
                We will notify you of any material changes by email or through our platform, and update 
                the "last updated" date at the top of this policy.
              </p>
              <p>
                Your continued use of SVM-Pay after any changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
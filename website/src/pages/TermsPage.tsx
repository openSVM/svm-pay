import { motion } from 'framer-motion'
import { FileText, Scale, Calendar, Mail, AlertTriangle } from 'lucide-react'

const sections = [
  {
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using SVM-Pay services, you accept and agree to be bound by the terms and provision of this agreement.',
      'If you do not agree to abide by the above, please do not use this service.',
      'These terms may be updated from time to time, and your continued use constitutes acceptance of any changes.'
    ]
  },
  {
    title: 'Description of Service',
    content: [
      'SVM-Pay provides cross-chain payment infrastructure and APIs that enable applications to accept payments across multiple blockchain networks.',
      'Our services include payment processing, cross-chain bridges, wallet integrations, and developer tools.',
      'We reserve the right to modify, suspend, or discontinue any aspect of the service with or without notice.'
    ]
  },
  {
    title: 'User Accounts and Registration',
    content: [
      'You must register for an account to access certain features of our service.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must provide accurate, current, and complete information during registration.',
      'You are responsible for all activities that occur under your account.',
      'You must notify us immediately of any unauthorized use of your account.'
    ]
  },
  {
    title: 'Acceptable Use Policy',
    content: [
      'You may not use our service for any illegal or unauthorized purpose.',
      'You may not violate any laws in your jurisdiction when using our service.',
      'You may not transmit any worms, viruses, or code of a destructive nature.',
      'You may not attempt to gain unauthorized access to our systems or other users\' accounts.',
      'You may not use our service to facilitate money laundering, terrorism financing, or other illicit activities.'
    ]
  },
  {
    title: 'Payment Terms',
    content: [
      'Fees for our services are outlined in our pricing page and may change with notice.',
      'All fees are non-refundable unless otherwise specified.',
      'You are responsible for all applicable taxes related to your use of our services.',
      'We reserve the right to suspend or terminate accounts with outstanding payments.',
      'Transaction fees on blockchain networks are separate and not controlled by SVM-Pay.'
    ]
  },
  {
    title: 'Intellectual Property',
    content: [
      'The SVM-Pay service and its original content, features, and functionality are owned by SVM-Pay and are protected by copyright, trademark, and other laws.',
      'You may not reproduce, distribute, modify, or create derivative works of our content without permission.',
      'Your feedback and suggestions may be used by us without any restriction or compensation to you.',
      'You retain ownership of any content you submit through our service.'
    ]
  },
  {
    title: 'Privacy and Data Protection',
    content: [
      'Your privacy is important to us. Please review our Privacy Policy for information on how we collect, use, and protect your data.',
      'We implement industry-standard security measures to protect your information.',
      'You consent to our processing of your data as described in our Privacy Policy.',
      'We may use aggregated, anonymized data for analytics and service improvement.'
    ]
  },
  {
    title: 'Disclaimers and Limitations',
    content: [
      'Our service is provided "as is" without any warranties, express or implied.',
      'We do not guarantee uninterrupted or error-free service.',
      'We are not responsible for losses due to blockchain network issues, smart contract bugs, or user error.',
      'You use our service at your own risk and are responsible for your own security practices.',
      'We do not provide investment, financial, or legal advice.'
    ]
  },
  {
    title: 'Limitation of Liability',
    content: [
      'In no event shall SVM-Pay be liable for any indirect, incidental, special, consequential, or punitive damages.',
      'Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.',
      'Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above may not apply to you.',
      'You agree to indemnify and hold harmless SVM-Pay from any claims arising from your use of our service.'
    ]
  },
  {
    title: 'Termination',
    content: [
      'Either party may terminate this agreement at any time with or without notice.',
      'We may suspend or terminate your account for violation of these terms or illegal activity.',
      'Upon termination, your right to use the service ceases immediately.',
      'Provisions that by their nature should survive termination will remain in effect.',
      'You may download your data before termination, subject to our data retention policies.'
    ]
  },
  {
    title: 'Governing Law',
    content: [
      'These terms shall be governed by and construed in accordance with the laws of Delaware, United States.',
      'Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Delaware.',
      'If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full force.',
      'Our failure to enforce any right or provision shall not constitute a waiver of such right or provision.'
    ]
  },
  {
    title: 'Changes to Terms',
    content: [
      'We reserve the right to modify these terms at any time.',
      'We will notify users of any material changes via email or through our platform.',
      'Changes will be effective immediately upon posting unless otherwise specified.',
      'Your continued use of the service after changes constitutes acceptance of the new terms.',
      'If you do not agree to the changes, you must stop using our service.'
    ]
  }
]

const keyPoints = [
  {
    title: 'Service Availability',
    description: 'We strive for 99.9% uptime but cannot guarantee uninterrupted service',
    icon: AlertTriangle,
    color: 'amber'
  },
  {
    title: 'Your Responsibilities',
    description: 'You are responsible for account security and compliance with applicable laws',
    icon: Scale,
    color: 'blue'
  },
  {
    title: 'Our Commitments',
    description: 'We commit to protecting your data and providing reliable payment infrastructure',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'Dispute Resolution',
    description: 'Governed by Delaware law with good faith resolution attempts first',
    icon: Scale,
    color: 'purple'
  }
]

export function TermsPage() {
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              These terms govern your use of SVM-Pay services. Please read them carefully 
              before using our platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                Last updated: December 15, 2024
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Effective Date: December 15, 2024
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Points</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Here are the most important things you should know
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    point.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    point.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    point.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <point.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{point.title}</h3>
                    <p className="text-slate-600">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="text-slate-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">Important Legal Notice</h3>
                <div className="space-y-3 text-amber-800">
                  <p>
                    <strong>Blockchain Risks:</strong> Cryptocurrency and blockchain transactions are irreversible. 
                    SVM-Pay cannot recover funds sent to incorrect addresses or reverse completed transactions.
                  </p>
                  <p>
                    <strong>Regulatory Compliance:</strong> You are responsible for ensuring your use of SVM-Pay 
                    complies with all applicable laws and regulations in your jurisdiction.
                  </p>
                  <p>
                    <strong>No Investment Advice:</strong> SVM-Pay does not provide investment, financial, or legal advice. 
                    Consult appropriate professionals before making financial decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              If you have any questions about these terms of service or need clarification on any provisions, 
              please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@svm-pay.com"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                legal@svm-pay.com
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

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-slate-50 rounded-2xl p-8 border text-center">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Agreement Acknowledgment</h3>
            <p className="text-slate-600 mb-6">
              By using SVM-Pay services, you acknowledge that you have read, understood, and agree to be bound by these terms of service.
            </p>
            <p className="text-sm text-slate-500">
              These terms constitute a legally binding agreement between you and SVM-Pay, Inc.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
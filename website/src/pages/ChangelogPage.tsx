import { motion } from 'framer-motion'
import { Calendar, ArrowRight, CheckCircle, AlertCircle, Info, Plus } from 'lucide-react'
import { useState } from 'react'

const changelogEntries = [
  {
    version: '2.1.0',
    date: '2024-12-15',
    type: 'major',
    title: 'Cross-Chain Payments Launch',
    description: 'Major release introducing cross-chain payment support across 6 EVM networks and 4 SVM networks.',
    changes: [
      {
        type: 'added',
        title: 'Cross-chain payment support',
        description: 'Pay from Ethereum, Polygon, BNB Chain to Solana addresses'
      },
      {
        type: 'added',
        title: 'Wormhole bridge integration',
        description: '5-minute transfers with comprehensive token support'
      },
      {
        type: 'added',
        title: 'Allbridge integration',
        description: '3-minute transfers with lower fees'
      },
      {
        type: 'added',
        title: 'Bridge adapter architecture',
        description: 'Extensible system for adding new bridge protocols'
      },
      {
        type: 'improved',
        title: 'URL scheme support',
        description: 'Extended payment URLs to support cross-chain parameters'
      }
    ],
    breaking: [
      'PaymentRequest interface now requires network specification for cross-chain payments',
      'Legacy single-chain constructors deprecated in favor of CrossChainRequestFactory'
    ]
  },
  {
    version: '2.0.3',
    date: '2024-12-10',
    type: 'patch',
    title: 'Security Enhancements',
    description: 'Critical security updates and performance improvements.',
    changes: [
      {
        type: 'fixed',
        title: 'Address validation improvements',
        description: 'Enhanced checksum validation for EVM addresses'
      },
      {
        type: 'improved',
        title: 'Error handling',
        description: 'Better error messages and stack trace preservation'
      },
      {
        type: 'improved',
        title: 'Fee calculation precision',
        description: 'Replaced floating point with BigNumber for financial calculations'
      }
    ],
    breaking: []
  },
  {
    version: '2.0.2',
    date: '2024-12-05',
    type: 'patch',
    title: 'Payment Links & QR Codes',
    description: 'New payment link generation with QR code support.',
    changes: [
      {
        type: 'added',
        title: 'Payment link generator',
        description: 'Create shareable payment URLs with custom parameters'
      },
      {
        type: 'added',
        title: 'QR code generation',
        description: 'Automatic QR code creation for payment links'
      },
      {
        type: 'added',
        title: 'Link customization',
        description: 'Custom descriptions, expiry times, and branding'
      }
    ],
    breaking: []
  },
  {
    version: '2.0.1',
    date: '2024-11-28',
    type: 'patch',
    title: 'Performance Optimizations',
    description: 'Various performance improvements and bug fixes.',
    changes: [
      {
        type: 'improved',
        title: 'Transaction monitoring',
        description: 'Faster confirmation tracking with reduced API calls'
      },
      {
        type: 'improved',
        title: 'Wallet connection',
        description: 'Better handling of wallet disconnections and reconnections'
      },
      {
        type: 'fixed',
        title: 'Memory leaks',
        description: 'Fixed event listener cleanup in payment monitoring'
      },
      {
        type: 'fixed',
        title: 'Token balance caching',
        description: 'Resolved stale balance issues in rapid transactions'
      }
    ],
    breaking: []
  },
  {
    version: '2.0.0',
    date: '2024-11-15',
    type: 'major',
    title: 'SVM-Pay 2.0 - Complete Rewrite',
    description: 'Major version with TypeScript rewrite, new architecture, and expanded network support.',
    changes: [
      {
        type: 'added',
        title: 'TypeScript support',
        description: 'Full TypeScript rewrite with comprehensive type definitions'
      },
      {
        type: 'added',
        title: 'Multi-network support',
        description: 'Support for Solana, Sonic, Eclipse, and s00n networks'
      },
      {
        type: 'added',
        title: 'Subscription payments',
        description: 'Recurring payment support with automated billing'
      },
      {
        type: 'added',
        title: 'Advanced analytics',
        description: 'Comprehensive payment tracking and reporting'
      },
      {
        type: 'improved',
        title: 'Developer experience',
        description: 'Simplified API with better documentation and examples'
      },
      {
        type: 'improved',
        title: 'Error handling',
        description: 'Standardized error codes and better debugging info'
      }
    ],
    breaking: [
      'Complete API redesign - migration guide available',
      'Node.js 16+ required',
      'React 17+ required for frontend components'
    ]
  },
  {
    version: '1.5.2',
    date: '2024-10-30',
    type: 'patch',
    title: 'Solana Wallet Improvements',
    description: 'Enhanced wallet adapter support and connection reliability.',
    changes: [
      {
        type: 'added',
        title: 'Additional wallet support',
        description: 'Support for Backpack, Glow, and other popular wallets'
      },
      {
        type: 'improved',
        title: 'Connection stability',
        description: 'Better handling of network interruptions'
      },
      {
        type: 'fixed',
        title: 'Mobile wallet support',
        description: 'Improved mobile browser wallet detection'
      }
    ],
    breaking: []
  }
]

const typeColors: Record<string, string> = {
  major: 'bg-purple-100 text-purple-800 border-purple-200',
  minor: 'bg-blue-100 text-blue-800 border-blue-200',
  patch: 'bg-green-100 text-green-800 border-green-200'
}

const changeTypeIcons: Record<string, { icon: any; color: string }> = {
  added: { icon: Plus, color: 'text-green-600' },
  improved: { icon: ArrowRight, color: 'text-blue-600' },
  fixed: { icon: CheckCircle, color: 'text-purple-600' }
}

export function ChangelogPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredEntries = selectedType 
    ? changelogEntries.filter(entry => entry.type === selectedType)
    : changelogEntries

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
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Changelog
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Track all improvements, new features, and bug fixes in SVM-Pay
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Latest: v2.1.0
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Released: Dec 15, 2024
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedType === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border'
              }`}
            >
              All Updates
            </button>
            {['major', 'minor', 'patch'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                  selectedType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border'
                }`}
              >
                {type} Releases
              </button>
            ))}
          </div>
        </motion.div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-900">v{entry.version}</h2>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${typeColors[entry.type]}`}>
                        {entry.type} release
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{entry.title}</h3>
                    <p className="text-slate-600">{entry.description}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div className="p-6">
                <div className="space-y-4">
                  {entry.changes.map((change, changeIndex) => {
                    const IconComponent = changeTypeIcons[change.type].icon
                    const iconColor = changeTypeIcons[change.type].color
                    
                    return (
                      <div key={changeIndex} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          change.type === 'added' ? 'bg-green-100' :
                          change.type === 'improved' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          <IconComponent className={`w-3 h-3 ${iconColor}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">
                            <span className="capitalize">{change.type}:</span> {change.title}
                          </h4>
                          <p className="text-slate-600">{change.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Breaking Changes */}
                {entry.breaking.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-red-900">Breaking Changes</h4>
                    </div>
                    <ul className="space-y-2 ml-8">
                      {entry.breaking.map((change, index) => (
                        <li key={index} className="text-red-700">
                          • {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Migration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Migration Assistance</h3>
                <p className="text-blue-800 mb-4">
                  Need help upgrading to the latest version? Our migration guides and support team are here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/docs/migration"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Migration Guide
                  </a>
                  <a
                    href="/support"
                    className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Get Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get notified about new releases, breaking changes, and important updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
            <p className="text-purple-200 text-sm mt-4">
              Release notifications only, no spam.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
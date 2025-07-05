import { motion } from 'framer-motion'
import { Github, Twitter, MessageCircle, Mail, ArrowUp } from 'lucide-react'

const footerLinks = {
  Product: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'Examples', href: '/examples' },
    { name: 'Pricing', href: '/pricing' }
  ],
  Developers: [
    { name: 'Quick Start', href: '/docs/quick-start' },
    { name: 'SDK Reference', href: '/docs/sdk' },
    { name: 'GitHub', href: 'https://github.com/openSVM/svm-pay' },
    { name: 'Community', href: '/community' }
  ],
  Resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Status', href: 'https://status.svm-pay.com' },
    { name: 'Support', href: '/support' }
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' }
  ]
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/openSVM/svm-pay' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/svmpay' },
  { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/svmpay' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@svm-pay.com' }
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-2xl font-black">SVM-Pay</span>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-8">
                The most comprehensive cross-chain payment infrastructure for the decentralized web. 
                Built by developers, for developers.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-xl font-bold mb-4">Stay updated</h3>
              <p className="text-slate-300 mb-6">
                Get the latest updates on new features, integrations, and developer resources.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </motion.div>

          {/* Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-white mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <p className="text-slate-400">
                © 2024 SVM-Pay. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">All systems operational</span>
              </div>
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 group"
            >
              <span className="text-sm">Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
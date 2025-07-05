import { motion } from 'framer-motion'
import { Users, Target, Zap, Globe, Heart, Award, ArrowRight } from 'lucide-react'

const stats = [
  { label: 'Developers Served', value: '10,000+', icon: Users },
  { label: 'Transactions Processed', value: '$50M+', icon: Zap },
  { label: 'Networks Supported', value: '10+', icon: Globe },
  { label: 'Uptime', value: '99.9%', icon: Award }
]

const team = [
  {
    name: 'Sarah Rodriguez',
    role: 'Co-founder & CEO',
    bio: 'Former VP of Engineering at Stripe, led payment infrastructure for 100M+ users',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b9c3?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/sarah-rodriguez'
  },
  {
    name: 'Alex Chen',
    role: 'Co-founder & CTO',
    bio: 'Ex-Facebook blockchain engineer, built cross-chain protocols for Meta\'s crypto projects',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/alex-chen'
  },
  {
    name: 'Priya Patel',
    role: 'Head of Engineering',
    bio: 'Former Coinbase senior engineer, expert in bridge protocols and DeFi infrastructure',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/priya-patel'
  },
  {
    name: 'Mike Johnson',
    role: 'Head of Security',
    bio: 'Previously at Trail of Bits, specialized in smart contract auditing and security research',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/mike-johnson'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Product',
    bio: 'Former Figma product lead, designed developer tools used by millions of creators',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/emily-watson'
  },
  {
    name: 'David Kim',
    role: 'Blockchain Engineer',
    bio: 'Ex-Solana Labs engineer, contributed to Solana core protocol and developer tooling',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=300&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/david-kim'
  }
]

const values = [
  {
    title: 'Developer First',
    description: 'Every decision is made with developers in mind. We build tools we would want to use.',
    icon: Heart
  },
  {
    title: 'Interoperability',
    description: 'Breaking down silos between blockchains to create a unified payment experience.',
    icon: Globe
  },
  {
    title: 'Security',
    description: 'Security is not an afterthought. It\'s built into every layer of our infrastructure.',
    icon: Award
  },
  {
    title: 'Performance',
    description: 'Fast, reliable, and scalable. We optimize for both developer and user experience.',
    icon: Zap
  }
]

const milestones = [
  {
    year: '2023',
    quarter: 'Q1',
    title: 'Company Founded',
    description: 'Started by blockchain veterans from Stripe, Facebook, and Coinbase'
  },
  {
    year: '2023',
    quarter: 'Q2',
    title: 'Solana Payments Launch',
    description: 'First payment infrastructure focusing on Solana ecosystem'
  },
  {
    year: '2023',
    quarter: 'Q4',
    title: 'Series A Funding',
    description: 'Raised $5M led by Andreessen Horowitz and Solana Ventures'
  },
  {
    year: '2024',
    quarter: 'Q2',
    title: 'Multi-Network Support',
    description: 'Expanded to support 4 SVM networks: Solana, Sonic, Eclipse, s00n'
  },
  {
    year: '2024',
    quarter: 'Q4',
    title: 'Cross-Chain Launch',
    description: 'Revolutionary cross-chain payments from 6 EVM networks to SVM'
  },
  {
    year: '2025',
    quarter: 'Q1',
    title: 'Global Expansion',
    description: 'Opening offices in Singapore and London to serve global developers'
  }
]

export function AboutPage() {
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
              About SVM-Pay
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-8">
              We're building the future of cross-chain payments, making it easy for developers 
              to accept payments across any blockchain network.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Blockchain technology has created powerful networks, but they remain isolated islands. 
                We believe the future of payments is cross-chain, where users can pay from any network 
                to any network seamlessly.
              </p>
              <p className="text-xl text-slate-600 leading-relaxed">
                SVM-Pay breaks down these barriers, enabling developers to build payment experiences 
                that work across the entire blockchain ecosystem. Whether your users have ETH on Ethereum 
                or SOL on Solana, they should be able to pay you without friction.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experienced engineers and product leaders from the world's top tech companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border text-center hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Connect on LinkedIn
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From startup to industry leader in cross-chain payments
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-600 to-blue-600 h-full rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${milestone.quarter}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border">
                      <div className="text-sm font-medium text-purple-600 mb-2">{milestone.year} {milestone.quarter}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <Target className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our vision of a connected blockchain future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                View Open Positions
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="mailto:careers@svm-pay.com"
                className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
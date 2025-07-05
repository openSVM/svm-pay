import { motion } from 'framer-motion'
import { MapPin, Users, Zap, Heart, Globe, ArrowRight, DollarSign, Coffee } from 'lucide-react'
import { useState } from 'react'

const positions = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco / Remote',
    type: 'Full-time',
    description: 'Build beautiful developer tools and user interfaces for cross-chain payments',
    requirements: [
      '5+ years React/TypeScript experience',
      'Experience with Web3 integrations',
      'Strong UI/UX design skills',
      'Blockchain knowledge preferred'
    ],
    salary: '$160k - $220k',
    equity: '0.1% - 0.5%'
  },
  {
    title: 'Blockchain Engineer',
    department: 'Engineering',
    location: 'San Francisco / Remote',
    type: 'Full-time',
    description: 'Design and implement cross-chain bridge protocols and smart contracts',
    requirements: [
      '3+ years smart contract development',
      'Experience with Solana and Ethereum',
      'Knowledge of bridge protocols',
      'Rust or Solidity expertise'
    ],
    salary: '$180k - $250k',
    equity: '0.2% - 0.8%'
  },
  {
    title: 'DevRel Engineer',
    department: 'Developer Relations',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build community, create content, and support developers using SVM-Pay',
    requirements: [
      'Strong technical writing skills',
      'Experience building developer communities',
      'Public speaking and content creation',
      'Blockchain development background'
    ],
    salary: '$140k - $180k',
    equity: '0.05% - 0.2%'
  },
  {
    title: 'Security Engineer',
    department: 'Security',
    location: 'San Francisco / Remote',
    type: 'Full-time',
    description: 'Secure our cross-chain infrastructure and conduct security audits',
    requirements: [
      'Security research experience',
      'Smart contract auditing skills',
      'Penetration testing expertise',
      'Incident response experience'
    ],
    salary: '$170k - $230k',
    equity: '0.1% - 0.4%'
  },
  {
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco / Remote',
    type: 'Full-time',
    description: 'Drive go-to-market strategy for cross-chain payment products',
    requirements: [
      '4+ years B2B SaaS marketing',
      'Developer tools experience',
      'Strong analytical skills',
      'Blockchain industry knowledge'
    ],
    salary: '$130k - $170k',
    equity: '0.05% - 0.3%'
  },
  {
    title: 'Engineering Intern',
    department: 'Engineering',
    location: 'San Francisco',
    type: 'Internship',
    description: 'Work on real projects with our engineering team this summer',
    requirements: [
      'CS degree in progress',
      'Strong programming skills',
      'Interest in blockchain technology',
      'Previous internship experience preferred'
    ],
    salary: '$8k - $10k /month',
    equity: 'N/A'
  }
]

const benefits = [
  {
    title: 'Competitive Compensation',
    description: 'Top-tier salary, equity, and performance bonuses',
    icon: DollarSign,
    color: 'green'
  },
  {
    title: 'Flexible Work',
    description: 'Remote-first with optional office access in SF',
    icon: Globe,
    color: 'blue'
  },
  {
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, vision, and mental health coverage',
    icon: Heart,
    color: 'red'
  },
  {
    title: 'Learning Budget',
    description: '$5,000 annual budget for conferences, courses, and books',
    icon: Zap,
    color: 'purple'
  },
  {
    title: 'Team Events',
    description: 'Quarterly team retreats and regular social events',
    icon: Users,
    color: 'indigo'
  },
  {
    title: 'Great Coffee',
    description: 'Premium coffee, snacks, and catered meals in office',
    icon: Coffee,
    color: 'amber'
  }
]

const values = [
  {
    title: 'Move Fast, Break Things (Safely)',
    description: 'We ship quickly but never compromise on security or quality'
  },
  {
    title: 'Developer First',
    description: 'Every decision considers the developer experience first'
  },
  {
    title: 'Own Your Work',
    description: 'Take ownership and see projects through from idea to production'
  },
  {
    title: 'Learn & Grow',
    description: 'Continuous learning and skill development is part of the job'
  }
]

const departments = ['All', 'Engineering', 'Developer Relations', 'Security', 'Marketing']

export function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [applicationForm, setApplicationForm] = useState({
    position: '',
    name: '',
    email: '',
    resume: null,
    coverLetter: ''
  })

  const filteredPositions = selectedDepartment === 'All' 
    ? positions 
    : positions.filter(pos => pos.department === selectedDepartment)

  const handleApply = (positionTitle: string) => {
    setApplicationForm({ ...applicationForm, position: positionTitle })
    // Scroll to application form or open modal
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Help us build the future of cross-chain payments. Work with cutting-edge technology 
              and talented people who are passionate about blockchain innovation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🌍 Remote-first
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                💰 Competitive equity
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🚀 High growth
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide how we work and make decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Work Here?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We offer competitive benefits and an amazing work environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  benefit.color === 'green' ? 'bg-green-100 text-green-600' :
                  benefit.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  benefit.color === 'red' ? 'bg-red-100 text-red-600' :
                  benefit.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  benefit.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find your perfect role and help us revolutionize cross-chain payments
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedDepartment === dept
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">{position.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {position.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {position.salary}
                  </div>
                  {position.equity !== 'N/A' && (
                    <div className="text-purple-600 font-medium">
                      {position.equity} equity
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleApply(position.title)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          id="application-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Apply Now</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Send us your application and we'll get back to you within 48 hours
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                <select
                  value={applicationForm.position}
                  onChange={(e) => setApplicationForm({...applicationForm, position: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a position</option>
                  {positions.map((pos) => (
                    <option key={pos.title} value={pos.title}>{pos.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={applicationForm.name}
                    onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-slate-500 mt-1">PDF, DOC, or DOCX files only</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter</label>
                <textarea
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                  rows={6}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us why you're excited about this role and what you'll bring to the team..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Submit Application
              </button>
            </form>
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
            <Users className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-4">Don't See Your Perfect Role?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
            </p>
            <a
              href="mailto:careers@svm-pay.com"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
import { motion } from 'framer-motion'
import { MessageCircle, Users, Github, Twitter, BookOpen, Zap, Calendar, Award, ExternalLink } from 'lucide-react'

const communityStats = [
  { label: 'Developers', value: '10,000+', icon: Users },
  { label: 'GitHub Stars', value: '2,500+', icon: Github },
  { label: 'Discord Members', value: '5,000+', icon: MessageCircle },
  { label: 'Monthly Events', value: '12+', icon: Calendar }
]

const resources = [
  {
    title: 'Developer Discord',
    description: 'Join our active community of developers building with SVM-Pay',
    icon: MessageCircle,
    link: 'https://discord.gg/svmpay',
    members: '5,000+ members',
    color: 'indigo'
  },
  {
    title: 'GitHub Discussions',
    description: 'Technical discussions, feature requests, and open source contributions',
    icon: Github,
    link: 'https://github.com/openSVM/svm-pay/discussions',
    members: '2,500+ contributors',
    color: 'slate'
  },
  {
    title: 'Twitter Community',
    description: 'Latest updates, announcements, and community highlights',
    icon: Twitter,
    link: 'https://twitter.com/svmpay',
    members: '15,000+ followers',
    color: 'blue'
  },
  {
    title: 'Documentation',
    description: 'Comprehensive guides, tutorials, and API reference',
    icon: BookOpen,
    link: '/docs',
    members: 'Always updated',
    color: 'green'
  }
]

const events = [
  {
    title: 'Monthly Developer Meetup',
    date: 'Every first Tuesday',
    time: '7:00 PM UTC',
    description: 'Technical talks, Q&A sessions, and networking with core team',
    type: 'Virtual',
    nextDate: 'January 7, 2025'
  },
  {
    title: 'Build with SVM-Pay Hackathon',
    date: 'February 15-17, 2025',
    time: '48 hours',
    description: 'Build innovative payment solutions and win prizes',
    type: 'Hybrid',
    nextDate: 'February 15, 2025'
  },
  {
    title: 'Cross-Chain Workshop',
    date: 'January 20, 2025',
    time: '2:00 PM UTC',
    description: 'Deep dive into cross-chain payment architecture and implementation',
    type: 'Virtual',
    nextDate: 'January 20, 2025'
  },
  {
    title: 'Office Hours',
    date: 'Every Wednesday',
    time: '3:00 PM UTC',
    description: 'Get help from our engineers and discuss technical challenges',
    type: 'Virtual',
    nextDate: 'This Wednesday'
  }
]

const contributors = [
  {
    name: 'Alex Chen',
    role: 'Core Maintainer',
    avatar: 'https://github.com/alexchen.png',
    contributions: '500+ commits',
    specialty: 'Cross-chain protocols'
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Community Lead',
    avatar: 'https://github.com/sarahrodriguez.png',
    contributions: '200+ PR reviews',
    specialty: 'Developer experience'
  },
  {
    name: 'Mike Johnson',
    role: 'Documentation',
    avatar: 'https://github.com/mikejohnson.png',
    contributions: '150+ docs',
    specialty: 'Technical writing'
  },
  {
    name: 'Priya Patel',
    role: 'Bridge Engineer',
    avatar: 'https://github.com/priyapatel.png',
    contributions: '300+ commits',
    specialty: 'Bridge integrations'
  }
]

const guidelines = [
  {
    title: 'Be Respectful',
    description: 'Treat all community members with respect and kindness'
  },
  {
    title: 'Stay On Topic',
    description: 'Keep discussions relevant to SVM-Pay and payment technology'
  },
  {
    title: 'Help Others',
    description: 'Share knowledge and help fellow developers succeed'
  },
  {
    title: 'No Spam',
    description: 'Avoid promotional content unrelated to the project'
  }
]

export function CommunityPage() {
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
              Join Our Community
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Connect with developers building the future of cross-chain payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/svmpay"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Join Discord
              </a>
              <a
                href="https://github.com/openSVM/svm-pay"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {communityStats.map((stat, index) => (
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

        {/* Community Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Community Resources
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect, learn, and contribute through our various community channels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                target={resource.link.startsWith('http') ? '_blank' : '_self'}
                rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    resource.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    resource.color === 'slate' ? 'bg-slate-100 text-slate-600' :
                    resource.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <resource.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{resource.title}</h3>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                    <p className="text-slate-600 mb-3">{resource.description}</p>
                    <div className="text-sm text-slate-500 font-medium">{resource.members}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join our regular events to learn, network, and contribute to the ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-slate-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Next: {event.nextDate}
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Register
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Top Contributors
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Meet the amazing people who make SVM-Pay possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{contributor.name}</h3>
                <p className="text-purple-600 font-medium mb-2">{contributor.role}</p>
                <p className="text-sm text-slate-500 mb-1">{contributor.contributions}</p>
                <p className="text-sm text-slate-600">{contributor.specialty}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Community Guidelines
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Help us maintain a welcoming and productive environment for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{guideline.title}</h3>
                    <p className="text-slate-600">{guideline.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <Zap className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Whether you're a developer, designer, or enthusiast, there's a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/openSVM/svm-pay/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Contribution Guide
              </a>
              <a
                href="https://discord.gg/svmpay"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Join Discord
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
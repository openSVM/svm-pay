import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, User, Search } from 'lucide-react'
import { useState } from 'react'

const blogPosts = [
  {
    id: '1',
    title: 'Announcing Cross-Chain Payments: Pay from Any EVM Network to Solana',
    excerpt: 'Today we\'re excited to launch cross-chain payment support, enabling users to pay from Ethereum, Polygon, BNB Chain, and other EVM networks directly to Solana addresses.',
    content: 'Full article content would go here...',
    author: 'Alex Chen',
    authorRole: 'Co-founder & CTO',
    date: '2024-12-15',
    readTime: '5 min read',
    category: 'Product',
    tags: ['Cross-Chain', 'Wormhole', 'Bridges', 'Ethereum'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    featured: true
  },
  {
    id: '2',
    title: 'How Bridge Adapters Enable Seamless Cross-Chain Transfers',
    excerpt: 'Deep dive into our bridge adapter architecture and how we achieve optimal routing across multiple bridge protocols.',
    content: 'Technical article content...',
    author: 'Priya Patel',
    authorRole: 'Bridge Engineer',
    date: '2024-12-10',
    readTime: '8 min read',
    category: 'Technical',
    tags: ['Architecture', 'Bridges', 'Technical'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    featured: false
  },
  {
    id: '3',
    title: 'Building the Future of Payments: Our $5M Series A',
    excerpt: 'We raised $5M to accelerate cross-chain payment infrastructure and expand our team of world-class engineers.',
    content: 'Funding announcement content...',
    author: 'Sarah Rodriguez',
    authorRole: 'CEO',
    date: '2024-12-05',
    readTime: '3 min read',
    category: 'Company',
    tags: ['Funding', 'Growth', 'Team'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    featured: false
  },
  {
    id: '4',
    title: 'Security Best Practices for Cross-Chain Payments',
    excerpt: 'Learn about the security measures we implement to protect cross-chain transactions and how you can secure your integration.',
    content: 'Security guide content...',
    author: 'Mike Johnson',
    authorRole: 'Security Lead',
    date: '2024-11-28',
    readTime: '6 min read',
    category: 'Security',
    tags: ['Security', 'Best Practices', 'Guide'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    featured: false
  },
  {
    id: '5',
    title: 'Introducing Payment Links: Share and Get Paid Instantly',
    excerpt: 'New payment links feature allows you to generate shareable URLs with QR codes for quick and easy payments.',
    content: 'Feature announcement content...',
    author: 'Emily Watson',
    authorRole: 'Product Manager',
    date: '2024-11-20',
    readTime: '4 min read',
    category: 'Product',
    tags: ['Payment Links', 'QR Codes', 'Feature'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    featured: false
  },
  {
    id: '6',
    title: 'Solana vs Ethereum: Payment Performance Comparison',
    excerpt: 'Comprehensive analysis of transaction speeds, costs, and user experience across different blockchain networks.',
    content: 'Performance analysis content...',
    author: 'David Kim',
    authorRole: 'Blockchain Engineer',
    date: '2024-11-15',
    readTime: '7 min read',
    category: 'Technical',
    tags: ['Solana', 'Ethereum', 'Performance', 'Comparison'],
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
    featured: false
  }
]

const categories = ['All', 'Product', 'Technical', 'Company', 'Security']

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'All' || post.category === selectedCategory
    const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return categoryMatch && searchMatch
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

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
              SVM-Pay Blog
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Insights, updates, and technical deep-dives from the SVM-Pay team
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-slate-600 text-lg mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{featuredPost.author}</div>
                        <div className="text-sm text-slate-500">{featuredPost.authorRole}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    Read Full Article
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.category === 'Product' ? 'bg-green-100 text-green-800' :
                    post.category === 'Technical' ? 'bg-blue-100 text-blue-800' :
                    post.category === 'Company' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{post.author}</div>
                      <div className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="text-xs text-slate-500">+{post.tags.length - 2} more</span>
                  )}
                </div>

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get the latest updates, technical insights, and product announcements delivered to your inbox.
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
              No spam, unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
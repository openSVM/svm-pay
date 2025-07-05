import { motion } from 'framer-motion'
import { ArrowLeft, Clock, BarChart3, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CopyButton } from './CopyButton'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TutorialStep {
  title: string
  description: string
  code?: string
  language?: string
  notes?: string[]
}

interface TutorialLayoutProps {
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  time: string
  category: string
  categoryPath: string
  overview: string
  prerequisites?: string[]
  steps: TutorialStep[]
  conclusion?: string
  nextSteps?: string[]
  relatedTutorials?: Array<{
    title: string
    path: string
  }>
}

export function TutorialLayout({
  title,
  description,
  level,
  time,
  category,
  categoryPath,
  overview,
  prerequisites = [],
  steps,
  conclusion,
  nextSteps = [],
  relatedTutorials = []
}: TutorialLayoutProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getLanguageFromString = (language: string): string => {
    const normalizedLang = language.toLowerCase()
    
    if (normalizedLang.includes('javascript') || normalizedLang.includes('js')) return 'javascript'
    if (normalizedLang.includes('typescript') || normalizedLang.includes('ts')) return 'typescript'
    if (normalizedLang.includes('react')) return 'jsx'
    if (normalizedLang.includes('shell') || normalizedLang.includes('bash')) return 'bash'
    if (normalizedLang.includes('json')) return 'json'
    if (normalizedLang.includes('yaml')) return 'yaml'
    if (normalizedLang.includes('sql')) return 'sql'
    if (normalizedLang.includes('python')) return 'python'
    if (normalizedLang.includes('rust')) return 'rust'
    if (normalizedLang.includes('solidity')) return 'solidity'
    if (normalizedLang.includes('css')) return 'css'
    if (normalizedLang.includes('html')) return 'html'
    
    return 'javascript' // default fallback
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
            <Link to="/docs" className="hover:text-slate-900">Documentation</Link>
            <span>/</span>
            <Link to={categoryPath} className="hover:text-slate-900">{category}</Link>
            <span>/</span>
            <span className="text-slate-900">{title}</span>
          </nav>

          {/* Back Button */}
          <Link
            to={categoryPath}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {category}
          </Link>

          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
            <p className="text-lg text-slate-600 mb-6">{description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
                  {level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{time}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Overview</h3>
              <p className="text-slate-600">{overview}</p>
            </div>
          </div>

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {prerequisites.map((prereq, index) => (
                  <li key={index} className="text-blue-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>

                {step.code && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-900">
                        {step.language || 'Code'}
                      </h4>
                      <CopyButton text={step.code} />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language={getLanguageFromString(step.language || 'javascript')}
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        customStyle={{
                          margin: 0,
                          fontSize: '14px',
                          borderRadius: '8px'
                        }}
                      >
                        {step.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}

                {step.notes && step.notes.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-amber-900 mb-2">Important Notes:</h4>
                    <ul className="space-y-1">
                      {step.notes.map((note, noteIndex) => (
                        <li key={noteIndex} className="text-amber-800 text-sm flex items-start gap-2">
                          <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          {conclusion && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Conclusion</h3>
              <p className="text-green-800">{conclusion}</p>
            </div>
          )}

          {/* Next Steps */}
          {nextSteps.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Next Steps</h3>
              <ul className="space-y-2">
                {nextSteps.map((step, index) => (
                  <li key={index} className="text-purple-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Tutorials */}
          {relatedTutorials.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Tutorials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTutorials.map((tutorial, index) => (
                  <Link
                    key={index}
                    to={tutorial.path}
                    className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-slate-900 font-medium">{tutorial.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
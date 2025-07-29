import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DocsPage } from './pages/DocsPage'
import { TutorialsPage } from './pages/TutorialsPage'
import { DemoPage } from './pages/DemoPage'
import { ExamplesPage } from './pages/ExamplesPage'
import { PricingPage } from './pages/PricingPage'
import { CommunityPage } from './pages/CommunityPage'
import { BlogPage } from './pages/BlogPage'
import { ChangelogPage } from './pages/ChangelogPage'
import { SupportPage } from './pages/SupportPage'
import { AboutPage } from './pages/AboutPage'
import { CareersPage } from './pages/CareersPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { FlutterPage } from './pages/FlutterPage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs/*" element={<DocsPage />} />
          <Route path="/tutorials/*" element={<TutorialsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/flutter" element={<FlutterPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

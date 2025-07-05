import './index.css'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { TechStack } from './components/TechStack'
import { Documentation } from './components/Documentation'
import { Stats } from './components/Stats'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Stats />
      <Features />
      <TechStack />
      <Documentation />
      <Footer />
    </div>
  )
}

export default App

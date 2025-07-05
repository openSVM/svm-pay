import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { TechStack } from '../components/TechStack'
import { Documentation } from '../components/Documentation'
import { Stats } from '../components/Stats'

export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <TechStack />
      <Documentation />
    </>
  )
}
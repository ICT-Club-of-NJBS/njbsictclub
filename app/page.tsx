import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Hero from '@/components/sections/hero'
import Features from '@/components/sections/features'
import Team from '@/components/sections/team-preview'
import Projects from '@/components/sections/projects-preview'
import Events from '@/components/sections/events-preview'
import CTA from '@/components/sections/cta'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <Hero />
        <Features />
        <Projects />
        <Team />
        <Events />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

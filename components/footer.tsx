'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">ICT Club of NJBS</h3>
            <p className="text-foreground/60 text-sm">
              Innovation, Creativity, and Technology Club - Inspiring the next generation of tech leaders.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/team" className="hover:text-primary transition-colors">
                Team
              </Link>
              <Link href="/projects" className="hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/events" className="hover:text-primary transition-colors">
                Events
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                GitHub
              </a>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/code" className="hover:text-primary transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

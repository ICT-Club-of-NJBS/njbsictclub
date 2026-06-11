'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-pretty">
          Ready to Join
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ICT Club of NJBS
          </span>
        </h2>
        
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-12">
          Be part of a curated collective pushing boundaries and building the future. Limited spots available.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base gap-2"
            asChild
          >
            <Link href="/auth/signup">
              Get Started
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-card/50 h-12 text-base"
            asChild
          >
            <Link href="/contact">Schedule a Chat</Link>
          </Button>
        </div>

        <div className="mt-16 pt-16 border-t border-border/50 text-foreground/60 text-sm">
          <p>Curated community • Building innovation • Making impact</p>
        </div>
      </div>
    </section>
  );
}

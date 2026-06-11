'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = [
  { role: 'Founder & Visionary', count: '1' },
  { role: 'Developers', count: '12' },
  { role: 'Designers', count: '8' },
  { role: 'Contributors', count: '25+' },
];

export default function Team() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Team</h2>
            <p className="text-foreground/70">Talented individuals driving innovation</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 gap-2"
            asChild
          >
            <Link href="/team">
              Meet Everyone
              <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {roles.map((item, idx) => (
            <div key={idx} className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/60 hover:border-primary/50 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-2">{item.count}</div>
              <div className="text-sm text-foreground/70">{item.role}</div>
            </div>
          ))}
        </div>

        <div className="glass p-8 rounded-2xl">
          <p className="text-foreground/80 text-center text-lg leading-relaxed">
            From experienced entrepreneurs to emerging talents, our diverse team brings perspectives and expertise
            that fuel our collective vision. We&apos;re always looking for passionate collaborators.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/auth/signup">Join Us</Link>
            </Button>
            <Button variant="outline" className="border-border/50 hover:bg-card/50" asChild>
              <Link href="/team">View Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

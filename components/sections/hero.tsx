'use client';

import { ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
  // 👉 You can change this image path or make it dynamic later
  const showcaseImage = '/njbsgroupphoto.jpeg'; // put image in /public folder

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Orb Background */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm text-foreground/80">
              Welcome to the creative collective
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-pretty">
            Where passion
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              meets innovation
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto text-balance leading-relaxed">
            Join a curated community of visionary creators, developers, and forward-thinking minds building the future
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            asChild
          >
            <Link href="/signup">
              Explore Our Collective
              <ChevronRight size={18} />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-card/50 h-12 text-base"
            asChild
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        {/* Featured Community Showcase */}
        <div className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-card/60 hover:border-primary/50 max-w-5xl mx-auto">
          {showcaseImage ? (
            <div className="relative w-full aspect-video">
              <Image
                src={showcaseImage}
                alt="Featured Community Showcase"
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-4 flex items-center justify-center opacity-50">
                  <Sparkles size={48} className="text-primary-foreground" />
                </div>
                <p className="text-foreground/50 text-sm">
                  Featured Community Showcase
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
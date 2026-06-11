'use client';

import { Zap, Users, Lightbulb, Rocket } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    label: 'Innovative Ideas',
    description: 'Collaborate on groundbreaking projects that shape the future',
  },
  {
    icon: Users,
    label: 'Curated Community',
    description: 'Access to vetted creators and industry leaders',
  },
  {
    icon: Zap,
    label: 'Rapid Execution',
    description: 'Resources and support to bring concepts to reality',
  },
  {
    icon: Rocket,
    label: 'Accelerate Growth',
    description: 'Network effects that amplify your reach and impact',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why Join ICT Club of NJBS?</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A community designed for creators who want to make an impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/60 hover:border-primary/50 p-6 rounded-2xl group"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.label}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

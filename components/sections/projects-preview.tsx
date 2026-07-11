'use client';

import Link from 'next/link';
import { ChevronRight, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
  github?: string;
}

const fallbackProjects: Project[] = [
  {
    id: 'fallback-1',
    title: 'ICT Club Portal',
    description:
      'Digital infrastructure platform for the NJBS ICT Club community.',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS'],
    status: 'Active',
    github: 'https://github.com',
    link: '#',
  },
  {
    id: 'fallback-2',
    title: 'Drone Controller',
    description:
      'Arduino powered flight control system using advanced sensors.',
    technologies: ['Arduino', 'C++', 'Robotics'],
    status: 'In Progress',
    github: 'https://github.com',
    link: '#',
  },
];

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects', {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.warn('Projects API failed:', response.status);
          setProjects(fallbackProjects);
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Invalid response type, using fallback');
          setProjects(fallbackProjects);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedProjects = data.map((project: any, index: number) => ({
            id: project.id?.toString() || `project-${index}`,
            title: project.title || project.name || 'Untitled Project',
            description: project.description || 'No description available.',
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            status: project.status || 'Active',
            github: project.github || project.github_url || '',
            link: project.link || project.demo_url || '',
          }));

          setProjects(formattedProjects.slice(0, 3));
        } else {
          console.warn('No projects found, using fallback');
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('Fetch failed, using fallback:', error);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [mounted]);

  if (!mounted) return null;

  // Loading Skeleton UI
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-4 h-10 w-64 animate-pulse rounded-xl bg-muted" />
              <div className="h-5 w-52 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 min-h-[240px] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-muted" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="mb-6 h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
                <div>
                  <div className="mb-6 flex gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Featured Projects
            </h2>
            <p className="text-foreground/70 text-sm sm:text-base">
              Connect, learn, and grow with our community
            </p>
          </div>

          <Button
            variant="ghost"
            className="hidden gap-2 text-primary hover:bg-primary/10 sm:flex"
            asChild
          >
            <Link href="/projects">
              <span className="flex items-center gap-1">
                View All
                <ChevronRight size={18} />
              </span>
            </Link>
          </Button>
        </div>

        {/* Projects Layout Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/60 flex flex-col justify-between min-h-[240px] group relative overflow-hidden"
            >
              
              {/* Primary Ambient Glow Effect */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/15 pointer-events-none" />

              <div>
                {/* Title and Status Badge */}
                <div className="relative z-10 mb-2 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>

                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize whitespace-nowrap">
                    {project.status}
                  </span>
                </div>

                {/* Description Text */}
                <p className="relative z-10 mb-6 text-sm text-foreground/70 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Technologies Badges and Meta Info Icons Layout style */}
                {project.technologies.length > 0 && (
                  <div className="relative z-10 mb-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-xs font-medium text-foreground/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Link Elements matched exactly with Image details */}
                <div className="relative z-10 flex items-center gap-5 border-t border-border/50 pt-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-primary"
                    >
                      <Github size={14} className="text-foreground/40" />
                      Code
                    </a>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-primary"
                    >
                      <ExternalLink size={14} className="text-foreground/40" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Fallback View All Button for Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            className="rounded-full border-border/50 hover:bg-card/50"
            asChild
          >
            <Link href="/projects">
              <span>View All Projects</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

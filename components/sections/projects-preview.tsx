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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-black dark:bg-black dark:text-white transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-4 h-10 w-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-52 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-black"
              >
                <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-6 h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-6 flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-black dark:bg-black dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
              Featured Projects
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
              Connect, learn, and grow with our community
            </p>
          </div>

          <Button
            variant="ghost"
            className="hidden gap-2 rounded-full text-purple-600 hover:bg-purple-500/10 hover:text-purple-600 sm:flex"
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
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 dark:border-zinc-800/80 dark:bg-black flex flex-col justify-between min-h-[240px]"
            >
              
              {/* Purple Ambient Glow Effect */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl transition-all duration-500 group-hover:bg-purple-500/15 pointer-events-none" />

              <div>
                {/* Title and Status Badge */}
                <div className="relative z-10 mb-2 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-black dark:text-white transition-colors group-hover:text-purple-600">
                    {project.title}
                  </h3>

                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 capitalize whitespace-nowrap">
                    {project.status}
                  </span>
                </div>

                {/* Description Text */}
                <p className="relative z-10 mb-6 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Technologies Badges and Meta Info Icons Layout style */}
                {project.technologies.length > 0 && (
                  <div className="relative z-10 mb-6 flex flex-wrap gap-2 text-zinc-500 dark:text-zinc-400">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-zinc-200/60 bg-zinc-50/50 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Link Elements matched exactly with Image details */}
                <div className="relative z-10 flex items-center gap-5 border-t border-zinc-100 pt-4 dark:border-zinc-900">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                    >
                      <Github size={14} className="text-zinc-400" />
                      Code
                    </a>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                    >
                      <ExternalLink size={14} className="text-zinc-400" />
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
            className="rounded-full border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-700 dark:bg-black dark:text-white"
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
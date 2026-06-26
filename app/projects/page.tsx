'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Github, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: string
  technologies: any 
  github_url: string
  demo_url: string
  image_url?: string // Added to safely process the project preview banner image
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [filterStatus])

  const fetchProjects = async () => {
    setLoading(true)

    try {
      const url = `/api/projects${filterStatus ? `?status=${filterStatus}` : ''}`
      // Bypasses stale Next.js cache checks forcing live fetches
      const response = await fetch(url, { cache: 'no-store' })
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data || [])
    } catch (error: any) {
      console.error('Error fetching projects:', error.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
      case 'active':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
      case 'planning':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
      default:
        return 'bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-500/20'
    }
  }

  const parseTech = (tech: any): string[] => {
    if (!tech) return []
    if (Array.isArray(tech)) return tech
    if (typeof tech === 'string') return tech.split(',').map(t => t.trim())
    if (typeof tech === 'object') return Object.values(tech).map(String)
    return []
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">Our Projects</h1>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Explore innovative projects built with passion and modern tech
            </p>
          </div>

          {/* FILTER */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {['all', 'planning', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status === 'all' ? null : status)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all uppercase tracking-wider border ${
                  filterStatus === status || (status === 'all' && !filterStatus)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-blue-500/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* PROJECT BANNER IMAGE DISPLAY */}
                  <div className="relative w-full h-48 bg-slate-100 dark:bg-zinc-800 overflow-hidden border-b border-slate-100 dark:border-zinc-800">
                    <img 
                      src={project.image_url || '/project-placeholder.png'} 
                      alt={project.name}
                      className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600'; // Beautiful abstract fallback
                      }}
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* TITLE + STATUS */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">{project.name}</h3>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shrink-0 ${getStatusColor(project.status)}`}>
                        {project.status || 'active'}
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-slate-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {project.description || 'No description provided for this project.'}
                    </p>

                    {/* TECH STACK */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                        {parseTech(project.technologies).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-md border border-slate-200/60 dark:border-zinc-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ACTION LINK BUTTONS */}
                    <div className="flex gap-3 mt-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition w-full"
                        >
                          <Github size={14} /> Code
                        </a>
                      )}

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/10 transition w-full"
                        >
                          <ExternalLink size={14} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

          {!loading && projects.length === 0 && (
            <p className="text-center text-slate-400 dark:text-zinc-500 py-20 text-lg">
              No projects found.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
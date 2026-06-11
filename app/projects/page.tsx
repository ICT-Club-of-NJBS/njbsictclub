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
  technologies: any // 👈 FIXED (was string)
  github_url: string
  demo_url: string
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
      const response = await fetch(url)
      
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
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'active':
        return 'bg-blue-500/20 text-blue-400'
      case 'planning':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  // ✅ SAFE TECHNOLOGY PARSER (MAIN FIX)
  const parseTech = (tech: any): string[] => {
    if (!tech) return []

    if (Array.isArray(tech)) return tech

    if (typeof tech === 'string')
      return tech.split(',').map(t => t.trim())

    if (typeof tech === 'object')
      return Object.values(tech).map(String)

    return []
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore innovative projects built with passion and modern tech
            </p>
          </div>

          {/* FILTER */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {['all', 'planning', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status === 'all' ? null : status)
                }
                className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                  filterStatus === status || (status === 'all' && !filterStatus)
                    ? 'bg-primary text-white'
                    : 'bg-card/40 border-border hover:border-primary/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all"
                >

                  {/* TITLE + STATUS */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{project.name}</h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  {/* TECH STACK - FIXED */}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {parseTech(project.technologies).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-auto">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-black/30 hover:bg-black/50 border border-border"
                      >
                        <Github size={14} /> Code
                      </a>
                    )}

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                      >
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}

          {!loading && projects.length === 0 && (
            <p className="text-center text-muted-foreground py-20">
              No projects found
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

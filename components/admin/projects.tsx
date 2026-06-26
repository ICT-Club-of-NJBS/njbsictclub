'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
  technologies: string
  githubUrl: string
  demoUrl: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const normalizeProjectData = (item: any): Project => {
    if (!item) return {} as Project
    let techString = ''
    if (item.technologies) {
      techString = Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies
    }
    return {
      id: item.id || item._id || '', 
      name: item.title || item.name || '', 
      description: item.description || '',
      status: item.status || 'active',
      startDate: item.start_date || item.startDate || '',
      endDate: item.end_date || item.endDate || '',
      technologies: techString,
      githubUrl: item.github_url || item.githubUrl || '',
      demoUrl: item.demo_url || item.demoUrl || ''
    }
  }

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const textData = await res.text()
        const data = textData ? JSON.parse(textData) : []
        setProjects(Array.isArray(data) ? data.map(normalizeProjectData) : [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setMessage({ text: 'Name and Description required', type: 'error' })
      return
    }
    setLoading(true)
    const techArray = form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = {
      title: form.name.trim(), 
      description: form.description.trim(),
      status: form.status.toLowerCase(), 
      start_date: form.startDate || null,
      end_date: form.endDate || null,
      technologies: techArray, 
      github_url: form.githubUrl.trim() || null,
      demo_url: form.demoUrl.trim() || null,
    }
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const responseData = await res.json()
        setProjects([normalizeProjectData(responseData), ...projects])
        setMessage({ text: 'Project added successfully!', type: 'success' })
        setForm({ name: '', description: '', status: 'active', startDate: '', endDate: '', technologies: '', githubUrl: '', demoUrl: '' })
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!id || !confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      if (res.ok) setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const filtered = projects.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 bg-transparent text-zinc-950 dark:text-zinc-50 transition-colors">
      
      {/* Alert Messages */}
      {message.text && (
        <div className={`p-4 border rounded-2xl font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'}`}>
          {message.text}
        </div>
      )}

      {/* Dynamic Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600"
        />
      </div>

      {/* Wrapper Main Card Panel - Dynamic Background Theme */}
      <div className="p-8 space-y-6 border border-zinc-200 rounded-3xl shadow-xs bg-white text-zinc-950 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 transition-colors">
        <h2 className="font-bold flex items-center gap-2 text-zinc-950 dark:text-zinc-50 text-xl tracking-tight">
          <Plus size={20} className="text-purple-600" /> Add New Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            {/* Project Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Project Name</label>
              <input 
                name="name" 
                placeholder="Enter project title" 
                value={form.name} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600" 
              />
            </div>
            
            {/* Status Dropdown Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium cursor-pointer dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              >
                <option value="active" className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">Active</option>
                <option value="completed" className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">Completed</option>
                <option value="on-hold" className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">On Hold</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Start Date</label>
              <input 
                name="startDate" 
                type="date" 
                value={form.startDate} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50" 
              />
            </div>
            
            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">End Date</label>
              <input 
                name="endDate" 
                type="date" 
                value={form.endDate} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50" 
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Technologies Stack</label>
              <input 
                name="technologies" 
                placeholder="React, Next.js, Tailwind..." 
                value={form.technologies} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600" 
              />
            </div>
            
            {/* GitHub Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">GitHub URL</label>
              <input 
                name="githubUrl" 
                placeholder="https://github.com/username/repo" 
                value={form.githubUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600" 
              />
            </div>
            
            {/* Live Demo Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Live Demo URL</label>
              <input 
                name="demoUrl" 
                placeholder="https://your-live-project.com" 
                value={form.demoUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600" 
              />
            </div>
          </div>
        </div>

        {/* Textarea Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">Project Description</label>
          <textarea
            name="description"
            placeholder="Detailed Description Text..."
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium min-h-[120px] resize-y dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600"
          />
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleAdd} 
            disabled={loading} 
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl font-semibold text-sm transition-all shadow-xs dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {loading ? 'Processing Submission...' : 'Add Project'}
          </Button>
        </div>
      </div>

      {/* Rendered Created Projects Feed Section */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div key={p.id} className="p-6 space-y-4 border border-zinc-200 rounded-3xl bg-white shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-xl text-zinc-950 tracking-tight dark:text-white">{p.name}</h3>
                <p className="text-sm text-zinc-600 mt-2 whitespace-pre-wrap leading-relaxed dark:text-zinc-400">{p.description}</p>
              </div>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => handleDelete(p.id)} 
                className="shrink-0 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
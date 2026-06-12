'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    return {
      // Handles both MongoDB '_id' or SQL 'id' variations safely
      id: item._id || item.id || '', 
      name: item.name || '',
      description: item.description || '',
      status: item.status || 'active',
      startDate: item.start_date || item.startDate || '',
      endDate: item.end_date || item.endDate || '',
      technologies: item.technologies || '',
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
        const cleanProjects = Array.isArray(data) ? data.map(normalizeProjectData) : []
        setProjects(cleanProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // FIXED ADD PROJECT SUBMISSION HANDLER
  const handleAdd = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setMessage({ text: 'Name and Description required', type: 'error' })
      return
    }

    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          technologies: form.technologies || null,
          githubUrl: form.githubUrl || null,
          demoUrl: form.demoUrl || null,
        }),
      })

      // ✅ FIX: Read raw text first to avoid crashing if the body string is empty
      const responseText = await res.text()
      let responseData: any = {}
      
      if (responseText) {
        try {
          responseData = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse response payload:", parseError)
        }
      }

      if (res.ok) {
        const safeNewProject = normalizeProjectData(responseData)
        setProjects([safeNewProject, ...projects])
        
        setMessage({ text: 'Project added successfully', type: 'success' })

        setForm({
          name: '',
          description: '',
          status: 'active',
          startDate: '',
          endDate: '',
          technologies: '',
          githubUrl: '',
          demoUrl: '',
        })
      } else {
        setMessage({ 
          text: responseData?.error || responseText || 'Failed to create project on server', 
          type: 'error' 
        })
      }
    } catch (error) {
      console.error('Error adding project:', error)
      setMessage({ text: 'Internal Client processing error', type: 'error' })
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!id || !confirm('Delete this project?')) return

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Safe mapping lookup fallback for database schema alignment
        setProjects(projects.filter((p) => p.id !== id))
        setMessage({ text: 'Project deleted successfully', type: 'success' })
      } else {
        setMessage({ text: 'Delete route execution failed', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      setMessage({ text: 'Error deleting project', type: 'error' })
    }
  }

  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {message.text && (
        <Card
          className={`p-3 border font-medium ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {message.text}
        </Card>
      )}

      <Input
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2 text-foreground">
          <Plus size={16} /> Add New Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input name="name" placeholder="Project Name" value={form.name} onChange={handleChange} />
          
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>

          <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />

          <Input name="technologies" placeholder="React, Next.js, TailWind..." value={form.technologies} onChange={handleChange} />
          <Input name="githubUrl" placeholder="GitHub Repository URL" value={form.githubUrl} onChange={handleChange} />
          <Input name="demoUrl" placeholder="Live Deployment Link URL" value={form.demoUrl} onChange={handleChange} />
        </div>

        <textarea
          name="description"
          placeholder="Detailed Description Text..."
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
        />

        <Button onClick={handleAdd} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Processing Submission...' : 'Add Project'}
        </Button>
      </Card>

      {filtered.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground text-sm">No active projects found.</p>
      ) : (
        filtered.map((p) => (
          <Card key={p.id} className="p-4 space-y-2 border shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{p.description}</p>
              </div>

              <Button variant="destructive" size="icon" onClick={() => handleDelete(p.id)} className="shrink-0">
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <p><span className="font-semibold text-foreground">Status:</span> <span className="capitalize">{p.status}</span></p>
              {p.technologies && <p><span className="font-semibold text-foreground">Stack:</span> {p.technologies}</p>}
              {(p.startDate || p.endDate) && (
                <p><span className="font-semibold text-foreground">Duration:</span> {p.startDate || 'N/A'} — {p.endDate || 'N/A'}</p>
              )}
              
              <div className="flex gap-4 items-center">
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
                    Code Repository
                  </a>
                )}
                {p.demoUrl && (
                  <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
                    Live View
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
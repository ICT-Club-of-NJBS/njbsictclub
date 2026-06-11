'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'

interface Project {
  _id: string
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

  // form states
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

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
    setLoading(false)
  }

  // INPUT HANDLER
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ADD PROJECT
  const handleAdd = async () => {
    if (!form.name || !form.description) {
      setMessage({ text: 'Name and Description required', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const newProject = await res.json()
        setProjects([newProject, ...projects])
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
      }
    } catch (error) {
      console.error('Error adding project:', error)
      setMessage({ text: 'Error adding project', type: 'error' })
    }

    setLoading(false)
  }

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id))
        setMessage({ text: 'Project deleted successfully', type: 'success' })
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      setMessage({ text: 'Error deleting project', type: 'error' })
    }
  }

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* MESSAGE */}
      {message.text && (
        <Card
          className={`p-3 ${
            message.type === 'error' ? 'bg-red-50' : 'bg-green-50'
          }`}
        >
          {message.text}
        </Card>
      )}

      {/* SEARCH */}
      <Input
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ADD FORM */}
      <Card className="p-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus size={16} /> Add New Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>

          <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />

          <Input name="technologies" placeholder="React, Next.js, Node..." value={form.technologies} onChange={handleChange} />
          <Input name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={handleChange} />

          <Input name="demoUrl" placeholder="Demo URL" value={form.demoUrl} onChange={handleChange} />

        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <Button onClick={handleAdd} disabled={loading}>
          {loading ? 'Adding...' : 'Add Project'}
        </Button>
      </Card>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p className="text-center py-4">No projects found</p>
      ) : (
        filtered.map((p) => (
          <Card key={p._id} className="p-4 space-y-2">

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>

              <Button variant="destructive" onClick={() => handleDelete(p._id)}>
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>Status: {p.status}</p>
              <p>Tech: {p.technologies}</p>
              <p>Start: {p.startDate} | End: {p.endDate}</p>

              {p.githubUrl && (
                <p>
                  GitHub: <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Link</a>
                </p>
              )}
              {p.demoUrl && (
                <p>
                  Demo: <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Link</a>
                </p>
              )}
            </div>

          </Card>
        ))
      )}
    </div>
  )
}

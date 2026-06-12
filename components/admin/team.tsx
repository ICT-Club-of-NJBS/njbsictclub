'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Edit2,
  Trash2,
  Plus,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
} from 'lucide-react'

interface TeamMember {
  _id: string // Fixed to use consistent MongoDB style ID mapping
  name: string
  position: string
  email?: string
  phone?: string
  bio?: string
  image_url?: string
  skills?: string[]
  created_at?: string
  updated_at?: string
}

const initialFormData: Partial<TeamMember> = {
  name: '',
  position: '',
  email: '',
  phone: '',
  bio: '',
  image_url: '',
  skills: [],
}

export default function TeamComponent() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Track the locally selected file object and its preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error' | ''
  }>({
    text: '',
    type: '',
  })

  const [formData, setFormData] = useState<Partial<TeamMember>>(initialFormData)

  useEffect(() => {
    fetchTeam()
  }, [])

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/team', { cache: 'no-store' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to fetch team')
      }

      if (Array.isArray(data)) {
        setTeam(data)
      } else if (Array.isArray(data.team)) {
        setTeam(data.team)
      } else {
        setTeam([])
      }
    } catch (error) {
      console.error('FETCH TEAM ERROR:', error)
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to fetch team members',
        type: 'error',
      })
      setTeam([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTeam = Array.isArray(team)
    ? team.filter((member) => {
        const name = member?.name || ''
        const position = member?.position || ''
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          position.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    : []

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingId(null)
    setSelectedFile(null)
    setPreviewUrl('')
    setShowForm(false)
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({ ...member })
    setEditingId(member._id)
    setSelectedFile(null)
    setPreviewUrl(member.image_url || '') // Show existing image if it exists
    setShowForm(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file)) // Create temporary local preview
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    const confirmed = confirm('Are you sure you want to remove this team member?')
    if (!confirmed) return

    try {
      setDeleteLoading(id)
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete team member')
      }

      setTeam((prev) => prev.filter((m) => m._id !== id))
      setMessage({ text: 'Team member removed successfully', type: 'success' })
    } catch (error) {
      console.error('DELETE ERROR:', error)
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to delete team member',
        type: 'error',
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      setMessage({ text: 'Name is required', type: 'error' })
      return
    }
    if (!formData.position?.trim()) {
      setMessage({ text: 'Position is required', type: 'error' })
      return
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' })
      return
    }

    try {
      setFormLoading(true)

      // Use native FormData payload to allow file attachment processing
      const dataPayload = new FormData()
      dataPayload.append('name', formData.name || '')
      dataPayload.append('position', formData.position || '')
      dataPayload.append('email', formData.email || '')
      dataPayload.append('phone', formData.phone || '')
      dataPayload.append('bio', formData.bio || '')
      
      if (selectedFile) {
        dataPayload.append('image', selectedFile) // Append raw binary file
      } else if (formData.image_url) {
        dataPayload.append('image_url', formData.image_url) // Retain old file if no new selection
      }

      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team'
      const method = editingId ? 'PUT' : 'POST'

      // Note: Omit 'Content-Type' header completely when sending FormData. 
      // The browser fills it automatically with correct boundaries.
      const res = await fetch(url, {
        method,
        body: dataPayload,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save team member')
      }

      if (editingId) {
        setTeam((prev) => prev.map((m) => (m._id === editingId ? data : m)))
        setMessage({ text: 'Team member updated successfully', type: 'success' })
      } else {
        setTeam((prev) => [data, ...prev])
        setMessage({ text: 'Team member added successfully', type: 'success' })
      }

      resetForm()
    } catch (error) {
      console.error('SAVE ERROR:', error)
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to save team member',
        type: 'error',
      })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Add Team Member
        </Button>
      </div>

      <Input
        placeholder="Search by name or position..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {message.text && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <p className="flex-1 font-medium">{message.text}</p>
          <button onClick={() => setMessage({ text: '', type: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              placeholder="Position"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />

            <Input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              placeholder="Phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* Custom File Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium block text-gray-700">Profile Image</label>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                )}
                <div className="relative flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="team-image-upload"
                  />
                  <label
                    htmlFor="team-image-upload"
                    className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition text-sm text-gray-600 font-medium"
                  >
                    <Upload size={16} />
                    {selectedFile ? selectedFile.name : 'Choose Image File'}
                  </label>
                </div>
              </div>
            </div>

            <textarea
              placeholder="Bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded-lg p-3 min-h-24"
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {formLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {editingId ? 'Update' : 'Add'} Member
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10">Loading team members...</div>
      ) : filteredTeam.length === 0 ? (
        <Card className="p-10 text-center">No team members found</Card>
      ) : (
        <div className="grid gap-4">
          {filteredTeam.map((member) => (
            <Card
              key={member._id}
              className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100/png'
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                    N/A
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  {member.email && <p className="text-xs text-gray-500">{member.email}</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(member)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  disabled={deleteLoading === member._id}
                  onClick={() => handleDelete(member._id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteLoading === member._id ? (
                    'Removing...'
                  ) : (
                    <>
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
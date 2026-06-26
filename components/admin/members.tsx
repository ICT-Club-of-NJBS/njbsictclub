'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, Save, AlertCircle, CheckCircle, X } from 'lucide-react'

interface Member {
  id: string
  full_name: string
  email: string
  role: 'member' | 'organizer' | 'admin'
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'member' as 'member' | 'organizer' | 'admin',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
    // Auto-clear message after 5 seconds
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setMembers(data)
      setMessage({ text: '', type: '' })
    } catch (error: any) {
      console.error('Error fetching members:', error)
      setMessage({ text: 'Failed to load members', type: 'error' })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete member')
      }

      setMembers(members.filter((m) => m.id !== id))
      setMessage({ text: 'Member deleted successfully', type: 'success' })
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to delete member', type: 'error' })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleEdit = (member: Member) => {
    setFormData({
      full_name: member.full_name,
      email: member.email,
      role: member.role,
    })
    // FIXED: Changed from member._id to member.id to match the Member type interface
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.full_name.trim()) {
      setMessage({ text: 'Full name is required', type: 'error' })
      return
    }

    if (!formData.email.trim()) {
      setMessage({ text: 'Email is required', type: 'error' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' })
      return
    }

    setFormLoading(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          throw new Error('Failed to update member')
        }

        const updated = await res.json()
        setMembers(members.map((m) => (m.id === editingId ? updated : m)))
        setMessage({ text: 'Member updated successfully', type: 'success' })
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          throw new Error('Failed to create member')
        }

        const created = await res.json()
        setMembers([created, ...members])
        setMessage({ text: 'Member created successfully', type: 'success' })
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ full_name: '', email: '', role: 'member' })
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to save member', type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Members</h3>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({ full_name: '', email: '', role: 'member' })
            setShowForm(!showForm)
          }}
        >
          <Plus size={16} /> Add
        </Button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="flex-1 font-medium">{message.text}</p>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            className="hover:opacity-70 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Input
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {showForm && (
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">
              {editingId ? 'Edit Member' : 'Add New Member'}
            </h4>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <Input
                placeholder="john@example.com"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'member' | 'organizer' | 'admin',
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={formLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {formLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {editingId ? 'Update' : 'Create'} Member
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">No members found</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredMembers.map((m) => (
            <Card
              key={m.id}
              className="p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{m.full_name}</p>
                <p className="text-sm text-gray-600">{m.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(m)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(m.id)}
                  disabled={deleteLoading === m.id}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  size="sm"
                >
                  {deleteLoading === m.id ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    <>
                      <Trash2 size={14} className="mr-1" />
                      Delete
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
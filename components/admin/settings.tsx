'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ClubSettings {
  _id: string
  clubName: string
  clubEmail: string
  clubDescription: string
  primaryColor: string
  secondaryColor: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<ClubSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [formData, setFormData] = useState({
    clubName: '',
    clubEmail: '',
    clubDescription: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setFormData({
          clubName: data.clubName || '',
          clubEmail: data.clubEmail || '',
          clubDescription: data.clubDescription || '',
          primaryColor: data.primaryColor || '#6366f1',
          secondaryColor: data.secondaryColor || '#8b5cf6',
        })
      }
    } catch (error) {
      console.error('[v0] Error fetching settings:', error)
      setMessage({ text: 'Failed to load settings', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const updated = await res.json()
        setSettings(updated)
        setMessage({ text: 'Settings saved successfully!', type: 'success' })
      }
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
      setMessage({ text: 'Error saving settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <div className="max-w-2xl">
      <Card className="p-6 bg-card/50 border-border/50">
        <h2 className="text-2xl font-bold mb-6">Club Settings</h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'error' ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Club Name</label>
            <Input
              value={formData.clubName}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              placeholder="Enter club name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Club Email</label>
            <Input
              type="email"
              value={formData.clubEmail}
              onChange={(e) => setFormData({ ...formData, clubEmail: e.target.value })}
              placeholder="Enter club email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.clubDescription}
              onChange={(e) => setFormData({ ...formData, clubDescription: e.target.value })}
              placeholder="Enter club description"
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground min-h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, X, Save, Calendar } from 'lucide-react'

interface Event {
  _id: string
  title: string
  description: string
  event_date: string
  location: string
  event_type: string
  capacity: number
  image_url: string
  createdAt?: string
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '18:00',
    location: '',
    event_type: 'workshop',
    capacity: 50,
    image_url: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  // ✅ FETCH EVENTS (MongoDB API)
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')

      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setMessage({
        text: 'Database connection error. Please check your setup.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      setEvents(events.filter((e) => e._id !== id))
      setMessage({ text: 'Event deleted successfully', type: 'success' })
    } catch (error: any) {
      console.error('Error deleting event:', error)
      setMessage({ text: error.message, type: 'error' })
    }
  }

  // ✅ EDIT
  const handleEdit = (event: Event) => {
    const datetime = new Date(event.event_date)

    setFormData({
      title: event.title,
      description: event.description,
      event_date: datetime.toISOString().split('T')[0],
      event_time: datetime.toISOString().split('T')[1]?.slice(0, 5) || '18:00',
      location: event.location || '',
      event_type: event.event_type,
      capacity: event.capacity || 50,
      image_url: event.image_url || '',
    })

    setEditingId(event._id)
    setShowForm(true)
  }

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.event_date) {
      setMessage({ text: 'Title and date required', type: 'error' })
      return
    }

    const eventDateTime = `${formData.event_date}T${formData.event_time}:00`

    const eventData = {
      title: formData.title,
      description: formData.description,
      event_date: eventDateTime,
      location: formData.location,
      event_type: formData.event_type,
      capacity: formData.capacity,
      image_url: formData.image_url,
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await fetch(`/api/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        })

        if (!res.ok) throw new Error('Update failed')

        const updated = await res.json()

        setEvents(events.map((e) => (e._id === editingId ? updated : e)))
        setMessage({ text: 'Event updated successfully', type: 'success' })
        setEditingId(null)
      } else {
        // CREATE
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        })

        if (!res.ok) throw new Error('Create failed')

        const created = await res.json()

        setEvents([created, ...events])
        setMessage({ text: 'Event created successfully', type: 'success' })
      }

      // RESET FORM
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '18:00',
        location: '',
        event_type: 'workshop',
        capacity: 50,
        image_url: '',
      })

      setShowForm(false)
    } catch (error) {
      console.error('Error saving event:', error)
      setMessage({ text: 'Error saving event', type: 'error' })
    }
  }

  // FILTER
  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Events Management</h3>

        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <Input
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* FORM */}
      {showForm && (
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">
              {editingId ? 'Edit Event' : 'Create New Event'}
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                placeholder="Event title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Event description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) =>
                    setFormData({ ...formData, event_time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                placeholder="Event location (e.g., Room 101, Hall A)"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            {/* Event Type & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) =>
                    setFormData({ ...formData, event_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="meetup">Meetup</option>
                  <option value="competition">Competition</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <Input
                  type="number"
                  placeholder="Max participants"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 50,
                    })
                  }
                  min="1"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save size={16} className="mr-2" />
                {editingId ? 'Update Event' : 'Create Event'}
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

      {/* LIST */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No events found. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-slate-900">
                      {event.title}
                    </h4>
                    {event.event_type && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {event.event_type.charAt(0).toUpperCase() +
                          event.event_type.slice(1)}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {event.description.substring(0, 100)}
                      {event.description.length > 100 ? '...' : ''}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Date & Time</span>
                      <p className="font-medium">
                        {formatEventDate(event.event_date)}
                      </p>
                    </div>

                    {event.location && (
                      <div>
                        <span className="text-gray-500">Location</span>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    )}

                    {event.capacity && (
                      <div>
                        <span className="text-gray-500">Capacity</span>
                        <p className="font-medium">{event.capacity} people</p>
                      </div>
                    )}

                    {event.image_url && (
                      <div>
                        <span className="text-gray-500">Image</span>
                        <p className="font-medium text-blue-600 truncate">
                          <a
                            href={event.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleEdit(event)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>

                <Button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

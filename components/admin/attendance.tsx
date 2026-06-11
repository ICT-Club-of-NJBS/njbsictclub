'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'

interface AttendanceRecord {
  _id: string
  userId: {
    _id: string
    full_name: string
    email: string
  }
  eventId: {
    _id: string
    title: string
  }
  checkInTime: string
  status: 'present' | 'absent' | 'late'
}

interface Event {
  _id: string
  title: string
}

export default function AdminAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEvent, setFilterEvent] = useState('')
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    try {
      const [recordsRes, eventsRes] = await Promise.all([
        fetch('/api/admin/attendance'),
        fetch('/api/events'),
      ])

      if (recordsRes.ok) {
        const data = await recordsRes.json()
        setRecords(data)
      }

      if (eventsRes.ok) {
        const data = await eventsRes.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter((r) => {
    const name = r.userId?.full_name?.toLowerCase() || ''
    const email = r.userId?.email?.toLowerCase() || ''

    const search = searchTerm.toLowerCase()

    const matchesSearch = name.includes(search) || email.includes(search)

    const matchesEvent = !filterEvent || r.eventId?._id === filterEvent

    return matchesSearch && matchesEvent
  })

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Event', 'Check-in Time', 'Status'],
      ...filteredRecords.map((r) => [
        r.userId?.full_name || 'N/A',
        r.userId?.email || 'N/A',
        r.eventId?.title || 'N/A',
        r.checkInTime
          ? new Date(r.checkInTime).toLocaleString()
          : 'N/A',
        r.status || 'present',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading attendance records...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        >
          <option value="">All Events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>

        <Button onClick={exportCSV}>
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Event</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.full_name || 'N/A'}</td>
                <td>{r.userId?.email || 'N/A'}</td>
                <td>{r.eventId?.title || 'N/A'}</td>
                <td>
                  {r.checkInTime
                    ? new Date(r.checkInTime).toLocaleString()
                    : 'N/A'}
                </td>
                <td>{r.status || 'present'}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-6">
          No attendance records found
        </div>
      )}
    </div>
  )
}

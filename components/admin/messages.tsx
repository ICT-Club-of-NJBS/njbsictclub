'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Mail, CheckCircle2 } from 'lucide-react'

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  adminReply?: string
  repliedAt?: string
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/admin/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }

    setLoading(false)
  }

  // ✅ MARK AS READ
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: 'read' } : m))
        )
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  // ✅ DELETE MESSAGE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id))
        setSelectedId(null)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting message')
    }
  }

  // ✅ SEND REPLY
  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message')
      return
    }

    setSendingReply(true)

    try {
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText }),
      })

      if (res.ok) {
        const result = await res.json()
        setMessages((prev) =>
          prev.map((m) =>
            m._id === id
              ? {
                  ...m,
                  status: 'replied',
                  adminReply: replyText,
                  repliedAt: new Date().toISOString(),
                }
              : m
          )
        )
        setReplyText('')
        alert('Reply sent successfully to ' + result.data.email)
      } else {
        alert('Failed to send reply')
      }
    } catch (error) {
      console.error('Reply error:', error)
      alert('Error sending reply')
    } finally {
      setSendingReply(false)
    }
  }

  const selectedMessage = messages.find(m => m._id === selectedId)

  // ✅ LOADING STATE
  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT: LIST */}
      <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            No messages
          </div>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg._id}
              className={`p-4 cursor-pointer transition ${
                selectedId === msg._id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card/50 hover:bg-card/70'
              } ${msg.status === 'new' ? 'border-l-4 border-l-accent' : ''}`}
              onClick={() => {
                setSelectedId(msg._id)
                if (msg.status === 'new') handleMarkAsRead(msg._id)
              }}
            >
              <p className="font-semibold text-sm">{msg.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {msg.subject}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleDateString()
                  : 'No date'}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* RIGHT: DETAILS */}
      <div className="lg:col-span-2 max-h-[600px] overflow-y-auto">
        {selectedMessage ? (
          <Card className="p-6 flex flex-col gap-4">

            <div>
              <h3 className="text-lg font-semibold">
                {selectedMessage.subject}
              </h3>

              <p className="text-muted-foreground text-sm">
                {selectedMessage.name} • {selectedMessage.email}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedMessage.status === 'new' ? 'bg-red-100 text-red-700' :
                  selectedMessage.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedMessage.status.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {selectedMessage.createdAt
                  ? new Date(selectedMessage.createdAt).toLocaleString()
                  : ''}
              </p>
            </div>

            <div className="bg-muted p-4 rounded">
              <p className="text-sm whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            {/* SHOW PREVIOUS REPLY IF EXISTS */}
            {selectedMessage.adminReply && (
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <p className="text-sm font-semibold text-green-900 mb-2">Admin Reply:</p>
                <p className="text-sm text-green-800 whitespace-pre-wrap">
                  {selectedMessage.adminReply}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Sent: {selectedMessage.repliedAt
                    ? new Date(selectedMessage.repliedAt).toLocaleString()
                    : ''}
                </p>
              </div>
            )}

            {/* REPLY FORM - Only show if not already replied */}
            {selectedMessage.status !== 'replied' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Send Reply:</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {selectedMessage.status !== 'replied' && (
                <Button
                  onClick={() => handleSendReply(selectedMessage._id)}
                  disabled={sendingReply || !replyText.trim()}
                  className="flex-1"
                >
                  <Mail size={16} className="mr-2" />
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </Button>
              )}

              <Button
                onClick={() => handleMarkAsRead(selectedMessage._id)}
                disabled={selectedMessage.status === 'read' || selectedMessage.status === 'replied'}
                variant="outline"
              >
                <CheckCircle2 size={16} className="mr-2" />
                Mark Read
              </Button>

              <Button
                onClick={() => handleDelete(selectedMessage._id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </div>

          </Card>
        ) : (
          <Card className="p-6 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Mail size={40} className="mx-auto mb-3 opacity-40" />
              Select a message
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

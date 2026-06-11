'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Calendar, MapPin } from 'lucide-react'

type Event = {
  id: string
  title: string
  description: string
  event_date: string // Matches the backend sort key
  location?: string
  image_url?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      if (!mounted) return
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        
        if (Array.isArray(data)) {
          setEvents(data)
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Upcoming Events</h1>
            <p className="mt-4 text-lg text-muted-foreground">Stay updated with the latest ICT Club workshops and meetups.</p>
          </header>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 w-full bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-6">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="group relative bg-card/50 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{event.title}</h2>
                      <p className="text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-foreground/60">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-primary" />
                          {new Date(event.event_date).toLocaleDateString(undefined, { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-primary" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed rounded-2xl">
              <p className="text-muted-foreground">No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
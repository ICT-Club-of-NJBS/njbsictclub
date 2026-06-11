'use client';

import Link from 'next/link';
import { Calendar, Users, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Event {
  _id: string;
  title: string;
  event_date: string;
  event_time: string;
  location?: string;
  capacity?: number;
  description?: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        // Get upcoming events (next 3 events sorted by date)
        const upcoming = data
          .filter((event: Event) => new Date(event.event_date).getTime() >= new Date().setHours(0,0,0,0))
          .sort((a: Event, b: Event) => 
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
          )
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to default events
        setEvents([
          {
            _id: '1',
            title: 'Tech Talks Showcase',
            event_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            event_time: '7:30 PM',
            capacity: 100,
            description: 'Lightning talks from community innovators',
            location: 'Main Hall',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-foreground/70">Connect, learn, and grow with our community</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 gap-2"
            asChild
          >
            <Link href="/events">
              See All Events
              <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/60 hover:border-primary/50 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
            >
              <div className="flex-grow">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                  {event.title}
                </h3>
                <p className="text-foreground/70 text-sm mb-3">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(event.event_date)} at {event.event_time}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {event.location}
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {event.capacity} capacity
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                asChild
              >
                <Link href="/events">Register</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

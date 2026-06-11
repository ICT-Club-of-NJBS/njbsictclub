import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()
  const auth = (req as any).auth

  if (req.method === 'GET') {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          created_by:users(id, user_id, full_name, email),
          registrations:event_registrations(count)
        `)
        .order('event_date', { ascending: true })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch events' },
          { status: 500 }
        )
      }

      return NextResponse.json(events || [])
    } catch (error: any) {
      console.error(' Events GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        description,
        eventDate,
        location,
        imageUrl,
        maxRegistrations,
        status = 'upcoming',
      } = await req.json()

      if (!name || !eventDate) {
        return NextResponse.json(
          { error: 'Event name and date are required' },
          { status: 400 }
        )
      }

      const { data: event, error } = await supabase
        .from('events')
        .insert({
          name,
          description,
          event_date: eventDate,
          location,
          image_url: imageUrl,
          max_registrations: maxRegistrations,
          status,
          created_by: auth.userId,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        return NextResponse.json(
          { error: 'Failed to create event' },
          { status: 500 }
        )
      }

      return NextResponse.json(event, { status: 201 })
    } catch (error: any) {
      console.error('Events POST error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

export async function POST(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

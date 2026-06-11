import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServer()
  const { id } = await params

  if (req.method === 'GET') {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .select(`
          *,
          created_by:users(id, user_id, full_name, email),
          registrations:event_registrations(*)
        `)
        .eq('id', id)
        .single()

      if (error || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(event)
    } catch (error: any) {
      console.error(' Event GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        name,
        description,
        eventDate,
        location,
        imageUrl,
        maxRegistrations,
        status,
      } = await req.json()

      const updateData: any = {}
      if (name) updateData.name = name
      if (description) updateData.description = description
      if (eventDate) updateData.event_date = eventDate
      if (location) updateData.location = location
      if (imageUrl) updateData.image_url = imageUrl
      if (maxRegistrations) updateData.max_registrations = maxRegistrations
      if (status) updateData.status = status
      updateData.updated_at = new Date().toISOString()

      const { data: event, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update event' },
          { status: 500 }
        )
      }

      return NextResponse.json(event)
    } catch (error: any) {
      console.error('Event PUT error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete event' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'Event deleted successfully' })
    } catch (error: any) {
      console.error('[v0] Event DELETE error:', error)
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

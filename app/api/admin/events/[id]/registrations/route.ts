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
      // Get all registrations for this event with details
      const { data: registrations, error } = await supabase
        .from('event_registrations')
        .select(`
          id,
          name,
          email,
          phone,
          message,
          status,
          registered_at,
          user:users(id, user_id, role)
        `)
        .eq('event_id', id)
        .order('registered_at', { ascending: false })

      if (error) {
        console.error('Error fetching registrations:', error)
        return NextResponse.json(
          { error: 'Failed to fetch registrations' },
          { status: 500 }
        )
      }

      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, name, event_date, location, max_registrations')
        .eq('id', id)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        event,
        registrations: registrations || [],
        totalRegistrations: registrations?.length || 0,
      })
    } catch (error: any) {
      console.error('Registrations GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const { registrationId, status } = await req.json()

      if (!registrationId || !status) {
        return NextResponse.json(
          { error: 'Registration ID and status are required' },
          { status: 400 }
        )
      }

      const validStatuses = ['registered', 'attended', 'cancelled', 'no-show']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }

      const { data: registration, error } = await supabase
        .from('event_registrations')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', registrationId)
        .select()
        .single()

      if (error) {
        console.error('Error updating registration:', error)
        return NextResponse.json(
          { error: 'Failed to update registration' },
          { status: 500 }
        )
      }

      return NextResponse.json(registration)
    } catch (error: any) {
      console.error('Registrations PUT error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { registrationId } = await req.json()

      if (!registrationId) {
        return NextResponse.json(
          { error: 'Registration ID is required' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', registrationId)

      if (error) {
        console.error(' Error deleting registration:', error)
        return NextResponse.json(
          { error: 'Failed to delete registration' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'Registration deleted successfully' })
    } catch (error: any) {
      console.error('Registrations DELETE error:', error)
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

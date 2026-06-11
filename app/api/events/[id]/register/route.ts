import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServer()
    const { id } = await params
    const { name, email, phone, message } = await req.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, max_registrations')
      .eq('id', id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user already registered for this event
    const { data: existingReg, error: existingError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', id)
      .eq('email', email)
      .single()

    if (existingReg) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      )
    }

    // Check capacity if set
    if (event.max_registrations) {
      const { data: registrations, error: countError } = await supabase
        .from('event_registrations')
        .select('id', { count: 'exact' })
        .eq('event_id', id)
        .eq('status', 'registered')

      if (!countError && registrations && registrations.length >= event.max_registrations) {
        return NextResponse.json(
          { error: 'Event registration is full' },
          { status: 400 }
        )
      }
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: id,
        name,
        email,
        phone,
        message,
        status: 'registered',
      })
      .select()
      .single()

    if (error) {
      console.error('Event registration error:', error)
      return NextResponse.json(
        { error: 'Failed to register for event' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        registration,
        message: 'Successfully registered for the event!',
      },
      { status: 201 }
    )
  } catch (error: any) {
console.error('Register endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to register' },
      { status: 500 }
    )
  }
}

// Get event registration status for a user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServer()
    const { id } = await params
    
    const email = req.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const { data: registration, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', id)
      .eq('email', email)
      .single()

    if (error) {
      return NextResponse.json(
        { registered: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      registered: true,
      registration,
    })
  } catch (error: any) {
console.error('Get registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get registration' },
      { status: 500 }
    )
  }
}

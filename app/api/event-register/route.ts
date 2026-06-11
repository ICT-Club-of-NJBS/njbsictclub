import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer()
    const { eventId, userId, name, email, phone, message } = await req.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // If user is not logged in, create registration with email
    if (!userId) {
      if (!email || !name) {
        return NextResponse.json(
          { error: 'Email and name are required for non-authenticated registrations' },
          { status: 400 }
        )
      }

      const { data: registration, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          name,
          email,
          phone,
          message,
          status: 'registered',
        })
        .select()
        .single()

      if (error) {
        console.error('Error registering for event:', error)
        return NextResponse.json(
          { error: 'Failed to register for event' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, registration }, { status: 201 })
    }

    // If user is logged in, create registration with user ID
    const { data: registration, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        name,
        email,
        phone,
        message,
        status: 'registered',
      })
      .select()
      .single()

    if (error) {
      console.error('Error registering for event:', error)
      return NextResponse.json(
        { error: 'Failed to register for event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, registration }, { status: 201 })
  } catch (error: any) {
    console.error('Event register error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to register' },
      { status: 500 }
    )
  }
}

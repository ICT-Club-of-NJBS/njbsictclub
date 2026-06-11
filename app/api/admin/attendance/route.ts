import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  if (req.method === 'GET') {
    try {
      const { data: records, error } = await supabase
        .from('attendance')
        .select(`
          *,
          user:users(id, user_id, full_name, email),
          event:events(id, title)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch attendance records' },
          { status: 500 }
        )
      }

      return NextResponse.json(records || [])
    } catch (error: any) {
      console.error('Attendance GET error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch attendance' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, eventId, status = 'present' } = await req.json()

      if (!userId || !eventId) {
        return NextResponse.json(
          { error: 'User ID and event ID are required' },
          { status: 400 }
        )
      }

      const { data: record, error } = await supabase
        .from('attendance')
        .insert({
          user_id: userId,
          event_id: eventId,
          status,
          check_in_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating attendance record:', error)
        return NextResponse.json(
          { error: 'Failed to create attendance record' },
          { status: 500 }
        )
      }

      return NextResponse.json(record, { status: 201 })
    } catch (error: any) {
      console.error('Attendance POST error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create attendance record' },
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

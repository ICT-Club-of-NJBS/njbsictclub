import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

/**
 * GET single event
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServer()
    const { id } = await params

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * UPDATE event (authenticated only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(async (req: NextRequest) => {
    try {
      const supabase = getSupabaseServer()
      const { id } = await params
      const body = await req.json()

      const updateData = {
        ...body,
        updated_at: new Date().toISOString(),
      }

      const { data: updated, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error || !updated) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      return NextResponse.json(updated)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })(req)
}

/**
 * DELETE event (authenticated only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(async (req: NextRequest) => {
    try {
      const supabase = getSupabaseServer()
      const { id } = await params

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })(req)
}

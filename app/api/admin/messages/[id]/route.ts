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
      const { data: message, error } = await supabase
        .from('messages')
        .select('*, sender:users(id, user_id, full_name, email)')
        .eq('id', id)
        .single()

      if (error || !message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(message)
    } catch (error: any) {
      console.error('Message GET error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch message' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, content, status } = await req.json()

      const { data: message, error } = await supabase
        .from('messages')
        .update({
          title: title || undefined,
          content: content || undefined,
          status: status || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(message)
    } catch (error: any) {
      console.error('Message PUT error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update message' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ message: 'Message deleted' })
    } catch (error: any) {
      console.error('Message DELETE error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete message' },
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

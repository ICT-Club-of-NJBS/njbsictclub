import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  if (req.method === 'GET') {
    try {
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')

      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, user_id, full_name, email)
        `)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: messages, error } = await query.order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch messages' },
          { status: 500 }
        )
      }

      return NextResponse.json(messages || [])
    } catch (error: any) {
      console.error('Admin messages GET error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch messages' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'POST') {
    try {
      const { senderId, title, content } = await req.json()

      if (!senderId || !title || !content) {
        return NextResponse.json(
          { error: 'Sender ID, title, and content are required' },
          { status: 400 }
        )
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          title,
          content,
          status: 'unread',
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating message:', error)
        return NextResponse.json(
          { error: 'Failed to create message' },
          { status: 500 }
        )
      }

      return NextResponse.json(message, { status: 201 })
    } catch (error: any) {
      console.error('Admin messages POST error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create message' },
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

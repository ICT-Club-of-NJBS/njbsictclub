import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  try {
    // Get counts from all tables
    const [usersResult, eventsResult, projectsResult, messagesResult] =
      await Promise.all([
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true }),
      ])

    const totalMembers = usersResult.count || 0
    const totalEvents = eventsResult.count || 0
    const totalProjects = projectsResult.count || 0
    const totalMessages = messagesResult.count || 0

    return NextResponse.json({
      totalMembers,
      totalEvents,
      totalProjects,
      totalMessages,
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  if (req.method === 'GET') {
    try {
      const { data: teamMembers, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Team GET error:', error)
        // Return empty array instead of error for better UX
        return NextResponse.json([], { status: 200 })
      }

      return NextResponse.json(teamMembers || [])
    } catch (error: any) {
      console.error('[v0] Team GET exception:', error)
      return NextResponse.json([], { status: 200 })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, position, email, phone, bio, image_url, skills } = await req.json()

      if (!name || !position) {
        return NextResponse.json(
          { error: 'Name and position are required' },
          { status: 400 }
        )
      }

      const { data: teamMember, error } = await supabase
        .from('team_members')
        .insert({
          name,
          position,
          email,
          phone,
          bio,
          image_url,
          skills: skills || [],
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        console.error('[v0] Error creating team member:', error)
        return NextResponse.json(
          { error: 'Failed to create team member' },
          { status: 500 }
        )
      }

      return NextResponse.json(teamMember, { status: 201 })
    } catch (error: any) {
      console.error('[v0] Team POST error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create team member' },
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

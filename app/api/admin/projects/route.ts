import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()
  const auth = (req as any).auth

  if (req.method === 'GET') {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          created_by:users(id, user_id, full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch projects' },
          { status: 500 }
        )
      }

      return NextResponse.json(projects || [])
    } catch (error: any) {
      console.error('Projects GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, imageUrl, status = 'active' } = await req.json()

      if (!name) {
        return NextResponse.json(
          { error: 'Project name is required' },
          { status: 400 }
        )
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          image_url: imageUrl,
          status,
          created_by: auth.userId,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
        )
      }

      return NextResponse.json(project, { status: 201 })
    } catch (error: any) {
      console.error('Projects POST error:', error)
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

export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

export async function POST(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

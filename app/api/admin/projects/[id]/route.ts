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
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          created_by:users(id, user_id, full_name, email),
          members:members_projects(count)
        `)
        .eq('id', id)
        .single()

      if (error || !project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(project)
    } catch (error: any) {
      console.error(' Project GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, description, imageUrl, status } = await req.json()

      const updateData: any = {}
      if (name) updateData.name = name
      if (description) updateData.description = description
      if (imageUrl) updateData.image_url = imageUrl
      if (status) updateData.status = status
      updateData.updated_at = new Date().toISOString()

      const { data: project, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update project' },
          { status: 500 }
        )
      }

      return NextResponse.json(project)
    } catch (error: any) {
      console.error('Project PUT error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete project' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'Project deleted successfully' })
    } catch (error: any) {
      console.error('[v0] Project DELETE error:', error)
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

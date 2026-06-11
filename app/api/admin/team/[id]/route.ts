import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServer()
  const { id } = await params

  if (req.method === 'PUT') {
    try {
      const { name, position, email, phone, bio, image_url, skills } = await req.json()

      const updateData: any = {}
      if (name) updateData.name = name
      if (position) updateData.position = position
      if (email) updateData.email = email
      if (phone) updateData.phone = phone
      if (bio) updateData.bio = bio
      if (image_url) updateData.image_url = image_url
      if (skills) updateData.skills = skills
      updateData.updated_at = new Date().toISOString()

      const { data: teamMember, error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(teamMember)
    } catch (error: any) {
      console.error('Team PUT error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update team member' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ message: 'Team member deleted' })
    } catch (error: any) {
      console.error('Team DELETE error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete team member' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
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

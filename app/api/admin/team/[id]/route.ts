import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServer()
  const { id } = await params

  // --- PUT METHOD (UPDATE) ---
  if (req.method === 'PUT') {
    try {
      // 1. Read request data as FormData instead of JSON
      const formData = await req.formData()
      
      const name = formData.get('name') as string | null
      const position = formData.get('position') as string | null
      const email = formData.get('email') as string | null
      const phone = formData.get('phone') as string | null
      const bio = formData.get('bio') as string | null
      
      // 'image' will be a File object if a new image was uploaded
      const imageFile = formData.get('image') as File | null
      let finalImageUrl = formData.get('image_url') as string | null

      // Build the update object conditionally based on fields sent
      const updateData: any = {}
      if (name !== null) updateData.name = name
      if (position !== null) updateData.position = position
      if (email !== null) updateData.email = email
      if (phone !== null) updateData.phone = phone
      if (bio !== null) updateData.bio = bio

      // 2. Handle File Upload to Supabase Storage if a new file is attached
      if (imageFile && imageFile.size > 0) {
        const fileExtension = imageFile.name.split('.').pop() || 'png'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`
        
        // Convert File object to a binary Buffer
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload new image to your bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('team-images')
          .upload(fileName, buffer, {
            contentType: imageFile.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('[Storage Upload Error]:', uploadError)
          return NextResponse.json(
            { error: `Image upload failed: ${uploadError.message}` },
            { status: 500 }
          )
        }

        // Get public URL link
        const { data: publicUrlData } = supabase.storage
          .from('team-images')
          .getPublicUrl(fileName)

        finalImageUrl = publicUrlData.publicUrl
      }

      // If we have a public image URL (either newly uploaded or retained old one), add it to update payload
      if (finalImageUrl !== null) {
        updateData.image_url = finalImageUrl
      }

      updateData.updated_at = new Date().toISOString()

      // 3. Update the data row in Supabase
      // Note: Matched '.eq('_id', id)' to align with frontend '_id' format
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('_id', id) 
        .select()
        .single()

      if (error) {
        console.error('Database Update Error:', error)
        return NextResponse.json(
          { error: 'Team member not found or update failed' },
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

  // --- DELETE METHOD ---
  if (req.method === 'DELETE') {
    try {
      // Note: Matched '.eq('_id', id)' to align with frontend '_id' format
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('_id', id)

      if (error) {
        console.error('Database Delete Error:', error)
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
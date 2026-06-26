import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

// --- GET METHOD FUNCTION ---
export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
    const supabase = getSupabaseServer()

    try {
      const { data: teamMembers, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Team GET error:', error)
        return NextResponse.json([], { status: 200 })
      }

      return NextResponse.json(teamMembers || [])
    } catch (error: any) {
      console.error('[v0] Team GET exception:', error)
      return NextResponse.json([], { status: 200 })
    }
  })(req)
}

// --- POST METHOD FUNCTION ---
export async function POST(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
    const supabase = getSupabaseServer()

    try {
      const formData = await req.formData()
      
      const name = formData.get('name') as string
      const position = formData.get('position') as string 
      const email = formData.get('email') as string
      const phone = formData.get('phone') as string
      const bio = formData.get('bio') as string
      
      const imageFile = formData.get('image') as File | null
      let finalImageUrl = (formData.get('image_url') as string) || ''

      // Validations
      if (!name || !position) {
        return NextResponse.json(
          { error: 'Name and position are required' },
          { status: 400 }
        )
      }

      // Handle Storage Buckets Uploads
      if (imageFile && imageFile.size > 0) {
        const fileExtension = imageFile.name.split('.').pop() || 'png'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`
        
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabase.storage
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

        const { data: publicUrlData } = supabase.storage
          .from('team-images')
          .getPublicUrl(fileName)

        finalImageUrl = publicUrlData.publicUrl
      }

      // Save row item inside DB
      // FIX: Removed "role: position" completely to stop the database from crashing
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .insert({
          name,
          position, // Handles the role details cleanly using the correct column name
          email,
          phone,
          bio,
          image_url: finalImageUrl, 
          skills: [], 
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        console.error('[v0] Error creating team member:', error)
        return NextResponse.json(
          { error: `Failed to create team member record: ${error.message}` },
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
  })(req)
}
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  // --- GET METHOD ---
  if (req.method === 'GET') {
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
  }

  // --- POST METHOD ---
  if (req.method === 'POST') {
    try {
      // 1. Read request data as FormData instead of JSON
      const formData = await req.formData()
      
      const name = formData.get('name') as string
      const position = formData.get('position') as string
      const email = formData.get('email') as string
      const phone = formData.get('phone') as string
      const bio = formData.get('bio') as string
      
      // 'image' will be a File object if uploaded, otherwise null
      const imageFile = formData.get('image') as File | null
      
      // Fallback to existing image_url string if present
      let finalImageUrl = (formData.get('image_url') as string) || ''

      // Validations
      if (!name || !position) {
        return NextResponse.json(
          { error: 'Name and position are required' },
          { status: 400 }
        )
      }

      // 2. Handle File Upload to Supabase Storage if an actual image was selected
      if (imageFile && imageFile.size > 0) {
        // Create a unique file name to avoid overwriting duplicates
        const fileExtension = imageFile.name.split('.').pop() || 'png'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`
        
        // Convert the File object to a binary buffer for Supabase Storage API
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload the file to your bucket (Make sure a 'team-images' bucket exists in Supabase storage and is public)
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

        // Get the accessible public link for your freshly uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('team-images')
          .getPublicUrl(fileName)

        finalImageUrl = publicUrlData.publicUrl
      }

      // 3. Insert metadata record into the Database table
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .insert({
          name,
          position,
          email,
          phone,
          bio,
          image_url: finalImageUrl, // Saved as string URL
          skills: [], // Defaults back to clean empty array structure
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        console.error('[v0] Error creating team member:', error)
        return NextResponse.json(
          { error: 'Failed to create team member record' },
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
// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// 1. GET METHOD - Fetch all projects
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer()

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin fetch projects query failed:', error.message)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json(projects || [])
  } catch (error: any) {
    console.error('Admin projects route internal crash:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 2. POST METHOD - Create a new project with safe property mapping
export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()

  try {
    const body = await req.json()

    // 👇 FIXED: Extract variables safely, mapping 'title' to 'name'
    const projectPayload = {
      name: body.name || body.title, // If form sends 'title', map it to 'name'
      description: body.description,
      status: body.status || 'planning',
      github_url: body.github_url,
      demo_url: body.demo_url,
      image_url: body.image_url,
      technologies: body.technologies || []
    }

    // Safety fallback: Ensure we aren't sending an undefined title/name
    if (!projectPayload.name) {
      return NextResponse.json({ error: "Project name or title is required" }, { status: 400 })
    }

    // Insert the correctly mapped object into your Supabase 'projects' table
    const { data, error } = await supabase
      .from('projects')
      .insert([projectPayload])
      .select()
      .single()

    if (error) {
      console.error('Supabase project insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Server POST crash:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
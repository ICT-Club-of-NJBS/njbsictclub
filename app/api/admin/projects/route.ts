import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer()

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        image_url,
        status,
        created_at,
        created_by:user_profiles!projects_created_by_user_profiles_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Public fetch projects query failed:', error.message)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json(projects || [])
  } catch (error: any) {
    console.error('Public projects route internal crash:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
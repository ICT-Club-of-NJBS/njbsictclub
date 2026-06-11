import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // This is expected when calling from a GET route in Next.js
            }
          },
        },
      }
    )

    // Fetch from the 'projects' table
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetch error:', error.message)
      return NextResponse.json([], { status: 200 }) // Return empty array to keep frontend safe
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Internal API Error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
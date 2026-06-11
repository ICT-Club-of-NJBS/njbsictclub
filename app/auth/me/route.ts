import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The setAll method is called even in GET routes. 
            // We catch this to prevent errors in Middleware or Server Components.
          }
        },
      },
    }
  )

  // Use getUser() for security (it validates the JWT with Supabase)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    // ✅ FIX: Return 200 instead of 401 to keep the console clean.
    // Your frontend Navbar logic already checks for !user, so this works perfectly.
    return NextResponse.json({ user: null }, { status: 200 })
  }

  // Optional: Fetch extra profile data from your 'profiles' table if needed
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, member_id, role')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ 
    user: {
      ...user,
      ...profile // Merges base auth data with your custom profile fields
    } 
  })
}
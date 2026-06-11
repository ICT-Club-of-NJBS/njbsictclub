import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // If there is no code, send them back to login
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }

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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // This can happen if the route is called from a Server Component
            // that doesn't allow setting cookies, but for a GET route it should work.
          }
        },
      },
    }
  )

  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth error:', error.message)
    // Redirect with a specific error message so your UI can show it
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  // ✅ Force the redirect to the absolute URL of your dashboard
  return NextResponse.redirect(`${origin}/dashboard`)
}
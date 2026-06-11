import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // If no token, return null user (unauthenticated)
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Verify the JWT token
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Get full user data from database
    const supabase = getSupabaseServer()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', decoded.email)
      .single()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Return complete user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        oauth_provider: user.oauth_provider,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { user: null },
      { status: 200 } // Return 200 to avoid console errors
    )
  }
}

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getTokenFromRequest } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get and verify token
    const token = getTokenFromRequest(req)

    if (!token) {
      return NextResponse.json(
        { error: 'No token' },
        { status: 401 }
      )
    }

    // Verify token safely
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseServer()

    // Look up user by user_id
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_id, email, full_name, role, status')
      .eq('user_id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status,
      }
    })

  } catch (err) {
    console.error('[v0] Auth error:', err)

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

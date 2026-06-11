import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { full_name, phone, avatar } = await req.json()

    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServer()

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: full_name.trim(),
        phone: phone ? phone.trim() : null,
        avatar: avatar || null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', decoded.email)
      .select()
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        qr_code: user.qr_code,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'
import { generateQRCode } from '@/lib/qrcode'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServer()
  const { id } = await params

  if (req.method === 'GET') {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, user_id, email, full_name, phone, role, status, created_at')
        .eq('id', id)
        .single()

      if (error || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Generate QR code for user
      let qrCode = null
      try {
        qrCode = await generateQRCode(user.user_id)
      } catch (qrError) {
        console.warn('QR code generation failed:', qrError)
      }

      return NextResponse.json({
        ...user,
        qrCode,
      })
    } catch (error: any) {
      console.error('User GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const { role, status, fullName, phone } = await req.json()

      // Only admin can change roles and status
      if ((role || status) && (req as any).auth?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only admins can change role or status' },
          { status: 403 }
        )
      }

      const updateData: any = {}
      if (fullName) updateData.full_name = fullName
      if (phone) updateData.phone = phone
      if (role) updateData.role = role
      if (status) updateData.status = status
      updateData.updated_at = new Date().toISOString()

      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        )
      }

      return NextResponse.json(user)
    } catch (error: any) {
      console.error('User PUT error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error(' Error deleting user:', error)
        return NextResponse.json(
          { error: 'Failed to delete user' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'User deleted successfully' })
    } catch (error: any) {
      console.error('User DELETE error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

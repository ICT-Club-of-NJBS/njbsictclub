import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'
import { generateUserID } from '@/lib/generate-user-id'
import { hashPassword } from '@/lib/auth'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()
  const auth = (req as any).auth

  if (req.method === 'GET') {
    try {
      // Fetch all users
      const { data: users, error } = await supabase
        .from('users')
        .select('id, user_id, email, full_name, phone, role, status, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        )
      }

      return NextResponse.json(users || [])
    } catch (error: any) {
      console.error('Users GET error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch users' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, full_name, fullName, phone, role = 'member' } = await req.json()
      const finalFullName = full_name || fullName

      if (!email || !finalFullName) {
        return NextResponse.json(
          { error: 'Email and full name are required' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }

      // Generate temporary password (user will reset on first login)
      const tempPassword = Math.random().toString(36).slice(-12)
      const passwordHash = await hashPassword(tempPassword)

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          full_name: finalFullName,
          phone,
          password_hash: passwordHash,
          role: role || 'member',
          status: 'active',
          user_id: generateUserID(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          ...user,
          tempPassword, // Return temp password for admin to share
        },
        { status: 201 }
      )
    } catch (error: any) {
      console.error('Users POST error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create user' },
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

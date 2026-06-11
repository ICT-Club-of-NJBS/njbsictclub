import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json()

    // Validate inputs
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Use the createUser function from auth.ts
    const result = await createUser(email, password, fullName)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create user account' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      user: result.user,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Signup failed' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = body?.email
    const password = body?.password

    // Validate fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password required',
        },
        { status: 400 }
      )
    }

    // Authenticate user
    const result = await authenticateUser(email, password)

    // Authentication failed
    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          error: result?.error || 'Authentication failed',
        },
        { status: 401 }
      )
    }

    // Token missing
    if (!result?.token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not generated',
        },
        { status: 500 }
      )
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: result?.user || null,
      },
      { status: 200 }
    )

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('LOGIN ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// Optional GET route
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
    },
    { status: 405 }
  )
}
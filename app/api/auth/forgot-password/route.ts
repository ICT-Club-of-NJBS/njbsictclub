import { NextResponse } from 'next/server'
import { requestPasswordReset } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Request password reset
    const result = await requestPasswordReset(email)

    return NextResponse.json({
      message: result.message,
      success: result.success,
      // Include code for development/testing only
      ...(process.env.NODE_ENV === 'development' && { code: result.code }),
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

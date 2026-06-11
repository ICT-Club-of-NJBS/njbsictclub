import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ 
    success: true,
    message: 'Logged out successfully' 
  })

  res.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return res
}

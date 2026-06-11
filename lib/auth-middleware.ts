import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

/**
 * Extract token from cookies or authorization header
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  // Try to get from cookies first
  const token = req.cookies.get('token')?.value

  if (token) {
    return token
  }

  // Try to get from Authorization header
  const authHeader = req.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * Verify user is authenticated and return token payload
 */
export function verifyAuth(req: NextRequest) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  return payload
}

/**
 * Middleware to check authentication
 */
export function requireAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const auth = verifyAuth(req)

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Attach auth to request for use in handler
    ;(req as any).auth = auth

    return handler(req)
  }
}

/**
 * Middleware to check if user is admin
 */
export function requireAdmin(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const auth = verifyAuth(req)

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Attach auth to request for use in handler
    ;(req as any).auth = auth

    return handler(req)
  }
}

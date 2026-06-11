import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { getSupabaseServer } from './supabase-server'
import { generateUserID } from './generate-user-id'

const JWT_SECRET = process.env.JWT_SECRET as string

/* =========================
   PASSWORD UTILITIES
========================= */

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash)
}

/* =========================
   JWT FUNCTIONS
========================= */

export function createToken(
  userId: string,
  userEmail: string,
  role: string,
  expiresIn: string = '7d'
): string {
  const payload = {
    userId,
    email: userEmail,
    role,
  }

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'], // ✅ FIX
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string): {
  userId: string
  email: string
  role: string
} | null {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }
  } catch (error) {
    console.error('[auth] Token verification failed:', error)
    return null
  }
}

/* =========================
   AUTH LOGIN
========================= */

export async function authenticateUser(email: string, password: string) {
  const supabase = getSupabaseServer()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  // Check if password_hash exists
  if (!user.password_hash) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  const passwordValid = await verifyPassword(password, user.password_hash)

  if (!passwordValid) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  if (user.status !== 'active') {
    return {
      success: false,
      error: 'Account is inactive',
    }
  }

  const token = createToken(user.user_id, user.email, user.role)

  return {
    success: true,
    user: {
      id: user.id,
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
    token,
  }
}

/* =========================
   CREATE USER
========================= */

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  const supabase = getSupabaseServer()

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered',
    }
  }

  const passwordHash = await hashPassword(password)

  const userId = generateUserID()

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      user_id: userId,
      email,
      password_hash: passwordHash,
      full_name: fullName,
      phone,
      role: 'member',
      status: 'active',
    })
    .select()
    .single()

  if (error || !user) {
    return {
      success: false,
      error: error?.message || 'Failed to create user',
    }
  }

  return {
    success: true,
    user: {
      id: user.id,
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
    },
  }
}

/* =========================
   PASSWORD RESET
========================= */

export async function requestPasswordReset(email: string) {
  const supabase = getSupabaseServer()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (!user) {
    return {
      success: true,
      message: 'If an account exists, a reset code will be sent',
    }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error } = await supabase.from('reset_tokens').insert({
    user_id: user.id,
    email,
    code,
    expires_at: expiresAt,
  })

  if (error) {
    return {
      success: false,
      error: 'Failed to generate reset code',
    }
  }

  console.log('[auth] Reset code:', email, code)

  return {
    success: true,
    message: 'Reset code sent to email',
    code, // dev only
  }
}

export async function verifyAndResetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const supabase = getSupabaseServer()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (!user) {
    return {
      success: false,
      error: 'User not found',
    }
  }

  const { data: resetToken } = await supabase
    .from('reset_tokens')
    .select('*')
    .eq('user_id', user.id)
    .eq('code', code)
    .is('used_at', null)
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (!resetToken) {
    return {
      success: false,
      error: 'Invalid reset code',
    }
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    return {
      success: false,
      error: 'Reset code expired',
    }
  }

  const passwordHash = await hashPassword(newPassword)

  await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', user.id)

  await supabase
    .from('reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', resetToken.id)

  return {
    success: true,
    message: 'Password reset successfully',
  }
}

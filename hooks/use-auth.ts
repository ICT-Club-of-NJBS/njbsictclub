'use client'

import { useEffect, useState } from 'react'

export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'member' | 'organizer' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Get current user from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')

        if (!res.ok) {
          setUser(null)
          return
        }

        const data = await res.json()

        setUser({
          id: data.id || '1',
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role || 'member'
        })
      } catch (error) {
        console.error('[Auth error]', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // ✅ Sign Up (API)
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      })

      const data = await res.json()
      return { user: data.user, error: data.error }
    } catch (error) {
      return { user: null, error }
    }
  }

  // ✅ Sign In (API)
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.user) {
        setUser(data.user)
      }

      return { user: data.user, error: data.error }
    } catch (error) {
      return { user: null, error }
    }
  }

  // ✅ Sign Out
  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })

      setUser(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // ❌ OAuth removed (you can add later with Google API)

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }
}
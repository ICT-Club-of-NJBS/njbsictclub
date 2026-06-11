import { useEffect, useState } from 'react'

export interface User {
  id: number
  email: string
  full_name: string
  user_id: string
  avatar?: string
  oauth_provider: 'email' | 'google' | 'github'
  role: 'member' | 'organizer' | 'admin'
  status: 'active' | 'inactive'
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user || data)
          setError(null)
        } else {
          setUser(null)
          setError(null) // Silent fail for unauthenticated users
        }
      } catch (err) {
        setUser(null)
        setError(null) // Don't show error, just silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}

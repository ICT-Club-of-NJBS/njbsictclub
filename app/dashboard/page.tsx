'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        })

        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
        } else {
          // Not logged in, redirect to login
          router.push('/auth/login')
        }
      } catch (err) {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Welcome to Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Hello, {user.full_name || user.email}
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Full Name
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white">
                {user.full_name || 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Email
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Member ID
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white font-mono">
                {user.user_id || 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Role
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white capitalize">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  user.role === 'organizer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {user.role}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Status
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white capitalize">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {user.status}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Login Method
              </label>
              <p className="mt-1 text-lg text-zinc-900 dark:text-white capitalize">
                {user.oauth_provider === 'email' ? 'Email & Password' : user.oauth_provider}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Account Type
            </h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white capitalize">
              {user.role}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Account Status
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Member Since
            </h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

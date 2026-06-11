'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Copy, LogOut, Loader2, Check } from 'lucide-react'
import QRCode from 'qrcode'

interface UserProfile {
  id: number
  user_id: string
  email: string
  full_name: string
  phone?: string
  avatar?: string
  oauth_provider: 'email' | 'google' | 'github'
  role: 'member' | 'organizer' | 'admin'
  status: 'active' | 'inactive'
  qr_code?: string
}

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  })

  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (!res.ok) {
        router.push('/auth/login')
        return
      }

      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setFormData({
          full_name: data.user.full_name || '',
          phone: data.user.phone || '',
        })

        // Generate QR code from user_id
        if (data.user.user_id) {
          try {
            const qrDataUrl = await QRCode.toDataURL(data.user.user_id)
            setQrCode(qrDataUrl)
          } catch (err) {
            console.error('Error generating QR code:', err)
          }
        }
      } else {
        router.push('/auth/login')
      }
    } catch (err) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (!formData.full_name.trim()) {
      setMessage({ text: 'Full name is required', type: 'error' })
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to update profile', type: 'error' })
        return
      }

      setUser(data.user)
      setMessage({ text: 'Profile updated successfully!', type: 'success' })

      setTimeout(() => {
        setMessage({ text: '', type: '' })
      }, 3000)
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCode || !user) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${user.user_id}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyId = () => {
    if (!user?.user_id) return
    navigator.clipboard.writeText(user.user_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
          <Loader2 className="animate-spin text-purple-600 dark:text-purple-400" size={40} />
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-4">Loading your profile...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Update your account information</p>
            </div>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-8 p-4 rounded-lg border ${
              message.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
              <p className={`flex items-center gap-2 font-medium ${
                message.type === 'error'
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-green-800 dark:text-green-300'
              }`}>
                {message.type === 'success' && <Check size={20} />}
                {message.text}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* QR Code Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Member QR Code
                </h2>

                {qrCode ? (
                  <div className="space-y-5">
                    {/* QR Code Display */}
                    <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-xl border-2 border-gray-200 dark:border-zinc-600 flex items-center justify-center">
                      <img
                        src={qrCode}
                        alt="Member QR Code"
                        className="w-40 h-40 rounded-lg"
                      />
                    </div>

                    {/* Member ID */}
                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-5">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Member ID
                      </p>
                      <p className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400 break-all">
                        {user.user_id}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-5 border-t border-gray-200 dark:border-zinc-700">
                      <button
                        onClick={handleDownloadQR}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                        Download QR Code
                      </button>

                      <button
                        onClick={handleCopyId}
                        className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-900 dark:text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <Copy size={16} />
                        {copied ? 'Copied!' : 'Copy ID'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">QR code not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Account Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-zinc-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                    />
                  </div>

                  {/* User ID (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={user.user_id}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-zinc-600 cursor-not-allowed font-mono font-bold"
                    />
                  </div>

                  {/* Role and Status */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-zinc-600 capitalize">
                        {user.role}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <div className="px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-zinc-600 capitalize">
                        {user.status}
                      </div>
                    </div>
                  </div>

                  {/* Sign-in Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sign-in Method
                    </label>
                    <div className="px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-zinc-600 capitalize">
                      {user.oauth_provider === 'email' ? 'Email & Password' : user.oauth_provider}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-zinc-700">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="flex-1 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

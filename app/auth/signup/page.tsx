'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Eye, EyeOff, ShieldCheck, Github, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const requirements = [
    { label: '8+ Characters', met: password.length >= 8 },
    { label: 'Numeric Value', met: /[0-9]/.test(password) },
    { label: 'Special Symbol', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (err: any) {
      setError(err.message || 'OAuth failed')
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate form inputs
      if (!fullName.trim()) {
        setError('Full name is required')
        setLoading(false)
        return
      }

      if (!email.trim()) {
        setError('Email is required')
        setLoading(false)
        return
      }

      // Check password requirements
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number')
        setLoading(false)
        return
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('Password must contain at least one special character')
        setLoading(false)
        return
      }

      // Create user in database via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          password,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorData
        
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = { error: await response.text() }
        }
        
        console.error('[v0] Signup error:', errorData)
        setError(errorData.error || 'Failed to create account')
        setLoading(false)
        return
      }

      const result = await response.json()

      // Redirect to login with success message
      router.push('/auth/login?signup=success')
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[450px] p-8 bg-white/80 dark:bg-zinc-950/80 border border-zinc-200/70 dark:border-zinc-800/80 rounded-3xl shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Join ICT Club</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-2">Start your journey into tech innovation.</p>
      </div>

      {/* OAuth Buttons */}
      <div className="mb-6 space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="h-12 w-full rounded-2xl border-zinc-200 bg-white/70 font-medium text-zinc-800 backdrop-blur-sm transition-all hover:scale-[1.01] hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <svg
            className="mr-3 h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.53-9.82 6.22l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuth('github')}
          disabled={loading}
          className="h-12 w-full rounded-2xl border-zinc-200 bg-white/70 font-medium text-zinc-800 backdrop-blur-sm transition-all hover:scale-[1.01] hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <Github className="mr-3 h-5 w-5" />
          Continue with GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-zinc-950 px-3 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Or sign up
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
          <Input 
            required
            placeholder="e.g. Sangam Kunwar" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 px-4 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
          <Input 
            required
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 px-4 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Create Password</label>
          <div className="relative">
            <Input 
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 px-4 pr-12 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-purple-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Real-time Requirement Tracker */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {requirements.map((req, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-[10px] font-bold transition-all ${
                  req.met 
                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-400" 
                  : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                {req.met && <Check size={12} />}
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] hover:from-purple-700 hover:to-fuchsia-700 active:scale-[0.99] mt-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            'Create My Account'
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already registered? <Link href="/auth/login" className="font-semibold text-purple-600 transition-colors hover:text-purple-500 hover:underline">Sign In</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-100 via-white to-zinc-200 p-4 transition-colors dark:from-[#09090b] dark:via-[#111113] dark:to-[#18181b]">
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      
      <SignupForm />
    </main>
  )
}

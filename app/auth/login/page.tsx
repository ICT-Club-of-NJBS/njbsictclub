'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Github, ShieldCheck, Loader2, Check } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signupSuccess = searchParams.get('signup') === 'success'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorData
        
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = { error: await response.text() }
        }
        
        setError(errorData.error || 'Invalid email or password')
        setLoading(false)
        return
      }

      const result = await response.json()

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80"
    >
      {/* Glow Effects */}
      <div className="absolute -top-20 left-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to access your dashboard and workspace.
        </p>
      </div>

      {/* Success Message */}
      {signupSuccess && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span>Account created successfully! Sign in to continue.</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3">
        {/* Google */}
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

        {/* GitHub */}
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
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 dark:bg-zinc-950">
            Or continue
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>

          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 px-4 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-purple-600 transition-colors hover:text-purple-500"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 px-4 pr-12 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-purple-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] hover:from-purple-700 hover:to-fuchsia-700 active:scale-[0.99]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="font-semibold text-purple-600 transition-colors hover:text-purple-500 hover:underline"
        >
          Create Account
        </Link>
      </p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-100 via-white to-zinc-200 p-4 transition-colors dark:from-[#09090b] dark:via-[#111113] dark:to-[#18181b]">
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}

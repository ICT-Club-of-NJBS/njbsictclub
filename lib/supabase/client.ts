import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return null
    }

    supabaseInstance = createBrowserClient(url, key)
  }

  return supabaseInstance
}

// Safe export that works during build
export const supabase = {
  auth: {
    signInWithOAuth: async (options: any) => {
      const client = getSupabaseClient()
      if (!client) throw new Error('Supabase client not available')
      return client.auth.signInWithOAuth(options)
    },
  },
}

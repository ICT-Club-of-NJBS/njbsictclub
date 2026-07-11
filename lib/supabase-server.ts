import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using service role key
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Server-side Supabase client for API routes (using service role)
export function getSupabaseClient() {
  return getSupabaseServer()
}

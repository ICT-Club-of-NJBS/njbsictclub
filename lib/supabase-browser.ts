'use client'

import { createClient } from '@supabase/supabase-js'

// Browser-side Supabase client (anonymous/public key)
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createClient(url, anonKey)
}

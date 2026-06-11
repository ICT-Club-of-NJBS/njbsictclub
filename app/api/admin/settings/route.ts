import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

async function handler(req: NextRequest) {
  const supabase = getSupabaseServer()

  if (req.method === 'GET') {
    try {
      const { data: settings, error } = await supabase
        .from('settings')
        .select('*')

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch settings' },
          { status: 500 }
        )
      }

      return NextResponse.json(settings || [])
    } catch (error: any) {
      console.error('Settings GET error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch settings' },
        { status: 500 }
      )
    }
  }

  if (req.method === 'PUT') {
    try {
      const { key, value, description } = await req.json()

      if (!key) {
        return NextResponse.json(
          { error: 'Key is required' },
          { status: 400 }
        )
      }

      const { data: setting, error } = await supabase
        .from('settings')
        .upsert(
          {
            key,
            value,
            description,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        )
        .select()
        .single()

      if (error) {
        console.error('Error updating setting:', error)
        return NextResponse.json(
          { error: 'Failed to update setting' },
          { status: 500 }
        )
      }

      return NextResponse.json(setting)
    } catch (error: any) {
      console.error('Settings PUT error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update setting' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

export async function PUT(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}

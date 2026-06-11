import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer()
    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Find or create user for contact sender
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    let userId = user?.id || null

    // If user doesn't exist, optionally create one (or just store contact as message)
    if (!userId) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email,
          full_name: name,
          role: 'member',
          status: 'active',
          user_id: `CONTACT-${Date.now()}`,
          oauth_provider: 'email',
        })
        .select('id')
        .single()

      userId = newUser?.id || null
    }

    // Create message record
    const { data: messageRecord, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        title: subject,
        content: message,
        status: 'unread',
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating message:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    console.log('[v0] New contact message:', {
      name,
      email,
      subject,
      messageId: messageRecord.id,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received',
        messageId: messageRecord.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Contact API error:', error)

    return NextResponse.json(
      {
        error: error.message || 'Failed to send message',
      },
      { status: 500 }
    )
  }
}

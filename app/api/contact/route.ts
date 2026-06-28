import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer()
    
    // 1. SAFE JSON PARSING
    let body;
    try {
      body = await req.json()
    } catch (parseError) {
      console.error('[Contact API] Failed to parse JSON body:', parseError)
      return NextResponse.json({ error: 'Malformed or empty JSON payload' }, { status: 400 })
    }

    const { name, email, subject, message } = body

    // 2. INPUT VALIDATION
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required' },
        { status: 400 }
      )
    }

    // 3. CHECK IF SENDER ALREADY EXISTS
    const { data: user, error: userFetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle() // Prevents throwing an unhandled exception if user doesn't exist

    if (userFetchError) {
      console.error('[Supabase Fetch Error]:', userFetchError)
      return NextResponse.json({ error: 'Database validation check failed' }, { status: 500 })
    }

    let userId = user?.id || null

    // 4. CREATE USER IF THEY DON'T EXIST
    if (!userId) {
      const { data: newUser, error: userInsertError } = await supabase
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
        .maybeSingle() // Safer alternative to .single()

      if (userInsertError) {
        console.error('[Supabase User Insertion Error]:', userInsertError)
        return NextResponse.json(
          { error: 'Failed to provision contact profile. Database schema mismatch.' }, 
          { status: 500 }
        )
      }

      userId = newUser?.id || null
    }

    // Fallback error catcher in case database configurations yield a null ID string
    if (!userId) {
      return NextResponse.json({ error: 'Could not bind user identity key mapping' }, { status: 500 })
    }

    // 5. SAVE THE MESSAGE RECORD
    const { data: messageRecord, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        title: subject,
        content: message,
        status: 'unread',
      })
      .select()
      .maybeSingle()

    if (messageError) {
      console.error('[Supabase Message Insertion Error]:', messageError)
      return NextResponse.json(
        { error: 'Failed to process and record contact message block' },
        { status: 500 }
      )
    }

    console.log('[Contact API Success]: Generated log entry:', {
      name,
      email,
      subject,
      messageId: messageRecord?.id,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received successfully.',
        messageId: messageRecord?.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    // 6. GLOBAL UNEXPECTED ERROR FALLBACK
    console.error('[Global Contact API Crash Handler]:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected internal processing server failure occurred.' },
      { status: 500 }
    )
  }
}
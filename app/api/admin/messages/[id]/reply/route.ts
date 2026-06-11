import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

// Send email reply using fetch (supports SendGrid, Resend, or custom SMTP API)
async function sendEmailReply(
  to: string,
  subject: string,
  adminReply: string
) {
  try {
    // If using Resend (recommended for Vercel)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@njbsictclub.com',
          to,
          subject: `Re: ${subject}`,
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>We have received your message about: <strong>${subject}</strong></p>
            <hr />
            <h3>Our Reply:</h3>
            <p>${adminReply.replace(/\n/g, '<br>')}</p>
            <hr />
            <p>Best regards,<br>NJBS ICT Club Team</p>
          `,
        }),
      })

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`)
      }

      console.log('Reply email sent via Resend to:', to)
      return true
    }

    // If using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.EMAIL_FROM || 'noreply@njbsictclub.com' },
          subject: `Re: ${subject}`,
          content: [
            {
              type: 'text/html',
              value: `
                <h2>Thank you for contacting us!</h2>
                <p>We have received your message about: <strong>${subject}</strong></p>
                <hr />
                <h3>Our Reply:</h3>
                <p>${adminReply.replace(/\n/g, '<br>')}</p>
                <hr />
                <p>Best regards,<br>NJBS ICT Club Team</p>
              `,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.statusText}`)
      }

      console.log('Reply email sent via SendGrid to:', to)
      return true
    }

    console.warn('Email not configured (no RESEND_API_KEY or SENDGRID_API_KEY)')
    return false
  } catch (error: any) {
    console.error('Failed to send email:', error.message)
    return false
  }
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServer()
  const { id } = await params
  const { replyText } = await req.json()

  if (!replyText || replyText.trim() === '') {
    return NextResponse.json(
      { error: 'Reply message is required' },
      { status: 400 }
    )
  }

  try {
    // Get message with sender info
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*, sender:users(email)')
      .eq('id', id)
      .single()

    if (fetchError || !message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Create reply record
    const { error: replyError } = await supabase
      .from('message_replies')
      .insert({
        message_id: id,
        responder_id: (req as any).auth.userId,
        reply_text: replyText,
      })

    if (replyError) {
      throw replyError
    }

    // Update message status
    await supabase
      .from('messages')
      .update({ status: 'read', updated_at: new Date().toISOString() })
      .eq('id', id)

    // Send email notification
    const emailSent = await sendEmailReply(
      message.sender.email,
      message.title,
      replyText
    )

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      emailSent,
    })
  } catch (error: any) {
    console.error('Reply API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send reply' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest) => handler(req, { params }))(req)
}

# Contact Messages System Setup

This guide explains how to set up the contact message system where users can submit messages through the contact form and admins can reply via email.

## Features

✅ Users submit contact messages via the contact form  
✅ Admin dashboard to view all messages  
✅ Mark messages as read/replied  
✅ Send email replies directly to users  
✅ Status tracking (new/read/replied)  

## Prerequisites

- MongoDB database (for storing messages)
- SMTP email server (Gmail, SendGrid, or any SMTP service)
- Environment variables configured

## Setup Steps

### 1. MongoDB Setup

Make sure you have a MongoDB instance running:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/njbsictclub?retryWrites=true&w=majority
```

### 2. Email Configuration

#### Option A: Resend (Recommended for Vercel)

Resend is the easiest email service for Vercel deployments.

**Setup Steps:**

1. Create account at https://resend.com (free tier available)
2. Verify your email address
3. Go to API Keys and copy your key
4. Add to environment variables:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@njbsictclub.com
ADMIN_EMAIL=admin@njbsictclub.com
```

**For Custom Domain (Optional):**
- Go to Domains in Resend dashboard
- Add your domain (njbsictclub.com)
- Verify DNS records
- Update EMAIL_FROM to use custom domain

**Note:** Resend's free tier includes 100 emails/day, plenty for a small community club.

#### Option B: SendGrid

SendGrid is a enterprise email platform.

**Setup Steps:**

1. Create account at https://sendgrid.com
2. Verify your sender email
3. Go to Settings → API Keys
4. Create API key with "Mail Send" permissions
5. Add to environment variables:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=verified_sender@example.com
ADMIN_EMAIL=admin@njbsictclub.com
```

**Important:** The EMAIL_FROM address must be verified in SendGrid.

#### Option C: Custom SMTP (Gmail, Outlook, etc.)

For SMTP-based services, you'll need to modify the code to use an SMTP library. Currently, the API uses Resend/SendGrid for simplicity. To use SMTP:

1. Install nodemailer: `pnpm add nodemailer @types/nodemailer`
2. Update `/app/api/admin/messages/[id]/reply/route.ts` to use the SMTP approach
3. Add environment variables for your email provider

### 4. Deploy to Vercel

1. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.example`

2. **Ensure MONGODB_URI is set:**
   - This is critical! Without it, API endpoints return HTML error pages instead of JSON
   - Add your MongoDB connection string

3. **Deploy:**
   ```bash
   git push origin main
   ```

## How It Works

### User Flow

1. User visits `/contact`
2. Fills out form and submits
3. Message saved to MongoDB with status: 'new'
4. Confirmation message shown to user

### Admin Flow

1. Admin logs in and goes to `/admin`
2. Clicks "Messages" tab
3. Selects a message from the list
4. Can view full message details
5. Types a reply in the reply box
6. Clicks "Send Reply"
7. Email is sent to the user automatically
8. Message status changes to 'replied'

## File Structure

```
app/
├── api/
│   ├── contact/
│   │   └── route.ts              # POST: Submit contact message
│   └── admin/
│       └── messages/
│           ├── route.ts           # GET: List all messages
│           └── [id]/
│               ├── route.ts       # PUT: Update message status
│               └── reply/
│                   └── route.ts   # POST: Send reply email
│
components/admin/
└── messages.tsx                  # Admin message panel UI

models/
└── Message.ts                     # MongoDB schema
```

## API Endpoints

### Submit Contact Message
```
POST /api/contact
Body: { name, email, subject, message }
Response: { success: true, message: "Message received" }
```

### Get All Messages
```
GET /api/admin/messages
Response: [{ _id, name, email, subject, message, status, adminReply, repliedAt, createdAt }]
```

### Update Message Status
```
PUT /api/admin/messages/[id]
Body: { status: 'read' | 'replied' }
Response: { updated message object }
```

### Send Reply Email
```
POST /api/admin/messages/[id]/reply
Body: { adminReply: "Your reply text here" }
Response: { success: true, message: "Reply sent", data: { message object } }
```

### Delete Message
```
DELETE /api/admin/messages/[id]
Response: { message: "Message deleted" }
```

## Troubleshooting

### Error: "MONGODB_URI is not defined"
- Solution: Add your MongoDB connection string to Vercel environment variables
- Without this, API returns HTML error pages, causing "Unexpected token '<'" JSON errors

### Error: "Failed to send email"
- Check that EMAIL_HOST, EMAIL_USER, EMAIL_PASS are correct
- For Gmail: Verify you're using an app-specific password, not your regular password
- Check email service isn't blocking the connection

### Messages not appearing in admin panel
- Verify MONGODB_URI is correct and database is running
- Check that contact form is posting to `/api/contact`
- Check browser console and server logs for errors

### Admin dashboard not accessible
- Verify you're logged in as an admin user
- Check that your user's role is set to 'admin' in MongoDB
- Current admin emails: sangamkunwar48@gmail.com (hardcoded in admin check)

## Security Notes

⚠️ **Important:**
- Never commit `.env` files (already in .gitignore)
- Use strong JWT_SECRET in production
- Only admins should access `/admin` routes
- Email credentials should only be in environment variables
- Implement rate limiting on contact form in production

## Future Enhancements

- Add email verification for contact messages
- Implement message categories/labels
- Add message search and filtering
- Send notifications to admin when new message arrives
- Add message attachments support
- Auto-reply templates for common questions

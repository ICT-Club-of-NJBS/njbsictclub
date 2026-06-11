# Get Started - NJBS ICT Club Website

Welcome! Your website is now fully functional and ready to use. This guide will get you started in 5 minutes.

## What's Included

✅ **Modern Authentication**
- Login with email/password
- Sign up form with password strength indicator
- Demo account for testing (no database needed)
- Admin role support

✅ **Contact Message System**
- Users can submit contact forms
- Admin dashboard to manage messages
- Reply directly to users with emails
- Message status tracking

✅ **Admin Panel**
- Manage users
- View contact messages
- Send message replies
- Manage team members
- View projects and events

✅ **Ready for Production**
- Builds successfully without errors
- Optimized for Vercel deployment
- Works with or without MongoDB

## Quick Start (5 Minutes)

### Option 1: Test Locally WITHOUT Database

No setup needed! The app has a demo account built-in.

```bash
# 1. Start development server
npm run dev

# 2. Open http://localhost:3000

# 3. Login with demo account:
#    Email: demo@example.com
#    Password: demo123

# 4. Explore the dashboard and admin panel
```

That's it! You can now:
- ✅ Test login/signup
- ✅ View admin dashboard
- ✅ Test contact messages
- ✅ See all UI/UX

### Option 2: Full Setup WITH Database

For permanent data storage and email functionality:

```bash
# 1. Get MongoDB connection string from:
#    → MongoDB Atlas: https://www.mongodb.com/cloud/atlas
#    → Or local MongoDB: mongodb://localhost:27017/njbsictclub

# 2. Create .env.local file in project root:
#    MONGODB_URI=your_connection_string_here
#    JWT_SECRET=your_secret_key_here

# 3. Start the app
npm run dev

# 4. Create account and signup - data will be saved!
```

## Testing the Contact Form

### As a User:

1. Go to http://localhost:3000/contact
2. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Subject: Test message
   - Message: Write something
3. Click "Send Message"
4. You'll see a success message

### As Admin:

1. Login with demo or admin account
2. Go to `/admin` → Messages tab
3. Click on a message to view it
4. Type your reply in the text area
5. Click "Send Reply"
6. The user receives an email (if configured)

## Environment Variables

### Required for Development

Create `.env.local` file in project root:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/njbsictclub
JWT_SECRET=your-super-secret-key-here

# Optional (for email replies)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (for OAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

### For Production (Vercel)

Add these in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
RESEND_API_KEY=your_resend_api_key
```

## Project Structure

```
/app
├── /auth              # Login/Signup pages
├── /admin             # Admin dashboard
├── /contact           # Contact form page
├── /api/auth          # Authentication APIs
└── /api/admin         # Admin APIs

/components
├── /admin             # Admin components
├── /ui               # UI components (button, input, etc.)
└── navbar.tsx        # Navigation bar

/models
├── User.ts           # User database schema
└── Message.ts        # Contact message schema

/lib
├── mongodb.ts        # Database connection
├── generate-user-id.ts
└── qrcode.ts
```

## Available Pages

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Public |
| About | `/about` | Public |
| Contact | `/contact` | Public |
| Team | `/team` | Public |
| Projects | `/projects` | Public |
| Login | `/auth/login` | Public |
| Signup | `/auth/signup` | Public |
| Dashboard | `/dashboard` | Logged in users |
| Admin Panel | `/admin` | Admin users only |

## User Roles

### Member (Default)
- ✅ Can access dashboard
- ✅ Can submit contact forms
- ✅ Can view public pages

### Admin
- ✅ All member features
- ✅ Access admin panel
- ✅ Manage users
- ✅ View/reply to messages
- ✅ Manage team and projects

To make someone admin:
1. Sign up with email: `sangamkunwar48@gmail.com`
2. Or manually set `role: 'admin'` in database

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Add Environment Variables

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add each variable:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `RESEND_API_KEY` = your Resend API key (optional)

### Step 4: Deploy

Click "Deploy" button. Done!

Your site is now live at `your-project.vercel.app`

## Common Tasks

### Change Admin Email

Edit `/app/api/auth/signup/route.ts`:

```typescript
role: email === 'your-email@example.com' ? 'admin' : 'member',
```

### Add a New User

1. Go to `/auth/signup`
2. Fill in the form
3. New user is created

### Reset User Password

Edit database directly or add password reset functionality:

1. In MongoDB, find the user
2. Update their password with bcrypt hash
3. Or implement forgot-password page

### Send Test Email

1. Get RESEND_API_KEY from https://resend.com
2. Add to environment variables
3. Reply to a message in admin panel
4. Email will be sent

## Troubleshooting

### "Signing in..." but no redirect

**Problem:** Login/signup stuck on loading

**Solution:**
1. Check browser console (F12)
2. Check if MONGODB_URI is set (optional for demo)
3. Try demo account: demo@example.com / demo123

### MongoDB connection error

**Problem:** `ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- This is normal! The app works without MongoDB
- Use demo account to test
- Add MONGODB_URI to use database

### Emails not sending

**Problem:** Replies don't send emails

**Solution:**
1. Get API key from https://resend.com or SendGrid
2. Add RESEND_API_KEY to environment
3. Restart app
4. Try again

### 404 errors in production

**Problem:** Pages not found after deploy

**Solution:**
1. Verify deployment completed
2. Check environment variables are set
3. Clear browser cache
4. Try incognito mode

## Next Steps

1. ✅ Test login with demo account
2. ✅ Explore the admin panel
3. ✅ Test contact form
4. ✅ Add MongoDB connection (optional)
5. ✅ Deploy to Vercel
6. ✅ Customize branding (colors, logo)
7. ✅ Set up email (Resend/SendGrid)

## File References

- **Setup Details:** See `TEST_CREDENTIALS.md`
- **Contact System:** See `CONTACT_MESSAGES_SETUP.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **Features:** See `FEATURES_IMPLEMENTED.md`
- **Deployment:** See `DEPLOYMENT.md`

## Need Help?

1. Check `TROUBLESHOOTING.md` for common issues
2. Look at console logs (browser F12 or terminal)
3. See `TEST_CREDENTIALS.md` for demo account info
4. Review `FEATURES_IMPLEMENTED.md` for feature details

## Summary

Your website is ready to:
- ✅ Login/Signup (with or without database)
- ✅ View dashboard (if logged in)
- ✅ Submit contact messages
- ✅ Admin can reply to messages
- ✅ Deploy to production

Start with `npm run dev` and explore! Demo account works without any configuration.

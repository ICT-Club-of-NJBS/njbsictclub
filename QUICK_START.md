# Quick Start Guide - ICT Club App Authentication

Get the app working in 5 minutes!

## Step 1: Set Environment Variables (1 minute)

Copy these to your `.env.local` file (get values from Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-key...
JWT_SECRET=your-random-secret-string
```

**Where to get these from Supabase:**
1. Open Supabase.com and login to your project
2. Click **Settings** (bottom left sidebar)
3. Click **API**
4. Copy **URL** → NEXT_PUBLIC_SUPABASE_URL
5. Copy **anon public** key → NEXT_PUBLIC_SUPABASE_ANON_KEY
6. Copy **service_role secret** key → SUPABASE_SERVICE_ROLE_KEY
7. Generate JWT_SECRET: `openssl rand -base64 32` (or any 32+ char random string)

## Step 2: Create Database Tables (1 minute)

1. Open your Supabase project
2. Click **SQL Editor** (left sidebar)
3. Click **"New Query"** button
4. **Copy ALL the SQL** from: `/scripts/setup-complete-supabase.sql`
5. **Paste** into the SQL Editor
6. Click **"Run"** button
7. Wait for **"Success"** message

✅ Tables created: users, events, event_registrations, messages, settings, and more

## Step 3: Start the App (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## Step 4: Test Signup (1 minute)

1. Go to http://localhost:3000/auth/signup
2. Fill in:
   - **Full Name**: Your Name
   - **Email**: test@example.com
   - **Password**: Test123!@ (needs 1 number, 1 special char, 8+ chars)
3. Click **"Create My Account"**
4. You'll see success message and be redirected to login

✅ Account created! Check Supabase > Table Editor > users table to verify

## Step 5: Test Login (1 minute)

1. On login page, enter your email and password
2. Click **"Sign In"**
3. You'll be redirected to dashboard
4. Check navbar - it shows your **email** and **role**

✅ **Done! Authentication is working!**

## If You Get "Failed to Fetch" Error

This is usually due to missing environment variables or incorrect setup. Fix it:

1. **Check console** (Ctrl+Shift+K) for **[v0]** error messages
2. **Verify .env.local** has all 4 environment variables set
3. **Restart dev server** after adding env vars: `npm run dev`
4. **Check Supabase tables exist**: Go to Supabase > Table Editor, should see "users" table
5. **Verify Supabase URL is correct**: No trailing slash, just the URL

## Next: Enable OAuth (Optional)

Signup/login also support **Google** and **GitHub** - just click the buttons!

To make them fully work, configure in Supabase:

### Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create a new project
3. Search for "Google+ API" and enable it
4. Create OAuth 2.0 Credentials (Web application type)
5. Add authorized origins: `http://localhost:3000`, `https://your-domain.com`
6. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase > Authentication > Providers > Google:
   - Paste your credentials
   - Toggle **ON**

### GitHub OAuth Setup
1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase > Authentication > Providers > GitHub:
   - Paste your credentials
   - Toggle **ON**

## Troubleshooting

### "Failed to fetch" Error
- [x] Check all 4 env vars are in `.env.local`
- [x] Restart dev server after adding env vars
- [x] Verify Supabase URL and keys are correct (no extra spaces/newlines)
- [x] Check browser console (Ctrl+Shift+K) for "[v0]" error messages
- [x] Make sure database tables exist (Supabase > Table Editor > users)

### Can't See Supabase Tables
- Re-run the SQL script from `/scripts/setup-complete-supabase.sql`
- If you see "relation already exists" error, tables are there - just verify in Table Editor

### OAuth Not Working
- Add redirect URL: `http://localhost:3000/auth/callback` in Supabase > Authentication > URL Configuration
- Check OAuth credentials are correct in provider (Google/GitHub)
- Verify credentials are pasted correctly in Supabase > Authentication > Providers

### Password Not Accepted
Passwords must have:
- **At least 8 characters**
- **At least 1 number** (0-9)
- **At least 1 special character** (!@#$%^&* etc)

Valid examples:
- `Test123!`
- `Pass@word123`
- `SecurePass99#`

## File Structure (Authentication Only)

```
app/
├── auth/
│   ├── signup/page.tsx        ← Signup form
│   ├── login/page.tsx         ← Login form  
│   └── callback/              ← OAuth callback
├── api/auth/
│   ├── signup/route.ts        ← Signup endpoint
│   ├── login/route.ts         ← Login endpoint
│   └── me/route.ts            ← Get current user
components/
├── navbar.tsx                 ← Shows user info
lib/
├── auth.ts                    ← Auth utilities
└── supabase/                  ← Supabase client
```

## Common Tasks

### View All Registered Users
1. Supabase > Table Editor
2. Click **"users"** table
3. See all members with email, role, status

### Make Someone Admin
1. Supabase > Table Editor > users
2. Find user row
3. Change **role** column from "member" to "admin"
4. Click save

### Reset User Password
1. Generate bcrypt hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123!', 10).then(hash => console.log(hash))"
   ```
2. Copy the output (long string)
3. Supabase > Table Editor > users
4. Find user, update **password_hash** column
5. Click save

### Create Event
1. Supabase > Table Editor > events
2. Click **"Insert row"**
3. Fill: title, event_date, location, capacity
4. Save
5. Users can now register for this event

## Database Tables

**users** - User accounts with email, password, role
**events** - Events with dates and capacity
**event_registrations** - User registrations for events
**messages** - Messaging system
**message_replies** - Replies to messages
**settings** - System settings (club name, email, etc)

(More tables available - see `/scripts/setup-complete-supabase.sql`)

## Documentation Files

For more detailed info, read:
- **`FIXES_SUMMARY.md`** - What was fixed and changes made
- **`SUPABASE_SETUP.md`** - Complete setup with all options
- **`SQL_REFERENCE.md`** - SQL help and troubleshooting
- **`SQL_MINIMAL.md`** - Minimal SQL (just essentials)

## Features Working Now

✅ Email/Password signup  
✅ Email/Password login  
✅ Google OAuth signup/login  
✅ GitHub OAuth signup/login  
✅ User profiles & roles (member/admin)  
✅ JWT token-based sessions  
✅ HTTP-only secure cookies  
✅ Event management  
✅ Event registration  
✅ Dark/Light mode support  
✅ Mobile responsive design  

## Need Help?

1. **Check console logs** - Look for **[v0]** prefix for app-specific errors
2. **Check Supabase status** - https://status.supabase.com
3. **Read error messages** - They tell you exactly what's wrong
4. **Verify environment variables** - Are all 4 set? Are they correct?
5. **Check tables exist** - Supabase > Table Editor > users

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Failed to fetch" | Check env vars are set, restart dev server |
| "Invalid email or password" | Verify user exists, check password is correct |
| OAuth redirect fails | Add callback URL to Supabase > Authentication > URL Configuration |
| Tables not found | Re-run SQL script from `/scripts/setup-complete-supabase.sql` |
| Password too weak | Must be 8+ chars with 1 number + 1 special char |
| Can't login after signup | Wait a moment and refresh page, or check if user exists in table |

---

**You're ready to go!** 🚀

Start with: **`npm run dev`** → Visit **http://localhost:3000/auth/signup** → Create account → Login

For production, see deployment guide or contact support.

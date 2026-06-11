# OAuth Authentication Setup Guide (Google & GitHub)

## Overview
This guide shows how to add Google and GitHub OAuth to your NJBS ICT Club platform. The custom JWT authentication system stays the same - OAuth just provides an additional login method.

## What You Get

### OAuth Features
- **Google Login/Signup** - Users can login with Google account
- **GitHub Login/Signup** - Users can login with GitHub account
- **Email/Password** - Still works as before
- **Automatic User Creation** - First-time OAuth users are auto-registered
- **User Detection** - Existing users can login via OAuth

### QR Codes
- **Auto-generated** - Every user gets a unique QR code
- **User ID Encoding** - QR encodes user ID (NJBS-YYYYMMDDHHMMSS)
- **Attendance Tracking** - Scan during events
- **Admin Dashboard** - View member QR codes

### Updated Pages
- **/auth/login** - Email login + Google + GitHub buttons
- **/auth/signup** - Email signup + Google + GitHub buttons
- **/profile** - View/download personal QR code

## Environment Variables Required

Add these to `.env.local` (and Vercel Settings):

```env
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...

# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth (get from GitHub Developer Settings)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# App URL (important for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Google OAuth Setup (Step-by-Step)

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click "Select a Project" → "New Project"
4. Name it "NJBS ICT Club"
5. Click "Create"

### Step 2: Enable Google+ API
1. Search for "Google+ API" in the search bar
2. Click on it
3. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "Credentials" (left sidebar)
2. Click "Create Credentials" → "OAuth client ID"
3. You'll be asked to create a consent screen first:
   - Click "Create Consent Screen"
   - Choose "External" user type
   - Fill in app name: "NJBS ICT Club"
   - Add your email for support
   - Add scopes: email, profile, openid
   - Add test users (your email)
   - Save and continue
4. Back to OAuth creation:
   - Choose "Web application"
   - Name: "NJBS ICT Club"
   - **Add Authorized JavaScript origins:**
     - http://localhost:3000 (for local testing)
     - https://yourdomain.com (for production)
   - **Add Authorized redirect URIs:**
     - http://localhost:3000/api/auth/callback/google
     - https://yourdomain.com/api/auth/callback/google
   - Click "Create"

### Step 4: Copy Your Credentials
You'll see a popup with:
- **Client ID** (public) → Copy to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Client Secret** (keep secret!) → Copy to `GOOGLE_CLIENT_SECRET`

### Step 5: Add to `.env.local`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_copied_client_id
GOOGLE_CLIENT_SECRET=your_copied_client_secret
```

### Done!
Google login is now ready. Test by clicking "Continue with Google" on login page.

## GitHub OAuth Setup (Step-by-Step)

### Step 1: Go to GitHub Developer Settings
1. Visit: https://github.com/settings/developers
2. Click "OAuth Apps" (left sidebar)
3. Click "New OAuth App"

### Step 2: Fill in Application Details
- **Application name:** NJBS ICT Club
- **Homepage URL:** http://localhost:3000 (or your domain)
- **Application description:** Club membership and event management
- **Authorization callback URL:**
  - http://localhost:3000/api/auth/callback/github (for local testing)
  - https://yourdomain.com/api/auth/callback/github (for production)

### Step 3: Register Application
Click "Register application"

### Step 4: Copy Your Credentials
You'll see the OAuth app page with:
- **Client ID** (visible at top) → Copy to `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- **Client Secret** (click "Generate a new client secret") → Copy to `GITHUB_CLIENT_SECRET`

⚠️ Important: Client Secret is only shown once! Copy it immediately.

### Step 5: Add to `.env.local`
```env
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_copied_client_id
GITHUB_CLIENT_SECRET=your_copied_client_secret
```

### Done!
GitHub login is now ready. Test by clicking "Continue with GitHub" on login page.

## Database Schema (Supabase Users Table)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  user_id VARCHAR(20) UNIQUE,        -- NJBS-YYYYMMDDHHMMSS
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),         -- NULL for OAuth users
  full_name VARCHAR(255),
  phone VARCHAR(20),
  
  -- OAuth Fields
  oauth_provider VARCHAR(50),         -- 'email', 'google', 'github'
  google_id VARCHAR(255) UNIQUE,      -- NULL unless from Google
  github_id VARCHAR(255) UNIQUE,      -- NULL unless from GitHub
  
  role VARCHAR(50) DEFAULT 'member',  -- member, admin, moderator
  status VARCHAR(50) DEFAULT 'active',
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Routes

### Authentication Endpoints
- `POST /api/auth/signup` - Email signup
- `POST /api/auth/login` - Email login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset with code
- `GET /api/auth/me` - Get current user

### OAuth Callback Routes (Auto-generated)
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

## How OAuth Works with JWT

### 1. User Clicks "Continue with Google/GitHub"
1. Redirected to Google/GitHub login page
2. User approves app access
3. Redirected to `/api/auth/callback/[provider]`

### 2. OAuth Callback Processing
1. System receives authorization code from provider
2. Exchanges code for user info (email, name, avatar)
3. Checks if user exists in database
4. **If new user:** Creates account with OAuth provider info
5. **If exists:** Logs them in with existing account
6. Generates JWT token
7. Sends token as HTTP-only cookie
8. Redirects to `/` or admin dashboard

### 3. QR Code Generation
- Each user automatically gets a unique user ID: `NJBS-YYYYMMDDHHMMSS`
- QR code is generated encoding this user ID
- QR code is stored in Supabase
- Can be viewed in user profile
- Admin can view and download all member QR codes

### 4. After Login
- User has JWT token in HTTP-only cookie
- Token valid for 7 days
- User can access protected pages
- Token sent automatically with each request

## Testing OAuth Locally

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Test Google Login
1. Visit http://localhost:3000/auth/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. Click "Allow" when asked for permissions
5. Should be redirected to dashboard
6. Check `/admin` to see your profile

### Step 3: Test GitHub Login
1. Visit http://localhost:3000/auth/signup
2. Click "Continue with GitHub"
3. Sign in with your GitHub account
4. Click "Authorize" when asked
5. Should be redirected to dashboard
6. Check `/admin` to see your profile

### Step 4: View Your QR Code
1. Go to `/admin`
2. Click Members tab
3. Find your account
4. Click to see details
5. Should see your QR code
6. Can download or copy it

## Troubleshooting

### OAuth Button Not Showing
- Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GITHUB_CLIENT_ID` are in `.env.local`
- Restart dev server after adding env vars
- Check browser console for errors

### "Invalid redirect URI"
- Verify callback URLs match exactly:
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`
- Check spelling and protocol (http vs https)

### "User not found" or login fails
- Check Supabase table `users` has correct schema
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check server logs for errors

### QR Code Not Showing
- Make sure `qrcode` package is installed
- Refresh page after OAuth login
- Check user record in Supabase

## Security Features

✅ OAuth tokens never exposed to frontend
✅ JWT tokens stored in HTTP-only cookies
✅ All callbacks validate state parameter
✅ PKCE protection for OAuth flows
✅ QR codes encode only user ID (not sensitive)
✅ SSL/HTTPS enforced in production
✅ No password stored for OAuth users

## Production Deployment

When deploying to Vercel:

1. **Update OAuth Redirect URLs** in Google Cloud Console:
   - https://yourdomain.com/api/auth/callback/google

2. **Update OAuth Redirect URLs** in GitHub Settings:
   - https://yourdomain.com/api/auth/callback/github

3. **Add Environment Variables** to Vercel (Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   JWT_SECRET=...
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXT_PUBLIC_GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Redeploy** your application

---

For more help, check the browser console (F12) and Vercel logs for detailed error messages.

# Google & GitHub OAuth Setup Checklist

## Quick Overview
This is a simple checklist to add Google and GitHub login buttons to your NJBS ICT Club platform using the custom JWT system (no Supabase Auth changes).

---

## Phase 1: Google OAuth Setup (10 minutes)

### [ ] Step 1: Create Google Cloud Project
- [ ] Visit: https://console.cloud.google.com/
- [ ] Click "Select a Project" → "New Project"
- [ ] Name: "NJBS ICT Club"
- [ ] Click "Create"

### [ ] Step 2: Enable Google+ API
- [ ] Search for "Google+ API" in search bar
- [ ] Click on it
- [ ] Click "Enable"

### [ ] Step 3: Create OAuth Credentials
- [ ] Go to "Credentials" (left sidebar)
- [ ] Click "Create Credentials" → "OAuth client ID"
- [ ] Create consent screen (mark as "External")
- [ ] Add app name: "NJBS ICT Club"
- [ ] Add scopes: email, profile, openid
- [ ] Back to OAuth creation → "Web application"
- [ ] **Add Authorized JavaScript origins:**
  - [ ] http://localhost:3000
  - [ ] https://yourdomain.com (production)
- [ ] **Add Authorized redirect URIs:**
  - [ ] http://localhost:3000/api/auth/callback/google
  - [ ] https://yourdomain.com/api/auth/callback/google
- [ ] Click "Create"

### [ ] Step 4: Copy Google Credentials
- [ ] Copy **Client ID** → Save for next step
- [ ] Copy **Client Secret** → Save for next step

### [ ] Step 5: Add to `.env.local`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=paste_client_id_here
GOOGLE_CLIENT_SECRET=paste_client_secret_here
```
- [ ] Save `.env.local` file

---

## Phase 2: GitHub OAuth Setup (10 minutes)

### [ ] Step 1: Go to GitHub Developer Settings
- [ ] Visit: https://github.com/settings/developers
- [ ] Click "OAuth Apps" in left sidebar
- [ ] Click "New OAuth App"

### [ ] Step 2: Fill Application Details
- [ ] **Application name:** NJBS ICT Club
- [ ] **Homepage URL:** http://localhost:3000
- [ ] **Description:** Club membership and event management
- [ ] **Authorization callback URL (local):** http://localhost:3000/api/auth/callback/github
- [ ] Click "Register application"

### [ ] Step 3: Copy GitHub Credentials
- [ ] Copy **Client ID** → Save for next step
- [ ] Click "Generate a new client secret"
- [ ] Copy **Client Secret** → Save for next step
  - ⚠️ Only shows once! Copy immediately!

### [ ] Step 4: Add to `.env.local`
```env
NEXT_PUBLIC_GITHUB_CLIENT_ID=paste_client_id_here
GITHUB_CLIENT_SECRET=paste_client_secret_here
```
- [ ] Save `.env.local` file

---

## Phase 3: Update Production (For Vercel)

### [ ] Google Cloud Console Update
- [ ] Add production authorized origins:
  - [ ] https://yourdomain.com
- [ ] Add production redirect URI:
  - [ ] https://yourdomain.com/api/auth/callback/google

### [ ] GitHub App Update
- [ ] Go back to GitHub OAuth App
- [ ] Add production authorization callback URL:
  - [ ] https://yourdomain.com/api/auth/callback/github

### [ ] Vercel Environment Variables
- [ ] Go to Vercel Project Settings
- [ ] Add Environment Variables:
  - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXT_PUBLIC_GITHUB_CLIENT_ID`
  - [ ] `GITHUB_CLIENT_SECRET`
- [ ] Redeploy project

---

## Phase 4: Test Locally

### [ ] Start Dev Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] No environment variable warnings

### [ ] Test Google Login
- [ ] Visit http://localhost:3000/auth/login
- [ ] Click "Continue with Google"
- [ ] Sign in with Google account
- [ ] See "Allow" permission dialog
- [ ] Click "Allow"
- [ ] Should redirect to dashboard
- [ ] Check `/admin` and verify logged in

### [ ] Test GitHub Login
- [ ] Visit http://localhost:3000/auth/signup
- [ ] Click "Continue with GitHub"
- [ ] Sign in with GitHub account
- [ ] Click "Authorize"
- [ ] Should redirect to dashboard
- [ ] Check `/admin` and verify logged in

### [ ] Test QR Code Generation
- [ ] Login via Google or GitHub
- [ ] Go to `/admin` → Members
- [ ] Find your account
- [ ] Click to view details
- [ ] Should see QR code
- [ ] Can download/copy it

### [ ] Test Email Login Still Works
- [ ] Visit /auth/signup
- [ ] Sign up with email/password
- [ ] Should work like before
- [ ] Check `/admin` for QR code

---

## Final Checklist

- [ ] All 4 environment variables added to `.env.local`
- [ ] Google OAuth testing passed ✅
- [ ] GitHub OAuth testing passed ✅
- [ ] Email/password login still works ✅
- [ ] QR codes generating for all users ✅
- [ ] Admin can view member QR codes ✅
- [ ] Production redirect URLs updated ✅
- [ ] Vercel environment variables set ✅

---

## Troubleshooting

**"OAuth buttons not showing"**
- Restart dev server after adding .env.local
- Clear browser cache (Ctrl+Shift+Del)

**"Invalid redirect URI error"**
- Check callback URLs match exactly in OAuth provider settings
- No trailing slashes!

**"User not created"**
- Check Supabase connection
- Check server logs for database errors

**"QR code missing"**
- Refresh page after login
- Check Supabase `users` table

---

## Summary

By completing this checklist, you'll have:
✅ Google login/signup on your platform
✅ GitHub login/signup on your platform
✅ Email/password login (still works)
✅ Automatic QR code generation
✅ Custom JWT authentication (unchanged)
✅ Admin dashboard with member QR codes

**Total time:** ~30 minutes setup + testing

**Questions?** Check OAUTH_SETUP.md for detailed information.

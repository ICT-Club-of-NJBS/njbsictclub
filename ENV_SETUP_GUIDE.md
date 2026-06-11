# Setting Up .env.local - Complete Guide

## Overview
Your NJBS ICT Club platform uses **Supabase** for the database and **custom JWT** for authentication. You need to add 4 environment variables to make it work.

---

## Step 1: Get Your Supabase Credentials

### 1.1 Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Login with your account
3. Click on your **NJBS ICT Club** project

### 1.2 Navigate to API Keys
1. Click **Settings** in the left sidebar
2. Click **API** 
3. You should see a page like this with your keys

### 1.3 Copy Your Keys

You'll see several keys here. Copy these **3 values**:

#### A) `NEXT_PUBLIC_SUPABASE_URL` 
- Look for the section labeled **"Project URL"**
- It looks like: `https://abcdefgh.supabase.co`
- Copy the full URL

#### B) `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Under **"Project API keys"** section
- Look for the key labeled **"anon public"**
- It's a long string starting with `eyJhbGc...`
- Click the copy button next to it

#### C) `SUPABASE_SERVICE_ROLE_KEY`
- Same section as above
- Look for the key labeled **"service_role secret"**
- It's a long string starting with `eyJhbGc...`
- Click the copy button next to it
- ⚠️ **Keep this SECRET!** Never share it publicly

---

## Step 2: Generate JWT Secret

Your JWT secret is a random string used to sign authentication tokens.

### Option A: Quick Generation (Recommended)
Copy this command and run it in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output a 64-character random string. **Copy the entire output.**

### Option B: Manual Generation
You can also use any online random string generator and create a 32+ character random string.

---

## Step 3: Create .env.local File

### For Local Development:

1. In your project root folder, create a new file called `.env.local`

2. Add these lines (replace the values with your actual credentials):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_64_character_random_string_here
```

Replace:
- `https://your-project.supabase.co` → Your actual Supabase URL
- `eyJhbGc...` (anon key) → Your anon public key
- `eyJhbGc...` (service role) → Your service role secret key
- `your_64_character_random_string_here` → The output from Step 2

### Example (don't use these values!):
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTk4NTYwMDAwMH0.abcdefghijklmnopqrstuvwxyz
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MDAwMDAwMCwiZXhwIjoxOTg1NjAwMDAwfQ.abcdefghijklmnopqrstuvwxyz
JWT_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
```

3. **Save the file as `.env.local`**

---

## Step 4: For Production (Vercel)

If you're deploying to Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings**
4. Click **Environment Variables** (left sidebar)
5. Add these 4 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

6. Click **Save and Redeploy**

> **Note:** `NEXT_PUBLIC_*` variables are visible in browser (they're meant to be public). The `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` are secret and only used on the server.

---

## Verify Your Setup

After creating `.env.local`, test that everything works:

```bash
npm run dev
```

Then visit: `http://localhost:3000`

If you can see the page without "Missing environment variable" errors, you're good!

---

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- ✓ Make sure `.env.local` file exists in your project root
- ✓ Make sure you spelled it exactly: `NEXT_PUBLIC_SUPABASE_URL`
- ✓ Make sure the value is the full URL (includes https://)
- ✓ Restart your dev server after creating `.env.local`

### "Could not find the table 'public.users'"
- ✓ Your tables aren't created in Supabase yet
- ✓ Follow QUICKSTART.md to create tables first

### Keys not working
- ✓ Make sure you copied the ENTIRE key string
- ✓ Make sure there are no extra spaces before/after the value
- ✓ Make sure you got the right key (anon vs service_role)

### "Invalid JWT secret"
- ✓ Make sure JWT_SECRET is a random string (at least 32 characters)
- ✓ Don't use special characters like quotes or spaces

---

## Security Notes

✅ **Safe to share:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **NEVER share:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

Never commit `.env.local` to Git. It's already in `.gitignore`.

---

## What Each Variable Does

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Database connection | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public database key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database key | Supabase → Settings → API |
| `JWT_SECRET` | Sign auth tokens | Generate with `node -e "console.log(...)"` |

---

## Quick Copy-Paste Template

Use this template and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

---

## Still Having Issues?

1. Check that `.env.local` is in your project **root folder** (same level as `package.json`)
2. Make sure there are no typos in variable names
3. Make sure values don't have quotes around them
4. Restart your dev server: `npm run dev`
5. Check browser console for specific error messages

---

That's it! Your environment is now configured. 🎉

Next step: Follow QUICKSTART.md to create your database tables.

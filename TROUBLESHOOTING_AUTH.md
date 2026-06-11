# Authentication Troubleshooting Guide

## "Failed to create user account" Error

### What's Happening
This error means the signup API endpoint encountered an issue while creating the user in the database.

### How to Debug

#### Step 1: Check the Browser Console
1. Open your browser's Developer Tools (F12 or Ctrl+Shift+K)
2. Go to the **Console** tab
3. Look for messages starting with **[v0]**
4. These will tell you exactly what failed

#### Step 2: Check Server Logs
If you're testing locally:
1. Look at your terminal where `npm run dev` is running
2. Search for **[v0]** error messages
3. These show server-side errors

If deployed on Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Deployments**
4. Click the active deployment
5. Go to **Functions** logs to see server errors

### Common Causes & Solutions

#### Cause 1: Database Tables Don't Exist
**Error in console:** `relation "users" does not exist`

**Solution:**
1. Go to Supabase > SQL Editor
2. Copy the entire SQL from: `/scripts/setup-complete-supabase.sql`
3. Create a new query and paste the SQL
4. Click **Run**
5. Wait for "Success" message
6. Try signup again

#### Cause 2: Environment Variables Not Set
**Error in console:** `Missing Supabase configuration`

**Solution:**
1. Create `.env.local` in project root
2. Add these 4 variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-32-chars
```
3. Get URL and keys from: Supabase > Settings > API
4. Restart dev server: `npm run dev`
5. Try signup again

#### Cause 3: Email Already Registered
**Error message:** `Email already registered`

**Solution:**
- Use a different email address
- Or go to Supabase > Table Editor > users, find the email, and delete that row
- Then try signup again

#### Cause 4: Password Doesn't Meet Requirements
**Error message:** `Password must be at least 8 characters` (or mention numbers/special chars)

**Solution:**
Make sure password has:
- At least 8 characters ✓
- At least 1 number (0-9) ✓
- At least 1 special character (!@#$%^&*) ✓

**Examples that work:**
- `Password123!`
- `Test@1234`
- `SecurePass99#`

**Examples that DON'T work:**
- `password123` (no special char)
- `Password!` (no number)
- `Pass1!` (less than 8 chars)

#### Cause 5: JSON Parse Error
**Error in console:** `SyntaxError: Unexpected token`

**Solution:**
This usually means the server is returning HTML instead of JSON (server crashed).
1. Check server logs for errors
2. Make sure all environment variables are set
3. Restart dev server: `npm run dev`

#### Cause 6: Service Role Key is Wrong or Missing
**Error:** `Invalid API Key` or `Unauthorized`

**Solution:**
1. Go to Supabase > Settings > API
2. Copy the **service_role secret** key (different from anon key!)
3. Paste it as `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
4. Restart dev server

### Complete Debugging Checklist

- [ ] All 4 environment variables are set in `.env.local`
- [ ] Environment variables have correct values (no extra spaces)
- [ ] Dev server was restarted after adding env vars
- [ ] SQL setup script was run successfully
- [ ] Can see `users` table in Supabase > Table Editor
- [ ] Browser console shows [v0] messages (not blank)
- [ ] Server logs show [v0] messages when trying to sign up
- [ ] Password is 8+ chars with number + special char
- [ ] Email hasn't been used before
- [ ] JWT_SECRET is set (any random 32+ char string)

---

## "Invalid email or password" During Login

### Common Causes

#### Issue 1: User Doesn't Exist
Make sure you signed up successfully first. Check:
1. Go to Supabase > Table Editor > users
2. Look for your email
3. If not there, signup didn't work - check signup errors

#### Issue 2: Password is Wrong
Double-check:
- Passwords are case-sensitive
- No extra spaces
- Typed correctly

#### Issue 3: User Account is Inactive
1. Go to Supabase > Table Editor > users
2. Find your user row
3. Check the `status` column - should say `active`
4. If says `inactive`, change it to `active`

### Debug Steps
1. Check browser console for [v0] error messages
2. Check server logs for [v0] error messages
3. Verify user exists in Supabase > users table
4. Verify user status is `active`
5. Verify password is correct

---

## OAuth (Google/GitHub) Not Working

### Google OAuth

**Problem:** Google button does nothing or shows error

**Fix:**
1. In Supabase > Authentication > URL Configuration
2. Add this callback URL:
```
http://localhost:3000/auth/callback
```
(or your production URL for deployed version)

3. In Supabase > Authentication > Providers > Google
4. Make sure it says **"Enabled"**
5. Check that Google OAuth credentials are set

### GitHub OAuth

**Problem:** GitHub button does nothing or shows error

**Fix:**
1. In Supabase > Authentication > URL Configuration
2. Add this callback URL:
```
http://localhost:3000/auth/callback
```

3. In Supabase > Authentication > Providers > GitHub
4. Make sure it says **"Enabled"**
5. Check that GitHub OAuth credentials are set

---

## Navbar Shows "Member" Instead of Actual Role

### Issue
After logging in, navbar shows generic "Member" instead of your actual role or email.

### Solution

#### Step 1: Check that you're logged in
1. Open browser console (F12)
2. Look for `[v0] Token verified for user:` message
3. If you see it, login worked

#### Step 2: Refresh the page
After login, sometimes navbar takes a moment to update:
1. Press F5 to refresh
2. Check navbar again

#### Step 3: Check user data in Supabase
1. Go to Supabase > Table Editor > users
2. Find your email
3. Check that columns are filled:
   - `full_name` - should have your name
   - `role` - should say `member`, `organizer`, or `admin`
   - `status` - should say `active`

#### Step 4: Clear browser cache
1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Click **Clear data**
3. Go back to app and try logging in again

---

## "Token not generated" Error

### Cause
JWT token wasn't created during login.

### Solution
1. Make sure `JWT_SECRET` is set in `.env.local`
2. JWT_SECRET should be any random string, at least 32 characters
3. Generate one: `openssl rand -base64 32`
4. Paste into `.env.local`
5. Restart dev server
6. Try login again

---

## Can't Logout

### Issue
Logout button doesn't work

### Debug
1. Open browser console (F12)
2. Look for error messages
3. Check that logout button is calling `/api/auth/logout`

### Solution
1. Try clearing cookies manually:
   - Open DevTools > Application > Cookies
   - Find cookie named "token"
   - Delete it
   
2. Or try logging in again and logout

---

## General Debugging Tips

### Enable Debug Logging
All auth messages have `[v0]` prefix. To see them:
1. Open browser console (F12)
2. Look for any message with `[v0]`
3. These messages tell you exactly what's happening

### Check All 4 Environment Variables
```bash
# In .env.local, you should have:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=your-random-string-32-chars
```

If any are missing:
1. Add them
2. Restart dev server
3. Try again

### Restart Dev Server
Many issues are fixed by restarting:
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

### Check Network Tab
1. Open DevTools > Network tab
2. Try to signup/login
3. Look for API calls (they should show in the list)
4. Click on each request
5. Check the Response tab for error messages

### Database Access
1. Go to Supabase.com
2. Select your project
3. Click "Table Editor" on left
4. Check the "users" table exists
5. Verify your test data is there

---

## Still Not Working?

If none of these solutions work:

1. **Check the exact error message** - note down the full text
2. **Check browser console** - what does [v0] say?
3. **Check server logs** - what error appears?
4. **Verify all setup steps:**
   - [ ] SQL script ran successfully
   - [ ] All 4 env vars are set
   - [ ] Dev server restarted
   - [ ] Tables exist in Supabase
   
5. **Try a fresh signup:**
   - Use a brand new email address
   - Use password: `Test@12345`
   - Check if it works

6. **Rebuild from scratch:**
   - Stop dev server
   - Delete `.env.local`
   - Follow QUICK_START.md again from step 1

---

## Getting Help

When asking for help, provide:
1. The exact error message you see
2. What you're trying to do (signup/login)
3. Browser console output (F12 > Console)
4. Server log output (terminal running `npm run dev`)
5. Confirmation that SQL script was run
6. Confirmation that all 4 env vars are set

With this info, the issue can be diagnosed quickly.

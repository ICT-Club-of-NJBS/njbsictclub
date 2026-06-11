# Quick Debug Guide - Auth Errors

## When You See an Error Message

### Step 1: Open Browser Console
Press `F12` or `Ctrl+Shift+K` to open developer tools, go to **Console** tab.

### Step 2: Look for [v0] Messages
All our app messages start with **[v0]**. Find and read them:

```
[v0] Signup request: { email: '...', fullName: '...' }
[v0] User created successfully: test@example.com
[v0] Signup exception: ...
```

### Step 3: Match Your Error to the List Below

---

## Error Messages & Fixes

### "Failed to create user account"

**In Console You'll See:**
```
[v0] Signup request: ...
[v0] Signup exception: ...
```

**Quick Fixes:**
1. Check `.env.local` has 4 variables
2. Restart dev server: Stop (Ctrl+C), Start (`npm run dev`)
3. Verify SQL script was run in Supabase
4. Check Supabase > Table Editor > can you see "users" table?

**Try This:**
- Different email address
- Password: `Test@1234`
- Check console for [v0] error message

---

### "Invalid email or password"

**In Console You'll See:**
```
[v0] Login request: { email: '...' }
[v0] Login failed: Invalid email or password
```

**Fixes:**
1. Check user exists in Supabase > Table Editor > users
2. Check password is typed correctly (case-sensitive)
3. Make sure you signed up successfully first

---

### "Missing Supabase configuration"

**In Console You'll See:**
```
Error: Missing Supabase configuration...
```

**Fixes:**
1. Create file: `.env.local` in project root
2. Add all 4 variables (copy from QUICK_START.md)
3. Restart dev server

---

### "Password must be at least 8 characters"

**Fixes:**
Make password longer and include:
- ✓ At least 8 characters
- ✓ At least 1 number (0-9)
- ✓ At least 1 special character (!@#$%^&*)

**Examples that work:**
- `Test@1234`
- `Password123!`
- `SecurePass99#`

---

### "Email already registered"

**Fixes:**
- Use a different email address
- Or delete the old user from Supabase:
  - Go to Supabase > Table Editor > users
  - Find the email row
  - Click trash icon to delete
  - Try signup again

---

### "Token not generated"

**Fixes:**
1. Check `JWT_SECRET` is set in `.env.local`
2. Can be any random string, minimum 32 characters
3. Generate: `openssl rand -base64 32`
4. Paste into `.env.local`
5. Restart dev server

---

### OAuth Button Does Nothing

**Fixes:**
1. Go to Supabase > Authentication > URL Configuration
2. Add this: `http://localhost:3000/auth/callback`
3. Go to Supabase > Authentication > Providers > Google/GitHub
4. Check it says **"Enabled"**
5. Refresh page and try again

---

## Debug Checklist

When something doesn't work, check these in order:

```
[ ] 1. Browser console open (F12)
[ ] 2. [v0] messages visible in console
[ ] 3. All 4 .env.local variables are set
[ ] 4. Dev server restarted after env changes
[ ] 5. Supabase > Table Editor > users table exists
[ ] 6. SQL script was run successfully
[ ] 7. Password has 8+ chars, 1 number, 1 special char
```

If all ✓, restart dev server once more and try again.

---

## Most Common Fixes (In Order)

1. **Restart dev server** (Stop Ctrl+C, Start `npm run dev`)
2. **Check .env.local** (all 4 variables present)
3. **Run SQL script** (in Supabase SQL Editor)
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Check console** (F12 > Console > look for [v0] messages)

---

## Check These 3 Things First

### 1. Environment Variables
```bash
# Should be in .env.local in project root:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=your-random-secret-32-chars
```
If missing → Add them and restart dev server

### 2. Database Tables
```
Supabase > Table Editor > should see:
  ✓ users table
  ✓ events table
  ✓ event_registrations
  ... (and more)
```
If missing → Run SQL script from `/scripts/setup-complete-supabase.sql`

### 3. Console Messages
```
F12 > Console > should see:
  [v0] Signup request:
  [v0] User created successfully:
  [v0] Login request:
  [v0] Login successful:
```
If missing → Check that you're testing on the right page

---

## Testing Flow

### Test Signup (Should Take 30 Seconds)
1. Go to http://localhost:3000/auth/signup
2. Enter email: `test@example.com`
3. Enter password: `Test@1234` (required format)
4. Click create account
5. Should see "success" and redirect to login
6. **Check console for [v0] messages**

### Test Login (Should Take 10 Seconds)
1. Enter email: `test@example.com`
2. Enter password: `Test@1234`
3. Click sign in
4. Should redirect to dashboard
5. **Check console for [v0] Login successful**

### Test Navbar
1. After login, check navbar
2. Should show your email
3. Should show role (member/organizer/admin)
4. Click user menu, should see options

---

## If Nothing Works

Try this in order:

1. **Full restart:**
   - Stop dev server: `Ctrl+C`
   - Delete `.env.local`
   - Read QUICK_START.md again
   - Add .env.local variables
   - Start dev server: `npm run dev`

2. **Check database:**
   - Go to Supabase > SQL Editor
   - Copy ALL from `/scripts/setup-complete-supabase.sql`
   - Create new query and paste
   - Run it
   - Wait for "Success"

3. **Clear everything:**
   - Clear browser cache: `Ctrl+Shift+Delete`
   - Close browser
   - Restart dev server
   - Open in new browser window
   - Try signup again

---

## Getting Help

When you ask for help, provide:

1. **The error message** - Copy exactly what you see
2. **Console output** - Screenshot of F12 Console tab with [v0] messages
3. **Server logs** - What appears in terminal running `npm run dev`
4. **What you did** - Step-by-step what you were trying to do
5. **Environment check** - Are all 4 variables set?

With this info, issue can be fixed quickly.

---

## TL;DR (Super Quick)

Error? Do this:
1. `F12` → Console tab
2. Look for `[v0]` message
3. Match message to list above
4. Apply fix
5. If still broken: restart dev server and try again

---

See full guide: `TROUBLESHOOTING_AUTH.md`

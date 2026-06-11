# Troubleshooting Guide

## Admin Access Issues

### Admin Dashboard Not Appearing

**Symptom:** After logging in with `njbsictclub@gmail.com`, the admin dashboard link doesn't appear in the user menu.

**Solutions:**

1. **Clear Cache and Refresh**
   ```bash
   # Hard refresh in browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   # Or clear browser cache and refresh
   ```

2. **Check User Profile in Database**
   - Open Supabase Dashboard
   - Go to `user_profiles` table
   - Find the row with email `njbsictclub@gmail.com`
   - Check that `role` column = `admin`
   - If not, manually update it to `admin`

3. **Re-login**
   - Sign out completely
   - Close browser
   - Log back in with `njbsictclub@gmail.com`

4. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Report any red error messages

### "Unauthorized" or "Access Denied" Error

**Symptom:** Getting permission errors when trying to access admin features.

**Solutions:**

1. **Verify Role in Database**
   - Supabase → user_profiles table
   - Ensure role = `admin` for your user

2. **Check RLS Policies**
   - In Supabase, go to Authentication → Policies
   - Ensure policies allow admin users
   - Try temporarily disabling RLS for testing

3. **Clear Session**
   - Sign out
   - Close all browser tabs
   - Clear cookies for the domain
   - Log back in

## Database Issues

### Tables Not Found

**Symptom:** "relation does not exist" errors when accessing pages.

**Solutions:**

1. **Run Database Setup Scripts**
   ```bash
   # In Supabase SQL Editor, run:
   # 1. Copy content from scripts/01-initial-schema.sql
   # 2. Copy content from scripts/02-admin-tables.sql
   # 3. Run each SQL script in Supabase console
   ```

2. **Verify Table Structure**
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Run: `SELECT * FROM information_schema.tables WHERE table_schema='public';`
   - Should see: user_profiles, events, projects, event_registrations, attendance_logs, contact_submissions, club_settings

### Data Not Saving

**Symptom:** Changes don't persist after refresh.

**Solutions:**

1. **Check RLS Policies**
   - Supabase → Authentication → Policies
   - Make sure INSERT, UPDATE, DELETE are allowed for your role

2. **Check User ID**
   - Open Supabase console
   - Verify the user ID matches between auth.users and user_profiles

3. **Try Disabling RLS Temporarily**
   - For testing only!
   - Go to each table's RLS section
   - Temporarily enable "Disable RLS for authenticated users"
   - Test if data saves
   - Re-enable RLS after testing

## Login Issues

### Can't Sign Up

**Symptom:** Signup fails with error message.

**Solutions:**

1. **Check Email Format**
   - For admin: must be exactly `njbsictclub@gmail.com`
   - For members: any valid email

2. **Password Requirements**
   - Minimum 6 characters (Supabase default)
   - Passwords must match in signup form

3. **Email Already Registered**
   - If you get "User already exists"
   - Try logging in instead with that email
   - Or sign up with a different email

4. **Check Supabase Email Config**
   - Supabase Dashboard → Authentication → Email
   - Verify email provider is configured (if confirmation emails needed)

### Can't Log In

**Symptom:** Login fails with "Invalid credentials" or similar.

**Solutions:**

1. **Check Email and Password**
   - Email must match exactly (case-insensitive)
   - Password is case-sensitive
   - No extra spaces

2. **Check User Exists**
   - Supabase → Authentication → Users
   - Search for the email address
   - If not there, you haven't signed up yet

3. **Password Reset**
   - On login page, look for "Forgot password?" link
   - Follow password reset process
   - Create new password

4. **Check Email Verification**
   - Supabase might require email confirmation
   - Check email inbox for verification link
   - Some emails might go to spam folder

## Performance Issues

### Slow Page Load

**Solutions:**

1. **Check Network Tab**
   - Open DevTools → Network
   - Identify slow-loading resources
   - Check for failed requests (red X)

2. **Clear Cache**
   - Browser cache might be stale
   - Ctrl+Shift+Delete → Clear browsing data
   - Select "All time" and "Cache"

3. **Check Internet Connection**
   - Open another website to verify connectivity
   - Try on mobile hotspot if WiFi is slow

4. **Check Server Status**
   - Supabase status page: status.supabase.com
   - Vercel status page: status.vercel.com

### Avatar Upload Slow

**Solutions:**

1. **Reduce Image Size**
   - Compress image before uploading
   - Use < 2MB files
   - Recommended: 400x400px PNG/JPG

2. **Check Browser Storage**
   - DevTools → Storage → Clear site data
   - Retry upload

## Theme Issues

### Theme Not Switching

**Symptom:** Dark/Light mode toggle doesn't work.

**Solutions:**

1. **Check localStorage**
   - DevTools → Application → localStorage
   - Look for `theme` key
   - Should have value "light" or "dark"

2. **Clear localStorage**
   - DevTools → Application → localStorage
   - Right-click "localhost" → Clear
   - Refresh page

3. **Check Browser Support**
   - Ensure JS is enabled
   - Try different browser

## Avatar Upload Issues

### Avatar Not Saving

**Solutions:**

1. **Check File Size**
   - Maximum recommended: 2MB
   - Compress large images first

2. **Check File Type**
   - Supported: PNG, JPG, JPEG, WebP
   - No PDF, SVG, or other formats

3. **Check Database**
   - Supabase → user_profiles table
   - Check `avatar_url` column has data
   - If empty, upload failed silently

### Avatar Showing as Broken Image

**Solutions:**

1. **Check URL is Valid**
   - DevTools → Network → find image request
   - Check response status is 200
   - If 404, image isn't stored properly

2. **Re-upload Avatar**
   - Go to Profile page
   - Click camera icon
   - Select new image
   - Wait for upload to complete

## Contact Form Issues

### Messages Not Saving

**Solutions:**

1. **Check contact_submissions Table**
   - Supabase → contact_submissions table
   - Should have new row after form submission

2. **Check Network Request**
   - DevTools → Network
   - Look for POST request to `/api/...`
   - Check response status (should be 200-201)

3. **Check Form Validation**
   - All fields required
   - Email must be valid format
   - Message must have text

4. **Check RLS Policies**
   - contact_submissions table might need "Allow inserts for anonymous"
   - If it's restrictive, messages won't save

## Event Registration Issues

### Can't Register for Events

**Symptom:** Event registration button doesn't work or shows error.

**Solutions:**

1. **Check Event Status**
   - Must be logged in to register
   - Event must not be full (check capacity)
   - Event must not have ended

2. **Check event_registrations Table**
   - Supabase → event_registrations table
   - Verify structure matches schema

3. **Check RLS Policies**
   - Authenticated users should be able to insert into event_registrations
   - May need manual RLS policy update

## API/Integration Issues

### "NEXT_PUBLIC_SUPABASE_URL is missing"

**Solutions:**

1. **Check Environment Variables**
   - Vercel → Settings → Environment Variables
   - Must have:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Restart Dev Server**
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   # Restart picks up new env vars
   ```

3. **Check Variable Names**
   - Spelling must match exactly
   - Must start with NEXT_PUBLIC_ for browser access
   - No extra spaces

### OAuth (Google/GitHub) Not Working

**Solutions:**

1. **Check Supabase Config**
   - Authentication → Providers
   - Google and GitHub providers enabled?
   - Credentials configured?

2. **Check Redirect URLs**
   - Supabase → Authentication → URL Configuration
   - Add your domain to Redirect URLs:
     - Local: `http://localhost:3000/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

3. **Check Provider Credentials**
   - Google: OAuth credentials created in Google Cloud?
   - GitHub: OAuth app created in GitHub settings?
   - Credentials added to Supabase?

## General Tips

### How to Get Help

1. **Check Browser Console (F12)**
   - Open DevTools
   - Go to Console tab
   - Look for error messages in red
   - Copy the full error message

2. **Check Network Tab**
   - DevTools → Network
   - Refresh page
   - Look for failed requests (red X)
   - Check response details

3. **Check Supabase Logs**
   - Supabase Dashboard → Logs
   - Look for error messages
   - Check timestamps around when error occurred

4. **Enable Debug Mode**
   - Set `console.log("[v0]", ...)` in code
   - Check browser console for debug output
   - This helps trace execution flow

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "PGRST116" | Row not found | Data might not exist, check DB |
| "42P01" | Table doesn't exist | Run database setup SQL scripts |
| "42501" | Permission denied | Check RLS policies |
| "Invalid credentials" | Wrong email/password | Verify login details |
| "User already exists" | Email registered | Sign in instead or use different email |
| "CORS error" | Cross-origin issue | Check Supabase configuration |

---

**Still having issues?** Check the ADMIN_SETUP.md and IMPLEMENTATION_COMPLETE.md files for more details.

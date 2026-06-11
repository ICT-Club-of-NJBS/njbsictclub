# Password Verification - Diagnostic Guide

If you're getting "Invalid email or password" even with the correct password, follow this guide to diagnose the issue.

## Step 1: Check the Debug Logs

Open your browser console (F12) and look for messages starting with `[v0]`:

```
[v0] Creating user: test@example.com
[v0] Hashing password for: test@example.com
[v0] Password hashed successfully, hash length: 60
[v0] Inserting user into database
[v0] User created successfully: test@example.com
```

These logs tell you if the signup process completed successfully.

## Step 2: Verify User in Database

Go to Supabase Dashboard:
1. Click **Table Editor** (left sidebar)
2. Select **users** table
3. Look for your user email
4. Check that `password_hash` column has a value (should be 60+ characters starting with `$2a$` or `$2b$`)

If `password_hash` is empty or NULL:
- The password wasn't hashed during signup
- The user was created but can't log in
- **Solution:** See "Fix Missing Password Hash" section below

## Step 3: Check Login Debug Logs

When trying to login, check browser console for:

```
[v0] Authenticating user: test@example.com
[v0] User found: test@example.com password_hash exists: true
[v0] Password verification result: true
[v0] User authenticated successfully: test@example.com
```

or if there's an error:

```
[v0] Authenticating user: test@example.com
[v0] User not found: ...
```

or:

```
[v0] User found: test@example.com password_hash exists: false
[v0] No password hash for user: test@example.com
```

or:

```
[v0] User found: test@example.com password_hash exists: true
[v0] Password verification result: false
[v0] Password mismatch for user: test@example.com
```

## Common Issues & Solutions

### Issue 1: "User not found" error

**Symptom:**
```
[v0] User not found: test@example.com
```

**Causes:**
- Email doesn't exist in database
- Email was mistyped during signup
- Email is case-sensitive and doesn't match exactly

**Solution:**
1. Go to Supabase > Table Editor > users
2. Check that your email exists exactly as you typed it
3. If not there, try signing up again with correct email

### Issue 2: "No password hash" error

**Symptom:**
```
[v0] User found: test@example.com password_hash exists: false
```

**Causes:**
- Password wasn't hashed during signup
- Signup completed but password field was NULL
- Database field doesn't match (`password_hash` vs `password`)

**Solution:**
Go to Supabase SQL Editor and run:

```sql
-- Check the password_hash value for your user
SELECT email, password_hash FROM users WHERE email = 'test@example.com';

-- If password_hash is NULL, delete and re-signup
DELETE FROM users WHERE email = 'test@example.com';
```

Then try signing up again.

### Issue 3: "Password mismatch" error

**Symptom:**
```
[v0] Password verification result: false
[v0] Password mismatch for user: test@example.com
```

**Causes:**
- Password is incorrect (you typed it wrong)
- Password was changed since signup
- Hash was corrupted during storage
- Special characters in password not handled correctly

**Solution:**
1. **Check password requirements:**
   - At least 8 characters
   - At least 1 number
   - At least 1 special character (!@#$%^&*)

2. **Try resetting password:**
   - Use a simple password: `Test@1234`
   - Make sure there are no extra spaces

3. **If still failing, reset the user:**
   ```sql
   DELETE FROM users WHERE email = 'test@example.com';
   ```
   Then sign up again with a simple password.

### Issue 4: Database field name mismatch

**Check that your table has the correct field:**

Go to Supabase > Table Editor > users, and verify you have:
- `password_hash` column (not `password` or `passwordHash`)
- It should be VARCHAR(255) type

If the column name is wrong, either:
1. Rename it in Supabase (right-click column > Edit)
2. Or update the code to use the correct column name

## How to Fix Missing Password Hash

If you have users without password hashes, run this SQL in Supabase:

```sql
-- First, check if there are users without password_hash
SELECT id, email, password_hash FROM users WHERE password_hash IS NULL;

-- Option 1: Delete these users and have them signup again
DELETE FROM users WHERE password_hash IS NULL;

-- Option 2: If you know the password, use this to hash it
-- Replace 'test@example.com' with actual email
-- Replace 'Password123!' with the actual password
UPDATE users 
SET password_hash = crypt('Password123!', gen_salt('bf'))
WHERE email = 'test@example.com';
```

Note: The second option requires PostgreSQL `pgcrypto` extension. If it doesn't work, just delete and signup again.

## Step-by-Step Debug Checklist

1. **Check browser console (F12):**
   - [ ] See [v0] messages?
   - [ ] What do they say?

2. **Check Supabase database:**
   - [ ] User exists in `users` table?
   - [ ] `password_hash` field has a value?
   - [ ] `status` is 'active'?

3. **Test signup:**
   - [ ] Go to `/auth/signup`
   - [ ] Enter email, simple password (Test@1234), name
   - [ ] See success message?
   - [ ] Check console for [v0] messages?

4. **Verify in database:**
   - [ ] Go to Supabase > users table
   - [ ] Find your email
   - [ ] Click on it to see full row
   - [ ] Is `password_hash` filled in? (60+ character string starting with $)
   - [ ] Is `status` = 'active'?

5. **Test login:**
   - [ ] Go to `/auth/login`
   - [ ] Enter same email and password
   - [ ] Check console for [v0] messages
   - [ ] Do you see "Password verification result: true"?

## If All Else Fails

Reset everything and start fresh:

```sql
-- In Supabase SQL Editor:
DELETE FROM users;
DELETE FROM events;
DELETE FROM event_registrations;
DELETE FROM projects;
DELETE FROM team_members;
```

Then:
1. Go to `/auth/signup`
2. Create a test account with simple credentials
3. Check console logs [v0]
4. Report what messages you see

## Getting Help

When asking for help, include:
1. The exact email you're trying to login with
2. The exact password you're using
3. Screenshots of browser console [v0] messages
4. Screenshot of the user row in Supabase (users table)
5. Exact error message from the login form

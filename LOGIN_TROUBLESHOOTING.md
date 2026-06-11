# Login Error Troubleshooting - "Invalid email or password"

Getting "Invalid email or password" even though the password is correct? Follow these steps.

## Quick Diagnosis (5 minutes)

### Step 1: Open Browser Console (F12)

Press **F12** and go to **Console** tab.

Try to login and watch for messages starting with `[v0]`.

**What you should see (successful login):**
```
[v0] Authenticating user: your@email.com
[v0] User found: your@email.com password_hash exists: true
[v0] Password verification result: true
[v0] User authenticated successfully: your@email.com
```

**If you see something different, note the exact message.**

---

## Diagnosis by Error Type

### Error: "User not found"

```
[v0] User not found: your@email.com
```

**This means:** Your email is not in the database.

**Fix:**
1. Make sure you actually signed up
2. Check you're using the same email for login as signup
3. Go to Supabase > Table Editor > users table
4. Search for your email in the table
5. If not there, go to `/auth/signup` and create account again

---

### Error: "No password hash for user"

```
[v0] User found: your@email.com password_hash exists: false
```

**This means:** You exist in database but password wasn't stored.

**Fix:**
1. Go to Supabase > SQL Editor
2. Run this:
   ```sql
   DELETE FROM users WHERE email = 'your@email.com';
   ```
3. Go to `/auth/signup` and create account again
4. Watch console - you should see:
   ```
   [v0] Password hashed successfully, hash length: 60
   ```

---

### Error: "Password mismatch"

```
[v0] Password verification result: false
[v0] Password mismatch for user: your@email.com
```

**This means:** Password is wrong.

**What to try:**

1. **Check password requirements:**
   - Must be 8+ characters
   - Must have 1 number (0-9)
   - Must have 1 special char (!@#$%^&*)

2. **Make sure you're using the EXACT same password:**
   - Check for extra spaces
   - Check CAPS LOCK isn't on
   - Copy password from somewhere safe, paste it in

3. **Use a test password:**
   - Delete user: Go to Supabase > users table, delete your row
   - Signup again with: `Test@1234`
   - Login with: `Test@1234`

4. **If still not working:**
   - Problem might be with password hashing
   - See "Password Hash Issue" section below

---

## Verify User Exists in Database

1. Go to **Supabase Dashboard** (https://supabase.com/dashboard)
2. Click **Table Editor** (left sidebar)
3. Click **users** table
4. Look for your email in the list

### What to check:

- **Column: email** - Should match exactly (test@example.com, not Test@example.com)
- **Column: password_hash** - Should have a long string (60+ characters), should start with `$2a$` or `$2b$`
- **Column: status** - Should be `active`

If `password_hash` is empty or NULL → Your password wasn't saved. See "Fix Password Hash" below.

---

## Fix Password Hash Issue

If the `password_hash` column is empty for your user:

### Option 1: Delete and Re-signup (Easiest)

1. Go to Supabase > Table Editor > users
2. Find your user row
3. Click trash icon to delete
4. Go to `/auth/signup` and create account again
5. Check console - you should see `[v0] Password hashed successfully, hash length: 60`

### Option 2: Manually Hash Password (Advanced)

In Supabase SQL Editor, run:

```sql
-- For a user with empty password_hash
-- Replace values with your info:
UPDATE users 
SET password_hash = crypt('YourPassword123!', gen_salt('bf'))
WHERE email = 'your@email.com';
```

Then try login.

---

## Complete Checklist

- [ ] Email exists in database (Supabase > users table)
- [ ] password_hash field is NOT empty
- [ ] password_hash starts with `$2a$` or `$2b$`
- [ ] status = 'active'
- [ ] Password is 8+ characters
- [ ] Password has at least 1 number
- [ ] Password has at least 1 special character
- [ ] CAPS LOCK is OFF
- [ ] No extra spaces in password
- [ ] Using same email for signup and login
- [ ] Using same password for signup and login

---

## Still Not Working?

1. **Open browser console (F12)**
2. **Try to login**
3. **Copy all `[v0]` messages you see**
4. **Go to Supabase > users table**
5. **Check your user row**

Then provide:
- The [v0] console messages
- Your email address (can mask middle)
- The password you're using (approximate - just tell requirements like "8 chars, 1 number, 1 special")
- Screenshot of your user row in Supabase
- Which version of browser you're using

---

## Test Case: Fresh Account

If you want to test from scratch:

1. **Delete the user:**
   - Go to Supabase > SQL Editor
   - Run: `DELETE FROM users WHERE email = 'test@example.com';`

2. **Signup with test account:**
   - Go to `/auth/signup`
   - Email: `test@example.com`
   - Password: `Test@1234`
   - Name: `Test User`
   - Watch console for [v0] messages
   - Should see: "Account created successfully"

3. **Check database:**
   - Go to Supabase > users table
   - Find `test@example.com`
   - Check `password_hash` has a value

4. **Login:**
   - Go to `/auth/login`
   - Email: `test@example.com`
   - Password: `Test@1234`
   - Watch console for [v0] messages
   - Should see: "User authenticated successfully"

If this test case works, your system is fine and the issue is with your specific account or password.

---

## Password Requirements Reminder

Must have ALL of these:

1. **8+ characters** ✓
2. **At least 1 number** (0-9) ✓
3. **At least 1 special character** (!@#$%^&*) ✓

**Examples that work:**
- `Test@1234` ✓
- `Password123!` ✓
- `MyPass#2025` ✓
- `Secure&Pass1` ✓

**Examples that DON'T work:**
- `test` ✗ (no number, no special char, too short)
- `test1234` ✗ (no special character)
- `Test@@@` ✗ (no number)
- `pass123` ✗ (no special character, no capital letter)

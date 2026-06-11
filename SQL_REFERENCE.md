# SQL Quick Reference for Supabase

Copy and paste the SQL code from `/scripts/setup-complete-supabase.sql` into your Supabase SQL Editor.

## Quick Setup Steps

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy the entire contents of `/scripts/setup-complete-supabase.sql`
5. Paste into the SQL Editor
6. Click "Run" or press Ctrl+Enter
7. Wait for the script to complete (you'll see "Success" message)

## What Gets Created

Running the SQL script will automatically create:

### Tables
- **users** - Main user table with auth info
- **events** - Events table
- **event_registrations** - User event registrations
- **projects** - Projects table
- **team_members** - Team member info
- **attendance** - Event attendance records
- **messages** - Message system
- **message_replies** - Message replies
- **settings** - System settings
- **reset_tokens** - Password reset tokens

### Indexes
- All tables have proper indexes for fast queries
- Unique constraints on key fields

### Default Data
- Admin user placeholder (email: njbsictclub@gmail.com)
- Default settings

## Important Notes

1. **Admin User**: The script creates a placeholder admin. You need to:
   - Sign up through the app, OR
   - Update the password_hash manually

2. **Password Hash**: If updating manually, use bcrypt format:
   ```bash
   # Generate hash (run once, copy the output)
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10).then(hash => console.log(hash))"
   ```

3. **Error Handling**: If the script fails:
   - Check each table was created (go to Table Editor)
   - Drop individual tables that failed and re-run those CREATE TABLE statements
   - Don't drop the entire script

## Testing Your Setup

After running the SQL script, test by:

1. Going to Supabase > Table Editor
2. Clicking on "users" table
3. Seeing the table with columns: id, user_id, email, etc.
4. Trying to insert a test row (optional)

Then test the app:
1. Go to http://localhost:3000/auth/signup
2. Create an account with email/password
3. Verify user appears in the users table
4. Try logging in

## Troubleshooting SQL Errors

### "Relation already exists"
- Tables might already exist from a previous run
- Either: delete the old tables first, or modify the script to use `DROP TABLE IF EXISTS`

### "Invalid syntax"
- Make sure you copied the entire script
- Check that no lines were cut off

### "Permission denied"
- Make sure you're using the Supabase SQL Editor, not a local postgres client
- Ensure you're logged in as the correct user

### "Column does not exist"
- Check you ran the complete script
- Some columns might not have been created if script failed partway through

## Manual Table Creation (If Needed)

If the full script fails, you can create tables individually:

### Users Table Only
```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'organizer', 'admin')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  oauth_provider VARCHAR(50) DEFAULT 'email' CHECK (oauth_provider IN ('email', 'google', 'github')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Then repeat for other tables as needed.

## Backup and Recovery

To backup your data:
1. Supabase > Settings > Backups
2. Click "Create a backup"
3. Downloaded data can be restored later

## Support

- Supabase Docs: https://supabase.com/docs
- SQL Syntax Help: https://www.postgresql.org/docs/
- Check debug logs: `npm run dev`

# Minimal SQL Setup (Copy & Paste)

If you just want to get started quickly, use this minimal SQL for the core authentication to work.

## Step 1: Copy this SQL

Go to Supabase > SQL Editor > New Query, and paste this:

```sql
-- Create users table (required for authentication)
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
  google_id VARCHAR(255),
  github_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  event_type VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Create message replies table
CREATE TABLE IF NOT EXISTS message_replies (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  responder_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (key, value, description)
VALUES 
  ('club_name', 'ICT Club', 'Name of the club'),
  ('club_email', 'njbsictclub@gmail.com', 'Official club email')
ON CONFLICT (key) DO NOTHING;
```

## Step 2: Click Run

Click the "Run" button or press Ctrl+Enter to execute the SQL.

You should see "Success" message at the bottom.

## Step 3: Verify Tables Were Created

1. Go to Supabase > Table Editor (left sidebar)
2. You should see these tables:
   - users
   - events
   - event_registrations
   - messages
   - message_replies
   - settings

## Step 4: Test the Application

1. Start the app: `npm run dev`
2. Go to http://localhost:3000/auth/signup
3. Create an account with:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: Test123!@
4. Click "Create My Account"
5. You should be redirected to login with success message
6. Go to http://localhost:3000/auth/login
7. Login with your email and password
8. Should redirect to dashboard

## What About Other Tables?

This minimal setup includes the core tables needed for:
- User authentication
- Event management
- Event registrations
- Messaging system

To add more features later, run the complete SQL from `scripts/setup-complete-supabase.sql`:

```sql
-- Tables added in complete setup:
-- - projects
-- - team_members
-- - attendance
-- - reset_tokens
-- And more indexes and configurations
```

## Environment Variables

Make sure these are in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_string
```

## If Tables Already Exist

If you see "relation already exists" error:

1. Go to Supabase > Table Editor
2. For each table that exists, click the three-dot menu
3. Select "Delete table"
4. Try running the SQL again

## Troubleshooting

### "Role doesn't exist"
- Make sure you're in the SQL Editor (not a local client)
- Check you're using the right project

### "Failed to authenticate"
- Check your NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Go to Supabase > Settings > API to find the correct key

### "Database does not exist"
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Go to Supabase > Settings > API to find the URL

## Next Steps

1. Setup authentication (see SUPABASE_SETUP.md)
2. Configure OAuth providers
3. Create admin user
4. Add more features

## Complete Setup

For the full setup with all tables, see:
- `scripts/setup-complete-supabase.sql` - Complete SQL
- `SUPABASE_SETUP.md` - Complete setup guide
- `FIXES_SUMMARY.md` - What was fixed and how to test

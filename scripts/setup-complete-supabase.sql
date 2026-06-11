-- ============================================================================
-- NJBS ICT Club - Complete Supabase Database Setup
-- ============================================================================
-- This script sets up all required tables for the club management system.
-- Run this in the Supabase SQL Editor.

-- ============================================================================
-- 1. USERS TABLE (Main user table - synced with Supabase Auth)
-- ============================================================================
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
  qr_code TEXT,
  oauth_provider VARCHAR(50) DEFAULT 'email' CHECK (oauth_provider IN ('email', 'google', 'github')),
  google_id VARCHAR(255),
  github_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================================================
-- 2. EVENTS TABLE
-- ============================================================================
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
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- ============================================================================
-- 3. EVENT REGISTRATIONS TABLE
-- ============================================================================
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
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);

-- ============================================================================
-- 4. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  technologies TEXT,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- ============================================================================
-- 5. TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(255),
  department VARCHAR(255),
  bio TEXT,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_unique_user ON team_members(user_id);

-- ============================================================================
-- 6. ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance(event_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_user_event ON attendance(user_id, event_id);

-- ============================================================================
-- 7. MESSAGES TABLE
-- ============================================================================
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
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- ============================================================================
-- 8. MESSAGE REPLIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_replies (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  responder_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_message_replies_message_id ON message_replies(message_id);
CREATE INDEX IF NOT EXISTS idx_message_replies_responder_id ON message_replies(responder_id);

-- ============================================================================
-- 9. SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================================================
-- 10. PASSWORD RESET TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_code ON reset_tokens(code);

-- ============================================================================
-- 11. INSERT DEFAULT ADMIN USER
-- ============================================================================
-- IMPORTANT: Change the password_hash below!
-- To generate a bcrypt hash, use: bcrypt.hash('your-password', 10)
-- Or use the signup form to create the admin account

INSERT INTO users (
  user_id,
  email,
  password_hash,
  full_name,
  role,
  status,
  oauth_provider
)
VALUES (
  'NJBS-ADMIN-001',
  'njbsictclub@gmail.com',
  '$2a$10$placeholder.hash.will.be.replaced',  -- Replace with actual bcrypt hash
  'ICT Club Admin',
  'admin',
  'active',
  'email'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 12. INSERT DEFAULT SETTINGS
-- ============================================================================
INSERT INTO settings (key, value, description)
VALUES 
  ('club_name', 'ICT Club', 'Name of the club'),
  ('club_email', 'njbsictclub@gmail.com', 'Official club email'),
  ('max_attendance_capacity', '500', 'Maximum members allowed'),
  ('event_registration_enabled', 'true', 'Allow new event registrations')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 13. ENABLE ROW LEVEL SECURITY (RLS) - OPTIONAL BUT RECOMMENDED
-- ============================================================================
-- Uncomment the lines below to enable RLS for security

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (example for users table)
-- CREATE POLICY "Users can view their own profile"
--   ON users FOR SELECT
--   USING (auth.uid()::text = user_id);

-- ============================================================================
-- 14. MIGRATION NOTES
-- ============================================================================
-- After running this script:
-- 1. Go to Supabase > Authentication > Providers
-- 2. Enable "Email" provider with password authentication
-- 3. Enable "Google" OAuth provider with your credentials
-- 4. Enable "GitHub" OAuth provider with your credentials
-- 5. Update the admin user password using the signup form or manually with a bcrypt hash
-- 6. Run the application and test the authentication flow

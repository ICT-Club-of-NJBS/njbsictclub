-- SQL Setup for Admin Panel - Run this in your Supabase SQL Editor

-- 1. CREATE TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE MESSAGES TABLE (if not exists)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE MESSAGE REPLIES TABLE
CREATE TABLE IF NOT EXISTS message_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ADD MISSING COLUMNS TO EXISTING TABLES IF NEEDED

-- Ensure events table has all needed columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS max_registrations INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'upcoming',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Ensure event_registrations table has all needed columns
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) FOR TEAM MEMBERS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert team members" ON team_members
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can update team members" ON team_members
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete team members" ON team_members
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- 7. ENABLE RLS FOR MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can update messages" ON messages
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- 8. ENABLE RLS FOR MESSAGE REPLIES
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view replies" ON message_replies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert replies" ON message_replies
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- DONE! All tables are now set up for your admin panel.

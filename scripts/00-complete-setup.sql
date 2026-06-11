-- Complete Database Setup for ICT Club of NJBS
-- Run this script in your Supabase SQL editor to set up all tables

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'organizer', 'admin')),
  member_id VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(20),
  year_of_study VARCHAR(50),
  department VARCHAR(100),
  skills TEXT,
  social_links JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CLUB SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS club_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name VARCHAR(255) NOT NULL DEFAULT 'ICT Club of NJBS',
  club_email VARCHAR(255) NOT NULL DEFAULT 'sangamkunwar48@gmail.com',
  club_description TEXT,
  club_logo_url VARCHAR(500),
  primary_color VARCHAR(7) DEFAULT '#6366f1',
  secondary_color VARCHAR(7) DEFAULT '#8b5cf6',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  start_date DATE,
  end_date DATE,
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  lead_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. PROJECT MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, member_id)
);

-- ============================================
-- 5. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  image_url VARCHAR(500),
  capacity INTEGER DEFAULT 100,
  event_type VARCHAR(50),
  organizer_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled'))
);

-- ============================================
-- 7. ATTENDANCE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP DEFAULT NOW(),
  check_out_time TIMESTAMP,
  notes TEXT
);

-- ============================================
-- 8. CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER PROFILES RLS POLICIES
-- ============================================
-- Allow users to read all profiles (public)
CREATE POLICY "Allow public read" ON user_profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow user update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to do everything
CREATE POLICY "Allow admin full access" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PROJECTS RLS POLICIES
-- ============================================
-- Allow anyone to read projects
CREATE POLICY "Allow public read projects" ON projects
  FOR SELECT USING (true);

-- Allow admins to create, update, delete projects
CREATE POLICY "Allow admin full access projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- EVENTS RLS POLICIES
-- ============================================
-- Allow anyone to read events
CREATE POLICY "Allow public read events" ON events
  FOR SELECT USING (true);

-- Allow admins to create, update, delete events
CREATE POLICY "Allow admin full access events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- EVENT REGISTRATIONS RLS POLICIES
-- ============================================
-- Allow anyone to read registrations
CREATE POLICY "Allow public read registrations" ON event_registrations
  FOR SELECT USING (true);

-- Allow users to register for events
CREATE POLICY "Allow user register events" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins to manage all registrations
CREATE POLICY "Allow admin full access registrations" ON event_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CONTACT SUBMISSIONS RLS POLICIES
-- ============================================
-- Allow anyone to create submissions
CREATE POLICY "Allow public create submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow admins to read and update
CREATE POLICY "Allow admin read submissions" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin update submissions" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_lead_id ON projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_member_id ON project_members(member_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_event_id ON attendance_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_user_id ON attendance_logs(user_id);

-- ============================================
-- SEED DATA
-- ============================================
-- Insert club settings
INSERT INTO club_settings (club_name, club_email, club_description, primary_color, secondary_color)
VALUES (
  'ICT Club of NJBS',
  'sangamkunwar48@gmail.com',
  'Innovation, Creativity, and Technology Club - Inspiring the next generation of tech leaders',
  '#6366f1',
  '#8b5cf6'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Your database is now ready for the ICT Club of NJBS portal!
-- All tables have been created with proper RLS policies and indexes.

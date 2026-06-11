-- ============================================
-- SIMPLE DATABASE SETUP FOR ICT CLUB
-- Copy and paste this into Supabase SQL Editor
-- ============================================

-- 1. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  start_date DATE,
  end_date DATE,
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CREATE EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INTEGER DEFAULT 100,
  event_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. CREATE TEAM TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  bio TEXT,
  image_url VARCHAR(500),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. ENABLE RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES FOR PROJECTS
CREATE POLICY "Allow public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow all for projects" ON projects
  FOR ALL USING (true);

-- 6. CREATE RLS POLICIES FOR EVENTS
CREATE POLICY "Allow public read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Allow all for events" ON events
  FOR ALL USING (true);

-- 7. CREATE RLS POLICIES FOR TEAM
CREATE POLICY "Allow public read team" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Allow all for team" ON team_members
  FOR ALL USING (true);

-- 8. CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_team_email ON team_members(email);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Tables: projects, events, team_members
-- All tables ready for CRUD operations!

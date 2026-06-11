-- Create club_settings table
CREATE TABLE IF NOT EXISTS club_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name VARCHAR(255) NOT NULL,
  club_email VARCHAR(255) NOT NULL,
  club_description TEXT,
  club_logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create extended profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  member_id VARCHAR(50) UNIQUE,
  avatar_url VARCHAR(500),
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

-- Rename existing tables if needed (projects)
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  start_date DATE,
  end_date DATE,
  technologies JSONB,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  lead_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project team members join table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, member_id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  image_url VARCHAR(500),
  capacity INTEGER,
  event_type VARCHAR(50),
  organizer_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public read club_settings" ON club_settings FOR SELECT USING (true);
CREATE POLICY "Public read user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);

-- RLS Policies for authenticated users
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for admin
CREATE POLICY "Admin can manage all profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage registrations" ON event_registrations FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

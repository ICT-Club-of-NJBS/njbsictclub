-- Attendance tracking table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP DEFAULT NOW(),
  check_out_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'left_early')),
  notes TEXT,
  marked_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Member attendance summary
CREATE TABLE IF NOT EXISTS member_attendance_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_events INTEGER DEFAULT 0,
  total_attended INTEGER DEFAULT 0,
  total_absent INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2) DEFAULT 0,
  last_attendance_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  replied_at TIMESTAMP,
  reply_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_attendance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance
CREATE POLICY "Public read attendance summary" ON member_attendance_summary FOR SELECT USING (true);
CREATE POLICY "Admin manage attendance" ON attendance_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin manage attendance summary" ON member_attendance_summary FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS for contact submissions
CREATE POLICY "Anyone can submit contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read contact" ON contact_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update contact" ON contact_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

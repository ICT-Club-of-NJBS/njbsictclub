-- Insert club settings
INSERT INTO club_settings (club_name, club_email, club_description, primary_color, secondary_color)
VALUES (
  'ICT Club of NJBS',
  'njbsictclub@gmail.com',
  'Innovation, Creativity, and Technology Club - Inspiring the next generation of tech leaders',
  '#6366f1',
  '#8b5cf6'
) ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, event_date, location, event_type, capacity)
VALUES 
  ('Web Development Workshop', 'Learn modern web development with React and Node.js', NOW() + INTERVAL '7 days', 'Main Hall', 'workshop', 50),
  ('Monthly Tech Talk', 'Discussion on emerging technologies in AI and ML', NOW() + INTERVAL '14 days', 'Auditorium', 'talk', 100),
  ('Hackathon 2025', 'Build innovative solutions in 24 hours', NOW() + INTERVAL '30 days', 'Campus', 'hackathon', 200)
ON CONFLICT DO NOTHING;

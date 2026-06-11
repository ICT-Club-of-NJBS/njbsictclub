-- Seed sample projects
INSERT INTO projects (title, description, image_url, status, tech_stack, link) VALUES
('AI Research Hub', 'Collaborative research on AI ethics and safety', '/api/placeholder?w=400&h=300', 'ongoing', ARRAY['Python', 'TensorFlow', 'Research'], 'https://example.com/ai-hub'),
('Web Framework', 'High-performance web framework for modern applications', '/api/placeholder?w=400&h=300', 'ongoing', ARRAY['TypeScript', 'React', 'Node.js'], 'https://example.com/framework'),
('Design System', 'Comprehensive design system and component library', '/api/placeholder?w=400&h=300', 'completed', ARRAY['React', 'Tailwind', 'Design'], 'https://example.com/design-system'),
('Community App', 'Mobile app for community collaboration', '/api/placeholder?w=400&h=300', 'planning', ARRAY['React Native', 'Firebase', 'UI/UX'], 'https://example.com/community-app'),
('Data Viz', 'Interactive data visualization library', '/api/placeholder?w=400&h=300', 'ongoing', ARRAY['D3.js', 'TypeScript', 'WebGL'], 'https://example.com/data-viz')
ON CONFLICT DO NOTHING;

-- Seed sample events
INSERT INTO events (title, description, image_url, date, location, type, capacity) VALUES
('Monthly Salon Meetup', 'Casual gathering for members to share ideas and network', '/api/placeholder?w=400&h=300', NOW() + INTERVAL '7 days', 'The Salon Space', 'meeting', 50),
('AI Workshop', 'Hands-on workshop on machine learning applications', '/api/placeholder?w=400&h=300', NOW() + INTERVAL '14 days', 'The Salon Space', 'workshop', 30),
('Design Talk', 'Guest speaker discussing design trends and practices', '/api/placeholder?w=400&h=300', NOW() + INTERVAL '21 days', 'Virtual', 'presentation', 100),
('Hackathon', '24-hour hackathon for members to build and innovate', '/api/placeholder?w=400&h=300', NOW() + INTERVAL '30 days', 'The Salon Space', 'social', 40)
ON CONFLICT DO NOTHING;

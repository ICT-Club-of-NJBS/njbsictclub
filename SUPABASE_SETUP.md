# Supabase Setup Guide for ICT Club App

This guide will help you set up your Supabase database and authentication for the ICT Club application.

## Prerequisites

1. Supabase account (https://supabase.com)
2. Your Supabase project URL and API keys
3. Environment variables configured in your `.env.local` file

## Step 1: Set Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here
```

To find these values:
1. Go to Supabase Dashboard
2. Click your project
3. Settings > API
4. Copy the URL and "anon" key
5. Copy the "service_role" key from the same page
6. Generate a JWT_SECRET: `openssl rand -base64 32` or use any secure random string

## Step 2: Create Database Tables

Go to Supabase Dashboard > SQL Editor and run the SQL code from:
- `/scripts/setup-complete-supabase.sql` - Complete schema with all tables

This will create:
- users (main user table)
- events (event management)
- event_registrations (user event registrations)
- projects (project management)
- team_members (team information)
- attendance (event attendance tracking)
- messages (messaging system)
- message_replies (message replies)
- settings (system settings)
- reset_tokens (password reset tokens)

## Step 3: Enable Authentication

### Email/Password Authentication
1. Go to Supabase Dashboard > Authentication > Providers
2. Find "Email" in the list
3. Toggle "Email" ON
4. In the Email Provider settings:
   - Enable "Confirm email" if you want email verification
   - You can leave it OFF for development

### Google OAuth
1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret
6. In Supabase Dashboard > Authentication > Providers > Google:
   - Paste Client ID and Client Secret
   - Toggle ON

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App:
   - Application name: ICT Club
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret
4. In Supabase Dashboard > Authentication > Providers > GitHub:
   - Paste Client ID and Client Secret
   - Toggle ON

## Step 4: Configure Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:

Add these redirect URLs:
```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

## Step 5: Create Admin User

Option 1: Using the Signup Form (Recommended)
1. Run the application: `npm run dev`
2. Go to http://localhost:3000/auth/signup
3. Sign up with: `njbsictclub@gmail.com`
4. Complete the signup form

Option 2: Manually in Database
1. Go to Supabase > Table Editor > users
2. Insert a new row:
   - user_id: `NJBS-ADMIN-001`
   - email: `njbsictclub@gmail.com`
   - password_hash: (generate using bcrypt)
   - full_name: `ICT Club Admin`
   - role: `admin`
   - status: `active`
   - oauth_provider: `email`

To generate a bcrypt hash, you can use Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10).then(hash => console.log(hash))"
```

## Step 6: Test Authentication

1. Go to http://localhost:3000/auth/signup
2. Try signing up with email/password
3. Go to http://localhost:3000/auth/login
4. Try logging in with the credentials you just created
5. Try Google and GitHub OAuth

## Troubleshooting

### "Failed to fetch" Error
**Problem:** Getting "Failed to fetch" when signing up/logging in with email/password

**Solution:**
1. Check that all environment variables are set correctly
2. Verify the backend API is running (check console for errors)
3. Check browser console for specific error messages
4. Ensure CORS is configured properly in your backend

### OAuth Not Working
**Problem:** OAuth buttons don't redirect or redirect to wrong URL

**Solution:**
1. Verify callback URL is correct in Supabase > Authentication > URL Configuration
2. Check that OAuth provider credentials are correct
3. Ensure redirect URI in OAuth provider settings matches Supabase setting

### Users Can't Login
**Problem:** Email/password login fails even with correct credentials

**Solution:**
1. Verify user exists in users table
2. Check that password_hash is correctly set (should start with $2a$, $2b$, or $2y$ for bcrypt)
3. Verify user status is 'active'
4. Check API response in browser Network tab for specific error

### Admin Privileges Not Working
**Problem:** Admin features not accessible

**Solution:**
1. Verify user role is 'admin' in users table
2. Check JWT token includes role (login and check Network tab)
3. Ensure middleware is checking role correctly

## Database Schema Summary

### users Table
- id: Primary key (auto-increment)
- user_id: Unique NJBS ID (NJBS-XXXXX)
- email: User email (unique)
- password_hash: Bcrypt hashed password
- full_name: User's full name
- phone: Phone number
- avatar: Profile picture URL
- role: member/organizer/admin
- status: active/inactive
- oauth_provider: email/google/github
- created_at: Account creation timestamp
- updated_at: Last update timestamp

### Other Tables
See `setup-complete-supabase.sql` for complete schema details

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `GET /api/admin/events` - List events
- `POST /api/admin/events` - Create event
- And more... (see API documentation)

## Next Steps

1. Test authentication flow thoroughly
2. Create team members and assign roles
3. Create events and test registration
4. Set up email notifications (optional)
5. Deploy to production

## Support

For Supabase-specific issues, visit: https://supabase.com/docs
For app-specific issues, check the debug logs: `npm run dev`

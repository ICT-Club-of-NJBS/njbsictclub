# Database Setup Guide for ICT Club Portal

## Overview
This guide walks you through setting up all the required database tables and Row Level Security (RLS) policies for the ICT Club of NJBS portal.

## What Gets Created
✅ user_profiles - User information and roles
✅ club_settings - Club configuration
✅ projects - Project management
✅ project_members - Project team members
✅ events - Event management
✅ event_registrations - Event registration tracking
✅ attendance_logs - Event attendance logs
✅ contact_submissions - Contact form submissions

## Setup Instructions

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" from the left sidebar
3. Click "New Query"

### Step 2: Copy and Run the Setup Script
1. Open `/scripts/00-complete-setup.sql` from the project
2. Copy the entire SQL script
3. Paste it into the Supabase SQL editor
4. Click "Run"

The script will:
- Create all 8 tables
- Enable Row Level Security (RLS) on all tables
- Set up RLS policies for security
- Create performance indexes
- Insert default club settings

### Step 3: Verify Tables Were Created
In Supabase Dashboard:
1. Go to "Tables" section
2. You should see these tables:
   - user_profiles
   - club_settings
   - projects
   - project_members
   - events
   - event_registrations
   - attendance_logs
   - contact_submissions

## Table Descriptions

### user_profiles
Stores user account information
- id: UUID (references auth.users)
- full_name: Text
- email: Text
- role: 'member' | 'organizer' | 'admin'
- member_id: Unique identifier
- avatar_url: Profile picture
- bio, phone, department, skills, etc.

### club_settings
Stores club configuration
- club_name: 'ICT Club of NJBS'
- club_email: 'sangamkunwar48@gmail.com'
- club_description: About the club
- primary_color, secondary_color: Hex colors

### projects
Stores club projects
- id: UUID
- name: Project name
- description: Project details
- status: 'planning' | 'ongoing' | 'completed'
- technologies: Array of tech stack
- github_url, demo_url: Links
- start_date, end_date: Project timeline

### events
Stores club events
- id: UUID
- title: Event name
- description: Details
- event_date: When the event is
- location: Where it's held
- capacity: Max attendees
- event_type: 'workshop' | 'webinar' | 'meetup' | 'hackathon' | 'conference'

### event_registrations
Tracks who registered for events
- event_id: References events
- user_id: References auth.users
- status: 'registered' | 'attended' | 'cancelled'

### attendance_logs
Detailed attendance records
- event_id, user_id
- check_in_time, check_out_time
- notes: Admin notes

### contact_submissions
Contact form submissions
- name, email, subject, message
- status: 'new' | 'read' | 'replied' | 'closed'

## RLS Policies Explained

### Who Can Do What?

**Public (Everyone):**
- ✅ Read all profiles
- ✅ Read all projects
- ✅ Read all events
- ✅ Submit contact form

**Users (Logged In):**
- ✅ Edit their own profile
- ✅ Register for events
- ✅ View own registrations

**Admins (sangamkunwar48@gmail.com):**
- ✅ Full access to everything
- ✅ Create/edit/delete projects
- ✅ Create/edit/delete events
- ✅ Create/edit/delete members
- ✅ View/manage contact submissions
- ✅ View attendance records

## Admin Dashboard Features

### Members Tab
✅ View all members
✅ Create new members
✅ Edit member info (name, email, role, department, year)
✅ Delete members

### Projects Tab
✅ View all projects with status
✅ Create new project
✅ Edit project details
✅ Add technologies
✅ Link GitHub/demo URLs
✅ Delete project

### Events Tab
✅ View all events with dates
✅ Create new event
✅ Set date, time, location, capacity
✅ Edit event details
✅ Delete event
✅ Track registrations

## Troubleshooting

### Tables Don't Appear
- Make sure you ran the complete SQL script
- Check for error messages in Supabase SQL editor
- Try refreshing the page

### RLS Policies Are Blocking Access
- Ensure user has 'admin' role in user_profiles
- Check that email is 'sangamkunwar48@gmail.com' for admin access
- Verify RLS is enabled but not too restrictive

### Can't Create/Edit Data
- Verify you're logged in as admin
- Check database RLS policies
- Look at browser console for error details

## Next Steps

1. ✅ Run the SQL setup script
2. ✅ Verify tables exist
3. ✅ Log in as admin (sangamkunwar48@gmail.com)
4. ✅ Visit /admin dashboard
5. ✅ Start creating projects, events, and managing team members

All features should now be fully functional!

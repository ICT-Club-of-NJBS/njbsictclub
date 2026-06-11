# Admin Management System Setup Guide

## Overview

This document explains how to set up and use the admin management system for the NJBS ICT Club application. The system is built with Supabase as the backend database and provides comprehensive management tools for users, events, projects, team members, attendance tracking, and messaging.

## Initial Setup

### 1. Database Setup

The Supabase database schema is defined in `scripts/setup-supabase.sql`. This file contains:

- **users** - User accounts with roles (member, organizer, admin)
- **events** - Club events and meetings
- **projects** - Active projects
- **team_members** - Team member profiles
- **attendance** - Event attendance tracking
- **messages** - Contact form and messaging
- **message_replies** - Replies to messages
- **settings** - System configuration
- **reset_tokens** - Password reset tokens

### 2. Admin User Creation

An admin user is pre-configured with:
- **Email**: `njbsictclub@gmail.com`
- **User ID**: `NJBS-ADMIN-001`
- **Role**: `admin`
- **Status**: `active`

**Important**: The password is set to a placeholder during schema initialization. You must:

1. Use the forgot-password flow to set a real password:
   - Request password reset with `njbsictclub@gmail.com`
   - Use the reset code sent to initialize the password
   
2. Or directly update the password hash in Supabase:
   ```sql
   UPDATE users SET password_hash = '$2a$10$...' WHERE email = 'njbsictclub@gmail.com';
   ```

### 3. Environment Variables

Configure these Supabase credentials in your `.env.local` or Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_for_tokens
```

## Admin Features

### Dashboard Overview

The admin dashboard (`/admin`) provides:

- **Stats Cards** - Total members, events, projects, and messages
- **Tabbed Interface** - Quick navigation between management sections

### Management Sections

#### 1. Members Management

Manage all registered club members:
- View all member accounts with email, phone, and role
- Create new members with temporary passwords
- Update member roles (member, organizer, admin)
- Change member status (active, inactive)
- Delete members from the system

**API Endpoints:**
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

#### 2. Events Management

Organize and manage club events:
- Create new events with date, location, and capacity
- View all upcoming and past events
- Track event registrations
- Update event details
- Cancel events
- Manage attendance records

**API Endpoints:**
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `GET /api/admin/events/[id]` - Get event details
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event
- `GET /api/admin/events/[id]/registrations` - View registrations
- `PUT /api/admin/events/[id]/registrations` - Update registration status
- `GET /api/admin/attendance` - View all attendance records

#### 3. Projects Management

Track active club projects:
- Create and manage projects
- Track project status (active, completed, on-hold)
- Add project technologies and links
- Assign team members to projects
- Monitor project progress

**API Endpoints:**
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/[id]` - Get project details
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

#### 4. Team Management

Manage team member profiles:
- Create team member profiles
- Assign positions and departments
- Add member bios and social media links
- View team hierarchy
- Manage team lead assignments

**API Endpoints:**
- `GET /api/admin/team` - List all team members
- `POST /api/admin/team` - Create team member
- `GET /api/admin/team/[id]` - Get team member details
- `PUT /api/admin/team/[id]` - Update team member
- `DELETE /api/admin/team/[id]` - Delete team member

#### 5. Attendance Tracking

Monitor attendance at club events:
- View attendance records by event
- Mark members as present, absent, or late
- Generate attendance reports
- Track member participation

**API Endpoints:**
- `GET /api/admin/attendance` - List all attendance records
- `POST /api/admin/attendance` - Create attendance record

#### 6. Messages Management

Handle contact form submissions and communications:
- View incoming messages from contacts
- Mark messages as read/unread
- Send replies to messages (with optional email notification)
- Delete messages
- Filter by status

**API Endpoints:**
- `GET /api/admin/messages` - List messages
- `POST /api/admin/messages` - Create message
- `GET /api/admin/messages/[id]` - Get message details
- `PUT /api/admin/messages/[id]` - Update message
- `DELETE /api/admin/messages/[id]` - Delete message
- `POST /api/admin/messages/[id]/reply` - Send reply

#### 7. Settings Management

Configure system settings:
- Club name and official email
- Capacity and limit settings
- System configuration
- Feature toggles

**API Endpoints:**
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings` - Update settings

#### 8. Dashboard Statistics

Real-time statistics:
- Total members count
- Total events count
- Active projects count
- Pending messages count

**API Endpoint:**
- `GET /api/admin/stats` - Get dashboard statistics

## Authentication & Authorization

### Admin-Only Routes

All admin routes are protected by the `requireAdmin` middleware:

```typescript
export async function GET(req: NextRequest) {
  return requireAdmin(async (req: NextRequest) => handler(req))(req)
}
```

This ensures:
1. User must be authenticated (valid JWT token)
2. User must have `role = 'admin'`
3. Unauthorized users receive 401 (Unauthorized) or 403 (Forbidden) responses

### User Roles

- **member** - Regular club member (can register for events)
- **organizer** - Can create and manage events
- **admin** - Full system access (njbsictclub@gmail.com)

### JWT Token Authentication

Users authenticate via `/api/auth/login` which returns a JWT token stored in a secure HTTP-only cookie. The token contains:
- User ID
- Email
- Role
- Expiration (7 days default)

## API Usage Examples

### Create a New User

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "newuser@example.com",
    "fullName": "New User",
    "phone": "123-456-7890",
    "role": "member"
  }'
```

### Create an Event

```bash
curl -X POST http://localhost:3000/api/admin/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Monthly Meetup",
    "description": "Regular club meetup",
    "eventDate": "2026-06-15T18:00:00Z",
    "location": "Club Room",
    "capacity": 50
  }'
```

### Send Message Reply

```bash
curl -X POST http://localhost:3000/api/admin/messages/[messageId]/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "replyText": "Thank you for your message. We will get back to you soon."
  }'
```

## Database Schema Reference

### Users Table

```sql
Column                Type        Description
id                   BIGINT      Primary key
user_id              VARCHAR     Unique user ID (NJBS-YYYYMMDDHHMMSS)
email                VARCHAR     Unique email address
password_hash        VARCHAR     Bcrypt hashed password
full_name            VARCHAR     User's full name
phone                VARCHAR     Contact phone number
role                 VARCHAR     member, organizer, admin
status               VARCHAR     active, inactive
created_at           TIMESTAMP   Account creation time
updated_at           TIMESTAMP   Last update time
```

### Events Table

```sql
Column                Type        Description
id                   BIGINT      Primary key
title                VARCHAR     Event name
description          TEXT        Event details
event_date           TIMESTAMP   Event date and time
location             VARCHAR     Event location
capacity             INTEGER     Max attendees
event_type           VARCHAR     Type of event
image_url            VARCHAR     Event poster/image
created_at           TIMESTAMP   Creation time
updated_at           TIMESTAMP   Last update time
```

## Troubleshooting

### Admin Login Issues

If the admin account isn't working:

1. Check if the user exists:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'njbsictclub@gmail.com';
   ```

2. Verify the password hash:
   ```sql
   SELECT id, password_hash FROM users WHERE email = 'njbsictclub@gmail.com';
   ```

3. Reset the password using the forgot-password flow

### API Returns 401 Unauthorized

- Check if JWT token is valid and not expired
- Verify token is sent in Authorization header: `Authorization: Bearer YOUR_TOKEN`
- Verify user role is 'admin'

### API Returns 403 Forbidden

- User is authenticated but doesn't have admin role
- Check user role in database:
  ```sql
  SELECT email, role FROM users WHERE id = YOUR_USER_ID;
  ```

### Messages Not Sending

- Verify email configuration (RESEND_API_KEY or SENDGRID_API_KEY)
- Check message reply logs in server console
- Ensure sender email address is valid

## Support

For issues or questions about the admin system, contact njbsictclub@gmail.com or refer to the Supabase documentation at https://supabase.com/docs.

# NJBS ICT Club - Quick Start (Supabase)

## ⚡ Setup in 3 Steps

### Step 1: Create Supabase Tables

1. Go to https://app.supabase.com → Open your project
2. Click **"SQL Editor"** from left sidebar
3. Click **"New Query"**
4. **Copy and paste ALL of this code**, then click **"Run"**:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS public.reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON public.reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_code ON public.reset_tokens(code);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(500),
  image_url VARCHAR(500),
  max_registrations INTEGER,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

-- Event registrations (WITH NAME, EMAIL, PHONE, MESSAGE)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Members projects
CREATE TABLE IF NOT EXISTS public.members_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_projects_user_id ON public.members_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_members_projects_project_id ON public.members_projects(project_id);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'announcement',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
```

**✅ If you see "Success" - great! Continue to Step 2**

### Step 2: Create Admin User

Still in SQL Editor, **run this code** to create the admin account:

```sql
INSERT INTO public.users (user_id, email, password_hash, full_name, role, status)
VALUES (
  'NJBS-' || to_char(NOW(), 'YYYYMMDDHH24MISS'),
  'sangamkunwar48@gmail.com',
  '$2b$10$bNuqLw0iW7A2ov4RLVI6gu7.cjJuJ0FbGKBRN6dRSJ.7QqX1T8/Q2',
  'Admin User',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING;
```

**Admin Credentials:**
```
Email: sangamkunwar48@gmail.com
Password: Admin@123
```

⚠️ **Change this password after first login!**

### Step 3: Set Environment Variables

Your Supabase credentials are already in Vercel/your project. Just verify they exist in your environment.

**If you're running locally, add to `.env.local`:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
```

Get these from Supabase → Project Settings → API

---

## 🚀 Run It!

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📋 What You Get

✅ **User Registration** - Sign up with email/password  
✅ **User Login** - Secure authentication  
✅ **Password Reset** - 6-digit code verification  
✅ **Event Registration** - Users register with name, email, phone, message  
✅ **Admin Dashboard** - View all registrations and messages  
✅ **QR Code Generation** - Each member gets a unique QR code  
✅ **Role Management** - Assign member/admin/moderator roles

---

## 🎯 Test It

**1. Signup:** Go to `/auth/signup` and create a test account

**2. Create Event:** Login as admin and go to `/admin` → Events tab → Create Event

**3. Register for Event:** Find event, click "Register" and fill:
   - Name
   - Email
   - Phone
   - Message (optional)

**4. View Registrations:** Admin panel → Events → Click event → See all registrations with messages

---

## ❌ If You Get "Could not find the table 'public.users'"

This means the tables weren't created:
1. Go back to Step 1
2. Go to Supabase SQL Editor
3. Make sure you ran the CREATE TABLE code
4. Refresh your app after

---

## 🔗 Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/auth/login` | Login page |
| `/auth/signup` | Sign up page |
| `/admin` | Admin dashboard |
| `/api/auth/login` | Login endpoint |
| `/api/auth/signup` | Signup endpoint |
| `/api/events/[id]/register` | Register for event |
| `/api/admin/events/[id]/registrations` | View all registrations |

---

## ✅ Quick Checklist

- [ ] Created all tables in Supabase
- [ ] Created admin user
- [ ] Can login with admin credentials
- [ ] Can create event in admin panel
- [ ] Can register for event
- [ ] Can see registration with message in admin panel
- [ ] Email/password reset works

---

## 📚 Full Documentation

For detailed info, see:
- `SETUP_GUIDE.md` - Complete setup instructions
- `TROUBLESHOOTING.md` - Common issues and fixes

---

**You're all set!** 🎉

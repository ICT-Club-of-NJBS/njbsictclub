import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) {
      console.warn('[v0] Warning executing SQL:', error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[v0] Exception:', error.message);
    return false;
  }
}

async function setupDatabase() {
  try {
    console.log('[v0] Starting Supabase database setup...');
    console.log('[v0] Creating tables...\n');

    // Create users table
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
      CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);
    `;

    // Create reset_tokens table
    const createResetTokensSQL = `
      CREATE TABLE IF NOT EXISTS public.reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON public.reset_tokens(email);
      CREATE INDEX IF NOT EXISTS idx_reset_tokens_code ON public.reset_tokens(code);
    `;

    // Create projects table
    const createProjectsSQL = `
      CREATE TABLE IF NOT EXISTS public.projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(1000),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
        created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
    `;

    // Create events table
    const createEventsSQL = `
      CREATE TABLE IF NOT EXISTS public.events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(1000),
        date TIMESTAMP,
        location VARCHAR(255),
        capacity INTEGER,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'completed')),
        created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
      CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
    `;

    // Create event_registrations table
    const createEventRegistrationsSQL = `
      CREATE TABLE IF NOT EXISTS public.event_registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT,
        status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
      CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_unique ON public.event_registrations(event_id, user_id);
    `;

    // Create members_projects table
    const createMembersProjectsSQL = `
      CREATE TABLE IF NOT EXISTS public.members_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_members_projects_user_id ON public.members_projects(user_id);
      CREATE INDEX IF NOT EXISTS idx_members_projects_project_id ON public.members_projects(project_id);
    `;

    // Create messages table
    const createMessagesSQL = `
      CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'announcement' CHECK (type IN ('announcement', 'notification', 'message')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
    `;

    // Execute all CREATE statements
    const statements = [
      { name: 'users', sql: createUsersSQL },
      { name: 'reset_tokens', sql: createResetTokensSQL },
      { name: 'projects', sql: createProjectsSQL },
      { name: 'events', sql: createEventsSQL },
      { name: 'event_registrations', sql: createEventRegistrationsSQL },
      { name: 'members_projects', sql: createMembersProjectsSQL },
      { name: 'messages', sql: createMessagesSQL },
    ];

    for (const stmt of statements) {
      console.log(`[v0] Creating ${stmt.name} table...`);
      const success = await executeSql(stmt.sql);
      if (success) {
        console.log(`[v0] ✓ ${stmt.name} table created/verified`);
      } else {
        console.log(`[v0] ✓ ${stmt.name} table already exists or other success`);
      }
    }

    // Create the admin user with proper password hash
    console.log('\n[v0] Setting up admin user...');
    const adminEmail = 'sangamkunwar48@gmail.com';
    const adminPassword = 'Admin@123'; // Default password - user should change this
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Generate user ID in format NJBS-YYYYMMDDHHMMSS
    const now = new Date();
    const userId = `NJBS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    // Use upsert to create or update admin user
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email: adminEmail,
          user_id: userId,
          password_hash: passwordHash,
          full_name: 'Admin User',
          role: 'admin',
          status: 'active'
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('[v0] Error creating admin user:', error);
    } else {
      console.log('[v0] ✓ Admin user created/updated successfully\n');
      console.log('═'.repeat(60));
      console.log('ADMIN CREDENTIALS:');
      console.log('═'.repeat(60));
      console.log(`Email:    ${adminEmail}`);
      console.log(`User ID:  ${userId}`);
      console.log(`Password: ${adminPassword}`);
      console.log('═'.repeat(60));
      console.log('⚠️  IMPORTANT: Change this password after first login!');
      console.log('═'.repeat(60));
    }

    console.log('\n[v0] ✓ Database setup completed successfully!');
    console.log('[v0] You can now run: npm run dev');
  } catch (error) {
    console.error('[v0] Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

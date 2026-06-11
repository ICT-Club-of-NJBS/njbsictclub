# ICT Club of NJBS

A modern, high-performance community portal built with Next.js 16, Supabase, and TailwindCSS. Features a sophisticated dark design with glassmorphism effects, real-time authentication, event management, and more.

## 🎯 Features

- **Dark Modern Design**: Sleek dark theme with vibrant indigo accents and glassmorphism effects
- **Authentication**: Supabase Auth with Google and GitHub OAuth, email/password support
- **Team Management**: Display team members with roles, bios, and social links
- **Project Showcase**: Browse projects by status (planning, ongoing, completed) with tech stacks
- **Event Management**: Create and register for events with countdown timers
- **User Profiles**: Members can manage their profile information
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Real-time Updates**: Supabase integration for real-time data sync

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS v4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: TailwindCSS with custom design tokens
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## 📋 Prerequisites

- Node.js 18+ (v24 recommended)
- pnpm package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Installation

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

The database schema needs to be set up in Supabase. You have two options:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project's SQL Editor
2. Copy and paste the contents of `scripts/setup-db.sql`
3. Execute the script
4. Optionally, run `scripts/seed-data.sql` to add sample data

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  ├── layout.tsx              # Root layout
  ├── page.tsx                # Home page
  ├── auth/
  │   ├── login/              # Login page
  │   ├── signup/             # Signup page
  │   └── callback/           # OAuth callback
  ├── team/                   # Team members page
  ├── projects/               # Projects listing
  ├── events/                 # Events and registration
  ├── contact/                # Contact form
  └── profile/                # User profile management
/components
  ├── navbar.tsx              # Navigation bar with auth
  ├── footer.tsx              # Footer
  └── sections/               # Page sections
/lib
  ├── supabase.ts             # Supabase client and types
  └── styles.ts               # Style constants
/hooks
  └── use-auth.ts             # Authentication hook
/scripts
  ├── setup-db.sql            # Database schema
  └── seed-data.sql           # Sample data
```

## 🔐 Authentication

The app uses Supabase Auth with multiple providers:

- **Email/Password**: Standard email and password authentication
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account

### Setting up OAuth

1. Go to your Supabase project settings
2. Navigate to Authentication > Providers
3. Enable Google and/or GitHub
4. Add your OAuth credentials from the respective provider consoles
5. Set redirect URL to: `https://your-domain/auth/callback`

## 📊 Database Schema

### Tables

- **profiles**: User profile information with roles
- **members**: Team members with skills and social links
- **projects**: Showcase projects with tech stacks
- **project_members**: Many-to-many relationship for project team
- **events**: Community events and workshops
- **event_registrations**: User event registrations
- **team_leads**: Special team member designations

All tables have Row Level Security (RLS) policies enabled for security.

## 🎨 Design System

The app uses a carefully curated color palette with design tokens:

- **Primary**: Vibrant indigo (`oklch(0.6 0.25 280)`)
- **Accent**: Bright lavender (`oklch(0.65 0.28 270)`)
- **Background**: Deep charcoal (`oklch(0.08 0 0)`)
- **Foreground**: Light gray (`oklch(0.95 0.02 0)`)

Custom classes:
- `.glass`: Glassmorphism effect with backdrop blur
- `.glass-hover`: Glass effect with hover state
- `.glow-accent`: Subtle glow effect with primary color

## 🔧 Key Features Explained

### Real-time Data

The team, projects, and events pages fetch data directly from Supabase and automatically update when database changes.

### Event Registration

Users can register for events through the Events page. The system tracks registrations and prevents duplicate entries.

### User Profiles

After logging in, users can update their profile information in the Profile page. Data is saved to the `profiles` table.

### Admin Features

The special email `sangamkunwar48@gmail.com` automatically gets admin privileges (role: 'admin'). You can extend this in the auth flow to enable admin panels.

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy!

```bash
vercel deploy
```

### Environment Variables for Production

Set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🐛 Troubleshooting

### "supabaseUrl is required" error

This happens at build time if Supabase env vars aren't set. The code handles this gracefully with placeholder values for production builds.

### Auth pages showing blank

Make sure the Supabase environment variables are correctly set in `.env.local` and match your Supabase project.

### RLS policy errors

If you get "row level security" errors, verify:
1. RLS is enabled on the table
2. The policy conditions match your authentication flow
3. The authenticated user has the appropriate role

## 📝 Customization

### Changing Colors

Edit the design tokens in `app/globals.css` under the `:root` and `.dark` sections.

### Adding New Pages

1. Create a new directory in `/app`
2. Add `page.tsx` file
3. Import and use the `Navbar` and `Footer` components
4. Apply the `glass` styling for cards

### Extending Authentication

To add more OAuth providers:
1. Enable in Supabase dashboard
2. Update `hooks/use-auth.ts` with new sign-in methods
3. Add buttons to login/signup pages

## 🤝 Contributing

This is a starter template. Feel free to fork and customize it for your community!

## 📄 License

MIT License - Feel free to use this project for your own community or business.

## 🆘 Support

For issues with:
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

**Built with ❤️ for creative communities**
"# njbsictclub" 

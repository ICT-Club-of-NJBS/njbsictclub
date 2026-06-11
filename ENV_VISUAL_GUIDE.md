# Environment Setup - Visual Guide

## What You See in Supabase

When you go to **Settings → API**, you'll see something like this:

```
┌────────────────────────────────────────────────────────────────┐
│ Settings / API                                                 │
└────────────────────────────────────────────────────────────────┘

📍 Project URL
└─ https://abcdefgh.supabase.co  [Copy]

📍 Project API keys

    anon public
    └─ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Copy]
    
    service_role secret
    └─ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Copy]
```

---

## What You Create in Your Project

### File Location:
```
your-project/
├── package.json
├── .env.local          ← CREATE THIS FILE
├── .env.example
├── app/
└── ... (other files)
```

### File Content (.env.local):

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTk4NTYwMDAwMH0.abcdefghijklmnopqrstuvwxyz
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MDAwMDAwMCwiZXhwIjoxOTg1NjAwMDAwfQ.abcdefghijklmnopqrstuvwxyz
JWT_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
```

---

## Step-by-Step Visual

### Step 1: Copy from Supabase

```
Supabase Dashboard
│
├─ Click on your project
├─ Click "Settings"
├─ Click "API"
│
└─ See:
   │
   ├─ Project URL
   │  └─ Copy: https://abcdefgh.supabase.co
   │
   ├─ anon public (under Project API keys)
   │  └─ Copy the long key starting with eyJhbGc...
   │
   └─ service_role secret (under Project API keys)
      └─ Copy the long key starting with eyJhbGc...
```

### Step 2: Generate JWT Secret

```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Output:
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
         ↓
    Copy this entire string
```

### Step 3: Create .env.local

```
Your Project Folder
│
├─ Create new file: .env.local
│
└─ Paste:
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   JWT_SECRET=1a2b3c4d...
```

### Step 4: Run

```bash
$ npm run dev

✓ Server running at http://localhost:3000
```

---

## Variable Mapping

| In .env.local | Where to Get It | Where It's Used |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API → Project URL | Browser & Server (database connection) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API → anon public key | Browser (public API access) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API → service_role secret | Server only (admin database access) |
| `JWT_SECRET` | Generate with node command | Server (sign authentication tokens) |

---

## Example Full .env.local

Here's what your complete file should look like:

```env
# Your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123def456.supabase.co

# Your anon public key (visible in browser, but limited access)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjcwMDAwMDAwLCJleHAiOjE5ODU2MDAwMDB9.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u

# Your service role key (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyM2RlZjQ1NiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTk4NTYwMDAwMH0.z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f

# Your random JWT secret
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## What NOT to Do

❌ Don't use `"quotes"` around values:
```env
# WRONG:
NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"

# CORRECT:
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
```

❌ Don't add extra spaces:
```env
# WRONG:
NEXT_PUBLIC_SUPABASE_URL = https://example.supabase.co

# CORRECT:
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
```

❌ Don't commit to Git:
```bash
# This is already done, but verify .gitignore has:
.env.local
```

✅ Do keep it in project root:
```
your-project/
├── .env.local   ← Here! Same level as package.json
├── package.json
└── app/
```

---

## Verification Checklist

After creating `.env.local`:

- [ ] File is named exactly `.env.local` (with the dot)
- [ ] File is in project root folder
- [ ] File has 4 variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET)
- [ ] No quotes around values
- [ ] No extra spaces
- [ ] Values are not empty
- [ ] Restarted dev server after creating file

Then run:
```bash
npm run dev
```

Visit: http://localhost:3000

If the page loads without errors, you're all set! ✅

---

## Common Mistakes & Fixes

### Mistake: Wrong filename
```
❌ env.local (missing the dot)
❌ .env.example (wrong name)
✅ .env.local (correct)
```

### Mistake: Wrong location
```
❌ /app/.env.local
❌ /src/.env.local
✅ /project/.env.local (project root)
```

### Mistake: Incomplete value
```
❌ NEXT_PUBLIC_SUPABASE_URL=https://
✅ NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
```

### Mistake: Typo in variable name
```
❌ NEXT_PUBLIC_SUPABASE_URL (missing 'L' at end)
❌ NEXT_PUBLIC_SUPABASE_KEY (wrong name)
✅ NEXT_PUBLIC_SUPABASE_URL (correct)
```

---

Once you have `.env.local` set up, follow **QUICKSTART.md** next to create your database tables! 🚀

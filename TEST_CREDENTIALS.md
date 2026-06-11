# Test Credentials & Demo Account

## Quick Start (Without MongoDB)

The application now includes a **demo account** that works even without MongoDB connection. This allows you to test the entire application immediately.

### Demo Login Credentials

```
Email:    demo@example.com
Password: demo123
Role:     Member (Regular User)
```

### How to Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to login:**
   - Go to http://localhost:3000/auth/login

3. **Sign in with demo account:**
   - Email: `demo@example.com`
   - Password: `demo123`

4. **You'll be redirected to:**
   - `/dashboard` (if regular user)
   - `/admin` (if admin user)

## Signup Testing

You can also test the signup form:

1. **Navigate to signup:**
   - Go to http://localhost:3000/auth/signup

2. **Fill in the form:**
   - Full Name: Any name
   - Email: Any email address
   - Password: Minimum 8 characters

3. **Submit:**
   - You'll be signed up (in demo mode, without database)
   - Redirected to dashboard

## Admin Account Testing

To test admin features:

1. **Sign up with admin email:**
   - Email: `sangamkunwar48@gmail.com`
   - Password: Any password (min 8 chars)

2. **You'll be assigned admin role** and redirected to `/admin`

3. **Admin features available:**
   - View all users
   - Manage team members
   - View contact messages
   - Send message replies

## Modes of Operation

### 1. Demo Mode (No Database)

**When:** MONGODB_URI is not set or connection fails

**What works:**
- ✅ Login with demo account
- ✅ Sign up new users
- ✅ Access dashboard
- ✅ Access admin panel (if admin role)
- ✅ View all UI and features

**What doesn't work:**
- ❌ User data not persisted (refreshing page loses session)
- ❌ Contact messages not saved
- ❌ User data not stored long-term

### 2. Production Mode (With MongoDB)

**When:** MONGODB_URI is set and MongoDB is connected

**What works:**
- ✅ All features fully functional
- ✅ User data persisted permanently
- ✅ Contact messages saved
- ✅ Admin replies with emails sent
- ✅ All data survives page refresh

## Setting Up MongoDB (Optional)

To use full functionality with data persistence:

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create account:** https://www.mongodb.com/cloud/atlas

2. **Create a cluster:**
   - Free tier is available
   - Follow MongoDB's setup wizard

3. **Get connection string:**
   - Find Connection String in Atlas dashboard
   - Copy the string

4. **Add to environment:**
   ```bash
   # .env.local (local development)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/njbsictclub?retryWrites=true&w=majority

   # Vercel (production)
   # Add the same variable in Vercel dashboard
   ```

5. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Option 2: Local MongoDB

1. **Install MongoDB Community Edition**
   - https://docs.mongodb.com/manual/installation/

2. **Start MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

3. **Add to .env.local:**
   ```
   MONGODB_URI=mongodb://localhost:27017/njbsictclub
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Production Checklist

Before deploying to Vercel:

- [ ] Set MONGODB_URI in Vercel environment variables
- [ ] Set JWT_SECRET in environment
- [ ] Set RESEND_API_KEY or SENDGRID_API_KEY for emails (optional)
- [ ] Test login/signup locally
- [ ] Deploy to Vercel
- [ ] Test login/signup in production
- [ ] Create admin account with your email

## Troubleshooting

### "Signing in..." but no redirect

**Cause:** API returned HTML error (MongoDB connection failed)

**Solution:**
1. Check browser console for error details
2. Ensure MONGODB_URI is correct if set
3. Try demo account (demo@example.com)
4. Check that API returns JSON not HTML

### "User already exists"

**Cause:** Email was previously used

**Solution:** Use a different email for signup

### Emails not sending

**Cause:** Email API key not set

**Solution:**
1. Get RESEND_API_KEY from https://resend.com
2. Add to .env.local
3. Restart dev server

## Demo vs Production

| Feature | Demo Mode | Production |
|---------|-----------|-----------|
| Login | ✅ Yes | ✅ Yes |
| Signup | ✅ Yes | ✅ Yes |
| Dashboard | ✅ Yes | ✅ Yes |
| Admin Panel | ✅ Yes | ✅ Yes |
| Persist Data | ❌ No | ✅ Yes |
| Contact Messages | ✅ View/Reply UI | ✅ Full functionality |
| Email Sending | ❌ No | ✅ Yes |

## Support

If you encounter issues:

1. Check console logs in browser (F12)
2. Check server logs in terminal
3. See TROUBLESHOOTING.md for detailed help
4. Use demo account to test without dependencies

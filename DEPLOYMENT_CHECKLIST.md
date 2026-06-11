# Deployment & Setup Checklist

## Pre-Deployment Requirements

### Environment Variables in Vercel
Make sure all these are added to your Vercel project (Settings → Environment Variables):

#### Database
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - A secure random string for token signing

#### Google OAuth
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Same as GOOGLE_CLIENT_ID (visible to client)

#### GitHub OAuth
- [ ] `GITHUB_CLIENT_ID` - From GitHub Developer Settings
- [ ] `GITHUB_CLIENT_SECRET` - From GitHub Developer Settings
- [ ] `NEXT_PUBLIC_GITHUB_CLIENT_ID` - Same as GITHUB_CLIENT_ID (visible to client)

#### Application
- [ ] `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

### Google Cloud Console Setup
- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Web Application credentials
- [ ] Added redirect URI: `https://your-domain.com/api/auth/callback/google`
- [ ] Copied Client ID and Client Secret

### GitHub Developer Settings
- [ ] Created OAuth App
- [ ] Set Authorization callback URL: `https://your-domain.com/api/auth/callback/github`
- [ ] Copied Client ID and Client Secret

### MongoDB Setup
- [ ] Created MongoDB database (Atlas or self-hosted)
- [ ] Generated connection string
- [ ] Added whitelist IP (if using Atlas, add 0.0.0.0/0 for Vercel)
- [ ] Verified connection works

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add OAuth and QR code features"
git push
```

### 2. Vercel Deployment
- [ ] Auto-deployed from GitHub (if connected)
- [ ] Check deployment logs for errors
- [ ] Verify all environment variables are set
- [ ] Test URL works: `https://your-app.vercel.app`

### 3. Update OAuth Redirect URLs
If your domain changed, update in both:
- [ ] Google Cloud Console - Update redirect URI to production URL
- [ ] GitHub Settings - Update redirect URI to production URL

## Testing After Deployment

### 1. Signup/Login Flow
- [ ] Visit `/auth/signup`
- [ ] Test "Sign up with Google"
- [ ] Test "Sign up with GitHub"
- [ ] Test "Sign up with Email"
- [ ] Verify redirect to `/profile` after signup

### 2. Profile Page
- [ ] Visit `/profile` (should redirect to login if not authenticated)
- [ ] Login with each method (email, google, github)
- [ ] Verify QR code displays
- [ ] Test download QR code
- [ ] Test copy to clipboard
- [ ] Test edit profile
- [ ] Test logout

### 3. Admin Dashboard
- [ ] Login as admin (use admin email or set role in database)
- [ ] Visit `/admin`
- [ ] Test Members tab - CRUD operations
- [ ] Test Events tab - Create/view events
- [ ] Test Attendance tab - View attendance records
- [ ] Test Projects tab - Create/view projects
- [ ] Test Messages tab - View messages
- [ ] Test Settings tab - Update settings

### 4. QR Code Functionality
- [ ] User signup generates QR code
- [ ] QR code displays on profile
- [ ] QR code can be downloaded as PNG
- [ ] QR code can be copied
- [ ] Different users have different QR codes

## Common Issues & Solutions

### OAuth Login Not Working
**Symptoms:** "Redirect URI mismatch" or blank page after OAuth approval

**Solution:**
1. Check NEXTAUTH_URL matches your actual URL
2. Verify redirect URIs in Google/GitHub match exactly
3. Clear browser cache and cookies
4. Check server logs in Vercel dashboard

### QR Code Not Showing
**Symptoms:** Profile page loads but QR code is missing

**Solution:**
1. Verify `qrcode` package is installed: `npm install qrcode`
2. Check browser console for JavaScript errors
3. Restart dev server: `npm run dev`
4. Check MongoDB user document has `qrCode` field

### Database Connection Error
**Symptoms:** "Connection failed" or "Cannot find MongoDB"

**Solution:**
1. Verify MONGODB_URI is correct
2. Check MongoDB is running and accessible
3. If using MongoDB Atlas, whitelist Vercel IP (0.0.0.0/0)
4. Check database name in connection string

### User Stays on Login Page After OAuth
**Symptoms:** OAuth completes but user doesn't redirect to profile

**Solution:**
1. Check server logs for errors
2. Verify OAuth token was exchanged correctly
3. Check database connection
4. Ensure JWT_SECRET is set
5. Check browser cookies are enabled

## Monitoring & Maintenance

### Regular Checks
- [ ] Monitor Vercel dashboard for errors
- [ ] Check MongoDB Atlas for connection issues
- [ ] Review user signup rate
- [ ] Monitor OAuth API limits

### Backup & Security
- [ ] Setup MongoDB automated backups
- [ ] Rotate JWT_SECRET periodically
- [ ] Review OAuth app permissions
- [ ] Monitor for suspicious activity

## Rollback Plan

If something goes wrong:

### From Vercel
1. Go to Deployments
2. Find previous stable deployment
3. Click "Redeploy"

### From GitHub
```bash
git revert <commit-hash>
git push
```

## Performance Optimization

### Optional: Enable Caching
- [ ] Add Redis for session caching
- [ ] Cache QR codes (they don't change)
- [ ] Cache admin dashboard data

### Optional: Analytics
- [ ] Setup Vercel Analytics
- [ ] Monitor signup conversion rate
- [ ] Track OAuth provider usage
- [ ] Monitor QR code downloads

## Documentation References

- **OAuth Setup**: See `OAUTH_SETUP.md`
- **MongoDB Setup**: See `MONGODB_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## Success Criteria

You'll know everything is working when:

✅ Users can sign up with Google
✅ Users can sign up with GitHub
✅ Users can sign up with Email
✅ Profile page shows QR code
✅ QR code can be downloaded
✅ QR code can be copied
✅ Admin dashboard loads and works
✅ All admin operations (CRUD) work
✅ Attendance can be tracked
✅ Settings can be updated

---

**Need Help?**
- Check Vercel deployment logs
- Review browser console for client errors
- Check server logs in Vercel dashboard
- Read the OAUTH_SETUP.md guide
- Check MongoDB Atlas dashboard

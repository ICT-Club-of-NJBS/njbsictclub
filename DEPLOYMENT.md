# Deployment Guide for ICT Club Website

## Overview

This guide provides step-by-step instructions to deploy the ICT Club website to Vercel with proper configuration and environment variables.

## Prerequisites

1. Node.js 18+ installed
2. Git installed and configured
3. Vercel account (free account works)
4. GitHub account with your repository

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/sangamkunwar-dv/njbsictclub.git
cd njbsictclub
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your actual values:
   - **MongoDB**: Add your MongoDB connection string
   - **Google OAuth**: Get credentials from Google Cloud Console
   - **GitHub OAuth**: Get credentials from GitHub Settings
   - **JWT Secret**: Generate a random secret key

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

## Deploying to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from project directory:
```bash
vercel
```

3. Follow prompts to:
   - Link to your GitHub repository
   - Set up production environment
   - Add environment variables

### Option 2: Using GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Select your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Add environment variables in settings
6. Click "Deploy"

## Setting Up Environment Variables in Vercel

1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable from `.env.example`:

### Required Variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NEXT_PUBLIC_APP_URL`: https://your-domain.vercel.app

### OAuth Variables (Optional but Recommended):
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`: From GitHub Settings
- `GITHUB_CLIENT_SECRET`: From GitHub Settings

4. Click "Save" after adding variables

## Configure OAuth Providers

### Google OAuth Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
6. Copy Client ID and Secret to `.env.local` and Vercel

### GitHub OAuth Setup:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set:
   - Application name: ICT Club
   - Homepage URL: https://your-domain.vercel.app
   - Authorization callback URL: https://your-domain.vercel.app/api/auth/callback/github
4. Copy Client ID and generate Client Secret
5. Add to `.env.local` and Vercel

## MongoDB Setup

### Using MongoDB Atlas (Free Tier Available):

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up for free
3. Create cluster
4. Create database user with strong password
5. Get connection string from "Connect" button
6. Update `MONGODB_URI` with your connection string
7. Whitelist Vercel IP: In Network Access, select "Allow Access from Anywhere"

## Pre-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] MongoDB connection tested locally
- [ ] Google OAuth credentials working locally
- [ ] GitHub OAuth credentials working locally
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run lint` (if configured)
- [ ] User authentication flows tested locally
- [ ] Login page displays correctly
- [ ] Signup page displays correctly
- [ ] Password strength indicator working

## Deployment Commands

```bash
# Build locally to test
npm run build

# Start production server
npm run start

# Deploy to Vercel
vercel --prod
```

## Troubleshooting

### Build Failures

1. Check TypeScript errors: `npm run lint`
2. Clear `.next` folder: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check environment variables in Vercel dashboard

### OAuth Errors

1. Verify redirect URIs are correct
2. Check Client IDs/Secrets are correct
3. Ensure providers are enabled in Vercel env vars
4. Check browser console for specific error messages

### Database Connection Issues

1. Verify MongoDB connection string
2. Check MongoDB is running and accessible
3. Test connection locally before deploying
4. Check Vercel logs for connection errors

### 404 on Favicon

The favicon path is configured in `layout.tsx`. If seeing errors:
1. Ensure `public/ictclubNJBS.jpg` exists
2. Clear Vercel cache and redeploy

## Production Best Practices

1. **Security**:
   - Never commit `.env.local`
   - Use strong, unique JWT_SECRET
   - Enable HTTPS (automatic on Vercel)
   - Keep dependencies updated

2. **Performance**:
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Use image optimization
   - Enable caching headers

3. **Monitoring**:
   - Set up error tracking (Sentry recommended)
   - Monitor application logs
   - Set up uptime monitoring
   - Track user authentication issues

4. **Backup & Disaster Recovery**:
   - Regular MongoDB backups
   - Version control all code
   - Document configuration
   - Have rollback plan

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## After Deployment

1. Test all features on production
2. Monitor error logs and analytics
3. Set up monitoring/alerting
4. Plan for scaling if needed
5. Regular security updates

---

For questions or issues, open an issue on GitHub or contact the development team.

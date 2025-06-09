# Vercel Deployment Guide

This guide will help you deploy BoardSource to Vercel with proper Prisma configuration.

## 🚀 Quick Deploy

1. **Push your code to GitHub**
2. **Connect to Vercel**
3. **Configure Environment Variables**
4. **Deploy!**

## 📋 Environment Variables Required

In your Vercel dashboard, add these environment variables:

### **Essential Variables**

```bash
# NextAuth Configuration
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-very-long-secret-key-here"

# Database (for production - see database setup below)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# OAuth - Google (required)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **Optional OAuth Providers**

```bash
# Apple OAuth (optional)
APPLE_ID="your-apple-id"
APPLE_SECRET="your-apple-secret"

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## 🗄️ Database Setup

### **Option 1: Vercel Postgres (Recommended)**

1. In Vercel dashboard, go to **Storage** tab
2. Create a **Postgres** database
3. Copy the `DATABASE_URL` to your environment variables
4. Update your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### **Option 2: External PostgreSQL**

Use services like:

- **Supabase** (free tier available)
- **PlanetScale** (MySQL)
- **Railway** (PostgreSQL)
- **Neon** (PostgreSQL)

## 🔑 Generate NextAuth Secret

```bash
# Run this command to generate a secure secret
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` environment variable.

## ⚙️ Build Configuration

Your `package.json` should now include:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

✅ **This is already configured in your project!**

## 🔄 Database Migration

After setting up your production database:

1. **Run migrations locally first:**

   ```bash
   # Update your local .env with production DATABASE_URL temporarily
   npx prisma db push
   ```

2. **Or use Prisma migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## 🌐 OAuth Configuration

### **Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)

### **Update OAuth Redirect URLs**

Make sure your OAuth providers have the correct redirect URLs:

- **Development**: `http://localhost:3000/api/auth/callback/[provider]`
- **Production**: `https://your-app.vercel.app/api/auth/callback/[provider]`

## 📱 Vercel Deployment Steps

1. **Connect Repository**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**

   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (uses our configured script)
   - Output Directory: `.next`

3. **Add Environment Variables**

   - Add all variables from the list above
   - Make sure `NEXTAUTH_URL` uses your Vercel domain

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## 🐛 Troubleshooting

### **Prisma Client Issues**

If you see Prisma client errors:

1. Check that `prisma generate` runs in build
2. Verify `DATABASE_URL` is correctly set
3. Ensure database schema matches your Prisma schema

### **NextAuth Issues**

1. Verify `NEXTAUTH_URL` matches your deployment URL
2. Check `NEXTAUTH_SECRET` is set and secure
3. Confirm OAuth redirect URLs are correct

### **Build Failures**

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify database connection

## 🔄 Continuous Deployment

After initial setup:

1. **Push to main branch** → Auto-deploy to production
2. **Push to other branches** → Preview deployments
3. **Environment variables** → No redeployment needed

## 📊 Monitoring

Monitor your deployment:

- **Vercel Dashboard**: Build logs, analytics
- **Vercel Functions**: API route performance
- **Database**: Connection pooling, query performance

## 🔒 Security Checklist

- ✅ `NEXTAUTH_SECRET` is cryptographically secure
- ✅ OAuth credentials are for production domains
- ✅ Database uses SSL connections
- ✅ Environment variables are not exposed in client code
- ✅ CORS settings are properly configured

## 🎉 Post-Deployment

After successful deployment:

1. **Test authentication** with all providers
2. **Verify password reset** functionality
3. **Check database operations** work correctly
4. **Test error handling** with invalid credentials

Your BoardSource marketplace is now live! 🏄‍♂️

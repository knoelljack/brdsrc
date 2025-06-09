# OAuth Troubleshooting Guide - Vercel Deployment

## 🚨 Google OAuth Not Working in Production?

### **1. Google Cloud Console Setup**

✅ **Check Authorized Redirect URIs:**
```
Development: http://localhost:3000/api/auth/callback/google
Production:  https://your-app.vercel.app/api/auth/callback/google
```

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate: **APIs & Services → Credentials**
4. Click your **OAuth 2.0 Client ID**
5. Add your Vercel domain to **Authorized redirect URIs**

### **2. Vercel Environment Variables**

✅ **Required Variables:**
```bash
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="secure-random-string-32-chars-min"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DATABASE_URL="your-production-database-url"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### **3. Common Issues & Solutions**

#### **Issue: "redirect_uri_mismatch" Error**
```
❌ Error: The redirect URI in the request does not match
```

**Solution:**
- Double-check your Vercel app URL in Google Cloud Console
- Ensure no trailing slashes in NEXTAUTH_URL
- Make sure the domain matches exactly (including subdomain)

#### **Issue: "invalid_client" Error**
```
❌ Error: The OAuth client was not found
```

**Solution:**
- Verify GOOGLE_CLIENT_ID is correctly set in Vercel
- Check for extra spaces or characters in environment variables
- Ensure the client ID matches Google Cloud Console

#### **Issue: Works Locally, Fails in Production**
```
❌ NextAuth configuration error
```

**Solution:**
- Check NEXTAUTH_URL points to your Vercel domain
- Verify all environment variables are set in Vercel dashboard
- Ensure database is accessible from Vercel (not localhost)

### **4. Testing Your Setup**

#### **Local Testing:**
```bash
# Test with your local setup
npm run dev
# Navigate to http://localhost:3000/api/auth/signin
```

#### **Production Testing:**
```bash
# Deploy and test
vercel --prod
# Navigate to https://your-app.vercel.app/api/auth/signin
```

### **5. Debug Mode**

**Enable NextAuth Debug Logging:**

Add to your Vercel environment variables:
```bash
NEXTAUTH_DEBUG=true
```

**Check Vercel Function Logs:**
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Functions** tab
4. Click on any failed function to see logs

### **6. Step-by-Step Verification**

**Before deploying, verify:**

- [ ] Google Cloud Console has correct redirect URI
- [ ] NEXTAUTH_URL matches your Vercel domain (no trailing slash)
- [ ] NEXTAUTH_SECRET is set and secure (32+ characters)
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- [ ] Database is accessible from Vercel
- [ ] All environment variables are set in Vercel dashboard

### **7. Alternative Solutions**

#### **If Still Not Working:**

1. **Try OAuth with a simple test:**
   ```javascript
   // Test direct Google OAuth (temporary)
   const testGoogleAuth = () => {
     const clientId = process.env.GOOGLE_CLIENT_ID;
     const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
     
     console.log('Testing OAuth config:', {
       clientId: clientId?.substring(0, 10) + '...',
       redirectUri
     });
   };
   ```

2. **Use Vercel's built-in environment variable UI:**
   - Go to **Settings → Environment Variables**
   - Add variables one by one
   - Redeploy after adding all variables

3. **Check Vercel deployment logs:**
   ```bash
   vercel logs your-deployment-url
   ```

### **8. Production Checklist**

```bash
# Final deployment checklist
□ Google OAuth redirect URIs updated
□ All environment variables set in Vercel
□ NEXTAUTH_URL points to production domain
□ Database accessible from Vercel
□ SSL certificate active on domain
□ Test OAuth flow end-to-end
```

### **9. Common Environment Variable Mistakes**

```bash
# ❌ WRONG
NEXTAUTH_URL="https://your-app.vercel.app/"  # Trailing slash
NEXTAUTH_URL=your-app.vercel.app             # Missing protocol

# ✅ CORRECT  
NEXTAUTH_URL="https://your-app.vercel.app"   # No trailing slash, with protocol
```

### **10. Getting Help**

If you're still having issues:

1. **Check Vercel function logs** for specific error messages
2. **Enable NextAuth debug mode** to see detailed logs
3. **Test OAuth redirect manually** by visiting the Google OAuth URL
4. **Verify your Google Cloud Console setup** matches exactly

---

**Pro Tip:** After making changes to Google Cloud Console, it can take a few minutes to propagate. Try waiting 5-10 minutes before testing again. 
# Cloud Storage Setup Guide

## Vercel Blob Storage Configuration

### 1. Get Your Blob Storage Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your Vercel Blob token (will be auto-generated when you first use Blob storage)

### 2. Local Development Setup

Create or update your `.env.local` file with:

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token_here

# Your existing environment variables...
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
# etc...
```

### 3. First Deployment

1. Deploy your app to Vercel (if not already deployed)
2. The first time you use the upload API, Vercel will automatically:
   - Create a Blob storage instance
   - Generate the `BLOB_READ_WRITE_TOKEN`
   - Add it to your environment variables

### 4. Migration Strategy

This implementation allows for **gradual migration**:

#### Phase 1: New Uploads (Current)

- New listings use cloud storage (`ImageUploadCloud` component)
- Existing listings still work with base64 images
- Both display correctly in the UI

#### Phase 2: Complete Migration (Optional)

- Migrate existing base64 images to cloud storage
- Update all components to use cloud URLs
- Remove base64 support

### 5. Usage in Components

Replace the current `ImageUpload` component with `ImageUploadCloud`:

```tsx
// Before (base64)
import ImageUpload from '@/app/components/ui/ImageUpload';

// After (cloud storage)
import ImageUploadCloud from '@/app/components/ui/ImageUploadCloud';

// Usage
<ImageUploadCloud
  onImagesChange={handleImagesChange}
  maxImages={5}
  className="mb-8"
/>;
```

### 6. Benefits

✅ **No Size Limits** - No more 5MB Prisma response limits  
✅ **Better Performance** - Images load faster via CDN  
✅ **Automatic Optimization** - Vercel optimizes images automatically  
✅ **Cost Effective** - Only pay for what you use  
✅ **Scalable** - Handles thousands of images easily

### 7. File Structure

```
app/
├── api/
│   └── upload/
│       └── route.ts          # New image upload API
├── components/
│   └── ui/
│       ├── ImageUpload.tsx       # Old base64 component
│       └── ImageUploadCloud.tsx  # New cloud component
└── my-listings/
    └── page.tsx              # Updated to show thumbnails
```

### 8. Testing

1. Start your development server: `npm run dev`
2. Go to `/sell` to create a new listing
3. Upload images using the new cloud component
4. Check that images appear in `/my-listings`
5. Verify images load quickly and display correctly

## Next Steps

1. Add the `BLOB_READ_WRITE_TOKEN` to your environment variables
2. Update your sell/edit listing pages to use `ImageUploadCloud`
3. Test the upload functionality
4. Deploy to Vercel to activate cloud storage

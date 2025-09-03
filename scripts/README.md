# Database Management Scripts

This directory contains utility scripts for managing your BoardSource database during development.

## Available Scripts

### User Cleanup: `npm run cleanup:users`

Cleans up test users and development data from the database.

**Basic usage:**

```bash
npm run cleanup:users
```

**With options:**

```bash
# Dry run - see what would be deleted without actually deleting
npm run cleanup:users -- --dry-run

# Delete users created in the last 24 hours
npm run cleanup:users -- --recent=24

# Delete OAuth-only users (be careful!)
npm run cleanup:users -- --oauth-only
```

**What it does:**

- ✅ Deletes users with 'test' in their email address
- ⚠️ Optionally deletes recent users or OAuth-only users
- 🔍 Supports dry-run mode for safety

### Database Seeding: `npm run db:seed`

Creates test users for development and testing.

```bash
npm run db:seed
```

**What it creates:**

- test1@example.com (password: password123)
- test2@example.com (password: password123)
- demo@boardsource.com (password: demo123)

### Web Scraping: `npm run scrape` & `npm run analyze`

Automatically scrape surfboard listings from other websites and import them into your database.

#### Website Analysis: `npm run analyze`

First, analyze a website's structure to understand how to scrape it:

```bash
npm run analyze -- "https://surf-shop.com/used-boards"
```

**What it does:**

- 🔍 Analyzes HTML structure
- 🏷️ Finds potential product containers
- 💰 Identifies price elements
- 🖼️ Locates image galleries
- ⚙️ Suggests CSS selectors for scraping

#### Surfboard Scraping: `npm run scrape`

Once you understand the structure, scrape the data:

```bash
# Save to JSON file only (recommended first)
npm run scrape -- "https://surf-shop.com/used-boards" "your@email.com" --save-only

# Import directly to database
npm run scrape -- "https://surf-shop.com/used-boards" "your@email.com"
```

**What it extracts:**

- ✅ Title, brand, length, condition, price
- ✅ Description, location (city/state)
- ✅ Multiple images per board
- ✅ Automatic data normalization

**Features:**

- 🤖 Auto-detects common surfboard listing patterns
- 📄 Supports pagination (multiple pages)
- 🛡️ Respectful scraping (delays between requests)
- 💾 Saves to JSON before database import
- 🔧 Customizable selectors for different websites

### Database Operations

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (deletes all data!)
npm run db:reset

# Create and apply database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

## Development Workflow

1. **Start development:**

   ```bash
   npm run dev
   ```

2. **Create test data:**

   ```bash
   npm run db:seed
   ```

3. **Test authentication:**

   - Sign up with new accounts
   - Test OAuth providers
   - Test password reset

4. **Scrape surfboard data:**

   ```bash

   ```

# First analyze the website

npm run analyze -- "https://surf-shop.com/boards"

# Then scrape (save to JSON first)

npm run scrape -- "https://surf-shop.com/boards" "your@email.com" --save-only

# Import to database once satisfied

npm run scrape -- "https://surf-shop.com/boards" "your@email.com"

# Example with Rider Shack (auto-detected)

npm run scrape -- "https://www.ridershack.com/used-90-walden-magic-model-longboard-surfboard-117544.html" "your@email.com"

````

5. **Clean up test data:**

   ```bash
   npm run cleanup:users
````

6. **View database:**
   ```bash
   npm run db:studio
   ```

## Web Scraping Guide

### Step 1: Install Dependencies

```bash
npm install jsdom node-fetch
npm install --save-dev @types/jsdom @types/node-fetch
```

### Step 2: Analyze Target Website

```bash
npm run analyze -- "https://target-surf-shop.com/boards"
```

This will show you:

- Potential CSS selectors for product containers
- Price element patterns
- Image gallery structures
- Suggested configuration

### Step 3: Customize Selectors (if needed)

If the auto-detection doesn't work perfectly, edit `scripts/scrape-surfboards.ts` and update the `EXAMPLE_CONFIGS.genericSurfShop.selectors` object:

```typescript
selectors: {
  boardContainer: '.product-card',        // Container for each board
  title: '.product-title',                // Board title
  brand: '.brand-name',                   // Brand (optional)
  length: '.dimensions',                  // Length/size
  condition: '.condition-grade',          // Condition (optional)
  price: '.price-amount',                 // Price
  description: '.product-description',    // Description
  location: '.seller-location',           // Location (optional)
  images: '.product-gallery img'          // Images
}
```

### Step 4: Test Scraping

Always test with `--save-only` first:

```bash
npm run scrape -- "https://surf-shop.com/boards" "your@email.com" --save-only
```

Check the JSON file in `scripts/scraped-data/` to verify the data looks correct.

### Step 5: Import to Database

Once satisfied with the data:

```bash
npm run scrape -- "https://surf-shop.com/boards" "your@email.com"
```

## Safety Features

- **Dry Run Mode**: Always test with `--dry-run` first
- **Smart Targeting**: Only deletes users matching specific patterns
- **Confirmation**: Shows exactly what will be deleted
- **Error Handling**: Graceful error handling and rollback
- **Respectful Scraping**: Delays between requests, proper User-Agent headers
- **Data Validation**: Ensures required fields are present before saving

## Configuration

Edit `scripts/cleanup-users.ts` to modify cleanup behavior:

```typescript
const CLEANUP_OPTIONS = {
  testUsers: true, // Delete users with 'test' in email
  recentHours: 0, // Delete users created in last X hours
  oauthOnlyUsers: false, // Delete OAuth-only users
  dryRun: false, // Preview mode
};
```

For scraping, customize selectors in `scripts/scrape-surfboards.ts`:

```typescript
const EXAMPLE_CONFIGS = {
  yourSurfShop: {
    url: 'https://your-shop.com/boards',
    selectors: {
      // Your custom selectors here
    },
  },
};
```

## Troubleshooting

**TypeError: Unknown file extension ".ts"**

- Fixed! We now use `tsx` instead of `ts-node`

**Permission errors:**

- Make sure your database file has proper permissions

**Prisma connection issues:**

- Check your `DATABASE_URL` in `.env`
- Run `npm run db:generate` to update Prisma client

**Scraping Issues:**

- **No boards found**: Use `npm run analyze` to find correct selectors
- **HTTP errors**: Website may be blocking requests or require authentication
- **Malformed data**: Check the JSON output and adjust parsing functions
- **Images not loading**: Some sites use lazy loading or authentication for images

**Common Scraping Fixes:**

```bash
# If selectors don't work, analyze the site first
npm run analyze -- "https://problem-site.com"

# Check what data was actually scraped
cat scripts/scraped-data/surfboards-*.json | head -50

# Test with a single page first (edit maxPages in config)
# Edit scripts/scrape-surfboards.ts and set maxPages: 1
```

## Supported Websites

### ✅ Rider Shack (Auto-detected)

- **URL Pattern**: `ridershack.com`
- **Support**: Individual product pages and listing pages
- **Features**:
  - Automatic brand extraction from titles
  - Dimension parsing from product details
  - Star rating to condition conversion
  - Los Angeles, CA location auto-fill
  - Image extraction from product galleries

**Example URLs:**

```bash
# Single product page
npm run scrape -- "https://www.ridershack.com/used-90-walden-magic-model-longboard-surfboard-117544.html" "your@email.com"

# Used surfboards listing page
npm run scrape -- "https://www.ridershack.com/used-surfboards" "your@email.com"
```

## Security Notes

⚠️ **Never run these scripts in production!**
⚠️ **Always backup important data before cleanup**
⚠️ **Use dry-run mode first when testing new configurations**
⚠️ **Respect website terms of service when scraping**
⚠️ **Don't scrape too aggressively - be respectful of server resources**

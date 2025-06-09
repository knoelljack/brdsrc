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

4. **Clean up test data:**

   ```bash
   npm run cleanup:users
   ```

5. **View database:**
   ```bash
   npm run db:studio
   ```

## Safety Features

- **Dry Run Mode**: Always test with `--dry-run` first
- **Smart Targeting**: Only deletes users matching specific patterns
- **Confirmation**: Shows exactly what will be deleted
- **Error Handling**: Graceful error handling and rollback

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

## Troubleshooting

**TypeError: Unknown file extension ".ts"**

- Fixed! We now use `tsx` instead of `ts-node`

**Permission errors:**

- Make sure your database file has proper permissions

**Prisma connection issues:**

- Check your `DATABASE_URL` in `.env`
- Run `npm run db:generate` to update Prisma client

## Security Notes

⚠️ **Never run these scripts in production!**
⚠️ **Always backup important data before cleanup**
⚠️ **Use dry-run mode first when testing new configurations**

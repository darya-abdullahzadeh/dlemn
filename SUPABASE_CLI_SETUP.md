# Supabase CLI Setup Guide

This guide will help you set up Supabase CLI to run migrations from your terminal.

## Prerequisites

- Node.js installed (you already have this)
- A Supabase project created
- Your Supabase project reference ID

## Step 1: Install Supabase CLI

**Recommended for macOS:**
```bash
brew install supabase/tap/supabase
```

**For other platforms or if you don't have Homebrew:**
```bash
# Using npx (no installation needed, runs directly)
npx supabase --version

# Or install via other package managers:
# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux (using npm, but install locally in project)
npm install supabase --save-dev
```

**Note:** Supabase CLI no longer supports global npm install. Use Homebrew (macOS) or npx.

Verify installation:
```bash
supabase --version
# Or if using npx:
npx supabase --version
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate. After logging in, you'll be authenticated in the CLI.

## Step 3: Link Your Project

You need your project reference ID. You can find it:
- In your Supabase dashboard URL: `https://app.supabase.com/project/[PROJECT_REF]`
- Or in Project Settings → General → Reference ID

```bash
supabase link --project-ref your-project-ref-id
```

You'll be prompted to enter your database password (set when creating the project).

## Step 4: Initialize Supabase (if needed)

If you haven't initialized Supabase in your project yet:

```bash
supabase init
```

This creates a `.supabase` folder with configuration files.

## Step 5: Run Migrations

Once linked, you can run migrations:

```bash
# If installed via Homebrew:
supabase db push

# If using npx:
npx supabase db push

# Or if installed locally:
npm run supabase:migrate
```

This will push all migrations from `supabase/migrations/` to your remote database.

## Alternative: Using Direct SQL Files

If you prefer to keep your current structure, you can also use:

```bash
# Apply migrations directly
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

## Step 6: Verify Migrations

Check that migrations were applied:

```bash
# List applied migrations
supabase migration list

# Or check in Supabase dashboard → Table Editor
```

## Troubleshooting

### "Command not found: supabase"
- If using Homebrew: Make sure installation completed successfully
- Use `npx supabase` instead (no installation needed)
- Or install locally: `npm install supabase --save-dev` then use `npx supabase`

### "Project not found"
- Verify your project reference ID is correct
- Make sure you're logged in: `supabase login`

### "Database password required"
- You set this when creating your Supabase project
- If forgotten, reset it in Project Settings → Database → Reset Database Password

### "Migration files not found"
- Make sure migrations are in `supabase/migrations/` folder
- Check file naming: `YYYYMMDDHHMMSS_description.sql` or numbered like `001_*.sql`

## Recommended Workflow

1. **Development**: Use `supabase db push` to apply migrations
2. **Production**: Use Supabase dashboard SQL Editor for production deployments
3. **Version Control**: Keep migrations in `supabase/migrations/` folder

## Quick Commands Reference

**If installed via Homebrew:**
```bash
# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Create new migration
supabase migration new migration_name

# List migrations
supabase migration list

# Check status
supabase status
```

**If using npx (no installation):**
```bash
# Login
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push

# List migrations
npx supabase migration list
```

## Next Steps

After running migrations:
1. Verify tables in Supabase dashboard
2. Set up storage bucket (see `PROFILE_SETUP.md`)
3. Test your app!

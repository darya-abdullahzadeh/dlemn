# Quick Start: Run Migrations via Terminal

## Option 1: Using Homebrew (Recommended for macOS)

### Step 1: Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### Step 2: Login
```bash
supabase login
```
This opens your browser to authenticate.

### Step 3: Link Your Project
```bash
# Get your project ref from Supabase dashboard URL:
# https://app.supabase.com/project/[PROJECT_REF]
supabase link --project-ref YOUR_PROJECT_REF
```

You'll be prompted for your database password (set when creating the project).

### Step 4: Run Migrations
```bash
supabase db push
```

That's it! All migrations in `supabase/migrations/` will be applied.

---

## Option 2: Using npx (No Installation)

If you don't want to install anything, use npx:

### Step 1: Login
```bash
npx supabase login
```

### Step 2: Link Project
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Run Migrations
```bash
npx supabase db push
```

---

## Verify Migrations

After running migrations, verify in Supabase dashboard:
1. Go to **Table Editor**
2. You should see: `profiles`, `swipes`, `matches`, `conversations`, `messages`

Or check via CLI:
```bash
# If using Homebrew:
supabase migration list

# If using npx:
npx supabase migration list
```

---

## Troubleshooting

### "Project ref not found"
- Check your Supabase dashboard URL for the project ref
- Format: `https://app.supabase.com/project/[PROJECT_REF]`

### "Database password required"
- This is the password you set when creating your Supabase project
- Reset it in: Project Settings → Database → Reset Database Password

### "Migration files not found"
- Make sure migrations are in `supabase/migrations/` folder
- Check that files exist: `001_create_profiles_table.sql`, etc.

---

## Next Steps

After migrations are complete:
1. ✅ Set up Storage bucket (see `PROFILE_SETUP.md`)
2. ✅ Test your app!

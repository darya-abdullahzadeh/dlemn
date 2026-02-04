# Profile Setup Guide

This guide will help you set up the user profile system with Supabase.

## Prerequisites

- Supabase project created (see `SUPABASE_SETUP.md`)
- Environment variables configured

## Step 1: Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_profiles_table.sql`
4. Paste and run the SQL in the SQL Editor

This will create:
- `profiles` table with all required fields
- Row Level Security (RLS) policies
- Automatic profile creation trigger when users sign up
- Automatic `updated_at` timestamp trigger

## Step 2: Set Up Storage Bucket for Profile Photos

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it `profile-photos`
4. Make it **Public** (so profile photos can be viewed)
5. Click **Create bucket**

### Set Up Storage Policies

After creating the bucket, you need to set up policies:

1. Go to **Storage** → **profile-photos** → **Policies**
2. Click **New Policy**

**Policy 1: Allow authenticated users to upload**
- Policy name: `Users can upload their own profile photos`
- Allowed operation: `INSERT`
- Policy definition:
```sql
(bucket_id = 'profile-photos'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
```

**Policy 2: Allow public read access**
- Policy name: `Anyone can view profile photos`
- Allowed operation: `SELECT`
- Policy definition:
```sql
bucket_id = 'profile-photos'::text
```

**Policy 3: Allow users to update their own photos**
- Policy name: `Users can update their own profile photos`
- Allowed operation: `UPDATE`
- Policy definition:
```sql
(bucket_id = 'profile-photos'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
```

**Policy 4: Allow users to delete their own photos**
- Policy name: `Users can delete their own profile photos`
- Allowed operation: `DELETE`
- Policy definition:
```sql
(bucket_id = 'profile-photos'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
```

## Step 3: Install Dependencies

Run the following command to install the image picker:

```bash
npm install
```

The `expo-image-picker` package is already added to `package.json`.

## Step 4: Test the Profile System

1. Sign up or log in to your app
2. Navigate to the **Profile** tab
3. Fill in your profile information:
   - About
   - Age
   - Location
   - Interests (comma-separated)
4. Upload a profile photo
5. Click **Save Profile**

## Profile Fields

The profile system includes the following fields:

- **About**: Text description about the user
- **Interests**: Array of interests (stored as comma-separated in the form)
- **Profile Photo**: URL to the uploaded image in Supabase Storage
- **Age**: Integer value
- **Location**: Text location string

## File Structure

```
app/
  (tabs)/
    profile.tsx          # Profile screen component

contexts/
  profile-context.tsx   # Profile context provider

lib/
  profile-service.ts    # Supabase profile operations

supabase/
  migrations/
    001_create_profiles_table.sql  # Database migration
```

## Usage

### Using Profile Context

```tsx
import { useProfile } from '@/contexts/profile-context';

function MyComponent() {
  const { profile, loading, updateProfile, refreshProfile } = useProfile();

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>{profile?.about}</Text>
      <Text>Age: {profile?.age}</Text>
      <Text>Location: {profile?.location}</Text>
    </View>
  );
}
```

### Updating Profile

```tsx
const { updateProfile } = useProfile();

await updateProfile({
  about: 'New about text',
  age: 25,
  location: 'New York',
  interests: ['hiking', 'reading'],
});
```

## Troubleshooting

### "Profile not found" error
- Make sure the migration has been run
- Check that the user exists in `auth.users`
- Verify RLS policies are set up correctly

### "Storage bucket not found" error
- Ensure the `profile-photos` bucket exists
- Check that the bucket name matches exactly

### Image upload fails
- Verify storage policies are set up correctly
- Check that the bucket is public (for viewing)
- Ensure the user is authenticated

### Profile photo not displaying
- Check that the bucket is public
- Verify the URL is correct
- Check browser console for CORS errors

## Next Steps

1. Add profile validation
2. Add profile completion percentage
3. Add profile search/filtering
4. Add profile verification badges
5. Add multiple photos support

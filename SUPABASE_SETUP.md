# Supabase Authentication Setup Guide

Supabase authentication has been successfully integrated into your app!

## What's Been Set Up

✅ Supabase client configured with secure storage
✅ Authentication context/provider
✅ Login and Signup screens
✅ Protected route handling
✅ Automatic session management

## Getting Started

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to finish setting up

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 3. Set Environment Variables

Create a `.env` file in the root of your project:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Make sure `.env` is in your `.gitignore` file to keep your keys secure!

### 4. Install Environment Variables Package

For Expo to read `.env` files, install `expo-constants` (already installed) and use `expo-constants` or install `react-native-dotenv`:

```bash
npm install react-native-dotenv
```

Or use Expo's built-in support by adding to `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseAnonKey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

### 5. Configure Supabase Auth Settings

In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your app's redirect URLs:
   - For development: `datingapp://`
   - For production: Your production URL

3. Go to **Authentication** → **Email Templates** (optional)
   - Customize email templates if needed

## File Structure

```
app/
  (auth)/
    login.tsx          # Login screen
    signup.tsx         # Signup screen
    _layout.tsx        # Auth layout
  (tabs)/              # Protected routes (require auth)
  index.tsx            # Root route (handles auth redirect)
  _layout.tsx          # Root layout with AuthProvider

contexts/
  auth-context.tsx     # Authentication context

lib/
  supabase.ts          # Supabase client configuration
```

## Usage

### Using Auth in Components

```tsx
import { useAuth } from '@/contexts/auth-context';

export function MyComponent() {
  const { user, signOut, loading } = useAuth();

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>Not logged in</Text>;

  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}
```

### Protected Routes

Routes in `app/(tabs)/` are automatically protected. The `app/index.tsx` file handles redirecting:
- Authenticated users → `/(tabs)`
- Unauthenticated users → `/(auth)/login`

### Sign Out

```tsx
const { signOut } = useAuth();
await signOut();
```

## Features

- ✅ Email/Password authentication
- ✅ Secure token storage (Expo SecureStore)
- ✅ Automatic session refresh
- ✅ Protected routes
- ✅ Loading states
- ✅ Error handling

## Next Steps

1. **Add Social Auth** (Google, Apple, etc.)
   - Configure in Supabase dashboard
   - Add providers to `lib/supabase.ts`

2. **Add Profile Management**
   - Create a profiles table in Supabase
   - Add profile screens

3. **Add Password Reset**
   - Create a forgot password screen
   - Use `supabase.auth.resetPasswordForEmail()`

4. **Add Email Verification**
   - Configure email templates in Supabase
   - Add verification status check

## Troubleshooting

### "Invalid API key" error
- Check that your `.env` file has the correct values
- Make sure you're using the `anon` key, not the `service_role` key

### Session not persisting
- Check that `expo-secure-store` is properly installed
- Verify the storage adapter in `lib/supabase.ts`

### Redirect not working
- Check your redirect URLs in Supabase dashboard
- Verify the scheme in `app.json` matches your redirect URL

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

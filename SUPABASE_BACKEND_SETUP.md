# Supabase Backend Setup Guide

This guide covers the complete Supabase backend setup for the dating app.

## Database Migrations

Run these migrations in order in your Supabase SQL Editor:

### 1. Profiles Table (`001_create_profiles_table.sql`)
- Creates the `profiles` table
- Sets up RLS policies
- Auto-creates profile on user signup

### 2. Swipes Table (`002_create_swipes_table.sql`)
- Tracks user swipes (likes/dislikes)
- Creates indexes for performance

### 3. Matches Table (`003_create_matches_table.sql`)
- Tracks mutual likes (matches)
- Auto-creates matches when two users like each other
- Creates conversation automatically when match is created

### 4. Conversations and Messages (`004_create_conversations_and_messages.sql`)
- Creates conversations table (linked to matches)
- Creates messages table
- Auto-updates conversation timestamp when messages are sent

## Running Migrations

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `001_create_profiles_table.sql`
   - `002_create_swipes_table.sql`
   - `003_create_matches_table.sql`
   - `004_create_conversations_and_messages.sql`

## Database Schema Overview

```
auth.users (Supabase built-in)
  └── profiles (1:1)
      ├── id (FK to auth.users)
      ├── about
      ├── interests[]
      ├── profile_photo_url
      ├── age
      └── location

swipes
  ├── swiper_id (FK to auth.users)
  ├── swiped_id (FK to auth.users)
  └── action (like/dislike/super_like)

matches
  ├── user1_id (FK to auth.users)
  ├── user2_id (FK to auth.users)
  └── created_at

conversations
  ├── match_id (FK to matches)
  ├── user1_id (FK to auth.users)
  ├── user2_id (FK to auth.users)
  └── last_message_at

messages
  ├── conversation_id (FK to conversations)
  ├── sender_id (FK to auth.users)
  ├── content
  └── read_at
```

## Backend Services

### `lib/profile-service.ts`
- `getProfile()` - Get profile by user ID
- `getCurrentUserProfile()` - Get current user's profile
- `updateProfile()` - Update profile
- `uploadProfilePhoto()` - Upload profile photo to storage

### `lib/explore-service.ts`
- `getExploreProfiles()` - Get profiles to explore (not yet swiped)
- `recordSwipe()` - Record a swipe action
- `hasSwiped()` - Check if user has swiped on a profile

### `lib/matches-service.ts`
- `getMatches()` - Get all matches for current user
- `getMatch()` - Get a specific match

### `lib/messages-service.ts`
- `getConversations()` - Get all conversations
- `getMessages()` - Get messages for a conversation
- `sendMessage()` - Send a message
- `markMessagesAsRead()` - Mark messages as read

## Features

### Automatic Match Creation
When two users swipe right (like) on each other, a match is automatically created via database trigger.

### Automatic Conversation Creation
When a match is created, a conversation is automatically created via database trigger.

### Real-time Updates
All services use Supabase queries that can be extended with real-time subscriptions for live updates.

## Storage Setup

Make sure you've set up the `profile-photos` storage bucket (see `PROFILE_SETUP.md`).

## Testing

1. Create test users
2. Complete their profiles
3. Test swiping functionality
4. Verify matches are created automatically
5. Test messaging functionality

## Next Steps

1. **Add Real-time Subscriptions**
   - Subscribe to new matches
   - Subscribe to new messages
   - Subscribe to conversation updates

2. **Add Name Field to Profiles**
   - Update migration to include `name` field
   - Update UserProfile interface
   - Update profile form

3. **Add Distance Calculation**
   - Store user coordinates
   - Calculate distance between users
   - Filter by distance

4. **Add Filters**
   - Age range filter
   - Distance filter
   - Interest matching

5. **Add Super Like Feature**
   - Track super likes
   - Show super like indicator
   - Limit super likes per day

## Troubleshooting

### "Relation does not exist" error
- Make sure all migrations have been run
- Check table names match exactly

### "Permission denied" error
- Verify RLS policies are set up correctly
- Check that user is authenticated

### Matches not creating automatically
- Verify triggers are created
- Check trigger function permissions

### Messages not appearing
- Verify conversation exists for the match
- Check message RLS policies
- Verify sender_id matches authenticated user

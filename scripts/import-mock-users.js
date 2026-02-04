#!/usr/bin/env node

/**
 * Script to import mock users into Supabase
 * Creates users with complete profiles except for interests
 * 
 * Usage:
 *   node scripts/import-mock-users.js
 * 
 * Requires:
 *   - EXPO_PUBLIC_SUPABASE_URL environment variable
 *   - SUPABASE_SERVICE_ROLE_KEY environment variable (for admin access)
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load dotenv from project root
try {
  const dotenv = require('dotenv');
  const envPath = path.resolve(__dirname, '..', '.env');
  
  // Check if .env file exists
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✓ Loaded .env file from:', envPath);
  } else {
    console.log('⚠️  .env file not found at:', envPath);
    console.log('   Trying default dotenv.config()...');
    dotenv.config();
  }
} catch (e) {
  // dotenv not installed, environment variables should be set manually
  console.log('ℹ️  dotenv not found, using environment variables directly');
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Show what we found (without exposing the full key)
console.log('\n📋 Environment Variables Check:');
console.log('   EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? `✓ (${supabaseUrl.substring(0, 30)}...)` : '✗ Missing');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? `✓ (${supabaseServiceRoleKey.substring(0, 20)}...)` : '✗ Missing');
console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? `✓ (found)` : '✗ Missing');

if (!supabaseUrl) {
  console.error('\n❌ Missing EXPO_PUBLIC_SUPABASE_URL!');
  process.exit(1);
}

if (!supabaseServiceRoleKey) {
  console.error('\n❌ Missing SUPABASE_SERVICE_ROLE_KEY!');
  console.error('\n⚠️  IMPORTANT: The anon key cannot create users via admin API.');
  console.error('   You MUST use the service_role key for this script.');
  console.error('\nTo get your service role key:');
  console.error('   1. Go to your Supabase dashboard');
  console.error('   2. Navigate to Settings → API');
  console.error('   3. Copy the "service_role" key (NOT the anon key)');
  console.error('   4. Add it to your .env file as: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('\n⚠️  Keep the service_role key SECRET - it bypasses all security!');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Mock user data
const mockUsers = [
  {
    email: 'alice.johnson@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Love traveling, trying new restaurants, and weekend hikes. Looking for someone who shares my passion for adventure and good food.',
      age: 28,
      location: 'San Francisco, CA',
      profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'bob.smith@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Software engineer by day, photographer by night. I enjoy coffee shops, indie music, and exploring the city on my bike.',
      age: 32,
      location: 'New York, NY',
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'charlie.brown@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Fitness enthusiast and bookworm. I love morning runs, cooking healthy meals, and reading sci-fi novels. Looking for someone to share adventures with.',
      age: 26,
      location: 'Austin, TX',
      profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'diana.prince@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Yoga instructor and plant mom. I enjoy farmers markets, meditation, and spending time in nature. Seeking meaningful connections.',
      age: 30,
      location: 'Portland, OR',
      profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'emma.wilson@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Marketing professional who loves art galleries, wine tasting, and live music. Always up for trying something new and exciting.',
      age: 29,
      location: 'Los Angeles, CA',
      profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'frank.miller@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Chef and food blogger. Passionate about cooking, trying new cuisines, and hosting dinner parties. Looking for someone who appreciates good food.',
      age: 35,
      location: 'Chicago, IL',
      profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'grace.lee@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Graphic designer and illustrator. I love museums, vintage shopping, and sketching in cafes. Seeking someone creative and kind-hearted.',
      age: 27,
      location: 'Seattle, WA',
      profile_photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'henry.davis@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Teacher and outdoor enthusiast. I enjoy camping, rock climbing, and teaching kids about nature. Looking for an adventurous partner.',
      age: 31,
      location: 'Denver, CO',
      profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'isabella.martinez@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Dancer and fitness coach. I love salsa dancing, beach volleyball, and healthy living. Seeking someone active and fun-loving.',
      age: 25,
      location: 'Miami, FL',
      profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    },
  },
  {
    email: 'jack.taylor@example.com',
    password: 'mockuser123',
    profile: {
      about: 'Musician and music producer. I play guitar, love jazz clubs, and enjoy discovering new artists. Looking for someone who shares my love for music.',
      age: 33,
      location: 'Nashville, TN',
      profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    },
  },
];

async function importMockUsers() {
  console.log('🚀 Starting mock user import...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const mockUser of mockUsers) {
    try {
      console.log(`Creating user: ${mockUser.email}...`);

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: mockUser.email,
        password: mockUser.password,
        email_confirm: true, // Auto-confirm email
      });

      if (authError) {
        // Check if user already exists
        if (authError.message.includes('already registered') || 
            authError.message.includes('already exists') ||
            authError.message.includes('User already registered')) {
          console.log(`  ⚠️  User ${mockUser.email} already exists, skipping...`);
          continue;
        }
        
        // Provide helpful error message
        if (authError.message.includes('not allowed') || authError.message.includes('User not allowed')) {
          console.error(`  ❌ Permission denied. Make sure you're using the SERVICE_ROLE key, not the anon key.`);
          console.error(`     Error details: ${authError.message}`);
        }
        
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user: no user data returned');
      }

      const userId = authData.user.id;
      console.log(`  ✓ User created with ID: ${userId}`);

      // Create profile (interests will be null/undefined as requested)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          about: mockUser.profile.about,
          age: mockUser.profile.age,
          location: mockUser.profile.location,
          profile_photo_url: mockUser.profile.profile_photo_url,
          interests: null, // Explicitly set to null as requested
        }, {
          onConflict: 'id',
        });

      if (profileError) {
        throw profileError;
      }

      console.log(`  ✓ Profile created successfully\n`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Error creating user ${mockUser.email}:`, error.message);
      errors.push({ email: mockUser.email, error: error.message });
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log(`  ✓ Successfully imported: ${successCount} users`);
  console.log(`  ❌ Errors: ${errorCount} users`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(({ email, error }) => {
      console.log(`  - ${email}: ${error}`);
    });
  }

  console.log('\n✅ Mock user import completed!');
}

// Run the import
importMockUsers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

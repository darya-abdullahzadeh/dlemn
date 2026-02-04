#!/usr/bin/env node

/**
 * Diagnostic script to test if the match trigger is working
 * This will help identify why matches aren't being created
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load dotenv
try {
  const dotenv = require('dotenv');
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }
} catch (e) {
  console.log('dotenv not found');
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testMatchTrigger() {
  console.log('🔍 Testing match trigger...\n');

  // Get all users
  const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (usersError || !users || users.users.length < 2) {
    console.error('❌ Need at least 2 users to test. Found:', users?.users?.length || 0);
    return;
  }

  const user1 = users.users[0];
  const user2 = users.users[1];

  console.log(`Testing with:`);
  console.log(`  User 1: ${user1.email} (${user1.id})`);
  console.log(`  User 2: ${user2.email} (${user2.id})\n`);

  // Check existing swipes
  const { data: existingSwipes } = await supabaseAdmin
    .from('swipes')
    .select('*')
    .or(`swiper_id.eq.${user1.id},swiper_id.eq.${user2.id}`);

  console.log('📊 Existing swipes:', existingSwipes?.length || 0);
  if (existingSwipes && existingSwipes.length > 0) {
    existingSwipes.forEach(swipe => {
      console.log(`  - ${swipe.swiper_id === user1.id ? 'User 1' : 'User 2'} → ${swipe.swiped_id === user1.id ? 'User 1' : 'User 2'}: ${swipe.action}`);
    });
  }

  // Check existing matches
  const { data: existingMatches } = await supabaseAdmin
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user1.id},user2_id.eq.${user1.id}`)
    .or(`user1_id.eq.${user2.id},user2_id.eq.${user2.id}`);

  console.log('\n📊 Existing matches:', existingMatches?.length || 0);
  if (existingMatches && existingMatches.length > 0) {
    existingMatches.forEach(match => {
      console.log(`  - Match between ${match.user1_id} and ${match.user2_id}`);
    });
  }

  // Test: User 1 likes User 2
  console.log('\n🔄 Step 1: User 1 likes User 2...');
  const { data: swipe1, error: swipe1Error } = await supabaseAdmin
    .from('swipes')
    .upsert({
      swiper_id: user1.id,
      swiped_id: user2.id,
      action: 'like',
    }, {
      onConflict: 'swiper_id,swiped_id'
    })
    .select()
    .single();

  if (swipe1Error) {
    console.error('❌ Error creating swipe 1:', swipe1Error);
    return;
  }
  console.log('✓ Swipe 1 created');

  // Check for match (should be none yet)
  const { data: matchesAfter1 } = await supabaseAdmin
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user1.id},user2_id.eq.${user1.id}`)
    .or(`user1_id.eq.${user2.id},user2_id.eq.${user2.id}`);
  
  console.log(`  Matches after swipe 1: ${matchesAfter1?.length || 0} (expected: 0)`);

  // Test: User 2 likes User 1 (should create match)
  console.log('\n🔄 Step 2: User 2 likes User 1...');
  const { data: swipe2, error: swipe2Error } = await supabaseAdmin
    .from('swipes')
    .upsert({
      swiper_id: user2.id,
      swiped_id: user1.id,
      action: 'like',
    }, {
      onConflict: 'swiper_id,swiped_id'
    })
    .select()
    .single();

  if (swipe2Error) {
    console.error('❌ Error creating swipe 2:', swipe2Error);
    return;
  }
  console.log('✓ Swipe 2 created');

  // Wait a moment for trigger to execute
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check for match (should be 1 now)
  const { data: matchesAfter2 } = await supabaseAdmin
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user1.id},user2_id.eq.${user1.id}`)
    .or(`user1_id.eq.${user2.id},user2_id.eq.${user2.id}`);

  console.log(`\n📊 Matches after swipe 2: ${matchesAfter2?.length || 0} (expected: 1)`);
  
  if (matchesAfter2 && matchesAfter2.length > 0) {
    console.log('✅ SUCCESS! Match was created automatically!');
    matchesAfter2.forEach(match => {
      console.log(`  - Match ID: ${match.id}`);
      console.log(`    User 1: ${match.user1_id}`);
      console.log(`    User 2: ${match.user2_id}`);
      console.log(`    Created: ${match.created_at}`);
    });
  } else {
    console.log('❌ FAILED! Match was NOT created.');
    console.log('\n🔍 Checking trigger status...');
    
    // Check if trigger exists
    const { data: triggerCheck } = await supabaseAdmin.rpc('pg_get_triggerdef', {
      tgname: 'on_mutual_like_create_match'
    }).catch(() => ({ data: null }));
    
    if (!triggerCheck) {
      console.log('⚠️  Could not verify trigger. Please check:');
      console.log('   1. Run migration 003_create_matches_table.sql');
      console.log('   2. Verify trigger exists: SELECT * FROM pg_trigger WHERE tgname = \'on_mutual_like_create_match\';');
    }
  }

  // Check all swipes
  const { data: allSwipes } = await supabaseAdmin
    .from('swipes')
    .select('*')
    .or(`swiper_id.eq.${user1.id},swiper_id.eq.${user2.id}`);

  console.log('\n📊 Final swipe count:', allSwipes?.length || 0);
}

testMatchTrigger()
  .then(() => {
    console.log('\n✅ Test complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });

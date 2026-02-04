import { supabase } from './supabase';
import { UserProfile } from './profile-service';

export interface SwipeAction {
  swiped_id: string;
  action: 'like' | 'dislike' | 'super_like';
}

/**
 * Get profiles to explore (users not yet swiped by current user)
 */
export async function getExploreProfiles(
  limit: number = 10
): Promise<{ data: UserProfile[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    // Get IDs of users already swiped
    const { data: swipedUsers } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', user.id);

    const swipedIds = swipedUsers?.map(s => s.swiped_id) || [];
    swipedIds.push(user.id); // Exclude self

    // Get all profiles first, then filter in memory
    // (Supabase doesn't support NOT IN with array easily)
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .limit(limit * 2); // Fetch more to account for filtering

    if (fetchError) {
      return { data: null, error: fetchError };
    }

    // Filter out swiped users and self
    const filteredProfiles = (allProfiles || []).filter(
      (profile) => !swipedIds.includes(profile.id)
    ).slice(0, limit);

    return { data: filteredProfiles, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch profiles' } };
  }
}

/**
 * Record a swipe action (like/dislike)
 */
export async function recordSwipe(
  swiped_id: string,
  action: 'like' | 'dislike' | 'super_like'
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    const { data, error } = await supabase
      .from('swipes')
      .upsert({
        swiper_id: user.id,
        swiped_id,
        action,
      }, {
        onConflict: 'swiper_id,swiped_id'
      })
      .select()
      .single();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to record swipe' } };
  }
}

/**
 * Check if current user has swiped on a profile
 */
export async function hasSwiped(swiped_id: string): Promise<{ data: boolean; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: false, error: { message: 'No authenticated user' } };
    }

    const { data, error } = await supabase
      .from('swipes')
      .select('id')
      .eq('swiper_id', user.id)
      .eq('swiped_id', swiped_id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return { data: false, error };
    }

    return { data: !!data, error: null };
  } catch (error: any) {
    return { data: false, error: { message: error.message || 'Failed to check swipe' } };
  }
}

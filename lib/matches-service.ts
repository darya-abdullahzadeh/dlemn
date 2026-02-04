import { supabase } from './supabase';
import { UserProfile } from './profile-service';

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  matched_user?: UserProfile;
}

/**
 * Get all matches for current user
 */
export async function getMatches(): Promise<{ data: Match[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    // Get matches where current user is either user1 or user2
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    // Enrich matches with matched user's profile
    const enrichedMatches = await Promise.all(
      (matches || []).map(async (match) => {
        const matchedUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', matchedUserId)
          .single();

        return {
          ...match,
          matched_user: profile || undefined,
        };
      })
    );

    return { data: enrichedMatches, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch matches' } };
  }
}

/**
 * Get a specific match by ID
 */
export async function getMatch(matchId: string): Promise<{ data: Match | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .single();

    if (error) {
      return { data: null, error };
    }

    const matchedUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', matchedUserId)
      .single();

    return {
      data: {
        ...match,
        matched_user: profile || undefined,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch match' } };
  }
}

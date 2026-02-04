import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  about?: string;
  interests?: string[];
  profile_photo_url?: string;
  age?: number;
  location?: string;
  name?: string; // Display name (extracted from email or location)
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  about?: string;
  interests?: string[];
  profile_photo_url?: string;
  age?: number;
  location?: string;
}

/**
 * Get user profile by user ID
 */
export async function getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

/**
 * Get current user's profile
 * Creates profile if it doesn't exist
 */
export async function getCurrentUserProfile(): Promise<{ data: UserProfile | null; error: any }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'No authenticated user' } };
  }

  const { data, error } = await getProfile(user.id);
  
  // If profile doesn't exist, create it
  if (error && error.code === 'PGRST116') {
    console.log('[Profile Service] Profile not found, creating new profile for user:', user.id);
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({ id: user.id })
      .select()
      .single();
    
    if (createError) {
      console.error('[Profile Service] Failed to create profile:', createError);
      return { data: null, error: createError };
    }
    
    return { data: newProfile, error: null };
  }

  return { data, error };
}

/**
 * Update user profile
 * Uses upsert to create profile if it doesn't exist
 */
export async function updateProfile(
  userId: string,
  updates: UpdateProfileData
): Promise<{ data: UserProfile | null; error: any }> {
  console.log('[Profile Service] Updating profile:', { userId, updates });
  
  // First check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  console.log('[Profile Service] Existing profile check:', existingProfile ? 'Found' : 'Not found');

  // Use upsert to insert if doesn't exist, update if exists
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
    }, {
      onConflict: 'id'
    })
    .select()
    .single();

  if (error) {
    console.error('[Profile Service] Update error:', error);
    console.error('[Profile Service] Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  } else {
    console.log('[Profile Service] Update successful:', data);
  }

  return { data, error };
}

/**
 * Update current user's profile
 */
export async function updateCurrentUserProfile(
  updates: UpdateProfileData
): Promise<{ data: UserProfile | null; error: any }> {
  console.log('[Profile Service] Updating current user profile:', updates);
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('[Profile Service] Auth error:', authError);
    return { data: null, error: authError };
  }
  
  if (!user) {
    console.error('[Profile Service] No authenticated user');
    return { data: null, error: { message: 'No authenticated user' } };
  }

  console.log('[Profile Service] User ID:', user.id);
  return updateProfile(user.id, updates);
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(
  userId: string,
  fileUri: string,
  fileName: string
): Promise<{ data: { path: string } | null; error: any }> {
  try {
    // Read the file
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const filePath = `profiles/${userId}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      return { data: null, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return { data: { path: urlData.publicUrl }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to upload image' } };
  }
}

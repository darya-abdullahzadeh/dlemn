import { UserProfile, getCurrentUserProfile, updateCurrentUserProfile } from '@/lib/profile-service';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: any;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: profileError } = await getCurrentUserProfile();
    
    if (profileError) {
      setError(profileError);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    console.log('[Profile Context] updateProfile called with:', updates);
    
    if (!user) {
      console.error('[Profile Context] No user found');
      return { error: { message: 'No authenticated user' } };
    }

    setError(null);
    console.log('[Profile Context] Calling updateCurrentUserProfile...');
    const { data, error: updateError } = await updateCurrentUserProfile(updates);
    
    if (updateError) {
      console.error('[Profile Context] Update error:', updateError);
      console.error('[Profile Context] Error object:', JSON.stringify(updateError, null, 2));
      setError(updateError);
      return { error: updateError };
    }

    if (data) {
      console.log('[Profile Context] Profile updated successfully:', data);
      setProfile(data);
    } else {
      console.warn('[Profile Context] Update succeeded but no data returned');
    }
    
    return { error: null };
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

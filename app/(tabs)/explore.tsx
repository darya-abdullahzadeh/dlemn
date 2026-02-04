import { Container, ProfileCard, Row, Screen, Stack, SwipeContainer } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { getExploreProfiles, recordSwipe } from '@/lib/explore-service';
import { UserProfile } from '@/lib/profile-service';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

export default function ExploreScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getExploreProfiles(10);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setProfiles(data || []);
      setCurrentIndex(0);
    }
    setLoading(false);
  };

  const handleSwipe = async (action: 'like' | 'dislike') => {
    if (!profiles[currentIndex] || !user) return;

    const currentProfile = profiles[currentIndex];
    
    // Record the swipe
    await recordSwipe(currentProfile.id, action);
    
    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Load more profiles if we've seen all
      loadProfiles();
    }
  };

  if (loading) {
    return (
      <Screen>
        <SwipeContainer>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ActivityIndicator size="large" />
            <ThemedText>Loading profiles...</ThemedText>
          </Stack>
        </SwipeContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <SwipeContainer>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ThemedText type="subtitle">Error loading profiles</ThemedText>
            <ThemedText>{error.message || 'Please try again later'}</ThemedText>
          </Stack>
        </SwipeContainer>
      </Screen>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <Screen>
      <SwipeContainer>
        <Stack spacing="lg" align="center" justify="center" className="flex-1">
          <ThemedText type="title">Discover</ThemedText>
          
          {!currentProfile ? (
            <Container>
              <Stack spacing="md" align="center">
                <ThemedText type="subtitle">No profiles available</ThemedText>
                <ThemedText>Check back later for new matches!</ThemedText>
              </Stack>
            </Container>
          ) : (
            <>
              <ProfileCard
                imageUrl={currentProfile.profile_photo_url}
                name={undefined} // TODO: Add name field to profiles table or use email
                age={currentProfile.age}
                distance={undefined} // TODO: Calculate distance based on location
              />
              <Row spacing="md" className="w-full px-4">
                <TouchableOpacity
                  onPress={() => handleSwipe('dislike')}
                  className="flex-1 bg-red-500 px-6 py-3 rounded-lg items-center">
                  <Text className="text-white font-semibold">Pass</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSwipe('like')}
                  className="flex-1 bg-green-500 px-6 py-3 rounded-lg items-center">
                  <Text className="text-white font-semibold">Like</Text>
                </TouchableOpacity>
              </Row>
            </>
          )}
        </Stack>
      </SwipeContainer>
    </Screen>
  );
}

import { View, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { UserProfile } from '@/lib/profile-service';
import { Card, Stack, Row } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';

interface ProfileDetailViewProps {
  profile: UserProfile;
}

/**
 * ProfileDetailView - Reusable component for displaying full profile details
 * Used in match detail screens and profile views
 */
export function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  return (
    <ScrollView>
      <Stack spacing="lg">
        {/* Profile Photo */}
        <Card variant="elevated" padding="lg">
          <Stack spacing="md" align="center">
            {profile.profile_photo_url ? (
              <Image
                source={{ uri: profile.profile_photo_url }}
                style={styles.profileImage}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <ThemedText className="text-6xl">👤</ThemedText>
              </View>
            )}
          </Stack>
        </Card>

        {/* About Section */}
        {profile.about && (
          <Card variant="elevated" padding="lg">
            <Stack spacing="sm">
              <ThemedText type="subtitle">About</ThemedText>
              <ThemedText>{profile.about}</ThemedText>
            </Stack>
          </Card>
        )}

        {/* Details */}
        <Card variant="elevated" padding="lg">
          <Stack spacing="md">
            <ThemedText type="subtitle">Details</ThemedText>
            <Stack spacing="sm">
              {profile.age && (
                <Row spacing="md" justify="space-between">
                  <ThemedText className="opacity-70">Age</ThemedText>
                  <ThemedText type="defaultSemiBold">{profile.age}</ThemedText>
                </Row>
              )}
              {profile.location && (
                <Row spacing="md" justify="space-between">
                  <ThemedText className="opacity-70">Location</ThemedText>
                  <ThemedText type="defaultSemiBold">{profile.location}</ThemedText>
                </Row>
              )}
            </Stack>
          </Stack>
        </Card>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card variant="elevated" padding="lg">
            <Stack spacing="sm">
              <ThemedText type="subtitle">Interests</ThemedText>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <ThemedText className="text-sm">{interest}</ThemedText>
                  </View>
                ))}
              </View>
            </Stack>
          </Card>
        )}
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  placeholderImage: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

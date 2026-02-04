import { useState, useEffect } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Screen, Container, Stack, Card, Row } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';
import { useProfile } from '@/contexts/profile-context';
import { uploadProfilePhoto } from '@/lib/profile-service';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    about: '',
    interests: '',
    age: '',
    location: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      console.log('[Profile Screen] Profile loaded:', profile);
      console.log('[Profile Screen] Profile photo URL:', profile.profile_photo_url);
      setFormData({
        about: profile.about || '',
        interests: profile.interests?.join(', ') || '',
        age: profile.age?.toString() || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && user) {
      setIsSaving(true);
      try {
        const fileName = `profile-${Date.now()}.jpg`;
        const { data, error } = await uploadProfilePhoto(
          user.id,
          result.assets[0].uri,
          fileName
        );

        if (error) {
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          setIsSaving(false);
          return;
        }

        if (data?.path) {
          console.log('[Profile Screen] Photo uploaded, updating profile with URL:', data.path);
          const { error: updateError } = await updateProfile({ profile_photo_url: data.path });
          if (updateError) {
            console.error('[Profile Screen] Failed to update profile with photo URL:', updateError);
            Alert.alert('Error', `Failed to update profile: ${updateError?.message || 'Unknown error'}`);
          } else {
            Alert.alert('Success', 'Profile photo updated!');
          }
        }
      } catch (error: any) {
        console.error('[Profile Screen] Image upload error:', error);
        console.error('[Profile Screen] Error details:', JSON.stringify(error, null, 2));
        Alert.alert('Error', `Failed to upload image: ${error?.message || 'Unknown error'}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    console.log('[Profile Screen] handleSave called');
    console.log('[Profile Screen] Form data:', formData);
    setIsSaving(true);
    
    try {
      const interestsArray = formData.interests
        .split(',')
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0);

      const updates: any = {
        about: formData.about || null,
        interests: interestsArray.length > 0 ? interestsArray : null,
        location: formData.location || null,
      };

      if (formData.age) {
        const age = parseInt(formData.age, 10);
        if (!isNaN(age) && age > 0) {
          updates.age = age;
        }
      }

      console.log('[Profile Screen] Prepared updates:', updates);
      console.log('[Profile Screen] Calling updateProfile...');
      
      const { error } = await updateProfile(updates);

      if (error) {
        console.error('[Profile Screen] Update failed:', error);
        console.error('[Profile Screen] Error details:', JSON.stringify(error, null, 2));
        const errorMessage = error?.message || error?.details || 'Failed to update profile. Please try again.';
        Alert.alert('Error', errorMessage);
      } else {
        console.log('[Profile Screen] Update successful!');
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('[Profile Screen] Unexpected error:', error);
      console.error('[Profile Screen] Error stack:', error?.stack);
      Alert.alert('Error', `An unexpected error occurred: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ActivityIndicator size="large" />
            <ThemedText>Loading profile...</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Container paddingY="lg">
          <Stack spacing="lg">
            <ThemedText type="title">My Profile</ThemedText>

            {/* Profile Photo */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="md" align="center">
                <View className="relative">
                  {profile?.profile_photo_url ? (
                    <Image
                      source={{ uri: profile.profile_photo_url }}
                      style={{ width: 128, height: 128, borderRadius: 64 }}
                      contentFit="cover"
                      onError={(error) => {
                        console.error('[Profile Screen] Image load error:', error);
                        console.log('[Profile Screen] Failed URL:', profile.profile_photo_url);
                      }}
                      onLoad={() => {
                        console.log('[Profile Screen] Image loaded successfully:', profile.profile_photo_url);
                      }}
                    />
                  ) : (
                    <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center">
                      <ThemedText className="text-4xl">👤</ThemedText>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handlePickImage}
                  disabled={isSaving}
                  className="bg-blue-500 px-4 py-2 rounded-lg">
                  <Text className="text-white font-semibold">
                    {isSaving ? 'Uploading...' : 'Change Photo'}
                  </Text>
                </TouchableOpacity>
              </Stack>
            </Card>

            {/* About */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="sm">
                <ThemedText type="subtitle">About</ThemedText>
                <TextInput
                  value={formData.about}
                  onChangeText={(text) => setFormData({ ...formData, about: text })}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-lg p-3 text-base min-h-[100px]"
                  style={{ textAlignVertical: 'top' }}
                />
              </Stack>
            </Card>

            {/* Age */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="sm">
                <ThemedText type="subtitle">Age</ThemedText>
                <TextInput
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                  placeholder="Enter your age"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-3 text-base"
                />
              </Stack>
            </Card>

            {/* Location */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="sm">
                <ThemedText type="subtitle">Location</ThemedText>
                <TextInput
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Enter your location"
                  placeholderTextColor="#999"
                  className="border border-gray-300 rounded-lg p-3 text-base"
                />
              </Stack>
            </Card>

            {/* Interests */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="sm">
                <ThemedText type="subtitle">Interests</ThemedText>
                <Text className="text-sm opacity-70 mb-2">
                  Separate interests with commas (e.g., hiking, reading, cooking)
                </Text>
                <TextInput
                  value={formData.interests}
                  onChangeText={(text) => setFormData({ ...formData, interests: text })}
                  placeholder="Enter your interests"
                  placeholderTextColor="#999"
                  multiline
                  className="border border-gray-300 rounded-lg p-3 text-base"
                />
              </Stack>
            </Card>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className={`bg-blue-500 px-6 py-4 rounded-lg items-center ${isSaving ? 'opacity-50' : ''}`}>
              {isSaving ? (
                <Row spacing="sm" align="center">
                  <ActivityIndicator color="#fff" />
                  <Text className="text-white font-semibold text-lg">Saving...</Text>
                </Row>
              ) : (
                <Text className="text-white font-semibold text-lg">Save Profile</Text>
              )}
            </TouchableOpacity>
          </Stack>
        </Container>
      </ScrollView>
    </Screen>
  );
}

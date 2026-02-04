import { router } from 'expo-router';
import { Alert, Text, TouchableOpacity } from 'react-native';

import { Card, Container, Row, Screen, Stack } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <Screen>
      <Container paddingY="lg">
        {user && (
          <Card variant="elevated" padding="lg">
            <Stack spacing="md">
              <ThemedText type="subtitle">Signed in as:</ThemedText>
              <ThemedText type="defaultSemiBold">{user.email}</ThemedText>
              
              <Row spacing="sm" justify="space-between" align="center">
                <TouchableOpacity
                  onPress={handleSignOut}
                  className="bg-red-500 rounded-lg px-4 py-2 flex-1 items-center">
                  <Text className="text-white text-base font-semibold">
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </Row>
            </Stack>
          </Card>
        )}
      </Container>
    </Screen>
  );
}

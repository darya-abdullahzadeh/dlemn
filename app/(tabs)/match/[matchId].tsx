import { Card, Container, Row, Screen, Stack } from '@/components/layouts';
import { ProfileDetailView } from '@/components/profile-detail-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { getMatch, Match } from '@/lib/matches-service';
import { getConversationByMatchId } from '@/lib/messages-service';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';

export default function MatchDetailScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (matchId && user) {
      loadMatch();
    }
  }, [matchId, user]);

  const loadMatch = async () => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getMatch(matchId);

    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setMatch(data);

      // Load conversation for this match
      const { data: conversation } = await getConversationByMatchId(matchId);
      if (conversation) {
        setConversationId(conversation.id);
      }
    }

    setLoading(false);
  };

  const handleMessagePress = async () => {
    if (!conversationId) {
      Alert.alert('Error', 'Conversation not found. Please try again.');
      return;
    }

    // Navigate to chat screen
    router.push(`/messages/${conversationId}`);
  };

  if (loading) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ActivityIndicator size="large" />
            <ThemedText>Loading match...</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  if (error || !match) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ThemedText type="subtitle">Error loading match</ThemedText>
            <ThemedText>{error?.message || 'Match not found'}</ThemedText>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-blue-500 px-6 py-3 rounded-lg">
              <ThemedText className="text-white font-semibold">Go Back</ThemedText>
            </TouchableOpacity>
          </Stack>
        </Container>
      </Screen>
    );
  }

  const matchedUser = match.matched_user;

  if (!matchedUser) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ThemedText type="subtitle">Profile not found</ThemedText>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-blue-500 px-6 py-3 rounded-lg">
              <ThemedText className="text-white font-semibold">Go Back</ThemedText>
            </TouchableOpacity>
          </Stack>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <Container paddingY="lg">
        <Stack spacing="lg">
          {/* Header */}
          <Row spacing="md" align="center" justify="space-between">
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText className="text-blue-500 font-semibold">← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title">Match</ThemedText>
            <View style={{ width: 60 }} />
          </Row>

          {/* Profile Detail View */}
          <ProfileDetailView profile={matchedUser} />

          {/* Message Button */}
          <Card variant="elevated" padding="lg">
            <TouchableOpacity
              onPress={handleMessagePress}
              className="bg-blue-500 px-6 py-4 rounded-lg items-center"
              disabled={!conversationId}>
              <ThemedText className="text-white font-semibold text-lg">
                {conversationId ? 'Message' : 'Loading...'}
              </ThemedText>
            </TouchableOpacity>
          </Card>
        </Stack>
      </Container>
    </Screen>
  );
}

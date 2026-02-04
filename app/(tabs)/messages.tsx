import { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Screen, Container, Stack, Card, Row } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';
import { getConversations, Conversation } from '@/lib/messages-service';
import { useAuth } from '@/contexts/auth-context';

export default function MessagesScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getConversations();
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  const handleConversationPress = (conversationId: string) => {
    // TODO: Navigate to chat screen
    router.push(`/messages/${conversationId}`);
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ActivityIndicator size="large" />
            <ThemedText>Loading messages...</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ThemedText type="subtitle">Error loading messages</ThemedText>
            <ThemedText>{error.message || 'Please try again later'}</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ThemedText type="title">Messages</ThemedText>

          {conversations.length === 0 ? (
            <Card variant="outlined" padding="xl">
              <Stack spacing="md" align="center">
                <ThemedText type="subtitle">No messages yet</ThemedText>
                <ThemedText>Start a conversation with your matches!</ThemedText>
              </Stack>
            </Card>
          ) : (
            <Stack spacing="sm">
              {conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  onPress={() => handleConversationPress(conversation.id)}>
                  <Card variant="elevated" padding="md">
                    <Row spacing="md" align="center">
                      {conversation.other_user?.profile_photo_url && (
                        <Image
                          source={{ uri: conversation.other_user.profile_photo_url }}
                          className="w-[50px] h-[50px] rounded-full"
                          contentFit="cover"
                        />
                      )}
                      <Stack spacing="xs" className="flex-1">
                        <Row spacing="sm" justify="space-between" align="center">
                          <ThemedText type="defaultSemiBold">
                            {conversation.other_user?.location || 'User'}
                          </ThemedText>
                          <ThemedText className="text-xs opacity-60">
                            {formatTimestamp(conversation.last_message_at)}
                          </ThemedText>
                        </Row>
                        <Row spacing="sm" justify="space-between" align="center">
                          <ThemedText
                            className={`text-sm opacity-70 flex-1 ${(conversation.unread_count || 0) > 0 ? 'font-semibold opacity-100' : ''}`}
                            numberOfLines={1}>
                            {conversation.last_message?.content || 'No messages yet'}
                          </ThemedText>
                          {(conversation.unread_count || 0) > 0 && (
                            <View className="bg-blue-500 min-w-[20px] h-5 rounded-full items-center justify-center px-1.5">
                              <ThemedText className="text-white text-xs font-semibold">
                                {conversation.unread_count}
                              </ThemedText>
                            </View>
                          )}
                        </Row>
                      </Stack>
                    </Row>
                  </Card>
                </TouchableOpacity>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Screen>
  );
}

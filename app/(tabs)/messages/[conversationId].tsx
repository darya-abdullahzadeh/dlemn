import { Container, Row, Screen, Stack } from '@/components/layouts';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { Conversation, getConversation, getMessages, markMessagesAsRead, Message, sendMessage } from '@/lib/messages-service';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (conversationId && user) {
      loadConversation();
      loadMessages();
      markAsRead();
    }
  }, [conversationId, user]);

  const loadConversation = async () => {
    if (!conversationId) return;

    const { data, error } = await getConversation(conversationId);
    if (error) {
      console.error('Error loading conversation:', error);
    } else if (data) {
      console.log('Loaded conversation:', data);
      console.log('Other user profile:', data.other_user);
      console.log('Profile photo URL:', data.other_user?.profile_photo_url);
      setConversation(data);
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getMessages(conversationId);

    if (fetchError) {
      setError(fetchError);
    } else {
      setMessages(data || []);
      // Scroll to bottom after loading
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }

    setLoading(false);
  };

  const markAsRead = async () => {
    if (conversationId) {
      await markMessagesAsRead(conversationId);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !conversationId || sending) return;

    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    const { data, error: sendError } = await sendMessage(conversationId, content);

    if (sendError) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessageText(content); // Restore message text
    } else if (data) {
      // Add new message to list
      setMessages((prev) => [...prev, data]);
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      // Mark as read
      await markAsRead();
    }

    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <Container className="flex-1">
          <Stack spacing="md" className="flex-1">
            {/* Header with Name and Profile Photo */}
            <Row spacing="md" align="center" className="pb-4 pt-2 border-b border-gray-200">
              <TouchableOpacity onPress={() => router.back()}>
                <ThemedText className="text-blue-500 font-semibold">←</ThemedText>
              </TouchableOpacity>
              {conversation?.other_user?.profile_photo_url ? (
                <Image
                  source={{ uri: conversation.other_user.profile_photo_url }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  contentFit="cover"
                  onError={(error) => {
                    console.error('[Chat Screen] Header image load error:', error);
                    console.log('[Chat Screen] Failed URL:', conversation.other_user?.profile_photo_url);
                  }}
                  onLoad={() => {
                    console.log('[Chat Screen] Header image loaded:', conversation.other_user?.profile_photo_url);
                  }}
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                  <ThemedText className="text-lg">👤</ThemedText>
                </View>
              )}
              <Stack spacing="xs" className="flex-1">
                <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                  {conversation?.other_user?.name || conversation?.other_user?.location || 'User'}
                </ThemedText>
                {conversation?.other_user?.age && (
                  <ThemedText className="text-sm opacity-60">
                    {conversation.other_user.age} years old
                  </ThemedText>
                )}
              </Stack>
            </Row>

            {/* Messages List */}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1"
              contentContainerStyle={{ paddingVertical: 16 }}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}>
              <Stack spacing="sm" className="px-4">
                {messages.length === 0 ? (
                  <Stack spacing="md" align="center" className="py-8">
                    <ThemedText className="opacity-60">No messages yet</ThemedText>
                    <ThemedText className="opacity-60 text-sm">Start the conversation!</ThemedText>
                  </Stack>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    return (
                      <Row
                        key={message.id}
                        justify={isOwnMessage ? 'end' : 'start'}
                        align="center"
                        className="mb-2">
                        {!isOwnMessage && message.sender_profile?.profile_photo_url && (
                          <Image
                            source={{ uri: message.sender_profile.profile_photo_url }}
                            style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                            contentFit="cover"
                            onError={(error) => {
                              console.error('[Chat Screen] Message image load error:', error);
                            }}
                          />
                        )}
                        <View
                          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-blue-500 rounded-br-sm'
                              : 'bg-gray-200 rounded-bl-sm'
                          }`}>
                          <ThemedText
                            className={isOwnMessage ? 'text-white' : 'text-gray-900'}
                            style={{ fontSize: 15 }}>
                            {message.content}
                          </ThemedText>
                          <ThemedText
                            className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                            {formatTime(message.created_at)}
                          </ThemedText>
                        </View>
                        {isOwnMessage && (
                          <View className="w-8 h-8 ml-2" />
                        )}
                      </Row>
                    );
                  })
                )}
              </Stack>
            </ScrollView>

            {/* Input Area */}
            <Row spacing="sm" align="center" className="pb-4 pt-2">
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base bg-white"
                style={{ maxHeight: 100 }}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!messageText.trim() || sending}
                className={`bg-blue-500 w-12 h-12 rounded-full items-center justify-center ${
                  !messageText.trim() || sending ? 'opacity-50' : ''
                }`}>
                {sending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText className="text-white font-bold text-lg">→</ThemedText>
                )}
              </TouchableOpacity>
            </Row>
          </Stack>
        </Container>
      </KeyboardAvoidingView>
    </Screen>
  );
}

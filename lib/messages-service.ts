import { supabase } from './supabase';
import { UserProfile } from './profile-service';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender_profile?: UserProfile;
}

export interface Conversation {
  id: string;
  match_id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string | null;
  created_at: string;
  other_user?: UserProfile;
  last_message?: Message;
  unread_count?: number;
}

/**
 * Get all conversations for current user
 */
export async function getConversations(): Promise<{ data: Conversation[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    // Get conversations where user is either user1 or user2
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) {
      return { data: null, error };
    }

    // Enrich conversations with other user's profile and last message
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        
        // Get other user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const lastMessage = messages?.[0] || undefined;

        // Get unread count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('sender_id', otherUserId)
          .is('read_at', null);

        return {
          ...conv,
          other_user: profile || undefined,
          last_message: lastMessage,
          unread_count: count || 0,
        };
      })
    );

    return { data: enrichedConversations, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch conversations' } };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: string,
  limit: number = 50
): Promise<{ data: Message[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    // Verify user has access to this conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .single();

    if (!conversation) {
      return { data: null, error: { message: 'Conversation not found' } };
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error };
    }

    // Enrich messages with sender profiles
    const enrichedMessages = await Promise.all(
      (messages || []).map(async (message) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', message.sender_id)
          .single();

        return {
          ...message,
          sender_profile: profile || undefined,
        };
      })
    );

    return { data: enrichedMessages.reverse(), error: null }; // Reverse to show oldest first
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch messages' } };
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ data: Message | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'No authenticated user' } };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to send message' } };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  conversationId: string
): Promise<{ error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: { message: 'No authenticated user' } };
    }

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

    return { error };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to mark messages as read' } };
  }
}

import { useState, useEffect } from 'react';
import { supabase, Message, Profile } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { User, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Messages() {
  const { profile } = useAuthContext();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchConversations();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url, username),
          recipient:recipient_id(id, display_name, avatar_url, username)
        `)
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map();
      data?.forEach((message) => {
        const partnerId = message.sender_id === profile.id ? message.recipient_id : message.sender_id;
        const partner = message.sender_id === profile.id ? message.recipient : message.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            partner,
            lastMessage: message,
            unreadCount: 0,
          });
        }

        // Count unread messages
        if (message.recipient_id === profile.id && !message.read_at) {
          conversationMap.get(partnerId).unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url, username),
          recipient:recipient_id(id, display_name, avatar_url, username)
        `)
        .or(`and(sender_id.eq.${profile.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${profile.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', partnerId)
        .eq('recipient_id', profile.id)
        .is('read_at', null);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile.id,
          recipient_id: selectedConversation,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="overflow-y-auto h-full">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Start connecting with other gardeners!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.partnerId}
                      onClick={() => setSelectedConversation(conv.partnerId)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                        selectedConversation === conv.partnerId ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          {conv.partner?.avatar_url ? (
                            <img
                              src={conv.partner.avatar_url}
                              alt={conv.partner.display_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {conv.partner?.display_name}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === profile?.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === profile?.id ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
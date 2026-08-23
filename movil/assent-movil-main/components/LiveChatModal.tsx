import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { X, Send, MessageSquareText } from 'lucide-react-native';
import { mobileApi, ChatMessageItem } from '../api/client';

interface LiveChatModalProps {
  visible: boolean;
  onClose: () => void;
  onMessagesUpdated?: (messages: ChatMessageItem[]) => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  visible,
  onClose,
  onMessagesUpdated,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchMessages = async () => {
    try {
      const res = await mobileApi.fetchChatMessages();
      if (res.ok && Array.isArray(res.data)) {
        setMessages(res.data);
        if (onMessagesUpdated) {
          onMessagesUpdated(res.data);
        }
      }
    } catch (e) {
      console.log('[LiveChatModal] Error fetching messages:', e);
    }
  };

  useEffect(() => {
    if (visible) {
      setFetching(true);
      fetchMessages().finally(() => setFetching(false));
      const interval = setInterval(() => {
        fetchMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages, visible]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await mobileApi.sendChatMessage(text);
      if (res.ok && res.data) {
        const newMsgs = [...messages, res.data];
        setMessages(newMsgs);
        if (onMessagesUpdated) {
          onMessagesUpdated(newMsgs);
        }
      } else {
        fetchMessages();
      }
    } catch (e) {
      console.log('[LiveChatModal] Send error:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.onlineDot} />
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>Chat de Soporte</Text>
              <Text style={styles.headerSubtitle}>En línea • Conexión Luz</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X color="#FFFFFF" size={22} />
          </TouchableOpacity>
        </View>

        {/* MESSAGES BODY */}
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {fetching && messages.length === 0 ? (
              <View style={styles.centeredBox}>
                <ActivityIndicator size="large" color="#0D9488" />
              </View>
            ) : messages.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyIconBg}>
                  <MessageSquareText color="#0D9488" size={32} />
                </View>
                <Text style={styles.emptyTitle}>¡Hola! ¿En qué podemos ayudarte hoy?</Text>
                <Text style={styles.emptySubtitle}>
                  Escribe tu mensaje a continuación para iniciar una conversación en vivo con nuestro equipo de atención.
                </Text>
              </View>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <View
                    key={msg.id || `${msg.createdAt}_${Math.random()}`}
                    style={[
                      styles.msgBubbleRow,
                      isAdmin ? styles.msgAlignLeft : styles.msgAlignRight,
                    ]}
                  >
                    <View
                      style={[
                        styles.msgBubble,
                        isAdmin ? styles.adminBubble : styles.clientBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.senderLabel,
                          isAdmin ? styles.adminSenderText : styles.clientSenderText,
                        ]}
                      >
                        {isAdmin ? 'Soporte Conexión Luz' : msg.senderName || 'Tú'}
                      </Text>
                      <Text
                        style={[
                          styles.msgText,
                          isAdmin ? styles.adminMsgText : styles.clientMsgText,
                        ]}
                      >
                        {msg.message}
                      </Text>
                      {msg.createdAt ? (
                        <Text
                          style={[
                            styles.timeText,
                            isAdmin ? styles.adminTimeText : styles.clientTimeText,
                          ]}
                        >
                          {formatTime(msg.createdAt)}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* INPUT BAR */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              multiline={false}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || loading) && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send color="#FFFFFF" size={18} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flexOne: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34D399',
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#E6FFFA',
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  centeredBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: 320,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  msgBubbleRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  msgAlignLeft: {
    justifyContent: 'flex-start',
  },
  msgAlignRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  adminBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clientBubble: {
    backgroundColor: '#0D9488',
    borderTopRightRadius: 4,
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
  },
  adminSenderText: {
    color: '#0F766E',
  },
  clientSenderText: {
    color: '#E6FFFA',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  adminMsgText: {
    color: '#1E293B',
  },
  clientMsgText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  adminTimeText: {
    color: '#94A3B8',
  },
  clientTimeText: {
    color: '#CCFBF1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
});

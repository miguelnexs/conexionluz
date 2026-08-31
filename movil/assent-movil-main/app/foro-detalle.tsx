import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
  Share,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Send,
  ShieldCheck,
  Pin,
  Clock,
  User,
  Tag,
  Lock,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ForumReply } from './foro';

export interface ForumTopicDetail {
  id: number;
  title: string;
  description: string;
  descriptionHtml?: string;
  category: string;
  imageUrl: string | null;
  isPinned: boolean;
  isLocked: boolean;
  isActive: boolean;
  repliesCount: number;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
  createdById?: number | null;
  replies: ForumReply[];
}

export default function ForoDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const isAuthed = !!user;

  const [topic, setTopic] = useState<ForumTopicDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Input de respuesta
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const stripHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return 'Reciente';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Cargar tema y respuestas REALES de la base de datos
  const loadTopicDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await mobileApi.fetchForumTopicDetail(id);
      if (res.ok && res.data) {
        const data = res.data;
        const mappedReplies: ForumReply[] = (data.replies || []).map((r: any) => ({
          id: r.id,
          topicId: r.topicId || r.topic_id || data.id,
          content: r.content,
          contentHtml: r.contentHtml || r.content_html,
          authorName: r.authorName || r.author_name || 'Miembro de la Comunidad',
          patientId: r.patientId || r.patient_id || null,
          parentId: r.parentId || r.parent_id || null,
          isActive: r.isActive !== false,
          createdAt: r.createdAt || r.created_at || 'Reciente',
          updatedAt: r.updatedAt || r.updated_at || 'Reciente',
        }));

        const topicDetail: ForumTopicDetail = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          descriptionHtml: data.descriptionHtml || data.description_html,
          category: data.category || 'General',
          imageUrl: data.imageUrl || null,
          isPinned: !!data.isPinned,
          isLocked: !!data.isLocked,
          isActive: data.isActive !== false,
          repliesCount: data.repliesCount ?? mappedReplies.length,
          likesCount: data.likesCount || 0,
          createdAt: data.createdAt || data.created_at || '',
          updatedAt: data.updatedAt || data.updated_at || '',
          createdById: data.createdById || data.created_by_id || null,
          replies: mappedReplies,
        };

        setTopic(topicDetail);
        setLikesCount(topicDetail.likesCount || 0);
      } else {
        setTopic(null);
      }
    } catch (e) {
      console.warn('Error loading topic from database:', e);
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopicDetail();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTopicDetail();
    setRefreshing(false);
  };

  // Manejar Me Gusta contra el backend
  const handleToggleLike = async () => {
    if (!topic) return;

    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para dar me gusta a este tema.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

    try {
      if (nextLiked) {
        const res = await mobileApi.likeForumTopic(topic.id);
        if (res.ok && res.data?.likesCount !== undefined) {
          setLikesCount(res.data.likesCount);
        }
      } else {
        const res = await mobileApi.unlikeForumTopic(topic.id);
        if (res.ok && res.data?.likesCount !== undefined) {
          setLikesCount(res.data.likesCount);
        }
      }
    } catch (e) {
      console.warn('Error liking topic:', e);
    }
  };

  // Manejar Compartir
  const handleShare = async () => {
    if (!topic) return;
    try {
      await Share.share({
        message: `✨ Lee este diálogo en la Tribu de Conexión Luz®: "${topic.title}" https://conexionluz.com/foro/${topic.id}`,
        title: topic.title,
      });
    } catch {}
  };

  // Enviar Respuesta a la base de datos
  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para responder en el foro de la comunidad.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    if (topic?.isLocked) {
      Alert.alert('Tema Cerrado', 'Este tema ha sido cerrado para nuevas respuestas.');
      return;
    }

    const contentToSend = replyText.trim();
    setReplyText('');
    setIsSubmitting(true);

    try {
      if (topic) {
        const res = await mobileApi.replyForumTopic(topic.id, contentToSend);
        if (res.ok) {
          // Re-cargar respuestas desde la base de datos
          const freshTopic = await mobileApi.fetchForumTopicDetail(topic.id);
          if (freshTopic.ok && freshTopic.data?.replies) {
            const mappedReplies: ForumReply[] = freshTopic.data.replies.map((r: any) => ({
              id: r.id,
              topicId: r.topicId || r.topic_id || topic.id,
              content: r.content,
              contentHtml: r.contentHtml || r.content_html,
              authorName: r.authorName || r.author_name || 'Miembro',
              patientId: r.patientId || r.patient_id || null,
              parentId: r.parentId || r.parent_id || null,
              isActive: r.isActive !== false,
              createdAt: r.createdAt || r.created_at || 'Reciente',
              updatedAt: r.updatedAt || r.updated_at || 'Reciente',
            }));
            setTopic((prev) => prev ? { ...prev, replies: mappedReplies, repliesCount: mappedReplies.length } : null);
          }
        } else {
          Alert.alert('Error', res.error || 'No se pudo enviar tu respuesta.');
        }
      }
    } catch (e: any) {
      console.warn('Error sending reply:', e);
      Alert.alert('Error', e?.message || 'Error al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const getBodyText = () => {
    if (!topic) return '';
    if (topic.description && topic.description.trim()) {
      return topic.description.trim();
    }
    if (topic.descriptionHtml) {
      return stripHtml(topic.descriptionHtml);
    }
    return 'Sin contenido adicional.';
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: topPadding }]}>
        <ActivityIndicator color="#DB2777" size="large" />
        <Text style={styles.loadingText}>Cargando tema del foro...</Text>
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: topPadding }]}>
        <Text style={styles.errorTitle}>Tema no encontrado</Text>
        <Text style={styles.errorSubtitle}>El tema solicitado no existe o fue eliminado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver al Foro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

        {/* 1. TOP HEADER */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft color="#0F172A" size={24} />
          </TouchableOpacity>

          <View style={styles.headerCategoryPill}>
            <Tag color="#DB2777" size={12} />
            <Text style={styles.headerCategoryText}>{topic.category || 'General'}</Text>
          </View>

          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerShareBtn}
            activeOpacity={0.7}
          >
            <Share2 color="#64748B" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DB2777']} />}
        >
          {/* 2. ORIGINAL TOPIC POST */}
          <View style={styles.topicMainCard}>
            {topic.isPinned && (
              <View style={styles.pinnedBanner}>
                <Pin color="#D97706" size={13} />
                <Text style={styles.pinnedBannerText}>Tema Fijado por la Comunidad</Text>
              </View>
            )}

            {topic.isLocked && (
              <View style={styles.lockedBanner}>
                <Lock color="#64748B" size={13} />
                <Text style={styles.lockedBannerText}>Tema Cerrado</Text>
              </View>
            )}

            <Text style={styles.topicMainTitle}>{topic.title}</Text>

            {/* Date info */}
            <View style={styles.dateRow}>
              <Clock color="#94A3B8" size={12} />
              <Text style={styles.timeText}>{formatDate(topic.createdAt)}</Text>
            </View>

            {/* Topic Description Content */}
            <View style={styles.topicBodyBox}>
              <Text style={styles.topicBodyText}>{getBodyText()}</Text>
            </View>

            {/* Action Bar: Like & Replies Count */}
            <View style={styles.topicActionsRow}>
              <TouchableOpacity
                onPress={handleToggleLike}
                style={[styles.likeActionBtn, hasLiked && styles.likeActionBtnActive]}
                activeOpacity={0.8}
              >
                <Heart
                  color={hasLiked ? '#E11D48' : '#64748B'}
                  fill={hasLiked ? '#E11D48' : 'transparent'}
                  size={18}
                />
                <Text style={[styles.likeActionBtnText, hasLiked && styles.likeActionBtnTextActive]}>
                  {likesCount} {likesCount === 1 ? 'Me gusta' : 'Me gusta'}
                </Text>
              </TouchableOpacity>

              <View style={styles.repliesCountBadge}>
                <MessageCircle color="#0284C7" size={16} />
                <Text style={styles.repliesCountBadgeText}>
                  {topic.replies.length} {topic.replies.length === 1 ? 'Respuesta' : 'Respuestas'}
                </Text>
              </View>
            </View>
          </View>

          {/* 3. SAFETY NOTICE */}
          <View style={styles.safetyBox}>
            <ShieldCheck color="#059669" size={18} />
            <Text style={styles.safetyText}>
              Este espacio está protegido. Responde con compasión, respeto y empatía hacia la experiencia ajena.
            </Text>
          </View>

          {/* 4. REPLIES THREAD */}
          <View style={styles.repliesSection}>
            <Text style={styles.repliesSectionTitle}>
              Respuestas de la Comunidad ({topic.replies.length})
            </Text>

            {topic.replies.length === 0 ? (
              <View style={styles.noRepliesBox}>
                <MessageCircle color="#CBD5E1" size={36} />
                <Text style={styles.noRepliesTitle}>Aún no hay respuestas</Text>
                <Text style={styles.noRepliesSubtitle}>
                  Sé el primero en compartir un mensaje de aliento o una perspectiva amorosa.
                </Text>
              </View>
            ) : (
              topic.replies.map((reply, idx) => (
                <View key={reply.id || idx} style={styles.replyCard}>
                  <View style={styles.replyHeader}>
                    <View style={styles.replyAvatarBox}>
                      <User color="#64748B" size={16} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.replyAuthorName}>{reply.authorName}</Text>
                      <Text style={styles.replyTimeText}>{formatDate(reply.createdAt)}</Text>
                    </View>
                  </View>

                  <Text style={styles.replyContentText}>
                    {reply.content || (reply.contentHtml ? stripHtml(reply.contentHtml) : '')}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 5. STICKY BOTTOM REPLY INPUT BAR */}
        {!topic.isLocked && (
          <View style={styles.bottomBarContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.bottomTextInput}
                placeholder="Escribe tu respuesta con respeto..."
                placeholderTextColor="#94A3B8"
                value={replyText}
                onChangeText={setReplyText}
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                onPress={handleSendReply}
                disabled={isSubmitting || !replyText.trim()}
                style={[
                  styles.sendBtn,
                  (!replyText.trim() || isSubmitting) && styles.sendBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Send color="#FFFFFF" size={18} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#DB2777',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  headerCategoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DB2777',
  },
  headerShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topicMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pinnedBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  lockedBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  topicMainTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  topicBodyBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    marginBottom: 16,
  },
  topicBodyText: {
    fontSize: 14.5,
    lineHeight: 23,
    color: '#3B0764',
  },
  topicActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  likeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  likeActionBtnActive: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FDA4AF',
  },
  likeActionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  likeActionBtnTextActive: {
    color: '#E11D48',
  },
  repliesCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  repliesCountBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  safetyText: {
    flex: 1,
    fontSize: 11.5,
    color: '#065F46',
    lineHeight: 17,
  },
  repliesSection: {
    marginTop: 6,
  },
  repliesSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  noRepliesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noRepliesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  noRepliesSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  replyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyAuthorName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  replyTimeText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  replyContentText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
  bottomBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 4,
  },
  bottomTextInput: {
    flex: 1,
    maxHeight: 80,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DB2777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});

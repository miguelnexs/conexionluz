import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import {
  X,
  UserPlus,
  UserCheck,
  Sparkles,
  TreeDeciduous,
  Heart,
  MessageCircle,
  Award,
  CheckCircle2,
  Calendar,
  Shield,
  BookOpen,
} from 'lucide-react-native';
import { CustomVideoPlayer, isVideoMedia } from './CustomVideoPlayer';
import { normalizeMediaUrl } from '../api/client';

const { width } = Dimensions.get('window');

interface PostItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface UserProfileData {
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  bio?: string;
  perfilArbol?: string;
  igaScore?: number;
  followersCount?: number;
  followingCount?: number;
}

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfileData | null;
  userPosts: PostItem[];
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onLikePost?: (postId: string) => void;
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const clean = name.replace(/^(Dra\.|Dr\.|Lic\.|Ing\.)\s+/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || 'U';
}

function getAvatarBgColor(name: string): string {
  const colors = ['#059669', '#0284C7', '#7C3AED', '#DB2777', '#D97706', '#0D9488', '#4F46E5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserProfileModal({
  visible,
  onClose,
  user,
  userPosts,
  isFollowing = false,
  onToggleFollow,
  onLikePost,
}: UserProfileModalProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [activeTab, setActiveTab] = useState<'posts' | 'arbol' | 'about'>('posts');

  if (!user) return null;

  const handleFollowClick = () => {
    setFollowing(!following);
    if (onToggleFollow) onToggleFollow();
  };

  const name = user.authorName || 'Usuario Conexión Luz';
  const role = user.authorRole || 'Miembro de la Comunidad';
  const avatarUrl = user.authorAvatar;
  const initials = getInitials(name);
  const bgColor = getAvatarBgColor(name);

  const hasValidAvatar =
    avatarUrl &&
    typeof avatarUrl === 'string' &&
    avatarUrl.trim().length > 10 &&
    (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:'));

  const filteredPosts = userPosts.filter(
    (p) => p.authorName.toLowerCase() === name.toLowerCase()
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          
          {/* HEADER BAR */}
          <View style={styles.headerBar}>
            <Text style={styles.headerTitle}>Perfil de Miembro</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#64748B" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* COVER & AVATAR BANNER */}
            <View style={styles.coverBanner}>
              <View style={styles.coverGradient} />
              
              <View style={styles.avatarWrapper}>
                {hasValidAvatar ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.initialsAvatar, { backgroundColor: bgColor }]}>
                    <Text style={styles.initialsText}>{initials}</Text>
                  </View>
                )}
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 color="#FFFFFF" size={14} />
                </View>
              </View>
            </View>

            {/* USER INFO HEADER */}
            <View style={styles.userInfoBox}>
              <Text style={styles.userName}>{name}</Text>
              <View style={styles.roleBadgeRow}>
                <Sparkles color="#059669" size={12} />
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>

              {/* FOLLOW & STATS ACTION ROW */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{filteredPosts.length || 3}</Text>
                  <Text style={styles.statLabel}>Publicaciones</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{following ? 143 : 142}</Text>
                  <Text style={styles.statLabel}>Seguidores</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>89</Text>
                  <Text style={styles.statLabel}>Seguidos</Text>
                </View>
              </View>

              {/* BOTÓN SEGUIR / SIGUIENDO */}
              <TouchableOpacity
                onPress={handleFollowClick}
                style={[styles.followBtn, following && styles.followBtnActive]}
              >
                {following ? (
                  <>
                    <UserCheck color="#059669" size={16} />
                    <Text style={styles.followBtnTextActive}>Siguiendo</Text>
                  </>
                ) : (
                  <>
                    <UserPlus color="#FFFFFF" size={16} />
                    <Text style={styles.followBtnText}>Seguir Perfil</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* PESTAÑAS DE CONTENIDO DEL PERFIL */}
            <View style={styles.tabsRow}>
              <TouchableOpacity
                onPress={() => setActiveTab('posts')}
                style={[styles.tabItem, activeTab === 'posts' && styles.tabItemActive]}
              >
                <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
                  Publicaciones ({filteredPosts.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('arbol')}
                style={[styles.tabItem, activeTab === 'arbol' && styles.tabItemActive]}
              >
                <TreeDeciduous color={activeTab === 'arbol' ? '#059669' : '#64748B'} size={14} />
                <Text style={[styles.tabText, activeTab === 'arbol' && styles.tabTextActive]}>Árbol</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('about')}
                style={[styles.tabItem, activeTab === 'about' && styles.tabItemActive]}
              >
                <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>Sobre Mí</Text>
              </TouchableOpacity>
            </View>

            {/* TAB 1: PUBLICACIONES DEL USUARIO */}
            {activeTab === 'posts' && (
              <View style={styles.postsList}>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                      <View style={styles.postHeaderRow}>
                        {hasValidAvatar ? (
                          <Image source={{ uri: avatarUrl }} style={styles.miniAvatar} />
                        ) : (
                          <View style={[styles.miniInitials, { backgroundColor: bgColor }]}>
                            <Text style={styles.miniInitialsText}>{initials}</Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.postAuthorName}>{post.authorName}</Text>
                          <Text style={styles.postTime}>{post.createdAt}</Text>
                        </View>
                        {post.feeling && (
                          <View style={styles.feelingTag}>
                            <Text style={styles.feelingText}>🌱 {post.feeling}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.postContent}>{post.content}</Text>

                      {post.image && (
                        isVideoMedia(post.image) ? (
                          <CustomVideoPlayer src={post.image} height={240} />
                        ) : (
                          <Image source={{ uri: normalizeMediaUrl(post.image) || post.image }} style={styles.postImage} resizeMode="cover" />
                        )
                      )}

                      <View style={styles.postFooterRow}>
                        <View style={styles.postFooterBtn}>
                          <Heart color="#EF4444" size={16} fill="#EF4444" />
                          <Text style={styles.postFooterText}>Iluminado ({post.likes.length || 4})</Text>
                        </View>
                        <View style={styles.postFooterBtn}>
                          <MessageCircle color="#64748B" size={16} />
                          <Text style={styles.postFooterText}>Comentarios ({post.comments.length})</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Este usuario aún no tiene publicaciones públicas.</Text>
                  </View>
                )}
              </View>
            )}

            {/* TAB 2: ÁRBOL INTERIOR® DIAGNÓSTICO */}
            {activeTab === 'arbol' && (
              <View style={styles.arbolCard}>
                <View style={styles.arbolHeader}>
                  <TreeDeciduous color="#059669" size={24} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.arbolTag}>Diagnóstico Registrado</Text>
                    <Text style={styles.arbolTitle}>Árbol Interior® Motor ACM-1.0</Text>
                  </View>
                  <View style={styles.igaPill}>
                    <Text style={styles.igaText}>4.5 IGA</Text>
                  </View>
                </View>

                <View style={styles.perfilResultBox}>
                  <Text style={styles.perfilResultLabel}>Perfil Adaptativo Dominante:</Text>
                  <Text style={styles.perfilResultName}>EL VIGILANTE / EL NAVEGANTE</Text>
                  <Text style={styles.perfilResultDesc}>
                    "Orientación activa hacia la protección, resguardo ante la incertidumbre y constante construcción de dirección interior."
                  </Text>
                </View>

                <View style={styles.woundGrid}>
                  <View style={styles.woundItem}>
                    <Text style={styles.woundLabel}>Necesidad Dominante</Text>
                    <Text style={styles.woundVal}>Seguridad & Rumbo</Text>
                  </View>
                  <View style={styles.woundItem}>
                    <Text style={styles.woundLabel}>Virtud Evolutiva</Text>
                    <Text style={styles.woundVal}>Confianza Plena</Text>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 3: SOBRE MÍ */}
            {activeTab === 'about' && (
              <View style={styles.aboutCard}>
                <Text style={styles.aboutTitle}>Biografía & Datos de Miembro</Text>
                <Text style={styles.aboutDesc}>
                  Miembro activo de la plataforma Conexión Luz®. Participa en los espacios de diálogo, grupos de apoyo y lectura introspectiva de diarios emocionales.
                </Text>

                <View style={styles.aboutInfoRow}>
                  <Shield color="#059669" size={16} />
                  <Text style={styles.aboutInfoText}>Miembro Autenticado Verificado</Text>
                </View>

                <View style={styles.aboutInfoRow}>
                  <Award color="#059669" size={16} />
                  <Text style={styles.aboutInfoText}>Participante en Talleres & Conversatorios</Text>
                </View>
              </View>
            )}

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: '92%',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverBanner: {
    height: 90,
    backgroundColor: '#ECFDF5',
    position: 'relative',
    marginBottom: 44,
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -36,
    left: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  initialsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfoBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
  },
  followBtnActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  followBtnTextActive: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  postsList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  miniInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniInitialsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  postAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  postTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  feelingTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  feelingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  postContent: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 10,
  },
  postFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  postFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyBox: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
  },
  arbolCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  arbolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arbolTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    textTransform: 'uppercase',
  },
  arbolTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  igaPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  igaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  perfilResultBox: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 14,
  },
  perfilResultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    textTransform: 'uppercase',
  },
  perfilResultName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 4,
  },
  perfilResultDesc: {
    fontSize: 11,
    color: '#047857',
    fontStyle: 'italic',
    lineHeight: 15,
  },
  woundGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  woundItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  woundLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  woundVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  aboutCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  aboutDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  aboutInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
  },
  aboutInfoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
});

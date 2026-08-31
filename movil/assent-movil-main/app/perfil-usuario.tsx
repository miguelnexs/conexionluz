import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Sparkles,
  Heart,
  MessageCircle,
  ShieldCheck,
  Award,
  UserCheck,
  Plus,
  MapPin,
  Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CustomVideoPlayer, isVideoMedia } from '../components/CustomVideoPlayer';
import { PostDetailModal, countTotalSembrados } from '../components/PostDetailModal';
import { SharePostModal } from '../components/SharePostModal';

const { width } = Dimensions.get('window');

export interface UserPostItem {
  id: string;
  patientId?: number | string | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likes: string[];
  commentsCount: number;
  comments?: any[];
  createdAt: string;
}

const cleanString = (str: string = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(lic\.|lic|dra\.|dra|dr\.|dr|psic\.|psic)\s+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

export default function PerfilUsuarioScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();
  const params = useLocalSearchParams<{
    authorName?: string;
    patientId?: string;
    therapistId?: string;
    avatarUrl?: string;
    coverUrl?: string;
    role?: string;
    bio?: string;
  }>();

  const authorName = params.authorName || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Miembro ConexiónLuz');
  const rawAvatarUrl = params.avatarUrl || '';
  const initialRole = (params.role || 'MIEMBRO').toUpperCase();
  const therapistId = params.therapistId ? Number(params.therapistId) : null;
  const targetPatientId = params.patientId ? String(params.patientId) : null;

  const currentFullName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '';
  const isCurrentUser = Boolean(
    currentUser && (
      (targetPatientId && String(currentUser.id) === targetPatientId) ||
      (currentFullName && cleanString(authorName) === cleanString(currentFullName)) ||
      (currentUser.firstName && cleanString(authorName) === cleanString(currentUser.firstName))
    )
  );

  const isTherapist =
    Boolean(therapistId) ||
    initialRole.includes('GUÍA') ||
    initialRole.includes('TERAPEUTA') ||
    initialRole.includes('PSICÓLOGO') ||
    initialRole.includes('ADMIN');

  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [userPosts, setUserPosts] = useState<UserPostItem[]>([]);
  const [therapistDetails, setTherapistDetails] = useState<any>(null);
  const [fetchedUserData, setFetchedUserData] = useState<any>(null);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const [customCoverUri, setCustomCoverUri] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  const [isGlobalMuted, setIsGlobalMuted] = useState<boolean>(true);
  const [selectedDetailPost, setSelectedDetailPost] = useState<any | null>(null);
  const [shareModalPost, setShareModalPost] = useState<any | null>(null);
  const [expandedPostsText, setExpandedPostsText] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProfileAndPosts();
  }, [authorName, therapistId, targetPatientId]);

  const loadProfileAndPosts = async () => {
    setLoadingPosts(true);
    try {
      // 1. Always query patient follow status and profile details to get authentic uploaded coverPictureUrl and profilePictureUrl
      const namesToTry = [
        authorName,
        authorName.replace(/^(lic\.|lic|dra\.|dra|dr\.|dr|psic\.|psic)\s+/i, '').trim(),
      ];
      if (authorName.toLowerCase().includes('juan')) {
        namesToTry.push('Juan David Martínez', 'Juan David Martinez', 'Juan David');
      }
      if (authorName.toLowerCase().includes('amparo') || authorName.toLowerCase().includes('luz')) {
        namesToTry.push('Luz Amparo Valencia', 'Luz Amparo');
      }

      let foundPatientData: any = null;
      for (const nameCandidate of namesToTry) {
        if (!nameCandidate) continue;
        try {
          const pStatus = await mobileApi.getPatientFollowStatus(nameCandidate);
          if (pStatus.ok && pStatus.data && (pStatus.data.coverPictureUrl || pStatus.data.profilePictureUrl || pStatus.data.followersCount > 0)) {
            foundPatientData = pStatus.data;
            setFetchedUserData(pStatus.data);
            if (pStatus.data.isFollowing !== undefined) setIsFollowing(Boolean(pStatus.data.isFollowing));
            if (typeof pStatus.data.followersCount === 'number') setFollowersCount(pStatus.data.followersCount);
            if (typeof pStatus.data.followingCount === 'number') setFollowingCount(pStatus.data.followingCount);
            break;
          }
        } catch {}
      }

      // 2. If therapist, load therapist clinical data
      if (therapistId || isTherapist) {
        const therRes = await mobileApi.fetchTherapists();
        if (therRes.ok && Array.isArray(therRes.data)) {
          const found = therRes.data.find((t: any) => {
            if (therapistId && t.id === therapistId) return true;
            const tClean = cleanString(t.name);
            const aClean = cleanString(authorName);
            return tClean === aClean || tClean.includes(aClean) || aClean.includes(tClean);
          });
          if (found) {
            setTherapistDetails(found);
            if (!foundPatientData && typeof found.followers_count === 'number') {
              setFollowersCount(found.followers_count);
            }
          }
        }

        const tIdToQuery = therapistId || (therapistDetails?.id);
        if (tIdToQuery) {
          try {
            const st = await mobileApi.getTherapistFollowStatus(tIdToQuery);
            if (st.ok && st.data) {
              setIsFollowing(Boolean(st.data.isFollowing));
              if (typeof st.data.followersCount === 'number') setFollowersCount(st.data.followersCount);
              if (typeof st.data.followingCount === 'number') setFollowingCount(st.data.followingCount);
            }
          } catch {}
        }
      }

      // 2. Load all community posts to filter this author's real posts
      const postsRes = await mobileApi.fetchCommunityPosts(true, 1, 100);
      let matched: UserPostItem[] = [];

      if (postsRes.ok && Array.isArray(postsRes.data)) {
        const targetClean = cleanString(authorName);

        matched = postsRes.data
          .filter((p: any) => {
            const pId = String(p.patientId || p.patient_id || (p.patient && typeof p.patient === 'object' ? p.patient.id : p.patient) || '');
            if (targetPatientId && pId && pId === targetPatientId) return true;

            const pAuthor = p.authorName || p.author || '';
            const pClean = cleanString(pAuthor);
            if (!pClean || !targetClean) return false;
            return (
              pClean === targetClean ||
              pClean.includes(targetClean) ||
              targetClean.includes(pClean)
            );
          })
          .map((p: any) => ({
            id: String(p.id),
            patientId: p.patientId || p.patient_id,
            authorName: p.authorName || p.author || authorName,
            authorAvatar: normalizeMediaUrl(p.authorAvatarUrl || p.authorAvatar || rawAvatarUrl),
            authorRole: (p.authorRole || initialRole).toUpperCase(),
            content: p.content || '',
            feeling: p.feeling || 'En calma',
            image: normalizeMediaUrl(p.imageUrl || p.image || ''),
            likes: Array.isArray(p.likes)
              ? p.likes.map((l: any) => (typeof l === 'object' && l ? l.name || l.authorName || 'me' : String(l)))
              : [],
            commentsCount:
              typeof p.commentsCount === 'number'
                ? p.commentsCount
                : Array.isArray(p.comments)
                ? p.comments.length
                : 0,
            comments: Array.isArray(p.comments) ? p.comments : [],
            createdAt: p.createdAt || p.created_at || 'Reciente',
          }));
      }

      setUserPosts(matched);
    } catch (e) {
      console.error('Error loading user profile:', e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePickAndUploadCover = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar tu foto de portada.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const pickedUri = result.assets[0].uri;
        setCustomCoverUri(pickedUri);
        setUploadingCover(true);

        const res = await mobileApi.uploadCoverPicture(pickedUri);
        setUploadingCover(false);

        if (res.ok) {
          Alert.alert('¡Portada Actualizada! 🌅', 'Tu nueva portada ha sido guardada exitosamente.');
          await refreshUser();
        } else {
          Alert.alert('Aviso', 'Tu portada se aplicó localmente.');
        }
      }
    } catch (e: any) {
      setUploadingCover(false);
      Alert.alert('Error', e?.message || 'No se pudo seleccionar la imagen');
    }
  };

  const handlePickAndUploadAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar tu foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const pickedUri = result.assets[0].uri;
        setUploadingAvatar(true);

        const res = await mobileApi.uploadProfilePicture(pickedUri);
        setUploadingAvatar(false);

        if (res.ok) {
          Alert.alert('¡Foto Actualizada! ✨', 'Tu foto de perfil ha sido guardada exitosamente.');
          await refreshUser();
        }
      }
    } catch (e: any) {
      setUploadingAvatar(false);
      Alert.alert('Error', e?.message || 'No se pudo actualizar la foto');
    }
  };

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Inicia Sesión',
        'Crea una cuenta o inicia sesión para seguir a este usuario.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => router.push('/(tabs)/profile' as any) },
        ]
      );
      return;
    }

    setLoadingFollow(true);
    try {
      if (therapistId) {
        const res = await mobileApi.toggleFollowTherapist(therapistId);
        if (res.ok && res.data) {
          setIsFollowing(Boolean(res.data.isFollowing));
          if (typeof res.data.followersCount === 'number') setFollowersCount(res.data.followersCount);
          if (typeof res.data.followingCount === 'number') setFollowingCount(res.data.followingCount);
        }
      } else {
        const res = await mobileApi.toggleFollowPatient(authorName);
        if (res.ok && res.data) {
          setIsFollowing(Boolean(res.data.isFollowing));
          if (typeof res.data.followersCount === 'number') setFollowersCount(res.data.followersCount);
          if (typeof res.data.followingCount === 'number') setFollowingCount(res.data.followingCount);
        }
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo actualizar el seguimiento');
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleToggleLikePost = async (postId: string) => {
    if (!isAuthenticated) {
      Alert.alert('Inicia Sesión', 'Inicia sesión para iluminar esta publicación.');
      return;
    }

    const myIdentifier = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';

    setUserPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes(myIdentifier) || p.likes.includes(currentUser?.firstName || '');
          const newLikes = hasLiked
            ? p.likes.filter((l) => l !== myIdentifier && l !== (currentUser?.firstName || ''))
            : [...p.likes, myIdentifier];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );

    try {
      await mobileApi.likeCommunityPost(postId);
    } catch {}
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        title: `Perfil de ${authorName} en ConexiónLuz`,
        message: `Mira el perfil de ${authorName} (${isTherapist ? 'Guía de Luz' : 'Miembro'}) en la comunidad ConexiónLuz®: https://conexionluz.com/perfil/${encodeURIComponent(authorName)}`,
      });
    } catch {}
  };

  // Resolve Cover Picture chosen by user or therapist
  const coverDisplay = useMemo(() => {
    if (customCoverUri) return customCoverUri;

    if (isCurrentUser) {
      const userCover =
        (currentUser as any)?.coverPictureUrl ||
        (currentUser as any)?.cover_picture_url ||
        (currentUser as any)?.coverUrl ||
        (currentUser as any)?.cover_url;
      if (userCover) return normalizeMediaUrl(userCover);
    }

    // Real database cover picture uploaded by user/therapist
    if (fetchedUserData?.coverPictureUrl && fetchedUserData.coverPictureUrl.trim().length > 0) {
      return normalizeMediaUrl(fetchedUserData.coverPictureUrl);
    }

    if (params.coverUrl && params.coverUrl.trim().length > 0) {
      return normalizeMediaUrl(params.coverUrl);
    }

    if (therapistDetails) {
      const therCover =
        therapistDetails.cover_image ||
        therapistDetails.cover_url ||
        therapistDetails.cover ||
        therapistDetails.banner ||
        therapistDetails.image_url;
      if (therCover) return normalizeMediaUrl(therCover);
    }

    return null;
  }, [customCoverUri, isCurrentUser, currentUser, params.coverUrl, fetchedUserData, therapistDetails]);

  // Resolve Avatar Picture
  const avatarDisplay = useMemo(() => {
    if (isCurrentUser) {
      const userPic = currentUser?.profilePictureUrl || currentUser?.avatarUrl;
      if (userPic) return normalizeMediaUrl(userPic);
    }
    if (rawAvatarUrl && rawAvatarUrl.trim().length > 0) {
      return normalizeMediaUrl(rawAvatarUrl);
    }
    if (fetchedUserData?.profilePictureUrl) {
      return normalizeMediaUrl(fetchedUserData.profilePictureUrl);
    }
    if (therapistDetails) {
      const therPic = therapistDetails.avatar || therapistDetails.image_url;
      if (therPic) return normalizeMediaUrl(therPic);
    }
    return '';
  }, [isCurrentUser, currentUser, rawAvatarUrl, fetchedUserData, therapistDetails]);

  const bioText =
    params.bio ||
    therapistDetails?.description ||
    therapistDetails?.bio ||
    (isCurrentUser ? (currentUser as any)?.bio : null) ||
    (isTherapist
      ? 'Guía de Luz y especialista en salud mental, regulación emocional y acompañamiento clínico en el portal ConexiónLuz®.'
      : 'Miembro activo de la comunidad ConexiónLuz®, compartiendo reflexiones, bienestar y gratitud.');

  const usernameHandle = `@${authorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. USER CHOSEN COVER BANNER WITH FLOATING CONTROLS ── */}
        <View style={styles.coverContainer}>
          {coverDisplay ? (
            <Image source={{ uri: coverDisplay }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverAtmosphericGradient}>
              <Sparkles color="rgba(255, 255, 255, 0.25)" size={54} style={styles.sparkleDecorationBg} />
            </View>
          )}

          <View style={styles.coverGradientOverlay} />

          {/* FLOATING TOP NAVIGATION OVER COVER */}
          <View style={[styles.floatingTopNav, { top: topPadding }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.floatingNavBtn} activeOpacity={0.8}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {isCurrentUser && (
                <TouchableOpacity
                  onPress={handlePickAndUploadCover}
                  style={styles.changeCoverFloatingBtn}
                  activeOpacity={0.8}
                >
                  {uploadingCover ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Camera color="#FFFFFF" size={14} />
                      <Text style={styles.changeCoverBtnText}>Editar Portada</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleShareProfile} style={styles.floatingNavBtn} activeOpacity={0.8}>
                <Share2 color="#FFFFFF" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── 2. PROFILE HEADER INFO (AVATAR & BUTTONS) ── */}
        <View style={styles.profileMetaHeader}>
          {/* AVATAR OVERLAPPING COVER */}
          <View style={styles.avatarRow}>
            <TouchableOpacity
              activeOpacity={isCurrentUser ? 0.85 : 1}
              onPress={isCurrentUser ? handlePickAndUploadAvatar : undefined}
              style={styles.avatarWrapper}
            >
              {avatarDisplay ? (
                <Image source={{ uri: avatarDisplay }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackInitial}>{(authorName || 'U')[0]}</Text>
                </View>
              )}

              {isCurrentUser && (
                <View style={styles.avatarCameraBadge}>
                  {uploadingAvatar ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Camera color="#FFFFFF" size={13} strokeWidth={2.5} />
                  )}
                </View>
              )}

              <View style={styles.onlineStatusDot} />
            </TouchableOpacity>

            {/* ACTION BUTTONS (FOLLOW OR EDIT) */}
            <View style={styles.headerActionBtns}>
              {!isCurrentUser ? (
                <TouchableOpacity
                  onPress={handleToggleFollow}
                  disabled={loadingFollow}
                  style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                  activeOpacity={0.85}
                >
                  {loadingFollow ? (
                    <ActivityIndicator size="small" color={isFollowing ? '#059669' : '#FFFFFF'} />
                  ) : isFollowing ? (
                    <>
                      <UserCheck color="#059669" size={15} />
                      <Text style={styles.followBtnTextActive}>Siguiendo</Text>
                    </>
                  ) : (
                    <>
                      <Plus color="#FFFFFF" size={15} />
                      <Text style={styles.followBtnText}>Seguir</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/profile' as any)}
                  style={styles.editMyProfileBtn}
                  activeOpacity={0.85}
                >
                  <Sparkles color="#059669" size={14} />
                  <Text style={styles.editMyProfileBtnText}>Mi Espacio</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* NAME, BADGE & ROLE */}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.displayNameText}>{authorName}</Text>
              {isTherapist && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck color="#047857" size={13} />
                  <Text style={styles.verifiedBadgeText}>GUÍA DE LUZ</Text>
                </View>
              )}
            </View>

            <Text style={styles.handleText}>{usernameHandle}</Text>

            {therapistDetails?.role || therapistDetails?.specialty ? (
              <Text style={styles.specialtyText}>
                {therapistDetails.role || therapistDetails.specialty}
              </Text>
            ) : null}

            <Text style={styles.bioBodyText}>{bioText}</Text>

            {/* LOCATION & COMMUNITY META */}
            <View style={styles.detailsMetaRow}>
              <View style={styles.metaBadgeItem}>
                <Calendar color="#64748B" size={13} />
                <Text style={styles.metaBadgeText}>Comunidad ConexiónLuz®</Text>
              </View>
              <View style={styles.metaBadgeItem}>
                <MapPin color="#64748B" size={13} />
                <Text style={styles.metaBadgeText}>Colombia · Sesiones Online</Text>
              </View>
            </View>

            {/* CERTIFICATIONS (IF THERAPIST) */}
            {therapistDetails?.certifications && therapistDetails.certifications.length > 0 && (
              <View style={styles.certListRow}>
                {therapistDetails.certifications.slice(0, 3).map((c: string, idx: number) => (
                  <View key={idx} style={styles.certTagItem}>
                    <Award color="#059669" size={12} />
                    <Text style={styles.certTagItemText} numberOfLines={1}>{c}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* DIRECT BOOKING CTA FOR THERAPISTS */}
            {isTherapist && !isCurrentUser && (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/agenda',
                    params: { therapistId: String(therapistId || therapistDetails?.id || '') },
                  } as any);
                }}
                style={styles.bookAppointmentCtaBtn}
                activeOpacity={0.88}
              >
                <Calendar color="#FFFFFF" size={17} />
                <Text style={styles.bookAppointmentCtaText}>
                  Agendar Consulta con {authorName.split(' ')[0]}
                </Text>
                <Sparkles color="#FDE68A" size={16} />
              </TouchableOpacity>
            )}
          </View>

          {/* SOCIAL STATS BAR: REAL COUNTS ONLY (PUBLICACIONES | SEGUIDORES | SIGUIENDO) */}
          <View style={styles.statsCounterRow}>
            <View style={styles.statBox}>
              <Text style={styles.statCountText}>{userPosts.length}</Text>
              <Text style={styles.statLabelText}>Publicaciones</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statCountText}>{followersCount}</Text>
              <Text style={styles.statLabelText}>Seguidores</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statCountText}>{followingCount}</Text>
              <Text style={styles.statLabelText}>Siguiendo</Text>
            </View>
          </View>
        </View>

        {/* ── 3. DIRECT SECTION HEADER: PUBLICACIONES ── */}
        <View style={styles.sectionHeadingContainer}>
          <Text style={styles.sectionHeadingTitle}>Publicaciones & Destellos</Text>
          <View style={styles.sectionHeadingLine} />
        </View>

        {/* ── 4. FULL-WIDTH POSTS FEED (IDENTICAL TO HOME POSTS) ── */}
        <View style={styles.fullWidthFeedContainer}>
          {loadingPosts ? (
            <View style={styles.loadingFeedBox}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={styles.loadingFeedText}>Cargando destellos de {authorName}...</Text>
            </View>
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => {
              const myFullName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Tú';
              const isLiked =
                post.likes.includes(myFullName) ||
                (currentUser?.firstName && post.likes.includes(currentUser.firstName)) ||
                post.likes.includes('me') ||
                post.likes.includes('Tú');

              const isLong = post.content && post.content.length > 180;
              const isExpanded = !!expandedPostsText[post.id];
              const displayedText = isLong && !isExpanded
                ? `${post.content.slice(0, 170).trim()}...`
                : post.content;

              return (
                <View key={post.id} style={styles.feedPostCardFull}>
                  {/* POST AUTHOR ROW */}
                  <View style={styles.postHeaderRow}>
                    <View style={styles.postAuthorAvatarContainer}>
                      {post.authorAvatar ? (
                        <Image source={{ uri: post.authorAvatar }} style={styles.postAuthorAvatarImg} />
                      ) : (
                        <View style={styles.postAuthorFallback}>
                          <Text style={styles.postAuthorFallbackInitial}>{(post.authorName || 'U')[0]}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.postAuthorMetaCol}>
                      <Text style={styles.postAuthorName}>{post.authorName}</Text>
                      <View style={styles.postAuthorRoleUnderNameRow}>
                        <View
                          style={[
                            styles.postRolePillUnderName,
                            (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                            (post.authorRole || '').toUpperCase().includes('GUIA') ||
                            (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                            (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                            (post.authorRole || '').toUpperCase().includes('ADMIN')
                              ? styles.postRolePillTherapist
                              : styles.postRolePillMember,
                          ]}
                        >
                          {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                          (post.authorRole || '').toUpperCase().includes('GUIA') ||
                          (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                          (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                          (post.authorRole || '').toUpperCase().includes('ADMIN') ? (
                            <ShieldCheck color="#047857" size={11} strokeWidth={2.5} />
                          ) : (
                            <Sparkles color="#64748B" size={10} strokeWidth={2.5} />
                          )}
                          <Text
                            style={[
                              styles.postRolePillTextUnderName,
                              (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                              (post.authorRole || '').toUpperCase().includes('GUIA') ||
                              (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                              (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                              (post.authorRole || '').toUpperCase().includes('ADMIN')
                                ? styles.postRolePillTextTherapist
                                : styles.postRolePillTextMember,
                            ]}
                          >
                            {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                            (post.authorRole || '').toUpperCase().includes('GUIA') ||
                            (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                            (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                            (post.authorRole || '').toUpperCase().includes('ADMIN')
                              ? 'Terapeuta'
                              : 'Miembro'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.postTimestampText}>{post.createdAt}</Text>
                    </View>
                  </View>

                  {/* POST CONTENT BODY WITH EXPANDABLE TEXT & FEELINGS */}
                  <View style={styles.postTextContainer}>
                    <Text style={styles.postBodyContent}>
                      {displayedText}
                      {isLong && (
                        <Text
                          onPress={() => setSelectedDetailPost(post)}
                          style={styles.readMoreHighlightBtn}
                        >
                          {'  Ver más...'}
                        </Text>
                      )}
                    </Text>

                    {post.feeling && (
                      <View style={styles.feelingPillBox}>
                        <Text style={styles.feelingPillText}>🌱 {post.feeling}</Text>
                      </View>
                    )}
                  </View>

                  {/* FULL BLEED ATTACHED IMAGE OR VIDEO */}
                  {post.image ? (
                    isVideoMedia(post.image) ? (
                      <CustomVideoPlayer
                        src={normalizeMediaUrl(post.image) || post.image}
                        fullBleed={true}
                        isActive={true}
                        isMuted={isGlobalMuted}
                        onMuteChange={(muted) => setIsGlobalMuted(muted)}
                        loop={true}
                        height={Math.round(width * 0.95)}
                        contentFit="contain"
                        style={{ width: width }}
                      />
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => setSelectedDetailPost(post)}
                      >
                        <Image
                          source={{ uri: normalizeMediaUrl(post.image) || post.image }}
                          style={styles.fullBleedPostImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )
                  ) : null}

                  {/* REACTION, COMMENTS & SHARE FOOTER BAR (EXACT AS HOME FEED) */}
                  <View style={styles.postFooterBar}>
                    {/* 1. ILUMINAR (HEART) */}
                    <TouchableOpacity
                      onPress={() => handleToggleLikePost(post.id)}
                      style={[styles.postActionFooterBtn, isLiked && styles.postActionFooterBtnLiked]}
                      activeOpacity={0.8}
                    >
                      <Heart
                        color={isLiked ? '#EF4444' : '#64748B'}
                        size={18}
                        fill={isLiked ? '#EF4444' : 'transparent'}
                      />
                      <Text style={[styles.postActionFooterText, isLiked && styles.postActionFooterTextLiked]}>
                        {isLiked ? 'Iluminado' : 'Iluminar'} ({post.likes.length})
                      </Text>
                    </TouchableOpacity>

                    {/* 2. SEMBRADOS (COMMENTS) */}
                    <TouchableOpacity
                      onPress={() => setSelectedDetailPost(post)}
                      style={styles.postActionFooterBtn}
                      activeOpacity={0.75}
                    >
                      <MessageCircle color="#0D9488" size={18} />
                      <Text style={[styles.postActionFooterText, { color: '#0F766E' }]}>
                        Sembrados ({countTotalSembrados(post.comments)})
                      </Text>
                    </TouchableOpacity>

                    {/* 3. COMPARTIR (SHARE) */}
                    <TouchableOpacity
                      onPress={() => setShareModalPost(post)}
                      style={styles.postActionFooterBtn}
                      activeOpacity={0.75}
                    >
                      <Share2 color="#0284C7" size={18} />
                      <Text style={[styles.postActionFooterText, { color: '#0369A1' }]}>
                        Compartir
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyFeedPlaceholder}>
              <Sparkles color="#94A3B8" size={36} />
              <Text style={styles.emptyFeedHeadline}>Sin publicaciones aún</Text>
              <Text style={styles.emptyFeedSubtext}>
                {authorName} aún no ha compartido publicaciones públicas en la comunidad.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* POST DETAIL MODAL (COMMENTS, VIDEO & FULL DISCUSSION) */}
      {selectedDetailPost && (
        <PostDetailModal
          post={selectedDetailPost}
          visible={!!selectedDetailPost}
          onClose={() => setSelectedDetailPost(null)}
          currentUser={currentUser as any}
          onToggleLike={(postId) => handleToggleLikePost(String(postId))}
          onAddComment={async (postId, content) => {
            if (!isAuthenticated) return { ok: false, error: 'Inicia sesión' };
            return await mobileApi.commentCommunityPost(postId, content);
          }}
          onAddReply={async (commentId, content) => {
            if (!isAuthenticated) return { ok: false, error: 'Inicia sesión' };
            return await mobileApi.replyCommunityPostComment(commentId, content);
          }}
          onToggleLikeComment={async (commentId) => {
            if (!isAuthenticated) return { ok: false };
            return await mobileApi.likeCommunityPostComment(commentId);
          }}
        />
      )}

      {/* SHARE POST MODAL (COPY LINK, WHATSAPP, SOCIAL) */}
      {shareModalPost && (
        <SharePostModal
          visible={!!shareModalPost}
          onClose={() => setShareModalPost(null)}
          postId={shareModalPost.id}
          postContent={shareModalPost.content}
          authorName={shareModalPost.authorName}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    backgroundColor: '#F1F5F9',
  },

  // 1. COVER CONTAINER
  coverContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#064E3B',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverAtmosphericGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
  },
  sparkleDecorationBg: {
    opacity: 0.35,
  },
  coverGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  floatingTopNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  floatingNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  changeCoverFloatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  changeCoverBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // 2. PROFILE META HEADER
  profileMetaHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -48,
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackInitial: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#059669',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
  },
  followBtnActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  followBtnTextActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  messageBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editMyProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  editMyProfileBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#059669',
  },

  // NAME & DETAILS
  nameSection: {
    gap: 6,
    marginTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  displayNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857',
  },
  handleText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  specialtyText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  bioBodyText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    marginTop: 4,
  },
  detailsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
  },
  metaBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaBadgeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  certListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  certTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: width * 0.88,
  },
  certTagItemText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },

  // BOOK APPOINTMENT CTA
  bookAppointmentCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bookAppointmentCtaText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // SOCIAL STATS BAR
  statsCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statCountText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  // 3. SECTION HEADING
  sectionHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  sectionHeadingTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionHeadingLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 12,
  },

  // 4. FULL WIDTH FEED POSTS (IDENTICAL TO HOME FEED)
  fullWidthFeedContainer: {
    width: '100%',
    gap: 8,
  },
  feedPostCardFull: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  postAuthorAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  postAuthorAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  postAuthorFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAuthorFallbackInitial: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  postAuthorMetaCol: {
    marginLeft: 10,
    flex: 1,
    gap: 2,
  },
  postAuthorName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  postAuthorRoleUnderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  postRolePillUnderName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  postRolePillTherapist: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  postRolePillMember: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postRolePillTextUnderName: {
    fontSize: 10,
    fontWeight: '800',
  },
  postRolePillTextTherapist: {
    color: '#047857',
  },
  postRolePillTextMember: {
    color: '#64748B',
  },
  postTimestampText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },

  postTextContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  postBodyContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
  },
  readMoreHighlightBtn: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 14,
  },
  feelingPillBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  feelingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  fullBleedPostImage: {
    width: width,
    height: Math.round(width * 0.9),
    backgroundColor: '#020617',
    marginBottom: 10,
  },

  // EXACT FOOTER BAR
  postFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  postActionFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  postActionFooterBtnLiked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  postActionFooterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  postActionFooterTextLiked: {
    color: '#DC2626',
    fontWeight: '800',
  },

  loadingFeedBox: {
    padding: 36,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  loadingFeedText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyFeedPlaceholder: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyFeedHeadline: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  emptyFeedSubtext: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
});

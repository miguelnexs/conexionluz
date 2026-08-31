import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react-native';
import { getPostShareUrl } from '../utils/postSlug';

interface SharePostModalProps {
  visible: boolean;
  onClose: () => void;
  postId?: string | null;
  postContent?: string;
  authorName?: string;
}

import { mobileApi } from '../api/client';

export const SharePostModal: React.FC<SharePostModalProps> = ({
  visible,
  onClose,
  postId,
  postContent,
  authorName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!visible || !postId) return null;

  const shareUrl = getPostShareUrl(postId);
  const snippet = postContent
    ? postContent.length > 90
      ? `${postContent.slice(0, 90)}...`
      : postContent
    : 'Mira este destello en Conexión Luz';

  const authorText = authorName ? ` de ${authorName}` : '';
  const shareMessage = `✨ Mira este destello${authorText} en Conexión Luz:\n\n"${snippet}"\n\n🌿 Ábrelo en la Web o App:\n${shareUrl}`;

  const triggerBackendShareNotification = () => {
    if (postId) {
      mobileApi.shareCommunityPost(postId).catch(() => {});
    }
  };

  const handleNativeShare = async () => {
    try {
      triggerBackendShareNotification();
      onClose();
      await Share.share({
        message: shareMessage,
        url: shareUrl,
        title: 'Destello en Conexión Luz',
      });
    } catch (error) {
      console.warn('Error sharing post:', error);
    }
  };

  const handleCopyLink = () => {
    try {
      triggerBackendShareNotification();
      Clipboard.setString(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1200);
    } catch (e) {
      Alert.alert('Enlace', shareUrl);
    }
  };

  const handleWhatsApp = async () => {
    triggerBackendShareNotification();
    onClose();
    const encodedText = encodeURIComponent(shareMessage);
    const nativeWa = `whatsapp://send?text=${encodedText}`;
    const webWa = `https://api.whatsapp.com/send?text=${encodedText}`;

    try {
      const supported = await Linking.canOpenURL(nativeWa);
      if (supported) {
        await Linking.openURL(nativeWa);
      } else {
        await Linking.openURL(webWa);
      }
    } catch (e) {
      await Linking.openURL(webWa);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Share2 color="#059669" size={18} />
              </View>
              <Text style={styles.headerTitle}>Compartir Destello</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X color="#64748B" size={18} />
            </TouchableOpacity>
          </View>

          <Text style={styles.previewSnippetText} numberOfLines={2}>
            "{snippet}"
          </Text>

          {/* Options Grid */}
          <View style={styles.optionsGrid}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={[styles.optionCard, styles.optionCardWa]}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#10B981' }]}>
                <MessageCircle color="#FFFFFF" size={18} />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={[styles.optionTitle, { color: '#065F46' }]}>WhatsApp</Text>
                <Text style={styles.optionSubtitle}>Enviar por chat</Text>
              </View>
            </TouchableOpacity>

            {/* General Share Sheet */}
            <TouchableOpacity
              style={[styles.optionCard, styles.optionCardNative]}
              onPress={handleNativeShare}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#0284C7' }]}>
                <ExternalLink color="#FFFFFF" size={18} />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={[styles.optionTitle, { color: '#0369A1' }]}>Más Opciones</Text>
                <Text style={styles.optionSubtitle}>Apps, SMS, etc.</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Direct Link Row */}
          <TouchableOpacity
            style={styles.copyLinkRow}
            onPress={handleCopyLink}
            activeOpacity={0.8}
          >
            <View style={styles.copyIconBox}>
              {copied ? (
                <Check color="#059669" size={16} />
              ) : (
                <Copy color="#475569" size={16} />
              )}
            </View>
            <Text style={styles.copyLinkText} numberOfLines={1}>
              {shareUrl}
            </Text>
            <View style={[styles.copyBadge, copied && styles.copyBadgeSuccess]}>
              <Text style={[styles.copyBadgeText, copied && styles.copyBadgeTextSuccess]}>
                {copied ? '¡Copiado!' : 'Copiar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSnippetText: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  optionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
  },
  optionCardWa: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  optionCardNative: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  optionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  optionSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  copyLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  copyIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyLinkText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  copyBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  copyBadgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  copyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  copyBadgeTextSuccess: {
    color: '#065F46',
  },
});

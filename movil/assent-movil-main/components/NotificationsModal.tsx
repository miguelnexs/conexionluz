import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  X,
  Bell,
  Heart,
  UserPlus,
  Calendar,
  MessageCircle,
  CheckCheck,
} from 'lucide-react-native';
import { NotificationItem } from '../api/client';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const created = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins}m`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      return `Hace ${diffDays}d`;
    } catch (e) {
      return '';
    }
  };

  const renderIcon = (type?: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('like')) {
      return <Heart color="#EC4899" size={18} />;
    }
    if (t.includes('follower')) {
      return <UserPlus color="#3B82F6" size={18} />;
    }
    if (t.includes('talk') || t.includes('event')) {
      return <Calendar color="#8B5CF6" size={18} />;
    }
    return <MessageCircle color="#0D9488" size={18} />;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.bellIconBg}>
              <Bell color="#0F766E" size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Notificaciones</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0
                  ? `${unreadCount} sin leer`
                  : 'Al día'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={onMarkAllRead}
                style={styles.markReadBtn}
                activeOpacity={0.7}
              >
                <CheckCheck color="#0D9488" size={14} />
                <Text style={styles.markReadText}>Leídas</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X color="#475569" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST OF NOTIFICATIONS */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {notifications.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconBg}>
                <Bell color="#94A3B8" size={32} />
              </View>
              <Text style={styles.emptyTitle}>No tienes notificaciones pendientes</Text>
              <Text style={styles.emptySubtitle}>
                Aquí recibirás alertas sobre comentarios, respuestas, interacciones y actividades.
              </Text>
            </View>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.isRead;
              return (
                <View
                  key={notif.id || `${notif.createdAt}_${Math.random()}`}
                  style={[
                    styles.notifCard,
                    isUnread ? styles.notifCardUnread : styles.notifCardRead,
                  ]}
                >
                  <View style={styles.notifHeaderRow}>
                    <View style={styles.typeIconBox}>
                      {renderIcon(notif.notificationType)}
                    </View>
                    <View style={styles.notifTitleCol}>
                      <Text style={styles.notifCategoryTitle}>{notif.title}</Text>
                      <Text style={styles.timeText}>{formatTimeAgo(notif.createdAt)}</Text>
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.notifMessage}>{notif.message}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: 350,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  notifCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: '#F0FDF4',
    borderColor: '#99F6E4',
  },
  notifCardRead: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  typeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitleCol: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifCategoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488',
  },
  notifMessage: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    paddingLeft: 42,
  },
});

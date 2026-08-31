import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  X,
  Sparkles,
  Gift,
  Coins,
  TrendingUp,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  Heart,
  Brain,
  ShieldCheck,
  Award,
  NotebookPen,
  ClipboardList,
  Clock,
  ExternalLink,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface LumiWalletModalProps {
  visible: boolean;
  onClose: () => void;
  onBalanceUpdated?: (newBalance: number) => void;
}

export const LumiWalletModal: React.FC<LumiWalletModalProps> = ({
  visible,
  onClose,
  onBalanceUpdated,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'earn' | 'history'>('rewards');

  useEffect(() => {
    if (visible) {
      loadWalletData();
    }
  }, [visible]);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      // First load cached balance
      const cached = await AsyncStorage.getItem('conexionluz:lumis-balance');
      if (cached) {
        setBalance(parseInt(cached, 10) || 0);
      }

      if (isAuthenticated) {
        const res = await mobileApi.fetchLumiWallet();
        if (res.ok && res.data) {
          const b = res.data.balance || 0;
          setBalance(b);
          setTotalEarned(res.data.totalEarned || b);
          setTransactions(res.data.transactions || []);
          await AsyncStorage.setItem('conexionluz:lumis-balance', String(b));
          if (onBalanceUpdated) onBalanceUpdated(b);
        }
      }
    } catch (e) {
      console.warn('Error loading wallet data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimDaily = async () => {
    if (!isAuthenticated) {
      Alert.alert('Inicia Sesión', 'Debes iniciar sesión para reclamar tu recompensa diaria de Lumis.');
      return;
    }

    setIsClaiming(true);
    try {
      const res = await mobileApi.claimDailyLumis();
      if (res.ok && res.data) {
        const newBal = res.data.balance;
        setBalance(newBal);
        setDailyClaimed(true);
        await AsyncStorage.setItem('conexionluz:lumis-balance', String(newBal));
        if (onBalanceUpdated) onBalanceUpdated(newBal);
        Alert.alert('✨ ¡Recompensa Reclamada!', res.data.message || 'Has recibido +15 Lumis.');
        loadWalletData();
      } else {
        setDailyClaimed(true);
        Alert.alert('Recompensa Diaria', res.error || 'Ya reclamaste tu bono de hoy. ¡Vuelve mañana!');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo reclamar la recompensa diaria.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRedeemPerk = async (itemType: string, itemId: string, cost: number, title: string) => {
    if (!isAuthenticated) {
      Alert.alert('Inicia Sesión', 'Inicia sesión para canjear tus Lumis.');
      return;
    }

    if (balance < cost) {
      Alert.alert(
        'Lumis Insuficientes',
        `Necesitas ${cost} Lumis para este beneficio. Tienes ${balance} Lumis actualmente. ¡Completa actividades conscientes para ganar más!`
      );
      return;
    }

    Alert.alert(
      'Confirmar Canje',
      `¿Deseas canjear ${cost} Lumis por "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: async () => {
            setIsLoading(true);
            try {
              const res = await mobileApi.spendLumis(itemType, itemId, cost, `Canje de ${title}`);
              if (res.ok && res.data) {
                const newBal = res.data.balance;
                setBalance(newBal);
                await AsyncStorage.setItem('conexionluz:lumis-balance', String(newBal));
                if (onBalanceUpdated) onBalanceUpdated(newBal);
                Alert.alert('🎉 ¡Canje Exitoso!', `Has canjeado "${title}". Tu nuevo saldo es de ${newBal} Lumis.`);
                loadWalletData();
              } else {
                Alert.alert('Error', res.error || 'No se pudo completar el canje.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Error al procesar el canje.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFBEB" />

        {/* TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.lumiIconBg}>
              <Sparkles color="#D97706" size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Billetera de Lumis®</Text>
              <Text style={styles.headerSubtitle}>Puntos de Bienestar y Luz</Text>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X color="#475569" size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* HERO BALANCE CARD */}
          <View style={styles.heroCard}>
            <View style={styles.heroGlowBadge}>
              <Sparkles color="#B45309" size={13} />
              <Text style={styles.heroGlowBadgeText}>PUNTOS CONSCIENTES</Text>
            </View>

            <View style={styles.balanceBigRow}>
              <Text style={styles.balanceBigNumber}>{balance}</Text>
              <Text style={styles.balanceBigSymbol}>✨ Lumis</Text>
            </View>

            <Text style={styles.heroDescription}>
              Los Lumis son tu energía de recompensa. Acumúlalos al meditar, escribir en tu diario y cuidar de tu mente.
            </Text>

            {/* DAILY CLAIM BUTTON */}
            <TouchableOpacity
              onPress={handleClaimDaily}
              disabled={isClaiming || dailyClaimed}
              style={[
                styles.dailyClaimBtn,
                dailyClaimed && styles.dailyClaimBtnClaimed,
              ]}
              activeOpacity={0.85}
            >
              {isClaiming ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : dailyClaimed ? (
                <>
                  <CheckCircle2 color="#047857" size={18} />
                  <Text style={styles.dailyClaimTextClaimed}>¡Bono Diario de Hoy Reclamado!</Text>
                </>
              ) : (
                <>
                  <Gift color="#FFFFFF" size={18} />
                  <Text style={styles.dailyClaimText}>Reclamar Bono Diario (+15 Lumis)</Text>
                  <Sparkles color="#FDE68A" size={16} />
                </>
              )}
            </TouchableOpacity>

            {/* BUY LUMIS BUTTON (COP & MERCADO PAGO) */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                router.push('/comprar-lumis' as any);
              }}
              style={styles.buyLumisCtaBtn}
              activeOpacity={0.88}
            >
              <Coins color="#FFFFFF" size={17} />
              <Text style={styles.buyLumisCtaText}>Comprar / Recargar Lumis (COP)</Text>
              <ArrowRight color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>

          {/* NAVIGATION TABS */}
          <View style={styles.tabsRow}>
            {[
              { id: 'rewards', label: '🎁 Beneficios' },
              { id: 'earn', label: '⚡ Cómo Ganar' },
              { id: 'history', label: '📜 Historial' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TAB 1: BENEFICIOS Y CANJES */}
          {activeTab === 'rewards' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Canjea tu Energía Consciente</Text>
              <Text style={styles.sectionSubtitle}>
                Usa tus Lumis para obtener descuentos en consultas, audios exclusivos y privilegios.
              </Text>

              <View style={styles.perksList}>
                {/* Perk 1 */}
                <View style={styles.perkCard}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <Heart color="#059669" size={22} />
                  </View>
                  <View style={styles.perkInfo}>
                    <Text style={styles.perkTitle}>Bono $20,000 COP en Terapia</Text>
                    <Text style={styles.perkDesc}>Aplica a cualquier sesión con nuestros terapeutas clínicos.</Text>
                    <View style={styles.perkCostRow}>
                      <Sparkles color="#D97706" size={14} />
                      <Text style={styles.perkCostText}>100 Lumis</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRedeemPerk('discount', 'therapy-20k', 100, 'Bono $20.000 COP en Consulta')}
                    style={[styles.redeemBtn, balance < 100 && styles.redeemBtnDisabled]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.redeemBtnText}>Canjear</Text>
                  </TouchableOpacity>
                </View>

                {/* Perk 2 */}
                <View style={styles.perkCard}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Brain color="#4F46E5" size={22} />
                  </View>
                  <View style={styles.perkInfo}>
                    <Text style={styles.perkTitle}>Hipnosis & Reprogramación VIP</Text>
                    <Text style={styles.perkDesc}>Audio guiado exclusivo para regeneración del sueño profundo.</Text>
                    <View style={styles.perkCostRow}>
                      <Sparkles color="#D97706" size={14} />
                      <Text style={styles.perkCostText}>50 Lumis</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRedeemPerk('audio', 'hypno-sleep', 50, 'Audio Hipnosis Sueño Profundo')}
                    style={[styles.redeemBtn, balance < 50 && styles.redeemBtnDisabled]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.redeemBtnText}>Canjear</Text>
                  </TouchableOpacity>
                </View>

                {/* Perk 3 */}
                <View style={styles.perkCard}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Award color="#D97706" size={22} />
                  </View>
                  <View style={styles.perkInfo}>
                    <Text style={styles.perkTitle}>Insignia Dorada de la Comunidad</Text>
                    <Text style={styles.perkDesc}>Distintivo brillante para tu perfil y comentarios en el foro.</Text>
                    <View style={styles.perkCostRow}>
                      <Sparkles color="#D97706" size={14} />
                      <Text style={styles.perkCostText}>30 Lumis</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRedeemPerk('badge', 'gold-member', 30, 'Insignia Dorada')}
                    style={[styles.redeemBtn, balance < 30 && styles.redeemBtnDisabled]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.redeemBtnText}>Canjear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: CÓMO GANAR */}
          {activeTab === 'earn' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Misiones de Bienestar</Text>
              <Text style={styles.sectionSubtitle}>
                Cada paso hacia tu paz interior genera abundancia de Lumis.
              </Text>

              <View style={styles.missionsList}>
                <View style={styles.missionCard}>
                  <View style={[styles.missionIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Gift color="#D97706" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.missionTitle}>Check-in Diario</Text>
                    <Text style={styles.missionDesc}>Abre la app diariamente y mantén tu racha activa.</Text>
                  </View>
                  <View style={styles.missionRewardBadge}>
                    <Text style={styles.missionRewardText}>+15 ✨</Text>
                  </View>
                </View>

                <View style={styles.missionCard}>
                  <View style={[styles.missionIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <NotebookPen color="#059669" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.missionTitle}>Escribir en el Diario Emocional</Text>
                    <Text style={styles.missionDesc}>Registra 1 gratitud y tu reflexión del día.</Text>
                  </View>
                  <View style={styles.missionRewardBadge}>
                    <Text style={styles.missionRewardText}>+10 ✨</Text>
                  </View>
                </View>

                <View style={styles.missionCard}>
                  <View style={[styles.missionIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <ClipboardList color="#4F46E5" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.missionTitle}>Completar un Test de Bienestar</Text>
                    <Text style={styles.missionDesc}>Evalúa tu ansiedad, ánimo o bienestar general.</Text>
                  </View>
                  <View style={styles.missionRewardBadge}>
                    <Text style={styles.missionRewardText}>+25 ✨</Text>
                  </View>
                </View>

                <View style={styles.missionCard}>
                  <View style={[styles.missionIconBox, { backgroundColor: '#FDF2F8' }]}>
                    <Heart color="#DB2777" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.missionTitle}>Compartir en la Comunidad</Text>
                    <Text style={styles.missionDesc}>Publica un destello o comenta positivamente.</Text>
                  </View>
                  <View style={styles.missionRewardBadge}>
                    <Text style={styles.missionRewardText}>+10 ✨</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 3: HISTORIAL */}
          {activeTab === 'history' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tus Movimientos Recientes</Text>
              <Text style={styles.sectionSubtitle}>
                Registro transparente de cada Lumi ganado y canjeado.
              </Text>

              {transactions.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Clock color="#94A3B8" size={32} />
                  <Text style={styles.emptyHistoryTitle}>Aún no tienes movimientos registrados</Text>
                  <Text style={styles.emptyHistoryDesc}>¡Reclama tu bono diario para comenzar!</Text>
                </View>
              ) : (
                <View style={styles.txList}>
                  {transactions.map((tx) => {
                    const isPositive = (tx.amount || 0) > 0;
                    return (
                      <View key={tx.id || Math.random()} style={styles.txCard}>
                        <View style={[styles.txIconBox, { backgroundColor: isPositive ? '#ECFDF5' : '#FEF2F2' }]}>
                          <Sparkles color={isPositive ? '#059669' : '#DC2626'} size={16} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.txDesc} numberOfLines={1}>{tx.description || 'Movimiento de Lumis'}</Text>
                          <Text style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Text style={[styles.txAmount, { color: isPositive ? '#059669' : '#DC2626' }]}>
                          {isPositive ? `+${tx.amount}` : tx.amount} ✨
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
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
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lumiIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#D97706',
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // HERO
  heroCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  heroGlowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: 10,
  },
  heroGlowBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  balanceBigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 4,
  },
  balanceBigNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: -1,
  },
  balanceBigSymbol: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
  },
  heroDescription: {
    fontSize: 12.5,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  dailyClaimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    width: '100%',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  dailyClaimBtnClaimed: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowOpacity: 0,
    elevation: 0,
  },
  dailyClaimText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },
  dailyClaimTextClaimed: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '800',
  },
  buyLumisCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    width: '100%',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buyLumisCtaText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },

  // TABS
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },

  // SECTION
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },

  // PERKS
  perksList: {
    gap: 10,
  },
  perkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  perkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkInfo: {
    flex: 1,
    gap: 2,
  },
  perkTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  perkDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  perkCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  perkCostText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#D97706',
  },
  redeemBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  redeemBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // MISSIONS
  missionsList: {
    gap: 10,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  missionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  missionDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  missionRewardBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  missionRewardText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#B45309',
  },

  // HISTORY
  emptyHistory: {
    alignItems: 'center',
    padding: 30,
    gap: 8,
  },
  emptyHistoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  emptyHistoryDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
  txList: {
    gap: 8,
  },
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  txIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDesc: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  txDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '900',
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, CreditCard, Wallet } from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface LumiHeaderBadgeProps {
  onPress?: () => void;
  overrideBalance?: number | null;
  variant?: 'banner' | 'pill';
}

export const LumiHeaderBadge: React.FC<LumiHeaderBadgeProps> = ({
  onPress,
  overrideBalance,
  variant = 'banner',
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (typeof overrideBalance === 'number') {
      setBalance(overrideBalance);
      return;
    }

    const loadBalance = async () => {
      try {
        const cached = await AsyncStorage.getItem('conexionluz:lumis-balance');
        if (cached) {
          setBalance(parseInt(cached, 10) || 0);
        } else if (user?.lumi_balance) {
          setBalance(user.lumi_balance);
        }

        if (isAuthenticated) {
          const res = await mobileApi.fetchLumiWallet();
          if (res.ok && res.data && typeof res.data.balance === 'number') {
            setBalance(res.data.balance);
            await AsyncStorage.setItem('conexionluz:lumis-balance', String(res.data.balance));
          }
        }
      } catch (e) {}
    };

    loadBalance();
  }, [user, isAuthenticated, overrideBalance]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/comprar-lumis' as any);
    }
  };

  if (variant === 'pill') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.pillContainer}
        activeOpacity={0.82}
      >
        <View style={styles.pillIconCircle}>
          <Sparkles color="#B45309" size={13} />
        </View>
        <Text style={styles.pillBalanceText}>{balance}</Text>
        <Text style={styles.pillCurrencyLabel}>Lumis</Text>
      </TouchableOpacity>
    );
  }

  // FIXED SPACIOUS BANNER (UNDER LOGO / HEADER)
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.bannerContainer}
      activeOpacity={0.88}
    >
      <View style={styles.bannerLeft}>
        <View style={styles.bannerIconCircle}>
          <Sparkles color="#D97706" size={16} />
        </View>
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerTagText}>BILLETERA & RECARGAS LUMIS</Text>
          <View style={styles.bannerAmountRow}>
            <Text style={styles.bannerAmountNumber}>{balance}</Text>
            <Text style={styles.bannerAmountLabel}>Lumis disponibles</Text>
          </View>
        </View>
      </View>

      <View style={styles.bannerRightAction}>
        <CreditCard color="#B45309" size={13} />
        <Text style={styles.bannerRightText}>Recargar</Text>
        <ArrowRight color="#B45309" size={13} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // BANNER STYLES (SPACIOUS & EVIDENT)
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bannerTextCol: {
    gap: 1,
  },
  bannerTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  bannerAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bannerAmountNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
    letterSpacing: -0.2,
  },
  bannerAmountLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400E',
  },
  bannerRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  bannerRightText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#92400E',
  },

  // PILL STYLES
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pillIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBalanceText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: -0.2,
  },
  pillCurrencyLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },
});

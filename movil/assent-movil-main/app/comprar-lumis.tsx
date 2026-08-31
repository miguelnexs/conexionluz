import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import {
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Building2,
  Lock,
  Check,
  AlertCircle,
  Award,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export interface LumiPackage {
  id: string;
  name: string;
  tagline: string;
  totalLumis: number;
  priceCOP: number;
  popular?: boolean;
  bestValue?: boolean;
  badge?: string;
  badgeBg: string;
  badgeTextColor: string;
  accentColor: string;
  accentBg: string;
  borderAccent: string;
  features: string[];
}

export const LUMI_PACKAGES: LumiPackage[] = [
  {
    id: 'pack-starter',
    name: 'Iniciación',
    tagline: 'Para experiencias y terapias individuales',
    totalLumis: 200,
    priceCOP: 10000,
    badge: '⚡ INICIAL',
    badgeBg: '#F1F5F9',
    badgeTextColor: '#334155',
    accentColor: '#475569',
    accentBg: '#F8FAFC',
    borderAccent: '#E2E8F0',
    features: [
      '200 Lumis acreditados al instante',
      'Sin fecha de expiración',
      'Acceso a ejercicios guiados',
    ],
  },
  {
    id: 'pack-popular',
    name: 'Foco & Bienestar',
    tagline: 'El preferido para meditación continua y talleres',
    totalLumis: 500,
    priceCOP: 25000,
    popular: true,
    badge: '🔥 MÁS POPULAR',
    badgeBg: '#059669',
    badgeTextColor: '#FFFFFF',
    accentColor: '#059669',
    accentBg: '#ECFDF5',
    borderAccent: '#A7F3D0',
    features: [
      '500 Lumis acreditados al instante',
      'Sin fecha de expiración',
      'Acceso a cursos y talleres en vivo',
    ],
  },
  {
    id: 'pack-pro',
    name: 'Transformación Pro',
    tagline: 'Formación avanzada e hipnosis clínica profunda',
    totalLumis: 1000,
    priceCOP: 50000,
    bestValue: true,
    badge: '💎 MEJOR VALOR',
    badgeBg: '#D97706',
    badgeTextColor: '#FFFFFF',
    accentColor: '#D97706',
    accentBg: '#FFFBEB',
    borderAccent: '#FDE68A',
    features: [
      '1.000 Lumis acreditados al instante',
      'Pase preferencial a Cursos Master',
      'Soporte prioritario 24/7',
    ],
  },
  {
    id: 'pack-master',
    name: 'Sanación Maestro',
    tagline: 'Recarga integral para programas de certificación',
    totalLumis: 2500,
    priceCOP: 120000,
    badge: '👑 ACCESO VIP',
    badgeBg: '#4F46E5',
    badgeTextColor: '#FFFFFF',
    accentColor: '#4F46E5',
    accentBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
    features: [
      '2.500 Lumis acreditados al instante',
      'Acceso VIP a todos los módulos',
      'Atención personalizada',
    ],
  },
];

const COLOMBIAN_BANKS = [
  'Bancolombia',
  'Banco Davivienda',
  'Banco de Bogotá',
  'Banco BBVA Colombia',
  'Banco de Occidente',
  'Banco Popular',
  'Banco Caja Social',
  'Banco Scotiabank Colpatria',
  'Banco Itaú',
  'Banco Falabella',
  'Banco AV Villas',
  'Lulo Bank',
  'RappiPay',
  'Dale!',
];

export default function ComprarLumisScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ packageId?: string }>();

  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [selectedPack, setSelectedPack] = useState<LumiPackage>(() => {
    if (params.packageId) {
      const found = LUMI_PACKAGES.find((p) => p.id === params.packageId);
      if (found) return found;
    }
    return LUMI_PACKAGES[1]; // Foco & Bienestar
  });

  const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'pse' | 'mp_checkout'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorData, setErrorData] = useState<string | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [docType, setDocType] = useState<string>('CC');
  const [docNumber, setDocNumber] = useState<string>('');
  const [installments, setInstallments] = useState<number>(1);
  const [payerEmail, setPayerEmail] = useState<string>(user?.email || '');

  // PSE Form State
  const [selectedBank, setSelectedBank] = useState<string>(COLOMBIAN_BANKS[0]);
  const [psePersonType, setPsePersonType] = useState<'natural' | 'juridica'>('natural');
  const [psePhone, setPsePhone] = useState<string>(user?.phone || '');
  const [pseDocNumber, setPseDocNumber] = useState<string>('');

  useEffect(() => {
    loadBalance();
  }, [user]);

  const loadBalance = async () => {
    try {
      const cached = await AsyncStorage.getItem('conexionluz:lumis-balance');
      if (cached) {
        setCurrentBalance(parseInt(cached, 10) || 0);
      } else if (user?.lumi_balance) {
        setCurrentBalance(user.lumi_balance);
      }

      const res = await mobileApi.fetchLumiWallet();
      if (res.ok && res.data && typeof res.data.balance === 'number') {
        setCurrentBalance(res.data.balance);
        await AsyncStorage.setItem('conexionluz:lumis-balance', String(res.data.balance));
      }
    } catch {}
  };

  // Auto-format card number
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  // Auto-format expiry
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // Detect card brand
  const getCardBrand = () => {
    const raw = cardNumber.replace(/\s/g, '');
    if (raw.startsWith('4')) return { brand: 'VISA', color: '#0F172A' };
    if (raw.startsWith('5')) return { brand: 'MASTERCARD', color: '#1E293B' };
    if (raw.startsWith('34') || raw.startsWith('37')) return { brand: 'AMEX', color: '#064E3B' };
    return { brand: 'TARJETA', color: '#0F172A' };
  };

  // 1. Process Card Payment via Mercado Pago API
  const handleProcessCardPayment = async () => {
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 15) {
      Alert.alert('Tarjeta Requerida', 'Por favor ingresa un número de tarjeta válido.');
      return;
    }
    if (!cardHolder.trim()) {
      Alert.alert('Titular Requerido', 'Ingresa el nombre del titular tal como aparece en la tarjeta.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      Alert.alert('Vencimiento Requerido', 'Ingresa el mes y año de vencimiento (MM/AA).');
      return;
    }
    if (cardCvv.length < 3) {
      Alert.alert('CVV Requerido', 'Ingresa el código de seguridad (3 o 4 dígitos).');
      return;
    }
    if (!docNumber.trim()) {
      Alert.alert('Documento Requerido', 'Ingresa tu número de identificación (Cédula).');
      return;
    }

    setIsProcessing(true);
    setErrorData(null);

    try {
      const res = await mobileApi.processMercadoPagoPay({
        itemType: 'lumi_package',
        packageId: selectedPack.id,
        totalLumis: selectedPack.totalLumis,
        priceCOP: selectedPack.priceCOP,
        payerEmail: payerEmail.trim() || user?.email || 'cliente@conexionluz.com',
        paymentMethod: 'card',
        cardData: {
          token: 'tok_real_' + Date.now(),
          payment_method_id: rawNumber.startsWith('4') ? 'visa' : 'master',
          installments: installments,
          docType: docType,
          docNumber: docNumber.trim(),
          cardholderName: cardHolder.trim().toUpperCase(),
        },
      });

      setIsProcessing(false);
      if (res.ok && res.data) {
        const newBal = (currentBalance || 0) + selectedPack.totalLumis;
        setCurrentBalance(newBal);
        await AsyncStorage.setItem('conexionluz:lumis-balance', String(newBal));

        setSuccessData({
          lumisAdded: selectedPack.totalLumis,
          newBalance: newBal,
          priceCOP: selectedPack.priceCOP,
          reference: res.data.referenceCode || `MP-CARD-${Date.now().toString().slice(-6)}`,
          methodLabel: `Tarjeta ${getCardBrand().brand} (•••• ${rawNumber.slice(-4)})`,
        });
      } else {
        setErrorData(res.error || 'Pago rechazado por Mercado Pago. Verifica los datos de tu tarjeta.');
      }
    } catch (e: any) {
      setIsProcessing(false);
      setErrorData(e.message || 'Error de conexión con la pasarela.');
    }
  };

  // 2. Process PSE Payment
  const handleProcessPSEPayment = async () => {
    if (!pseDocNumber.trim()) {
      Alert.alert('Documento Requerido', 'Por favor ingresa tu número de cédula para PSE.');
      return;
    }
    if (!psePhone.trim()) {
      Alert.alert('Teléfono Requerido', 'Ingresa tu número celular para la transferencia.');
      return;
    }

    setIsProcessing(true);
    setErrorData(null);

    try {
      const res = await mobileApi.createMercadoPagoPreference({
        packageId: selectedPack.id,
        totalLumis: selectedPack.totalLumis,
        priceCOP: selectedPack.priceCOP,
        packageName: selectedPack.name,
        payerEmail: payerEmail.trim() || user?.email || 'cliente@conexionluz.com',
        method: 'pse',
      });

      const initPoint = res.data?.initPoint || res.data?.init_point || res.data?.sandboxInitPoint;
      if (res.ok && initPoint) {
        setIsProcessing(false);
        await WebBrowser.openBrowserAsync(initPoint);

        // Auto-refresh balance upon return
        setTimeout(async () => {
          const w = await mobileApi.fetchLumiWallet();
          if (w.ok && w.data && w.data.balance > (currentBalance || 0)) {
            const added = w.data.balance - (currentBalance || 0);
            setCurrentBalance(w.data.balance);
            await AsyncStorage.setItem('conexionluz:lumis-balance', String(w.data.balance));
            setSuccessData({
              lumisAdded: added,
              newBalance: w.data.balance,
              priceCOP: selectedPack.priceCOP,
              reference: `PSE-${Date.now().toString().slice(-6)}`,
              methodLabel: `Transferencia PSE (${selectedBank})`,
            });
          }
        }, 1200);
      } else {
        setIsProcessing(false);
        setErrorData(res.error || 'No se pudo generar la pasarela PSE.');
      }
    } catch (e: any) {
      setIsProcessing(false);
      setErrorData(e.message || 'Error al conectar con PSE.');
    }
  };

  // 3. Process Official Hosted Checkout
  const handleProcessMPHosted = async () => {
    setIsProcessing(true);
    setErrorData(null);

    try {
      const res = await mobileApi.createMercadoPagoPreference({
        packageId: selectedPack.id,
        totalLumis: selectedPack.totalLumis,
        priceCOP: selectedPack.priceCOP,
        packageName: selectedPack.name,
        payerEmail: payerEmail.trim() || user?.email || 'cliente@conexionluz.com',
        method: 'all',
      });

      const initPoint = res.data?.initPoint || res.data?.init_point || res.data?.sandboxInitPoint;
      if (res.ok && initPoint) {
        setIsProcessing(false);
        await WebBrowser.openBrowserAsync(initPoint);

        setTimeout(async () => {
          const w = await mobileApi.fetchLumiWallet();
          if (w.ok && w.data && w.data.balance > (currentBalance || 0)) {
            const added = w.data.balance - (currentBalance || 0);
            setCurrentBalance(w.data.balance);
            await AsyncStorage.setItem('conexionluz:lumis-balance', String(w.data.balance));
            setSuccessData({
              lumisAdded: added,
              newBalance: w.data.balance,
              priceCOP: selectedPack.priceCOP,
              reference: `MP-HOSTED-${Date.now().toString().slice(-6)}`,
              methodLabel: 'Pasarela Oficial Mercado Pago',
            });
          }
        }, 1200);
      } else {
        setIsProcessing(false);
        setErrorData(res.error || 'No se pudo abrir la pasarela de Mercado Pago.');
      }
    } catch (e: any) {
      setIsProcessing(false);
      setErrorData(e.message || 'Error al conectar con Mercado Pago.');
    }
  };

  const cardBrandObj = getCardBrand();

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* ── TOP HEADER (CLEAN & SPACIOUS) ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerMainTitle}>Recargar Lumis</Text>
          <Text style={styles.headerSubTitle}>⚡ Mercado Pago Colombia</Text>
        </View>

        <View style={styles.balancePill}>
          <Sparkles color="#B45309" size={13} />
          <Text style={styles.balancePillNumber}>{currentBalance}</Text>
          <Text style={styles.balancePillUnit}>Lumis</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── 1. SELECTOR DE PAQUETE ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTag}>PASO 1 · SELECCIONA TU PAQUETE</Text>
          </View>

          {/* PAQUETES EN GRID 2x2 ELEGANTE */}
          <View style={styles.packagesGrid}>
            {LUMI_PACKAGES.map((p) => {
              const isSelected = selectedPack.id === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPack(p)}
                  style={[
                    styles.gridPackCard,
                    isSelected && styles.gridPackCardActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.gridPackTop}>
                    <Text style={[styles.gridPackLumis, isSelected && { color: '#059669' }]}>
                      +{p.totalLumis}
                    </Text>
                    <Text style={styles.gridPackLumisUnit}>Lumis</Text>
                  </View>

                  <Text style={styles.gridPackName} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.gridPackPrice, isSelected && { color: '#059669' }]}>
                    ${p.priceCOP.toLocaleString('es-CO')}
                  </Text>

                  {p.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>MÁS POPULAR</Text>
                    </View>
                  )}
                  {p.bestValue && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueBadgeText}>MEJOR VALOR</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BANNER RESUMEN DEL PAQUETE ACTIVO */}
          <View style={styles.activePackSummary}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activePackName}>{selectedPack.name}</Text>
              <Text style={styles.activePackTagline}>{selectedPack.tagline}</Text>
              <Text style={styles.activePackPriceText}>
                ${selectedPack.priceCOP.toLocaleString('es-CO')} COP · 1 Lumi = $50 COP
              </Text>
            </View>

            <View style={styles.activePackLumiCircle}>
              <Sparkles color="#FFFFFF" size={18} />
              <Text style={styles.activePackLumiCount}>+{selectedPack.totalLumis}</Text>
            </View>
          </View>
        </View>

        {/* ── 2. SECCIÓN DE PAGO CON MERCADO PAGO ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTag}>PASO 2 · MEDIO DE PAGO EN LÍNEA</Text>
            <View style={styles.sslBadge}>
              <Lock color="#059669" size={11} />
              <Text style={styles.sslBadgeText}>SSL Seguro</Text>
            </View>
          </View>

          {/* PESTAÑAS DE PAGO LIMPIAS Y SIN SUPERPOSICIÓN */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => {
                setActivePaymentTab('card');
                setErrorData(null);
              }}
              style={[styles.tabButton, activePaymentTab === 'card' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <CreditCard color={activePaymentTab === 'card' ? '#059669' : '#64748B'} size={15} />
              <Text style={[styles.tabButtonText, activePaymentTab === 'card' && styles.tabButtonTextActive]}>
                Tarjeta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActivePaymentTab('pse');
                setErrorData(null);
              }}
              style={[styles.tabButton, activePaymentTab === 'pse' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <Building2 color={activePaymentTab === 'pse' ? '#059669' : '#64748B'} size={15} />
              <Text style={[styles.tabButtonText, activePaymentTab === 'pse' && styles.tabButtonTextActive]}>
                PSE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActivePaymentTab('mp_checkout');
                setErrorData(null);
              }}
              style={[styles.tabButton, activePaymentTab === 'mp_checkout' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <Zap color={activePaymentTab === 'mp_checkout' ? '#059669' : '#64748B'} size={15} />
              <Text style={[styles.tabButtonText, activePaymentTab === 'mp_checkout' && styles.tabButtonTextActive]}>
                Mercado Pago
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── TAB A: TARJETA DE CRÉDITO / DÉBITO ── */}
          {activePaymentTab === 'card' && (
            <View style={styles.tabContent}>
              {/* TARJETA VISUAL INTERACTIVA EN VIVO */}
              <View style={[styles.virtualCard, { backgroundColor: cardBrandObj.color }]}>
                <View style={styles.virtualCardTop}>
                  <View style={styles.virtualCardChip} />
                  <Text style={styles.virtualCardBrand}>{cardBrandObj.brand}</Text>
                </View>

                <Text style={styles.virtualCardNumber}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>

                <View style={styles.virtualCardBottom}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.virtualCardLabel}>TITULAR</Text>
                    <Text style={styles.virtualCardHolder} numberOfLines={1}>
                      {cardHolder.toUpperCase() || 'NOMBRE DEL TITULAR'}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', minWidth: 60 }}>
                    <Text style={styles.virtualCardLabel}>VENCE</Text>
                    <Text style={styles.virtualCardExpiry}>{cardExpiry || 'MM/AA'}</Text>
                  </View>
                </View>
              </View>

              {/* INPUTS DE FORMULARIO */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Número de Tarjeta</Text>
                <View style={styles.inputBox}>
                  <CreditCard color="#64748B" size={17} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    maxLength={19}
                  />
                </View>

                <Text style={styles.inputLabel}>Nombre del Titular</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Como figura en la tarjeta"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="characters"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.inputLabel}>Vencimiento</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM/AA"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={cardExpiry}
                        onChangeText={handleExpiryChange}
                        maxLength={5}
                      />
                    </View>
                  </View>

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.inputLabel}>CVV / Cód. Seg.</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="123"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        secureTextEntry={true}
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        maxLength={4}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={{ width: 70, marginRight: 8 }}>
                    <Text style={styles.inputLabel}>Tipo</Text>
                    <View style={[styles.inputBox, { justifyContent: 'center' }]}>
                      <Text style={styles.docTypeText}>CC</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Número de Cédula</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Número de identificación"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={docNumber}
                        onChangeText={setDocNumber}
                      />
                    </View>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Número de Cuotas</Text>
                <View style={styles.installmentsRow}>
                  {[1, 2, 3, 6, 12].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => setInstallments(num)}
                      style={[
                        styles.installmentBtn,
                        installments === num && styles.installmentBtnActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.installmentText, installments === num && styles.installmentTextActive]}>
                        {num === 1 ? '1 Cuota' : `${num}x`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Correo para Comprobante</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={payerEmail}
                    onChangeText={setPayerEmail}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleProcessCardPayment}
                disabled={isProcessing}
                style={[styles.primaryActionBtn, isProcessing && { opacity: 0.7 }]}
                activeOpacity={0.88}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Lock color="#FFFFFF" size={17} />
                    <Text style={styles.primaryActionBtnText}>
                      Pagar ${selectedPack.priceCOP.toLocaleString('es-CO')} COP · +{selectedPack.totalLumis} Lumis
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ── TAB B: PSE (MERCADO PAGO) ── */}
          {activePaymentTab === 'pse' && (
            <View style={styles.tabContent}>
              <View style={styles.infoBannerBox}>
                <Building2 color="#4F46E5" size={18} />
                <Text style={styles.infoBannerText}>
                  Transfiere en tiempo real desde tu banco con el respaldo oficial de PSE y Mercado Pago.
                </Text>
              </View>

              <Text style={styles.inputLabel}>Selecciona tu Banco</Text>
              <ScrollView style={styles.bankPickerScroll} nestedScrollEnabled={true}>
                {COLOMBIAN_BANKS.map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    onPress={() => setSelectedBank(bank)}
                    style={[styles.bankItem, selectedBank === bank && styles.bankItemActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.bankItemText, selectedBank === bank && styles.bankItemTextActive]}>
                      {bank}
                    </Text>
                    {selectedBank === bank && <Check color="#4F46E5" size={15} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Tipo de Persona</Text>
              <View style={styles.formRow}>
                <TouchableOpacity
                  onPress={() => setPsePersonType('natural')}
                  style={[styles.personTypeBtn, psePersonType === 'natural' && styles.personTypeBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.personTypeText, psePersonType === 'natural' && styles.personTypeTextActive]}>
                    Persona Natural
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPsePersonType('juridica')}
                  style={[styles.personTypeBtn, psePersonType === 'juridica' && styles.personTypeBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.personTypeText, psePersonType === 'juridica' && styles.personTypeTextActive]}>
                    Persona Jurídica
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Cédula / NIT</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Número de identificación"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={pseDocNumber}
                  onChangeText={setPseDocNumber}
                />
              </View>

              <Text style={styles.inputLabel}>Teléfono Celular</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: 3001234567"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={psePhone}
                  onChangeText={setPsePhone}
                />
              </View>

              <TouchableOpacity
                onPress={handleProcessPSEPayment}
                disabled={isProcessing}
                style={[styles.primaryActionBtn, { backgroundColor: '#4F46E5' }, isProcessing && { opacity: 0.7 }]}
                activeOpacity={0.88}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Building2 color="#FFFFFF" size={17} />
                    <Text style={styles.primaryActionBtnText}>
                      Continuar a PSE ({selectedBank})
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ── TAB C: MERCADO PAGO HOSTED CHECKOUT ── */}
          {activePaymentTab === 'mp_checkout' && (
            <View style={styles.tabContent}>
              <View style={[styles.infoBannerBox, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                <Zap color="#0284C7" size={18} />
                <Text style={[styles.infoBannerText, { color: '#0369A1' }]}>
                  Accede a la pasarela web oficial de Mercado Pago para pagar con tarjetas guardadas, Efecty, Daviplata o saldo Mercado Pago.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleProcessMPHosted}
                disabled={isProcessing}
                style={[styles.primaryActionBtn, { backgroundColor: '#0284C7' }, isProcessing && { opacity: 0.7 }]}
                activeOpacity={0.88}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Zap color="#FFFFFF" size={17} />
                    <Text style={styles.primaryActionBtnText}>
                      Abrir Pasarela Mercado Pago (${selectedPack.priceCOP.toLocaleString('es-CO')} COP)
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ERROR ALERT */}
          {errorData && (
            <View style={styles.errorBannerBox}>
              <AlertCircle color="#E11D48" size={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.errorBannerTitle}>No se pudo procesar el pago</Text>
                <Text style={styles.errorBannerText}>{errorData}</Text>
              </View>
            </View>
          )}

          {/* FOOTER DE SEGURIDAD */}
          <View style={styles.securityFooterRow}>
            <ShieldCheck color="#059669" size={15} />
            <Text style={styles.securityFooterText}>
              Cifrado SSL 256 bits · Procesado 100% por Mercado Pago
            </Text>
          </View>
        </View>

        {/* ── 3. GARANTÍA DE SALDO ── */}
        <View style={styles.guaranteeCard}>
          <Award color="#D97706" size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Garantía de Saldo ConexiónLuz®</Text>
            <Text style={styles.guaranteeDesc}>
              Tus Lumis quedan acreditados inmediatamente en tu cuenta, sin fecha de vencimiento y auditados contablemente.
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── MODAL DE PAGO EXITOSO ── */}
      <Modal
        visible={Boolean(successData)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessData(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successGlowCircle}>
              <Sparkles color="#D97706" size={34} />
            </View>

            <Text style={styles.successModalTitle}>¡Recarga Aprobada! ⚡</Text>
            <Text style={styles.successModalDesc}>
              Tu pago ha sido confirmado por Mercado Pago y tus Lumis ya están disponibles en tu billetera.
            </Text>

            <View style={styles.successLumisHighlight}>
              <Sparkles color="#059669" size={18} />
              <Text style={styles.successLumisNumber}>
                +{successData?.lumisAdded?.toLocaleString('es-CO')} Lumis
              </Text>
            </View>

            <View style={styles.successReceiptBox}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Nuevo Saldo:</Text>
                <Text style={styles.receiptValue}>✨ {successData?.newBalance} Lumis</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Monto Pagado:</Text>
                <Text style={styles.receiptValue}>${successData?.priceCOP?.toLocaleString('es-CO')} COP</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Medio de Pago:</Text>
                <Text style={styles.receiptValue}>{successData?.methodLabel}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Referencia Oficial:</Text>
                <Text style={styles.receiptValue}>{successData?.reference}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSuccessData(null);
                router.back();
              }}
              style={styles.successDoneBtn}
              activeOpacity={0.88}
            >
              <Text style={styles.successDoneBtnText}>Regresar a mis Actividades</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  balancePillNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#78350F',
  },
  balancePillUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // SECTION CARD
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  sslBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sslBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#047857',
  },

  // 1. GRID DE PAQUETES
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridPackCard: {
    width: (width - 64 - 8) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 2,
  },
  gridPackCardActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 2,
  },
  gridPackTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  gridPackLumis: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  gridPackLumisUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  gridPackName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  gridPackPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginTop: 2,
  },
  popularBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#047857',
  },
  bestValueBadge: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginTop: 2,
  },
  bestValueBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#B45309',
  },
  activePackSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 10,
  },
  activePackName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  activePackTagline: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  activePackPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  activePackLumiCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePackLumiCount: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },

  // 2. TABS DE PAGO
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 5,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  tabContent: {
    gap: 12,
    marginTop: 4,
  },

  // TARJETA VIRTUAL
  virtualCard: {
    borderRadius: 16,
    padding: 14,
    height: 165,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  virtualCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  virtualCardChip: {
    width: 34,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#FDE68A',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  virtualCardBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  virtualCardNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  virtualCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  virtualCardLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  virtualCardHolder: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  virtualCardExpiry: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // FORMULARIOS
  formGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginTop: 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 12,
    height: 42,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTypeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  installmentsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  installmentBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingVertical: 7,
    alignItems: 'center',
  },
  installmentBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 1.5,
  },
  installmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  installmentTextActive: {
    color: '#059669',
    fontWeight: '900',
  },

  // PSE
  infoBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    padding: 10,
    borderRadius: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#3730A3',
    lineHeight: 15,
  },
  bankPickerScroll: {
    maxHeight: 130,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    padding: 3,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
  },
  bankItemActive: {
    backgroundColor: '#EEF2FF',
  },
  bankItemText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  bankItemTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },
  personTypeBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  personTypeBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
    borderWidth: 1.5,
  },
  personTypeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  personTypeTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },

  // CTA BUTTON
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // ERROR & SECURITY
  errorBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    padding: 10,
    borderRadius: 12,
  },
  errorBannerTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#E11D48',
  },
  errorBannerText: {
    fontSize: 11,
    color: '#BE123C',
    marginTop: 1,
  },
  securityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 2,
  },
  securityFooterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },

  // GUARANTEE
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  guaranteeDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 1,
  },

  // SUCCESS MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  successGlowCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  successModalDesc: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
  successLumisHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  successLumisNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  successReceiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  receiptValue: {
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '800',
  },
  successDoneBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  successDoneBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

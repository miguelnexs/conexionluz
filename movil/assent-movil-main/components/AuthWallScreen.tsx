import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Mail, Lock, User, LogIn, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export function AuthWallScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const { login, register } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  const handleSubmit = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setLoading(true);

    if (authMode === 'login') {
      const res = await login(emailInput.trim(), passwordInput.trim());
      setLoading(false);
      if (res.ok) {
        Alert.alert('¡Bienvenido/a!', 'Sesión iniciada correctamente.');
      } else {
        Alert.alert('Error', res.error || 'Credenciales incorrectas');
      }
    } else {
      if (!firstNameInput.trim()) {
        setLoading(false);
        Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
        return;
      }
      const res = await register(
        firstNameInput.trim(),
        lastNameInput.trim(),
        emailInput.trim(),
        passwordInput.trim()
      );
      setLoading(false);
      if (res.ok) {
        Alert.alert('¡Registro exitoso!', 'Bienvenido/a a Conexión Luz®');
      } else {
        Alert.alert('Error', res.error || 'No se pudo crear la cuenta');
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BRAND LOGO HEADER */}
        <View style={styles.brandContainer}>
          <View style={styles.sunBadgeBox}>
            <Sun color="#F59E0B" size={38} />
          </View>
          <Text style={styles.brandName}>ConexiónLuz</Text>
          <Text style={styles.brandTagline}>
            Comunidad, apoyo emocional y salud mental integral
          </Text>
        </View>

        {/* AUTH CARD */}
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Ingreso a la Plataforma</Text>
          <Text style={styles.authSubTitle}>
            Inicia sesión o regístrate con tu correo electrónico para acceder a tu contenido.
          </Text>

          {/* TAB SWITCHER */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setAuthMode('login')}
              style={[styles.tabBtn, authMode === 'login' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, authMode === 'login' && styles.tabTextActive]}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAuthMode('register')}
              style={[styles.tabBtn, authMode === 'register' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, authMode === 'register' && styles.tabTextActive]}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          {/* FORM FIELDS */}
          {authMode === 'register' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre</Text>
                <View style={styles.inputBox}>
                  <User color="#64748B" size={18} />
                  <TextInput
                    value={firstNameInput}
                    onChangeText={setFirstNameInput}
                    placeholder="Ej. Sofía"
                    placeholderTextColor="#94A3B8"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Apellido</Text>
                <View style={styles.inputBox}>
                  <User color="#64748B" size={18} />
                  <TextInput
                    value={lastNameInput}
                    onChangeText={setLastNameInput}
                    placeholder="Ej. Varela"
                    placeholderTextColor="#94A3B8"
                    style={styles.textInput}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputBox}>
              <Mail color="#64748B" size={18} />
              <TextInput
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="ejemplo@conexionluz.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputBox}>
              <Lock color="#64748B" size={18} />
              <TextInput
                value={passwordInput}
                onChangeText={setPasswordInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.textInput}
              />
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitBtn}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <LogIn color="#FFFFFF" size={18} />
                <Text style={styles.submitBtnText}>
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* SECURITY FOOTER */}
        <View style={styles.securityFooter}>
          <ShieldCheck color="#059669" size={16} />
          <Text style={styles.securityText}>Tus datos están encriptados y protegidos por Conexión Luz®</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  sunBadgeBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },

  authCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  authSubTitle: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 16,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '900',
  },

  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },

  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});

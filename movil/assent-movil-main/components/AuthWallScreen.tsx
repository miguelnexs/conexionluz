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
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Svg, { Path } from 'react-native-svg';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client ID — debe coincidir con el configurado en SiteSettings del backend
const GOOGLE_CLIENT_ID = '14270208474-n2rcnds6ksetn9m2vt0llm2fecijbnko.apps.googleusercontent.com';

const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

export function AuthWallScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const { login, register, loginWithGoogle } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // Google OAuth setup via expo-auth-session
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleCredential(authentication.idToken);
      } else if (authentication?.accessToken) {
        // Fallback: some flows return accessToken instead of idToken
        handleGoogleCredential(authentication.accessToken);
      } else {
        Alert.alert('Error', 'No se pudo obtener el token de Google.');
        setGoogleLoading(false);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Error al iniciar sesión con Google.');
      setGoogleLoading(false);
    } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
      setGoogleLoading(false);
    }
  }, [response]);

  async function handleGoogleCredential(token: string) {
    try {
      const res = await loginWithGoogle(token);
      if (!res.ok) {
        Alert.alert('Error', res.error || 'No se pudo iniciar sesión con Google.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Error inesperado.');
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGooglePress() {
    setGoogleLoading(true);
    try {
      // Usamos la URI web registrada en Google Cloud Console (https://conexionluz.com/login)
      // para evitar el Error 400: invalid_request que Google muestra con esquemas no web
      const redirectUri = Platform.OS === 'web' 
        ? (typeof window !== 'undefined' ? window.location.origin + '/login' : 'https://conexionluz.com/login')
        : 'https://conexionluz.com/login';

      console.log('[GoogleAuth] Usando Redirect URI registrada:', redirectUri);

      const nonce = Math.random().toString(36).substring(2);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token` +
        `&scope=${encodeURIComponent('openid profile email')}` +
        `&nonce=${nonce}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        console.log('[GoogleAuth] WebBrowser retornó URL:', result.url);
        const match = result.url.match(/id_token=([^&]+)/) || result.url.match(/access_token=([^&]+)/);
        const token = match ? match[1] : null;

        if (token) {
          await handleGoogleCredential(token);
          return;
        }
      }

      setGoogleLoading(false);
    } catch (err: any) {
      console.error('[GoogleAuth] Error:', err);
      Alert.alert('Error', err?.message || 'No se pudo abrir el inicio de sesión de Google.');
      setGoogleLoading(false);
    }
  }

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

          {/* GOOGLE SIGN-IN BUTTON */}
          <TouchableOpacity
            onPress={handleGooglePress}
            disabled={googleLoading || !request}
            style={[styles.googleBtn, (googleLoading || !request) && { opacity: 0.6 }]}
            activeOpacity={0.85}
          >
            {googleLoading ? (
              <ActivityIndicator color="#374151" size="small" />
            ) : (
              <>
                <GoogleIcon />
                <Text style={styles.googleBtnText}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

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

  // Google Sign-In button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
});

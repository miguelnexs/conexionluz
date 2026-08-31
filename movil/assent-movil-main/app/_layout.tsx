import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { TabBarVisibilityProvider } from '../context/TabBarVisibilityContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TabBarVisibilityProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.dark.background,
              },
              headerTintColor: Colors.dark.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: Colors.dark.background,
              },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="details" options={{ title: 'Detalles' }} />
            <Stack.Screen name="conversatorios" options={{ headerShown: false }} />
            <Stack.Screen name="cursos" options={{ headerShown: false }} />
            <Stack.Screen name="curso-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="historias" options={{ headerShown: false }} />
            <Stack.Screen name="historia-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="foro" options={{ headerShown: false }} />
            <Stack.Screen name="foro-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="testimonios" options={{ headerShown: false }} />
            <Stack.Screen name="test-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="ejercicio-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="relajacion-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="diario-emocional" options={{ headerShown: false }} />
            <Stack.Screen name="progreso" options={{ headerShown: false }} />
            <Stack.Screen name="comprar-lumis" options={{ headerShown: false }} />
            <Stack.Screen name="agenda" options={{ headerShown: false }} />
            <Stack.Screen name="mi-calendario" options={{ headerShown: false }} />
            <Stack.Screen name="guias-de-luz" options={{ headerShown: false }} />
            <Stack.Screen name="perfil-usuario" options={{ headerShown: false }} />
            <Stack.Screen name="informacion" options={{ headerShown: false }} />
            <Stack.Screen name="quienes-somos" options={{ headerShown: false }} />
            <Stack.Screen name="faq" options={{ headerShown: false }} />
            <Stack.Screen name="contacto" options={{ headerShown: false }} />
            <Stack.Screen name="privacidad" options={{ headerShown: false }} />
          </Stack>
        </TabBarVisibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

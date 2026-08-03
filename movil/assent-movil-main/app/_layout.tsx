import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
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
      </Stack>
    </ThemeProvider>
  );
}

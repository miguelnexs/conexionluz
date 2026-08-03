import { MaterialTopTabs } from '../../components/MaterialTopTabs';
import { useTheme } from '../../context/ThemeContext';
import { Home, Compass, User } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 1, 
          borderTopColor: '#E2E8F0',
          elevation: 8, 
          shadowOpacity: 0.05,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748B',
        tabBarIndicatorStyle: { 
          backgroundColor: '#059669', 
          height: 3, 
          top: 0
        },
        tabBarLabelStyle: { 
          fontSize: 11, 
          fontWeight: 'bold', 
          textTransform: 'none',
          marginTop: -3,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Compass color={color} size={22} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />
    </MaterialTopTabs>
  );
}

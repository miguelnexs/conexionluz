import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { MaterialTopTabs } from '../../components/MaterialTopTabs';
import { Home, Users, User, Activity, Info } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { AuthWallScreen } from '../../components/AuthWallScreen';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isTabBarVisible } = useTabBarVisibility();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthWallScreen />;
  }

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarShowIcon: true,
        tabBarStyle: isTabBarVisible ? { 
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 1, 
          borderTopColor: '#E2E8F0',
          elevation: 8, 
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 6,
          height: 56,
          display: 'flex',
        } : {
          display: 'none',
          height: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 56,
          padding: 0,
        },
        tabBarActiveTintColor: '#0D9488',
        tabBarInactiveTintColor: '#64748B',
        tabBarIndicatorStyle: { 
          backgroundColor: '#0D9488', 
          height: 3, 
          top: 0,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Home color={color} size={23} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="comunidad"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Users color={color} size={23} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <User color={color} size={23} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="actividades"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Activity color={color} size={23} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="informacion"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Info color={color} size={23} />,
        }}
      />
    </MaterialTopTabs>
  );
}

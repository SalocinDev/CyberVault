import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ribbon from '@/components/ribbon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <Ribbon />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="vault"
          options={{
            title: 'Vault',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text" color={color} />,
          }}
        />
        <Tabs.Screen
          name="passwords"
          options={{
            title: 'Passwords',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="key.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="monitor"
          options={{
            title: 'Monitor',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="alarm.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="security"
          options={{
            title: 'Security',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="JM_Clicker"
          options={{
            title: 'JM_Clicker',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cursorarrow" color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

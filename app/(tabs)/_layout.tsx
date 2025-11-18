import { HapticTab } from '@/components/haptic-tab';
import Ribbon from '@/components/ribbon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

import { useColorScheme } from '@/hooks/use-color-scheme';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="vault"
          options={{
            title: 'Vault',
            tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="passwords"
          options={{
            title: 'Passwords',
            tabBarIcon: ({ color }) => <Feather name="key" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="monitor"
          options={{
            title: 'Monitor',
            tabBarIcon: ({ color }) => <Ionicons name="warning-outline" size={20} color={color} />,
          }}
        />
{/*         <Tabs.Screen
          name="JM_Clicker"
          options={{
            title: 'JM_Clicker',
            tabBarIcon: ({ color }) => <IconSymbol size={20} name="cursorarrow" color={color} />,
          }}
        />  */}       
{/*         <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <IconSymbol size={20} name="gear" color={color} />,
          }}
        /> */}
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

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeIAP } from '@hallpass/iap-core';
import { Platform } from 'react-native';

export default function Layout() {
  useEffect(() => {
    // Initialize IAP on app start
    if (Platform.OS !== 'web') {
      initializeIAP(Platform.OS as 'ios' | 'android');
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f0f1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#0f0f1a',
        },
      }}
    />
  );
}
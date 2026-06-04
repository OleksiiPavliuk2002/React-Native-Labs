import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { biometricManager } from '../security/BiometricManager';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lock'>;

export function LockScreen({ navigation }: Props) {
  const onUnlock = async () => {
    const result = await biometricManager.authenticate('Unlock secure area');
    if (result.ok) {
      navigation.replace('MainTabs');
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#fef3c7']}
      style={styles.container}
    >
      <Text style={styles.title}>App is Locked</Text>
      <Text style={styles.subtitle}>Authenticate to continue</Text>
      <PrimaryButton title="Unlock with Biometrics" onPress={onUnlock} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: theme.spacing.lg, 
    padding: theme.spacing.md 
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    textAlign: 'center',
  },
});

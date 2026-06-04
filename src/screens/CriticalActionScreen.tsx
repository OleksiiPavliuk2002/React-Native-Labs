import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { biometricManager } from '../security/BiometricManager';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme/theme';

export function CriticalActionScreen() {
  const [message, setMessage] = useState('No critical action executed');

  const onConfirm = async () => {
    const result = await biometricManager.authenticate('Confirm dangerous operation');
    if (result.ok) {
      setMessage('Critical action confirmed and completed');
    } else {
      setMessage(result.message ?? 'Biometric confirmation failed');
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#fee2e2']}
      style={styles.container}
    >
      <Text style={styles.title}>Critical Action</Text>
      <Text style={styles.description}>Deleting all tasks requires biometric confirmation.</Text>
      <PrimaryButton title="Confirm with Biometrics" onPress={onConfirm} />
      <Text style={styles.message}>{message}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.md, 
    gap: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

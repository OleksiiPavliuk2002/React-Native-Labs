import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { biometricManager } from '../security/BiometricManager';
import { useAppContext } from '../state/AppContext';
import { UserProfile } from '../models/UserProfile';
import { theme } from '../theme/theme';

export function SecuritySettingsScreen() {
  const { profile, updateProfile } = useAppContext();
  const [enabled, setEnabled] = useState(profile.biometricEnabled);
  const [type, setType] = useState('Unknown');

  useEffect(() => {
    biometricManager.checkAvailability().then((result) => setType(result.type));
    biometricManager.isEnabledByUser().then((value) => setEnabled(value));
  }, []);

  const onToggle = async (value: boolean) => {
    setEnabled(value);
    await biometricManager.setEnabledByUser(value);
    const next = new UserProfile(
      profile.id,
      profile.fullName,
      profile.email,
      value,
      profile.lockTimeoutSec,
      profile.lastLoginAt
    );
    await updateProfile(next);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#ecfdf5']}
      style={styles.container}
    >
      <Text style={styles.title}>Security Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Supported Biometric Type:</Text>
        <Text style={styles.value}>{type}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Enable Biometrics</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={enabled ? theme.colors.primaryText : theme.colors.muted}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Lock Timeout (seconds):</Text>
        <Text style={styles.value}>{profile.lockTimeoutSec}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    ...theme.shadows.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: 16,
  },
  value: {
    color: theme.colors.muted,
    fontSize: 16,
  },
});

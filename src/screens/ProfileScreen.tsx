import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../state/AppContext';
import { theme } from '../theme/theme';

export function ProfileScreen() {
  const { profile } = useAppContext();
  return (
    <LinearGradient
      colors={[theme.colors.background, '#fce7f3']}
      style={styles.container}
    >
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{profile.fullName}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Biometric Enabled:</Text>
        <Text style={[styles.value, { color: profile.biometricEnabled ? theme.colors.success : theme.colors.danger }]}>
          {profile.biometricEnabled ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Last Login:</Text>
        <Text style={styles.value}>{profile.lastLoginAt.toLocaleString()}</Text>
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

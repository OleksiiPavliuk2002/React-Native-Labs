import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../state/AppContext';
import { theme } from '../theme/theme';

export function RealtimeScreen() {
  const { tasks, startRealtime, stopRealtime } = useAppContext();

  useEffect(() => {
    startRealtime();
    return () => stopRealtime();
  }, [startRealtime, stopRealtime]);

  return (
    <LinearGradient
      colors={[theme.colors.background, '#dbeafe']}
      style={styles.container}
    >
      <Text style={styles.title}>Realtime Feed</Text>
      <View style={styles.card}>
        <Text style={styles.description}>Incoming tasks from mock WebSocket every 4 seconds.</Text>
        <Text style={styles.count}>Total tasks now: {tasks.length}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    ...theme.shadows.medium,
    alignItems: 'center',
    width: '80%',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  count: { 
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});

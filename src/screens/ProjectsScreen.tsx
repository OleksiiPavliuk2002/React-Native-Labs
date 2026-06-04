import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../state/AppContext';
import { theme } from '../theme/theme';

export function ProjectsScreen() {
  const { projects } = useAppContext();
  return (
    <LinearGradient
      colors={[theme.colors.background, '#fef3c7']}
      style={styles.container}
    >
      <Text style={styles.title}>Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>Budget: ${item.budget}</Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, item.isArchived && styles.archivedText]}>
                {item.isArchived ? 'Archived' : 'Active'}
              </Text>
              <View style={[styles.statusDot, { backgroundColor: item.isArchived ? theme.colors.muted : theme.colors.success }]} />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.md,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  item: { 
    backgroundColor: theme.colors.card, 
    padding: theme.spacing.lg, 
    borderRadius: theme.radius.lg, 
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  itemTitle: { 
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
  },
  itemText: {
    color: theme.colors.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  archivedText: {
    color: theme.colors.muted,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

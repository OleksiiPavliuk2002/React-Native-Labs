import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

export function TaskDetailsScreen({ route, navigation }: Props) {
  const { tasks, deleteTask } = useAppContext();
  const task = tasks.find((item) => item.id === route.params.taskId);

  if (!task) {
    return (
      <LinearGradient
        colors={[theme.colors.background, '#fee2e2']}
        style={styles.container}
      >
        <Text style={styles.notFound}>Task not found.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, '#fef3c7']}
      style={styles.container}
    >
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{task.description}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Due Date:</Text>
        <Text style={styles.value}>{task.dueDate.toLocaleString()}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Project:</Text>
        <Text style={styles.value}>{task.projectId}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Completed:</Text>
        <Text style={[styles.value, { color: task.isCompleted ? theme.colors.success : theme.colors.danger }]}>
          {task.isCompleted ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Priority:</Text>
        <View style={styles.priorityContainer}>
          <Text style={styles.value}>{task.priority}</Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
        </View>
      </View>
      <PrimaryButton
        title="Delete Task"
        onPress={async () => {
          await deleteTask(task.id);
          navigation.goBack();
        }}
      />
    </LinearGradient>
  );
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1: return theme.colors.danger;
    case 2: return theme.colors.secondary;
    case 3: return theme.colors.primary;
    case 4: return theme.colors.accent;
    case 5: return theme.colors.success;
    default: return theme.colors.muted;
  }
};

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
  notFound: {
    fontSize: 18,
    color: theme.colors.danger,
    textAlign: 'center',
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
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../state/AppContext';
import { Task } from '../models/Task';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormField } from '../components/FormField';
import { theme } from '../theme/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function TasksListScreen() {
  const navigation = useNavigation<Navigation>();
  const { tasks, addTask } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('2');
  const [error, setError] = useState('');

  const onAddTask = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    const parsedPriority = Number(priority);
    if (Number.isNaN(parsedPriority) || parsedPriority < 1 || parsedPriority > 5) {
      setError('Priority must be a number from 1 to 5');
      return;
    }
    setError('');
    const task = new Task(
      `t-${Date.now()}`,
      title.trim(),
      description.trim() || 'No description',
      parsedPriority,
      false,
      new Date(Date.now() + 86400000),
      'p1'
    );
    await addTask(task);
    setTitle('');
    setDescription('');
    setPriority('2');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#e0e7ff']}
      style={styles.container}
    >
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create New Task</Text>
        <FormField label="Title" value={title} onChangeText={setTitle} placeholder="Enter task title" />
        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the task"
          multiline
          numberOfLines={3}
        />
        <FormField
          label="Priority (1-5)"
          value={priority}
          onChangeText={setPriority}
          keyboardType="numeric"
          placeholder="2"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Add Task" onPress={onAddTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>{item.description}</Text>
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityText}>Priority: {item.priority}</Text>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
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
    gap: 16,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 12,
    ...theme.shadows.medium,
  },
  formTitle: { 
    fontWeight: '700', 
    color: theme.colors.text, 
    fontSize: 18,
    textAlign: 'center',
  },
  error: { 
    color: theme.colors.danger, 
    fontSize: 14,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    marginVertical: 8,
    ...theme.shadows.light,
  },
  itemTitle: { 
    fontWeight: '700', 
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: 4,
  },
  itemText: { 
    color: theme.colors.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityText: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

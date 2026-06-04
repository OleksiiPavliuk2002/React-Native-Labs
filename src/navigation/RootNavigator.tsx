import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from './types';
import { CriticalActionScreen } from '../screens/CriticalActionScreen';
import { LockScreen } from '../screens/LockScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { RealtimeScreen } from '../screens/RealtimeScreen';
import { SecuritySettingsScreen } from '../screens/SecuritySettingsScreen';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { TasksListScreen } from '../screens/TasksListScreen';
import { theme } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function getTabIcons(routeName: keyof MainTabParamList): {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
} {
  switch (routeName) {
    case 'Tasks':
      return { active: 'list', inactive: 'list-outline' };
    case 'Projects':
      return { active: 'briefcase', inactive: 'briefcase-outline' };
    case 'Realtime':
      return { active: 'pulse', inactive: 'pulse-outline' };
    case 'Profile':
      return { active: 'person', inactive: 'person-outline' };
    case 'Security':
      return { active: 'shield-checkmark', inactive: 'shield-checkmark-outline' };
    default:
      return { active: 'ellipse', inactive: 'ellipse-outline' };
  }
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const icons = getTabIcons(route.name as keyof MainTabParamList);
          return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          ...theme.shadows.light,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
          ...theme.shadows.light,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Tasks" component={TasksListScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Realtime" component={RealtimeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Security" component={SecuritySettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="Lock" component={LockScreen} />
      <Stack.Screen name="CriticalAction" component={CriticalActionScreen} />
    </Stack.Navigator>
  );
}

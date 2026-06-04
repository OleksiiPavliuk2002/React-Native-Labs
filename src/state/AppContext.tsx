import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedProfile, seedProjects, seedTasks } from '../data/seedData';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { UserProfile } from '../models/UserProfile';
import { storageService } from '../storage/StorageService';
import { MockSocketManager } from '../realtime/SocketManager';

type AppContextValue = {
  tasks: Task[];
  projects: Project[];
  profile: UserProfile;
  loadData: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  startRealtime: () => void;
  stopRealtime: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const realtime = new MockSocketManager();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile>(seedProfile);

  const loadData = async () => {
    const storedTasks = await storageService.readTasks();
    const storedProjects = await storageService.readProjects();
    const storedProfile = await storageService.readProfile();

    if (!storedTasks.length && !storedProjects.length && !storedProfile) {
      await Promise.all(seedTasks.map((task) => storageService.saveTask(task)));
      await Promise.all(seedProjects.map((project) => storageService.saveProject(project)));
      await storageService.saveProfile(seedProfile);
      setTasks(seedTasks);
      setProjects(seedProjects);
      setProfile(seedProfile);
      return;
    }

    setTasks(storedTasks);
    setProjects(storedProjects);
    setProfile(storedProfile ?? seedProfile);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTask = async (task: Task) => {
    await storageService.saveTask(task);
    setTasks(await storageService.readTasks());
  };

  const deleteTask = async (id: string) => {
    await storageService.deleteTask(id);
    setTasks(await storageService.readTasks());
  };

  const updateProfile = async (next: UserProfile) => {
    await storageService.saveProfile(next);
    setProfile(next);
  };

  const startRealtime = () => {
    realtime.onMessage((incomingTask) => {
      storageService.saveTask(incomingTask).then(async () => {
        setTasks(await storageService.readTasks());
      });
    });
    realtime.connect();
  };

  const stopRealtime = () => realtime.disconnect();

  const value = useMemo(
    () => ({
      tasks,
      projects,
      profile,
      loadData,
      addTask,
      deleteTask,
      updateProfile,
      startRealtime,
      stopRealtime,
    }),
    [tasks, projects, profile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}

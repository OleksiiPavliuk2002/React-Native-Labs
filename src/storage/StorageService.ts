import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { UserProfile } from '../models/UserProfile';

const TASKS_KEY = 'tasks';
const PROJECTS_KEY = 'projects';
const PROFILE_KEY = 'profile';

async function saveList<T>(key: string, list: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

async function readList<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

export class StorageService {
  async saveTask(task: Task): Promise<void> {
    const list = await this.readTasks();
    const next = [...list.filter((x) => x.id !== task.id), task];
    await saveList(TASKS_KEY, next.map((x) => x.toJSON()));
  }

  async readTasks(): Promise<Task[]> {
    const raw = await readList<ReturnType<Task['toJSON']>>(TASKS_KEY);
    return raw.map((x) => Task.fromJSON(x));
  }

  async readTask(id: string): Promise<Task | undefined> {
    const list = await this.readTasks();
    return list.find((x) => x.id === id);
  }

  async deleteTask(id: string): Promise<void> {
    const list = await this.readTasks();
    await saveList(TASKS_KEY, list.filter((x) => x.id !== id).map((x) => x.toJSON()));
  }

  async saveProject(project: Project): Promise<void> {
    const list = await this.readProjects();
    const next = [...list.filter((x) => x.id !== project.id), project];
    await saveList(PROJECTS_KEY, next.map((x) => x.toJSON()));
  }

  async readProjects(): Promise<Project[]> {
    const raw = await readList<ReturnType<Project['toJSON']>>(PROJECTS_KEY);
    return raw.map((x) => Project.fromJSON(x));
  }

  async readProject(id: string): Promise<Project | undefined> {
    const list = await this.readProjects();
    return list.find((x) => x.id === id);
  }

  async deleteProject(id: string): Promise<void> {
    const list = await this.readProjects();
    await saveList(PROJECTS_KEY, list.filter((x) => x.id !== id).map((x) => x.toJSON()));
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile.toJSON()));
  }

  async readProfile(): Promise<UserProfile | undefined> {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? UserProfile.fromJSON(JSON.parse(raw)) : undefined;
  }

  async deleteProfile(): Promise<void> {
    await AsyncStorage.removeItem(PROFILE_KEY);
  }
}

export const storageService = new StorageService();

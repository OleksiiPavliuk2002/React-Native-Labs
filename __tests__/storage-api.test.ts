const mockStore = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
  getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  removeItem: jest.fn(async (key: string) => {
    mockStore.delete(key);
  }),
}));

import { Task } from '../src/models/Task';
import { Project } from '../src/models/Project';
import { UserProfile } from '../src/models/UserProfile';
import { StorageService } from '../src/storage/StorageService';
import { ApiService, apiContract } from '../src/api/ApiService';

describe('StorageService + ApiService', () => {
  const storage = new StorageService();
  const api = new ApiService();

  beforeEach(() => {
    mockStore.clear();
    jest.clearAllTimers();
  });

  test('saves and reads task list', async () => {
    const task = new Task('1', 'A', 'B', 1, false, new Date(), 'p1');
    await storage.saveTask(task);
    const list = await storage.readTasks();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('A');
  });

  test('reads single task', async () => {
    await storage.saveTask(new Task('1', 'A', 'B', 1, false, new Date(), 'p1'));
    const task = await storage.readTask('1');
    expect(task?.id).toBe('1');
  });

  test('deletes task', async () => {
    await storage.saveTask(new Task('1', 'A', 'B', 1, false, new Date(), 'p1'));
    await storage.deleteTask('1');
    expect(await storage.readTasks()).toHaveLength(0);
  });

  test('saves and reads project', async () => {
    await storage.saveProject(new Project('p1', 'Project', 100, false, new Date()));
    const project = await storage.readProject('p1');
    expect(project?.name).toBe('Project');
  });

  test('deletes project', async () => {
    await storage.saveProject(new Project('p1', 'Project', 100, false, new Date()));
    await storage.deleteProject('p1');
    expect(await storage.readProjects()).toHaveLength(0);
  });

  test('saves and reads profile', async () => {
    await storage.saveProfile(new UserProfile('u1', 'Alex', 'a@a.com', true, 20, new Date()));
    const profile = await storage.readProfile();
    expect(profile?.biometricEnabled).toBe(true);
  });

  test('deletes profile', async () => {
    await storage.saveProfile(new UserProfile('u1', 'Alex', 'a@a.com', true, 20, new Date()));
    await storage.deleteProfile();
    expect(await storage.readProfile()).toBeUndefined();
  });

  test('api contract has 3 endpoints', () => {
    expect(apiContract).toHaveLength(3);
  });

  test('api getTasks returns non-empty list', async () => {
    const promise = api.getTasks();
    jest.runAllTimers();
    const list = await promise;
    expect(list.length).toBeGreaterThan(0);
  });

  test('api getTaskById returns item', async () => {
    const promise = api.getTaskById('t1');
    jest.runAllTimers();
    const item = await promise;
    expect(item?.id).toBe('t1');
  });

  test('api createTask returns new id', async () => {
    const promise = api.createTask({
      title: 'N',
      description: 'D',
      priority: 1,
      isCompleted: false,
      dueDate: new Date(),
      projectId: 'p1',
    });
    jest.runAllTimers();
    const item = await promise;
    expect(item.id.startsWith('api-')).toBe(true);
  });
});

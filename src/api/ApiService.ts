import { Task } from '../models/Task';
import { seedTasks } from '../data/seedData';

type EndpointContract = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  returns: string;
  expects: string;
};

export const apiContract: EndpointContract[] = [
  { method: 'GET', path: '/tasks', returns: 'Task[]', expects: 'optional query: projectId' },
  { method: 'GET', path: '/tasks/:id', returns: 'Task', expects: 'path param: id' },
  {
    method: 'POST',
    path: '/tasks',
    returns: 'Task',
    expects: 'body: title, description, priority, dueDate, projectId',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CreateTaskInput = {
  title: string;
  description: string;
  priority: number;
  isCompleted: boolean;
  dueDate: Date;
  projectId: string;
};

export class ApiService {
  async getTasks(): Promise<Task[]> {
    await delay(400);
    return seedTasks;
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    await delay(350);
    return seedTasks.find((t) => t.id === id);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    await delay(450);
    return new Task(
      `api-${Date.now()}`,
      input.title,
      input.description,
      input.priority,
      input.isCompleted,
      input.dueDate,
      input.projectId
    );
  }
}

export const apiService = new ApiService();

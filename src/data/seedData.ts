import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { UserProfile } from '../models/UserProfile';

export const seedProjects = [
  new Project('p1', 'Mobile App', 10000, false, new Date('2026-03-01T10:00:00.000Z')),
  new Project('p2', 'Backend API', 7000, false, new Date('2026-03-05T10:00:00.000Z')),
];

export const seedTasks = [
  new Task('t1', 'Create navigation', 'Set up stack and tabs', 1, false, new Date('2026-04-25T10:00:00.000Z'), 'p1'),
  new Task('t2', 'Implement storage', 'Persist data in AsyncStorage', 2, false, new Date('2026-04-26T10:00:00.000Z'), 'p1'),
  new Task('t3', 'Write tests', 'Cover critical modules with tests', 3, false, new Date('2026-04-27T10:00:00.000Z'), 'p2'),
];

export const seedProfile = new UserProfile(
  'u1',
  'Student',
  'student@example.com',
  false,
  20,
  new Date('2026-04-23T09:00:00.000Z')
);

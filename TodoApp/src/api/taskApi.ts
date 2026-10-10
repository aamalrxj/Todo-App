import client from './client';
import { Task, NewTask } from '../types';

export const getTasks = async (): Promise<Task[]> =>
  (await client.get<Task[]>('/tasks')).data;

export const createTask = async (task: NewTask): Promise<Task> =>
  (await client.post<Task>('/tasks', task)).data;

export const updateTask = async (id: string, changes: Partial<Task>): Promise<Task> =>
  (await client.put<Task>(`/tasks/${id}`, changes)).data;

export const deleteTask = async (id: string): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};
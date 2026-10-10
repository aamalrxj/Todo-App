export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'study' | 'other';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// A task as returned by the backend (dates arrive as ISO strings)
export interface Task {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category: Category;
  completed: boolean;
}

// Data needed to create a task
export type NewTask = Omit<Task, '_id' | 'completed'>;
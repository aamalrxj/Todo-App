import client from './client';
import { AuthResponse } from '../types';

export const register = async (email: string, password: string): Promise<AuthResponse> =>
  (await client.post<AuthResponse>('/auth/register', { email, password })).data;

export const login = async (email: string, password: string): Promise<AuthResponse> =>
  (await client.post<AuthResponse>('/auth/login', { email, password })).data;
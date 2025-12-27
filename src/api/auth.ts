import api from './axios';
import { User } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async (): Promise<{ success: boolean; user: User }> => {
  const response = await api.get('/auth/me');
  return response.data;
};


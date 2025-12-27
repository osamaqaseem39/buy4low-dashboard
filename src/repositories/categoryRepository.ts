import api from '../api/axios';
import { Category } from '../types';

export const categoryRepository = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  create: async (data: Partial<Category>) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};


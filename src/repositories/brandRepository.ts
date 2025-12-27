import api from '../api/axios';
import { Brand } from '../types';

export const brandRepository = {
  getAll: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  create: async (data: Partial<Brand>) => {
    const response = await api.post('/brands', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Brand>) => {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};


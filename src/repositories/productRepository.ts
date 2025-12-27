import api from '../api/axios';
import { Product } from '../types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export const productRepository = {
  getAll: async (params?: GetProductsParams) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: Partial<Product>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateStock: async (id: string, stock: number) => {
    const response = await api.put(`/products/${id}`, { stock });
    return response.data;
  },

  toggleActive: async (id: string, isActive: boolean) => {
    const response = await api.put(`/products/${id}`, { isActive });
    return response.data;
  },
};


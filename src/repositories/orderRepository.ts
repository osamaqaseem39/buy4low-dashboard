import api from '../api/axios';
import { Order } from '../types';

export const orderRepository = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  create: async (data: Partial<Order>) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, orderStatus?: string, paymentStatus?: string) => {
    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },
};


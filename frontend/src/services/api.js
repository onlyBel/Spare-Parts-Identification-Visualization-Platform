import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const equipmentAPI = {
  getAll: (params) => api.get('/api/equipment', { params }),
  getById: (id) => api.get(`/api/equipment/${id}`),
  getParts: (id) => api.get(`/api/equipment/${id}/parts`),
};

export const partsAPI = {
  getAll: (params) => api.get('/api/parts', { params }),
  getById: (id) => api.get(`/api/parts/${id}`),
  search: (data) => api.post('/api/search/parts', data),
};

export const inventoryAPI = {
  getAll: (params) => api.get('/api/inventory', { params }),
};

export const metadataAPI = {
  getCategories: () => api.get('/api/categories'),
  getBrands: () => api.get('/api/brands'),
};

export const ordersAPI = {
  create: (data) => api.post('/api/orders', data),
};

export default api;

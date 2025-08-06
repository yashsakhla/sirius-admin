// src/api.js
import axios from 'axios';

const BASE_API_URL = 'https://sirius-backend-ahsc.onrender.com'; // or HTTPS if deployed

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Admin authentication
export const adminLogin = (credentials) => {
  return api.post('/api/admin/login', credentials);
};

// ✅ Dashboard
export const fetchDashboardData = () => {
  return api.get('/api/admin/dashboard');
};

export const getAllProducts = () => {
  return api.get('/api/perfumes/products');
};

export const createProduct = (product) => {
  return api.post('/api/perfumes/add-product',product);
};

export const updateProduct = (id, updatedFields) => {
  return api.put(`/api/perfumes/${id}`, updatedFields);
};

// DELETE: delete product
export const deleteProduct = (id) => {
  return api.delete(`/api/perfumes/${id}`);
};

// Get all orders (admin-only)
export const getAllOrders = () => {
  return api.get('/api/orders'); // 💡 Make sure this matches your backend route
};

export const getUserOrders = (id) => {
  return api.get(`/api/orders/user/${id}`); // 💡 Make sure this matches your backend route
};


// Later: update order status (admin)
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/api/orders/${orderId}/status`, { status });
};


// ✅ User management (admin only)
export const getAllUsers = () => {
  return api.get('/api/user');
};

export const deleteUser = (userId) => {
  return api.delete(`/api/admin/users/${userId}`);
};

// ✅ Category APIs
export const getCategories = () => {
  // Public GET request
  return api.get('/api/categories');
};

export const createCategory = (name) => {
  // Protected POST request — requires token via setAuthToken
  return api.post('/api/categories', { name });
};

// ✅ Update (PUT) category by ID
export const updateCategory = (id, name) => {
  return api.put(`/api/categories/${id}`, { name });
};


export const fetchOffers = async () => {
  const res = api.get(`/api/perfumes/offer`);
  return res;
};

/**
 * Create a new offer
 */
export const createOffer = async (offer) => {
  const res = api.post('/api/perfumes/offer', offer);
  return res;
};

/**
 * Update offer (by offer.code)
 */
export const updateOffer = async (code, updatedBody) => {
  const res = api.put(`/api/perfumes/offer/${code}`, updatedBody);
  return res;
};

export default api;

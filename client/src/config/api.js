/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Use relative URL for production, fallback to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    LOGOUT: `${API_BASE}/auth/logout`,
    ME: `${API_BASE}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE}/auth/change-password`,
  },
  
  // Government invoice endpoints
  GOV_INVOICES: {
    BASE: `${API_BASE}/gov-invoices`,
    BY_ID: (id) => `${API_BASE}/gov-invoices/${id}`,
  },
  
  // Health check
  HEALTH: `${API_BASE}/health`,
};

// Default headers for API requests
export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// Auth headers with token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...getDefaultHeaders(),
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

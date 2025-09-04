/**
 * Authentication service for handling login, logout, and token management
 */

const API_BASE = 'http://localhost:3000/api';

// Token management
export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * User login
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store token
      setToken(data.data.token);
      
      return {
        ok: true,
        data: data.data.user,
        message: data.message
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Login failed'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * User logout
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function logout() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    // Remove token regardless of response
    removeToken();

    if (response.ok) {
      return {
        ok: true,
        message: 'Logout successful'
      };
    } else {
      return {
        ok: false,
        error: 'Logout failed'
      };
    }
  } catch (error) {
    // Remove token even if request fails
    removeToken();
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Get current user profile
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        data: data.data
      };
    } else {
      // If token is invalid, remove it
      if (response.status === 401) {
        removeToken();
      }
      
      return {
        ok: false,
        error: data.message || 'Failed to get user profile'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Change password
 * @param {Object} passwords - { currentPassword, newPassword }
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function changePassword(passwords) {
  try {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwords),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        message: data.message
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Failed to change password'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get user role from token (basic implementation)
 * @returns {string|null}
 */
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode JWT token (without verification for client-side)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
}; 
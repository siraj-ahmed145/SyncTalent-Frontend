// app/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

const api = {
  // Generic request handler
  request: async (endpoint, options = {}) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('auth_token') || localStorage.getItem('token')
      : null;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // GET request
  get: (endpoint) => {
    return api.request(endpoint, { method: 'GET' });
  },

  // POST request
  post: (endpoint, body) => {
    return api.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // PUT request
  put: (endpoint, body) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return api.request(endpoint, { method: 'DELETE' });
  },
};

export default api;

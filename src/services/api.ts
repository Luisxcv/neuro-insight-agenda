// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000';

// Función helper para hacer requests con token
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    specialty?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },
};

// Servicios de usuarios
export const userService = {
  getAllUsers: async () => {
    return apiRequest('/api/users');
  },

  getUserById: async (id: number) => {
    return apiRequest(`/api/users/${id}`);
  },

  getCurrentUserProfile: async () => {
    return apiRequest('/api/users/profile');
  },

  getPendingDoctors: async () => {
    return apiRequest('/api/users/pending-doctors');
  },

  approveDoctor: async (id: number) => {
    return apiRequest(`/api/users/${id}/approve`, {
      method: 'PUT',
    });
  },

  toggleUserStatus: async (id: number) => {
    return apiRequest(`/api/users/${id}/toggle-status`, {
      method: 'PUT',
    });
  },

  deleteUser: async (id: number) => {
    return apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};
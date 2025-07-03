// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

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
    // Para registro, no incluir token de autorización
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },
};

// Servicios de usuarios
export const userService = {
  getAllUsers: async () => {
    return apiRequest('/users');
  },

  getUserById: async (id: number) => {
    return apiRequest(`/users/${id}`);
  },

  getCurrentUserProfile: async () => {
    return apiRequest('/users/profile');
  },

  getPendingDoctors: async () => {
    return apiRequest('/users/pending-doctors');
  },

  approveDoctor: async (id: number) => {
    return apiRequest(`/users/${id}/approve`, {
      method: 'PUT',
    });
  },

  toggleUserStatus: async (id: number) => {
    return apiRequest(`/users/${id}/toggle-status`, {
      method: 'PUT',
    });
  },

  deleteUser: async (id: number) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getApprovedDoctors: async () => {
    return apiRequest('/users/doctors');
  },
};

// Servicios de pacientes
export const patientService = {
  getAllPatients: async (search?: string) => {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/patients${queryParam}`);
  },

  getPatientById: async (id: number) => {
    return apiRequest(`/patients/${id}`);
  },

  getPatientStats: async () => {
    return apiRequest('/patients/stats');
  },

  createPatient: async (patientData: {
    name: string;
    email: string;
    phone: string;
    status?: string;
  }) => {
    return apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
};

// Servicios de citas
export const appointmentService = {
  getAllAppointments: async () => {
    return apiRequest('/appointments');
  },

  getAppointmentsByDoctor: async (doctorName: string) => {
    return apiRequest(`/appointments/doctor/${encodeURIComponent(doctorName)}`);
  },

  createAppointment: async (appointmentData: {
    date: string;
    time: string;
    doctorName: string;
    doctorSpecialty: string;
    patientName: string;
  }) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  cancelAppointment: async (id: number) => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'PUT',
    });
  },
};
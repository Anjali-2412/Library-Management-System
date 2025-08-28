import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AuthResponse {
  token: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

export const login = async (email: string, password: string) => {
  try {
    const request: AuthRequest = { email, password };
    const response = await authAPI.post<AuthResponse>('/auth/login', request);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      // Set the token for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  delete authAPI.defaults.headers.common['Authorization'];
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Add 5 minutes buffer to expiration time
    return (payload.exp * 1000) + (5 * 60 * 1000) > Date.now();
  } catch (e) {
    return false;
  }
};

// Add token to all API requests if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} 
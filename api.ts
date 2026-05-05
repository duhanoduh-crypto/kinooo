// API клиент для фронтенда - РЕАЛЬНЫЕ запросы к бэкенду
const API_BASE_URL = 'http://192.168.137.1:8000';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const request = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log(`🔄 Отправляем запрос к: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Ответ от бэкенда:', data);
    return data;
  } catch (error) {
    console.error('❌ API request failed:', error);
    throw error;
  }
};

// ЗАМЕНИТЕ localStorage на реальные API вызовы:
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    request('/api/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(userData) 
    }),
    
  login: (credentials: { email: string; password: string }) =>
    request('/api/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
    
  adminLogin: (credentials: { email: string; password: string }) =>
    request('/api/auth/admin-login', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
    
  getProfile: () => request('/api/user/profile'),
};

export const moviesAPI = {
  getAll: () => request('/api/movies/'),
  getById: (id: number) => request(`/api/movies/${id}/`),
  create: (movie: any) =>
    request('/api/movies/', { 
      method: 'POST', 
      body: JSON.stringify(movie) 
    }),
  update: (id: number, movie: any) =>
    request(`/api/movies/${id}/`, { 
      method: 'PUT', 
      body: JSON.stringify(movie) 
    }),
  delete: (id: number) => 
    request(`/api/movies/${id}/`, { 
      method: 'DELETE' 
    }),
};

export const cinemasAPI = {
  getAll: () => request('/api/cinemas/'),
  create: (cinema: any) =>
    request('/api/cinemas/', { 
      method: 'POST', 
      body: JSON.stringify(cinema) 
    }),
  update: (id: number, cinema: any) =>
    request(`/api/cinemas/${id}/`, { 
      method: 'PUT', 
      body: JSON.stringify(cinema) 
    }),
  delete: (id: number) => 
    request(`/api/cinemas/${id}/`, { 
      method: 'DELETE' 
    }),
};

export const screeningsAPI = {
  getAll: () => request('/api/screenings/'),
  create: (screening: any) =>
    request('/api/screenings/', { 
      method: 'POST', 
      body: JSON.stringify(screening) 
    }),
  delete: (id: number) => 
    request(`/api/screenings/${id}/`, { 
      method: 'DELETE' 
    }),
};

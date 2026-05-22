import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hp_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── Auth ──────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  loginGoogle: () => api.get('/auth/google'),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
}

// ── Children ──────────────────────────
export const childrenAPI = {
  getAll: () => api.get('/children'),
  getById: (id) => api.get(`/children/${id}`),
}

// ── Donations ─────────────────────────
export const donationsAPI = {
  create: (data) => api.post('/donations', data),
  getHistory: () => api.get('/donations/history'),
}

// ── Games ─────────────────────────────
export const gamesAPI = {
  getAll: () => api.get('/games'),
}

// ── Coupons ───────────────────────────
export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  redeem: (id) => api.post(`/coupons/${id}/redeem`),
}

export default api

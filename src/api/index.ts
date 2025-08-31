import axios from 'axios'

// In dev we rely on Vite's dev server proxy (see vite.config.ts) to avoid CORS.
// So we use a relative path (/api). In production we use the absolute URL from env.
const api = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || '/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // localStorage.removeItem('refreshToken')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export default api

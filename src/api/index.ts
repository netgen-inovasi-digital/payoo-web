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
    const status = error.response?.status
    const requestUrl: string | undefined = error.config?.url
    if (status === 401) {
      // Don't force redirect for expected auth failures on login/register endpoints
      const isAuthAttempt = requestUrl?.includes('/auth/login') || requestUrl?.includes('/auth/register')
      if (!isAuthAttempt) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Use hard redirect only if we're not already on signin
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/services'
import type { User, LoginCredentials, RegisterData } from '@/api/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem('user')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setTokens = (accessToken: string) => {
    token.value = accessToken
    localStorage.setItem('token', accessToken)
  }

  const setUser = (userData: User) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearTokens = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      if (response.status !== 'success') {
        error.value = response.message || 'Login failed'
        throw new Error(error.value)
      }
      user.value = response.data.user
      setTokens(response.data.token)
      setUser(response.data.user)
      return response
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.register(data)
      if (response.status !== 'success') {
        error.value = response.message || 'Registration failed'
        throw new Error(error.value)
      }
      // Auto login behavior after successful registration
      user.value = response.data.user
      setTokens(response.data.token)
      setUser(response.data.user)
      return response
    } catch (err: unknown) {
      const errorResponse = (err as { response?: { data?: { message?: string, errors?: Record<string, string> } } }).response?.data
      
      if (errorResponse?.errors) {
        // Handle validation errors - get the first error message and translate to Indonesian
        const firstErrorKey = Object.keys(errorResponse.errors)[0]
        const originalError = errorResponse.errors[firstErrorKey]
        
        // Translate common validation messages to Indonesian
        if (originalError?.includes('unique value') && firstErrorKey === 'email') {
          error.value = 'Email sudah digunakan. Silakan gunakan email lain.'
        } else {
          error.value = originalError || 'Validation failed'
        }
      } else {
        error.value = errorResponse?.message || 'Registration failed'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    clearTokens()
  }

  const getCurrentUser = async () => {
    if (!token.value) return
    
    try {
      const response = await authService.getCurrentUser()
      user.value = response.data
    } catch {
      await logout()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser,
    clearTokens,
    setUser
  }
})

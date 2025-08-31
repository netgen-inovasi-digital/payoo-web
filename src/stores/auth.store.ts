import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/services'
import type { User, LoginCredentials, RegisterData } from '@/api/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setTokens = (accessToken: string) => {
    token.value = accessToken
    localStorage.setItem('token', accessToken)
  }

  const clearTokens = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      user.value = response.data.user
      setTokens(response.data.token)
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
      return response
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearTokens()
    }
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
    clearTokens
  }
})

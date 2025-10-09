import api from '../index'
import type { ApiResponse } from '../types'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/account/profile')
    return response.data
  },

  // async logout(): Promise<void> {
  //   await api.post('/auth/logout')
  //   localStorage.removeItem('token')
  // },

  // async forgotPassword(email: string): Promise<ApiResponse<void>> {
  //   const response = await api.post('/auth/forgot-password', { email })
  //   return response.data
  // },

  // async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
  //   const response = await api.post('/auth/reset-password', { token, password })
  //   return response.data
  // }
}

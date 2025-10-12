import api from '../index'
import type { ApiResponse } from '../types'
import type { LoginCredentials, RegisterData, AuthResponse, User, ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest } from '../types/auth.types'

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

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
    return response.data
  },

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password/verify-otp', data)
    return response.data
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)
    return response.data
  }
}

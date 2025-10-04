import type { ApiResponse } from './index'

// Profile data structure matching the API response
export interface Profile {
  id: number
  name: string
  email: string
  phone: string
  photo: string
  role: string
  created_at: string
  updated_at: string
  shop_id: number
}

// Profile update payload
export interface ProfileUpdatePayload {
  name: string
  email: string
  phone: string
  photo?: string
}

// Profile service response types
export type ProfileResponse = ApiResponse<Profile>
export type ProfileUpdateResponse = ApiResponse<Profile>
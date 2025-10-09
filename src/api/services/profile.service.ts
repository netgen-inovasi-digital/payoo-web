import api from '../index'
import type { ProfileResponse, ProfileUpdateResponse, ProfileUpdatePayload } from '../types/profile.types'

export const profileService = {
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get('/account/profile')
    return response.data
  },

  async updateProfile(profileData: ProfileUpdatePayload): Promise<ProfileUpdateResponse> {
    const response = await api.put('/account/profile', profileData)
    return response.data
  }
}

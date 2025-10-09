import api from '../index'
import type { ApiResponse } from '../types'
import type { Composition, CompositionPayload } from '../types/composition.types'

export const compositionService = {
  async getCompositions(): Promise<ApiResponse<Composition[]>> {
    const response = await api.get('/compositions')
    return response.data
  },

  async getComposition(id: number): Promise<ApiResponse<Composition>> {
    const response = await api.get(`/compositions/${id}`)
    return response.data
  },

  async createComposition(composition: CompositionPayload): Promise<ApiResponse<Composition>> {
    const response = await api.post('/compositions', composition)
    return response.data
  },

  async updateComposition(id: number, composition: Partial<CompositionPayload>): Promise<ApiResponse<Composition>> {
    const response = await api.put(`/compositions/${id}`, composition)
    return response.data
  },

  async deleteComposition(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/compositions/${id}`)
    return response.data
  }
}

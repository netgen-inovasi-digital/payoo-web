import api from '../index'
import type { ApiResponse } from '../types'
import type { Category } from '../types/category.types'

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/categories')
    return response.data
  },

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Category>> {
    const response = await api.post('/categories', category)
    return response.data
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.put(`/categories/${id}`, category)
    return response.data
  },

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }
}

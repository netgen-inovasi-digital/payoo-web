import api from '../index'
import type { ApiResponse } from '../types'
import type { Product } from '../types/product.types'

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await api.get('/products')
    return response.data
  },

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', product)
    return response.data
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}

import api from '../index'
import type { ApiResponse, PaginatedResponse } from '../types'
import type { Product, ProductFilters } from '../types/product.types'

export const productService = {
  async getProducts(
    page = 1, 
    limit = 10, 
    filters: ProductFilters = {}
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, String(v)]))
    })
    
    const response = await api.get(`/products?${params}`)
    return response.data
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', product)
    return response.data
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}

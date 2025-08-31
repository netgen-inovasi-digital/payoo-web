import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/api/services'
import type { Product, ProductFilters } from '@/api/types/product.types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchProducts = async (page = 1, limit = 10, filters: ProductFilters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await productService.getProducts(page, limit, filters)
      products.value = response.data.data
      pagination.value = {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      }
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch products'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await productService.getProduct(id)
      currentProduct.value = response.data
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch product'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await productService.createProduct(productData)
      products.value.unshift(response.data)
      return response.data
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create product'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await productService.updateProduct(id, productData)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      if (currentProduct.value?.id === id) {
        currentProduct.value = response.data
      }
      return response.data
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update product'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await productService.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete product'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
})

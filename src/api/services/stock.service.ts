import api from '../index'
import type { ApiResponse } from '../types'
import { Product } from '../types/product.types'
import type { Stock, StockTransaction } from '../types/stock.types'

interface StockApiResponse {
  status: string
  message: string
  data: Stock[]
  meta: {
    pagination: {
      current_page: number
      per_page: number
      total: number
      total_pages: number
    }
    filters: Record<string, string | number>
  }
}

export const stockService = {
  async getStocks(params?: {
    page?: number
    limit?: number
    type?: 'in' | 'out'
    search?: string
    date_start?: string
    date_end?: string
    product_id?: number
  }): Promise<StockApiResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.type) queryParams.append('type', params.type)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.date_start) queryParams.append('date_start', params.date_start)
    if (params?.date_end) queryParams.append('date_end', params.date_end)
    if (params?.product_id) queryParams.append('product_id', params.product_id.toString())
    
    const response = await api.get(`/stocks?${queryParams.toString()}`)
    return response.data
  },

  async getPembelian(params?: {
    page?: number
    limit?: number
    search?: string
    date_start?: string
    date_end?: string
    product_id?: number
    product_type?: string
  }): Promise<StockApiResponse> {
    const queryParams = new URLSearchParams()
    
    // Always filter for 'in' type for pembelian
    queryParams.append('type', 'in')
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.date_start) queryParams.append('date_start', params.date_start)
    if (params?.date_end) queryParams.append('date_end', params.date_end)
    if (params?.product_id) queryParams.append('product_id', params.product_id.toString())
    if (params?.product_type) queryParams.append('product_type', params.product_type)
    
    const response = await api.get(`/stocks?${queryParams.toString()}`)
    return response.data
  },

  async createStock(stockData: StockTransaction): Promise<ApiResponse<Stock>> {
    const response = await api.post('/stocks', stockData)
    return response.data
  },

  async getStock(id: number): Promise<ApiResponse<Stock>> {
    const response = await api.get(`/stocks/${id}`)
    return response.data
  },

  async getShopProducts(): Promise<ApiResponse<Product[]>> {
    const response = await api.get('/stocks/products/shop')
    return response.data
  }
}

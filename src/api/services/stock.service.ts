import api from '../index'
import type { ApiResponse } from '../types'
import type { Stock, StockTransaction } from '../types/stock.types'

export const stockService = {
  async getStocks(): Promise<ApiResponse<Stock[]>> {
    const response = await api.get('/stocks')
    return response.data
  },

  async getPembelian(): Promise<ApiResponse<Stock[]>> {
    const response = await api.get('/stocks?type=in')
    return response.data
  },

  async createStock(stockData: StockTransaction): Promise<ApiResponse<Stock>> {
    const response = await api.post('/stocks', stockData)
    return response.data
  },

  async getStock(id: number): Promise<ApiResponse<Stock>> {
    const response = await api.get(`/stocks/${id}`)
    return response.data
  }
}

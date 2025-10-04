import api from '../index'
import type { ApiResponse } from '../types'
import type { Shop, ShopPayload, ShopUpdatePayload } from '../types/shop.types'

export const shopService = {
  async getShop(id: number): Promise<ApiResponse<Shop>> {
    const response = await api.get(`/shops/${id}`)
    return response.data
  },

  async createShop(shop: ShopPayload): Promise<ApiResponse<Shop>> {
    const response = await api.post('/shops', shop)
    return response.data
  },

  async updateShop(id: number, shop: ShopUpdatePayload): Promise<ApiResponse<Shop>> {
    const response = await api.put(`/shops/${id}`, shop)
    return response.data
  },
}

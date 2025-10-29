import api from '../index'
import type { ApiResponse } from '../types'
import type { 
  Order, 
} from '../types/order.types'

export interface OrderCreatePayload {
  status: string
  notes?: string
  total: number
  amount_paid?: number
  change_money?: number
  tax?: number
  created_at: string
  payment_method: string
  order_items: {
    product_id: number
    quantity: number
    price: number
  }[]
}

export const orderService = {
  // Get single order by ID
  async getOrder(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  },

  // Create new order
  async createOrder(orderData: OrderCreatePayload): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post<ApiResponse<Order>>('/orders', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  // Update order status
  async updateOrderStatus(id: number, status: string, notes?: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { 
        status, 
        notes 
      })
      return response.data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },
}
import api from '../index'
import type { ApiResponse } from '../types'
import type { 
  Order, 
  OrderFilters
} from '../types/order.types'

export interface OrderCreatePayload {
  status: string
  notes?: string
  total: number
  amount_paid?: number
  change_money?: number
  tax?: number
  payment_method: string
  order_items: {
    product_id: number
    quantity: number
    price: number
  }[]
}

export const orderService = {
  // Get all orders for a shop
  async getOrders(shopId: number = 1, filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.search) {
        params.append('search', filters.search)
      }
      if (filters?.status) {
        params.append('status', filters.status)
      }
      if (filters?.date_from) {
        params.append('date_from', filters.date_from)
      }
      if (filters?.date_to) {
        params.append('date_to', filters.date_to)
      }

      const url = params.toString() 
        ? `/orders/shop/${shopId}?${params.toString()}` 
        : `/orders/shop/${shopId}`
      
      const response = await api.get<ApiResponse<Order[]>>(url)
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

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
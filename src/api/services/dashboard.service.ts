import api from '../index'
import type { ApiResponse } from '../types'

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export interface RecentOrder {
  id: string
  customerName: string
  amount: number
  status: string
  date: string
}

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  async getSalesChart(period: 'week' | 'month' | 'year'): Promise<ApiResponse<ChartData>> {
    const response = await api.get(`/dashboard/sales-chart?period=${period}`)
    return response.data
  },

  async getRecentOrders(): Promise<ApiResponse<RecentOrder[]>> {
    const response = await api.get('/dashboard/recent-orders')
    return response.data
  }
}

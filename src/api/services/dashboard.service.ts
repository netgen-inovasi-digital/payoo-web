import api from '../index'
import type { DashboardResponse } from '../types/dashboard.types'

export const dashboardService = {
  async getDashboardData(): Promise<DashboardResponse> {
    const response = await api.get('/dashboard/web')
    return response.data
  }
}

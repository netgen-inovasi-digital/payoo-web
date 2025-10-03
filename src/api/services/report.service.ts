import api from '../index'
import type { ApiResponse } from '../types'
import type { ReportData, ReportPeriod } from '../types/report.types'

export const reportService = {
  async getReports(shopId: string, period: ReportPeriod = 'today'): Promise<ApiResponse<ReportData>> {
    const response = await api.get(`/reports/${shopId}/orders`, {
      params: { period }
    })
    return response.data
  },
}

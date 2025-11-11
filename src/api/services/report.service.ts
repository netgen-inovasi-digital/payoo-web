import api from '../index'
import type { ApiResponse } from '../types'
import type { ReportData, ReportPeriod, ReportV2Data, ReportV2Params, PrintReportData } from '../types/report.types'

export const reportService = {
  async getReports(shopId: string, period: ReportPeriod = 'today'): Promise<ApiResponse<ReportData>> {
    const response = await api.get(`/reports/${shopId}/orders`, {
      params: { period }
    })
    return response.data
  },

  async getReportsV2(
    shopId: string, 
    rangeStart?: string, 
    rangeEnd?: string
  ): Promise<ApiResponse<ReportV2Data>> {
    const params: ReportV2Params = {}
    
    if (rangeStart) {
      params.range_start = rangeStart
    }
    
    if (rangeEnd) {
      params.range_end = rangeEnd
    }

    const response = await api.get(`/reports/${shopId}/ordersv2`, {
      params
    })
    return response.data
  },

  async getPrintReport(
    shopId: string, 
    rangeStart?: string, 
    rangeEnd?: string
  ): Promise<ApiResponse<PrintReportData>> {
    const params: ReportV2Params = {}
    
    if (rangeStart) {
      params.range_start = rangeStart
    }
    
    if (rangeEnd) {
      params.range_end = rangeEnd
    }

    const response = await api.get(`/reports/${shopId}/print`, {
      params
    })
    return response.data
  },
}

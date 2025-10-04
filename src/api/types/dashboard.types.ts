import type { ApiResponse } from './index'

// Summary metrics
export interface SummaryMetric {
  key: string
  label: string
  total: number
  growth_pct: number
  direction: 'up' | 'down'
  compare_text: string
}

// Monthly sales data
export interface MonthlySale {
  month: string
  transactions: number
  revenue: number
}

// Statistics series data
export interface StatisticSeries {
  month: string
  orders: number
  items_sold: number
}

// Statistics data structure
export interface Statistics {
  basis: string
  period: string
  series: StatisticSeries[]
  note: string
}

// Main dashboard data structure
export interface DashboardData {
  summary: SummaryMetric[]
  monthly_sales: MonthlySale[]
  statistics: Statistics
}

// Dashboard API response
export type DashboardResponse = ApiResponse<DashboardData>
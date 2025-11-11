export interface ReportOrder {
  id: string
  user_id: string
  shop_id: string
  status: string
  notes: string
  total: string
  amount_paid: string
  change_money: string
  tax: string
  payment_method: string
  created_at: string
  updated_at: string
  total_items: string
}

export interface ReportDateRange {
  start: string
  end: string
}

export interface ReportData {
  orders: ReportOrder[]
  total_orders: number
  period: string
  date_range: ReportDateRange
}

export interface ReportV2Filters {
  range_start?: string
  range_end?: string
}

export interface ReportV2Data {
  orders: ReportOrder[]
  total_orders: number
  filters?: ReportV2Filters
  date_range: ReportDateRange
}

export interface ReportV2Params {
  range_start?: string
  range_end?: string
}

export type ReportPeriod = 'today' | 'this_week' | 'this_month'

// Print Report Types
export interface PrintOrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_photo: string | null
  product_unit: string
  product_type: string
  quantity: number
  price: number
  subtotal: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PrintOrder {
  id: number
  shop_id: number
  order_number: string
  customer_name: string
  customer_phone: string
  table_number: string
  subtotal: number
  discount: number
  tax: number
  total: number
  status: string
  payment_method: string
  notes: string | null
  created_at: string
  updated_at: string
  total_items: number
  items: PrintOrderItem[]
}

export interface PrintSummary {
  total_orders: number
  total_revenue: number
  total_discount: number
  total_tax: number
}

export interface PrintFilters {
  range_start: string
  range_end: string
}

export interface PrintReportData {
  orders: PrintOrder[]
  summary: PrintSummary
  filters: PrintFilters
  date_range: ReportDateRange
}

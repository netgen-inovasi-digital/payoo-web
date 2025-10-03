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

export type ReportPeriod = 'today' | 'this_week' | 'this_month'

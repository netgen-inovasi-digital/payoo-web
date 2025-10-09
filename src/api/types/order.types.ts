export interface Order {
  id: number
  user_id: number
  shop_id: number
  status: 'pending'
  notes: string
  total: number
  amount_paid: number
  change_money?: number
  tax?: number
  payment_method: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: number
  product_id: number
  name: string
  quantity: number
  price: number
}

export interface OrderFilters {
  search?: string
  status?: 'pending'
  payment_method?: string
  date_from?: string
  date_to?: string
  user_id?: number
}

export interface OrderFormData {
  user_id: number
  shop_id: number
  status: 'pending'
  notes?: string
  total: number
  amount_paid?: number
  change_money?: number
  tax?: number
  payment_method: string
  order_items: {
    product_id: number
    quantity: number
    selling_price: number
  }[]
}

export interface OrderStatusUpdate {
  status: 'pending'
  notes?: string
}

export interface PaymentStatusUpdate {
  payment_status: 'pending'
  notes?: string
}

export interface OrderSummary {
  total_orders: number
  total_revenue: number
  pending_orders: number
  processing_orders: number
  shipped_orders: number
  delivered_orders: number
  cancelled_orders: number
}

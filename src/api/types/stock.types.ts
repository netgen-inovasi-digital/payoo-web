export interface Stock {
  id: number
  product_id: number
  quantity: number
  type: 'in' | 'out'
  buy_price: number | null
  notes: string
  date: string
  created_at: string
  product_name: string
  product_type: string
}

export interface StockTransaction {
  product_id: number
  quantity: number
  type: 'in' | 'out'
  buy_price?: number | null
  notes: string
  date: string
}

export interface StockFilters {
  product_id?: number
  type?: 'in' | 'out'
  date_from?: string
  date_to?: string
  search?: string
}

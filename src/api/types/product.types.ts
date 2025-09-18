export interface Product {
  id: number
  shop_id: number
  category_id: number
  name: string
  description: string
  photo: string
  cost_price: number
  selling_price: number
  created_at: string
  updated_at: string
}

export interface ProductFilters {
  search?: string
  category_id?: number
  shop_id?: number
  cost_price_min?: number
  cost_price_max?: number
  selling_price_min?: number
  selling_price_max?: number
}

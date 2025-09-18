export interface Category {
  id: number
  name: string
  shop_id: number
  created_at: string | null
  updated_at: string | null
}

export interface CategoryFilters {
  search?: string
  shop_id?: number
}
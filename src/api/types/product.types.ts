export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  stock: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search?: string
  category?: string
  status?: string
  priceMin?: number
  priceMax?: number
}

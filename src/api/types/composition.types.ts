// Unit enum
export type CompositionUnit = 'pcs' | 'gr' | 'kg' | 'ml' | 'liter' | 'lembar' | 'slice' | 'butir' | 'pack' | 'botol'

export interface Composition {
  id: number
  name: string
  cost_price: number
  selling_price: number
  unit: CompositionUnit
  stock: number
  created_at: string
  updated_at: string
}

export interface CompositionPayload {
  name: string
  cost_price: number
  selling_price: number
  unit: CompositionUnit
}

export interface CompositionFilters {
  search?: string
  cost_price_min?: number
  cost_price_max?: number
  selling_price_min?: number
  selling_price_max?: number
}

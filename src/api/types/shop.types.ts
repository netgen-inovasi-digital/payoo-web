export interface Shop {
  id: number
  user_id: number
  name: string
  email: string
  address: string
  type: 'mandiri' | 'persewaan'
  province: string
  city: string
  phone: string
  photo: string
  created_at: string
  updated_at: string
}

export interface ShopPayload {
  name: string
  email: string
  address: string
  type: 'mandiri' | 'persewaan'
  province: string
  city: string
  phone: string
}

export interface ShopUpdatePayload extends ShopPayload {
  photo?: string
}
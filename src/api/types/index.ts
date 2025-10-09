export interface ApiResponse<T> {
  status: string // "success" or "error"
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ErrorResponse {
  status: string // "error"
  message: string
  errors?: Record<string, string>
}

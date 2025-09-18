export interface UploadResponse {
  original_name: string
  stored_name: string
  mime: string
  size: number
  folder: string
  path: string
  url: string
}

export interface UploadRequest {
  file: File
  folder: string
}
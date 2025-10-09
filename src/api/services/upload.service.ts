import api from '../index'
import type { ApiResponse } from '../types'
import type { UploadResponse } from '../types/upload.types'

export const uploadService = {
  async uploadFile(file: File, folder: string = 'produk'): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post(`/upload?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  }
}

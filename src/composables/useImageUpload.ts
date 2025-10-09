import { ref } from 'vue'
import { uploadService } from '@/api/services/upload.service'

export interface ImageUploadOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
}

export function useImageUpload(options: ImageUploadOptions = {}) {
  const { maxSizeInMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options
  
  const selectedFile = ref<File | null>(null)
  const previewUrl = ref<string>('')
  const isUploading = ref(false)
  const error = ref<string>('')

  const handleImageSelect = (event: Event): Promise<boolean> => {
    return new Promise((resolve) => {
      const input = event.target as HTMLInputElement
      error.value = ''
      
      if (!input.files || input.files.length === 0) {
        resolve(false)
        return
      }

      const file = input.files[0]
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        error.value = `Tipe file tidak didukung. Hanya ${allowedTypes.join(', ')} yang diperbolehkan.`
        resolve(false)
        return
      }
      
      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxSizeInMB) {
        error.value = `Ukuran file terlalu besar. Maksimal ${maxSizeInMB}MB.`
        resolve(false)
        return
      }

      selectedFile.value = file
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string
        resolve(true)
      }
      reader.onerror = () => {
        error.value = 'Terjadi kesalahan saat membaca file.'
        resolve(false)
      }
      reader.readAsDataURL(file)
    })
  }

  const resetUpload = () => {
    selectedFile.value = null
    previewUrl.value = ''
    error.value = ''
    isUploading.value = false
  }

  const setUploadingState = (state: boolean) => {
    isUploading.value = state
  }

  const uploadFile = async (folder: string = 'produk') => {
    if (!selectedFile.value) {
      throw new Error('No file selected')
    }

    isUploading.value = true
    try {
      const response = await uploadService.uploadFile(selectedFile.value, folder)
      return response
    } catch (error) {
      throw error
    } finally {
      isUploading.value = false
    }
  }

  return {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    handleImageSelect,
    resetUpload,
    setUploadingState,
    uploadFile
  }
}
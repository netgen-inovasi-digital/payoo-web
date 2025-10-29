import { ref } from 'vue'
import { uploadService } from '@/api/services/upload.service'

export interface ImageUploadOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
  compressionQuality?: number
  maxWidth?: number
  maxHeight?: number
  enableCompression?: boolean
}

export function useImageUpload(options: ImageUploadOptions = {}) {
  const { 
    maxSizeInMB = 5, 
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    compressionQuality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200,
    enableCompression = true
  } = options
  
  const selectedFile = ref<File | null>(null)
  const previewUrl = ref<string>('')
  const isUploading = ref(false)
  const error = ref<string>('')
  const originalSize = ref<number>(0)
  const compressedSize = ref<number>(0)

  // Image compression function
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!enableCompression || file.type === 'image/gif') {
        // Skip compression for GIFs or if compression is disabled
        compressedSize.value = file.size
        updateCompressionRatio()
        resolve(file)
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        const aspectRatio = width / height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            width = maxWidth
            height = width / aspectRatio
          } else {
            height = maxHeight
            width = height * aspectRatio
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type === 'image/png' ? 'image/jpeg' : file.type, // Convert PNG to JPEG for better compression
                lastModified: Date.now()
              })
              compressedSize.value = compressedFile.size
              updateCompressionRatio()
              resolve(compressedFile)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type === 'image/png' ? 'image/jpeg' : file.type,
          compressionQuality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image for compression'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageSelect = (event: Event): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const input = event.target as HTMLInputElement
      error.value = ''
      
      if (!input.files || input.files.length === 0) {
        resolve(false)
        return
      }

      const file = input.files[0]
      originalSize.value = file.size
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        error.value = `Tipe file tidak didukung. Hanya ${allowedTypes.join(', ')} yang diperbolehkan.`
        resolve(false)
        return
      }
      
      // Validate file size before compression
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxSizeInMB * 2) { // Allow 2x the limit before compression
        error.value = `Ukuran file terlalu besar. Maksimal ${maxSizeInMB * 2}MB sebelum kompresi.`
        resolve(false)
        return
      }

      try {
        // Compress image if enabled
        const processedFile = enableCompression ? await compressImage(file) : file
        
        // Validate compressed file size
        const compressedFileSizeInMB = processedFile.size / (1024 * 1024)
        if (compressedFileSizeInMB > maxSizeInMB) {
          error.value = `Ukuran file masih terlalu besar setelah kompresi. Maksimal ${maxSizeInMB}MB.`
          resolve(false)
          return
        }

        selectedFile.value = processedFile
        
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
        reader.readAsDataURL(processedFile)
      } catch (compressionError) {
        console.error('Compression error:', compressionError)
        error.value = 'Terjadi kesalahan saat mengkompresi gambar.'
        resolve(false)
      }
    })
  }

  const resetUpload = () => {
    selectedFile.value = null
    previewUrl.value = ''
    error.value = ''
    isUploading.value = false
    originalSize.value = 0
    compressedSize.value = 0
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

  // Computed properties for compression stats
  const compressionRatio = ref(0)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Update compression ratio when sizes change
  const updateCompressionRatio = () => {
    if (originalSize.value > 0 && compressedSize.value > 0) {
      compressionRatio.value = Math.round(((originalSize.value - compressedSize.value) / originalSize.value) * 100)
    } else {
      compressionRatio.value = 0
    }
  }

  return {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    originalSize,
    compressedSize,
    compressionRatio,
    handleImageSelect,
    resetUpload,
    setUploadingState,
    uploadFile,
    formatFileSize,
    updateCompressionRatio
  }
}
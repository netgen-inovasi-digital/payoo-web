import { ref, computed } from 'vue'

interface ForgotPasswordData {
  email: string
  step: 'forgot' | 'verify' | 'reset'
  otpSent: boolean
  otpVerified: boolean
  expiresAt: number
}

const STORAGE_KEY = 'forgot-password-flow'
const EXPIRATION_TIME = 30 * 60 * 1000 // 30 menit

export const useForgotPassword = () => {
  const data = ref<ForgotPasswordData | null>(null)

  // Load data from localStorage
  const loadFromStorage = (): ForgotPasswordData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const parsedData: ForgotPasswordData = JSON.parse(stored)
      
      // Check if data has expired
      if (Date.now() > parsedData.expiresAt) {
        clearStorage()
        return null
      }

      return parsedData
    } catch (error) {
      console.error('Error loading forgot password data:', error)
      clearStorage()
      return null
    }
  }

  // Save data to localStorage
  const saveToStorage = (newData: Partial<ForgotPasswordData>) => {
    try {
      const currentData = loadFromStorage()
      const updatedData: ForgotPasswordData = {
        email: '',
        step: 'forgot',
        otpSent: false,
        otpVerified: false,
        expiresAt: Date.now() + EXPIRATION_TIME,
        ...currentData,
        ...newData,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
      data.value = updatedData
    } catch (error) {
      console.error('Error saving forgot password data:', error)
    }
  }

  // Clear data from localStorage
  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
    data.value = null
  }

  // Initialize data from storage
  const initializeData = () => {
    data.value = loadFromStorage()
  }

  // Start forgot password flow
  const startForgotPassword = (email: string) => {
    saveToStorage({
      email,
      step: 'forgot',
      otpSent: false,
      otpVerified: false,
    })
  }

  // Mark OTP as sent
  const markOtpSent = () => {
    if (data.value) {
      saveToStorage({
        ...data.value,
        step: 'verify',
        otpSent: true,
      })
    }
  }

  // Mark OTP as verified
  const markOtpVerified = () => {
    if (data.value) {
      saveToStorage({
        ...data.value,
        step: 'reset',
        otpVerified: true,
      })
    }
  }

  // Complete password reset
  const completePasswordReset = () => {
    clearStorage()
  }

  // Computed properties
  const email = computed(() => data.value?.email || '')
  const currentStep = computed(() => data.value?.step || 'forgot')
  const isOtpSent = computed(() => data.value?.otpSent || false)
  const isOtpVerified = computed(() => data.value?.otpVerified || false)
  const isExpired = computed(() => {
    if (!data.value) return true
    return Date.now() > data.value.expiresAt
  })

  // Check if user can access specific step
  const canAccessStep = (step: 'forgot' | 'verify' | 'reset'): boolean => {
    if (isExpired.value) return step === 'forgot'
    if (!data.value) return step === 'forgot'

    switch (step) {
      case 'forgot':
        return true
      case 'verify':
        return data.value.otpSent
      case 'reset':
        return data.value.otpVerified
      default:
        return false
    }
  }

  return {
    data: computed(() => data.value),
    email,
    currentStep,
    isOtpSent,
    isOtpVerified,
    isExpired,
    initializeData,
    startForgotPassword,
    markOtpSent,
    markOtpVerified,
    completePasswordReset,
    clearStorage,
    canAccessStep,
  }
}
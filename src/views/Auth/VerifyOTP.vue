<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <!-- Back to dashboard link -->
            <div class="mb-8">
              <router-link 
                to="/forgot-password" 
                class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke lupa kata sandi
              </router-link>
            </div>

            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Verifikasi Dua Langkah
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Kode verifikasi telah dikirim ke email Anda. Silakan masukkan kode tersebut di kolom di bawah ini.
              </p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="space-y-5">
                <!-- Email Display -->
                <div v-if="email" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Kode OTP dikirim ke: <strong>{{ email }}</strong>
                </div>

                <!-- OTP Input -->
                <div>
                  <label
                    for="otp"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Masukkan kode keamanan 6 digit Anda
                  </label>
                  <div class="flex gap-2 justify-center">
                    <input
                      v-for="(digit, index) in otpDigits"
                      :key="index"
                      :ref="el => otpInputs[index] = el as HTMLInputElement"
                      v-model="otpDigits[index]"
                      type="text"
                      maxlength="1"
                      :disabled="loading"
                      @input="handleOtpInput(index, $event)"
                      @keydown="handleKeydown(index, $event)"
                      @paste="handlePaste($event)"
                      class="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <!-- Button -->
                <div>
                  <button
                    type="submit"
                    :disabled="loading || !isOtpComplete"
                    class="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="loading"
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span v-if="loading">Memverifikasi...</span>
                    <span v-else>Verifikasi Akun Saya</span>
                  </button>
                </div>

                <!-- Resend OTP -->
                <div class="text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Tidak menerima kode? 
                    <button 
                      type="button"
                      @click="resendOTP"
                      :disabled="loading || resendCooldown > 0"
                      class="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}d` : 'Kirim Ulang' }}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="{231}" height="{48}" src="/images/logo/Logo Primary.png" alt="Logo" />
              </router-link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/services'
import { useAlert } from '@/composables/useAlert'
import { useForgotPassword } from '@/composables/useForgotPassword'

defineOptions({ name: 'VerifyOTPPage' })

const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpInputs = ref<(HTMLInputElement | null)[]>([])
const loading = ref(false)
const resendCooldown = ref(0)

const router = useRouter()
const alert = useAlert()
const forgotPassword = useForgotPassword()

// Use email from localStorage instead of route query
const email = computed(() => forgotPassword.email.value)

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit.length === 1)
})

const otpCode = computed(() => {
  return otpDigits.value.join('')
})

const handleOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '') // Only allow numbers
  
  if (value) {
    otpDigits.value[index] = value
    // Move to next input
    if (index < 5) {
      nextTick(() => {
        otpInputs.value[index + 1]?.focus()
      })
    }
  } else {
    otpDigits.value[index] = ''
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    // Move to previous input on backspace
    nextTick(() => {
      otpInputs.value[index - 1]?.focus()
    })
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text') || ''
  const digits = paste.replace(/[^0-9]/g, '').slice(0, 6).split('')
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
    }
  })
  
  // Focus on the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(digit => !digit)
  const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
  nextTick(() => {
    otpInputs.value[focusIndex]?.focus()
  })
}

const handleSubmit = async () => {
  if (!isOtpComplete.value) {
    alert.error('Silakan masukkan kode 6 digit yang lengkap')
    return
  }

  if (!email.value) {
    alert.error('Email tidak ditemukan. Silakan mulai ulang proses.')
    router.push('/forgot-password')
    return
  }

  loading.value = true
  try {
    const response = await authService.verifyOTP({ 
      email: email.value, 
      otp: otpCode.value 
    })
    
    if (response.status === 'success') {
      // Mark OTP as verified in localStorage
      forgotPassword.markOtpVerified()
      
      alert.success('OTP berhasil diverifikasi')
      // Navigate to reset password page
      router.push('/reset-password')
    }
  } catch (error: unknown) {
    let errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Kode OTP tidak valid'
    if(errorMessage.includes('expired')) {
        errorMessage = 'Kode OTP telah kedaluwarsa. Silakan kirim ulang.'
    } else if(errorMessage.includes('Invalid')) {
        errorMessage = 'Kode OTP tidak valid. Silakan coba lagi.'
    }
    alert.error(errorMessage)
    // Clear OTP on error
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } finally {
    loading.value = false
  }
}

const resendOTP = async () => {
  if (!email.value) return
  
  loading.value = true
  try {
    await authService.forgotPassword({ email: email.value })
    alert.success('Kode OTP baru telah dikirim ke email Anda')
    
    // Start countdown
    resendCooldown.value = 60
    const countdown = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(countdown)
      }
    }, 1000)
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal mengirim ulang OTP'
    alert.error(errorMessage)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Initialize forgot password data
  forgotPassword.initializeData()
  
  // Check if user can access this step
  if (!forgotPassword.canAccessStep('verify')) {
    alert.error('Akses tidak valid. Silakan mulai proses dari awal.')
    router.push('/forgot-password')
    return
  }
  
  // Focus on first input
  nextTick(() => {
    otpInputs.value[0]?.focus()
  })
  
  // Check if email is provided
  if (!email.value) {
    alert.error('Email tidak ditemukan. Mengalihkan ke halaman lupa kata sandi.')
    router.push('/forgot-password')
  }
})
</script>
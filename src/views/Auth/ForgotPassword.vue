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
                to="/signin" 
                class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke masuk
              </router-link>
            </div>

            <div class="mb-4 sm:mb-7">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Lupa Kata Sandi?
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Masukkan alamat email yang terhubung dengan akun Anda, dan kami akan mengirimkan kode OTP untuk reset kata sandi.
              </p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="space-y-5">
                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Email<span class="text-error-500"> *</span>
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Masukkan email Anda"
                    required
                    :disabled="loading"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <!-- Button -->
                <div>
                  <button
                    type="submit"
                    :disabled="loading"
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
                    <span v-if="loading">Mengirim Kode OTP...</span>
                    <span v-else>Kirim Kode OTP</span>
                  </button>
                </div>
              </div>
            </form>

            <div class="mt-5">
              <p
                class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
              >
                Tunggu, saya ingat kata sandi saya... 
                <router-link
                  to="/signin"
                  class="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Klik di sini
                </router-link>
              </p>
            </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/services'
import { useAlert } from '@/composables/useAlert'
import { useForgotPassword } from '@/composables/useForgotPassword'

defineOptions({ name: 'ForgotPasswordPage' })

const email = ref('')
const loading = ref(false)

const router = useRouter()
const alert = useAlert()
const forgotPassword = useForgotPassword()

const handleSubmit = async () => {
  if (!email.value) {
    alert.error('Silakan masukkan alamat email Anda')
    return
  }

  loading.value = true
  try {
    // Start forgot password flow in localStorage
    forgotPassword.startForgotPassword(email.value)
    
    const response = await authService.forgotPassword({ email: email.value })
    
    if (response.status === 'success') {
      // Mark OTP as sent in localStorage
      forgotPassword.markOtpSent()
      
      alert.success('Kode OTP telah dikirim ke alamat email Anda')
      // Navigate to OTP verification page
      router.push('/verify-otp')
    }
  } catch (error: unknown) {
    // Clear storage on error
    forgotPassword.clearStorage()
    let errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal mengirim kode OTP'
    if(errorMessage.includes('not found')) {
        errorMessage = 'Email tidak terdaftar'
    }
    alert.error(errorMessage)
  } finally {
    loading.value = false
  }
}

// Initialize data and pre-fill email if available
onMounted(() => {
  forgotPassword.initializeData()
  if (forgotPassword.email.value) {
    email.value = forgotPassword.email.value
  }
})
</script>
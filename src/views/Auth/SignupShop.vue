<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Create Your Shop
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Complete your shop information to get started!
              </p>
            </div>
            <div>
              <!-- <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                <button
                  class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </button>
                <button
                  class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="21"
                    class="fill-current"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z"
                    />
                  </svg>

                  Sign up with X
                </button>
              </div>
              <div class="relative py-3 sm:py-5">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2"
                    >Or</span
                  >
                </div>
              </div> -->
              <form @submit.prevent="handleSubmit">
                <!-- Shop Creation Form -->
                <div class="space-y-5">
                  <!-- Shop Name -->
                  <div>
                    <label
                      for="shopName"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Shop Name<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="shopName"
                      type="text"
                      id="shopName"
                      placeholder="Enter your shop name"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>

                  <!-- Shop Email -->
                  <div>
                    <label
                      for="shopEmail"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Shop Email<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="shopEmail"
                      type="email"
                      id="shopEmail"
                      placeholder="Enter shop email"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>

                  <!-- Shop Type -->
                  <div>
                    <label
                      for="shopType"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Shop Type<span class="text-error-500">*</span>
                    </label>
                    <select
                      v-model="shopType"
                      id="shopType"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    >
                      <option value="mandiri">Mandiri</option>
                      <option value="perusahaan">Perusahaan</option>
                    </select>
                  </div>

                  <!-- Province -->
                  <div>
                    <label
                      for="province"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Province<span class="text-error-500">*</span>
                    </label>
                    <select
                      v-model="selectedProvinceId"
                      id="province"
                      :disabled="loadingProvinces"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50"
                    >
                      <option value="">{{ loadingProvinces ? 'Loading provinces...' : 'Select Province' }}</option>
                      <option
                        v-for="province in provinces"
                        :key="province.id"
                        :value="province.id"
                      >
                        {{ province.text }}
                      </option>
                    </select>
                  </div>

                  <!-- City -->
                  <div>
                    <label
                      for="city"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      City<span class="text-error-500">*</span>
                    </label>
                    <select
                      v-model="selectedCityId"
                      id="city"
                      :disabled="!selectedProvinceId || loadingCities"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50"
                    >
                      <option value="">{{ 
                        !selectedProvinceId ? 'Select province first' :
                        loadingCities ? 'Loading cities...' : 'Select City' 
                      }}</option>
                      <option
                        v-for="city in cities"
                        :key="city.id"
                        :value="city.id"
                      >
                        {{ city.text }}
                      </option>
                    </select>
                  </div>

                  <!-- Address -->
                  <div>
                    <label
                      for="shopAddress"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Address<span class="text-error-500">*</span>
                    </label>
                    <textarea
                      v-model="shopAddress"
                      id="shopAddress"
                      placeholder="Enter shop address"
                      rows="3"
                      required
                      class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    ></textarea>
                  </div>

                  <!-- Shop Phone -->
                  <div>
                    <label
                      for="shopPhone"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Shop Phone<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="shopPhone"
                      type="tel"
                      id="shopPhone"
                      placeholder="Enter shop phone number"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>

                  <!-- Button -->
                  <div>
                    <button
                      type="submit"
                      :disabled="creatingShop"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="creatingShop">Creating Shop...</span>
                      <span v-else>Create Shop</span>
                    </button>
                  </div>
                </div>
              </form>
              <div class="mt-5">
                <p
                  class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                >
                  Complete your shop information to start selling!
                </p>
              </div>
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { useAlert } from '@/composables/useAlert'
import { shopService } from '@/api/services/shop.service'
import { locationService } from '@/api/services/location.service'
import type { Province, City } from '@/api/types/location.types'

defineOptions({ name: 'SignupPage' })

// Shop creation fields
const shopName = ref('')
const shopEmail = ref('')
const shopAddress = ref('')
const shopType = ref<'mandiri' | 'persewaan'>('mandiri')
const shopPhone = ref('')

// Location data
const provinces = ref<Province[]>([])
const cities = ref<City[]>([])
const selectedProvinceId = ref<string>('')
const selectedCityId = ref<string>('')
const selectedProvinceName = ref<string>('')
const selectedCityName = ref<string>('')
const loadingProvinces = ref(false)
const loadingCities = ref(false)
const creatingShop = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const alert = useAlert()

// Fetch provinces from location API
const fetchProvinces = async () => {
  try {
    loadingProvinces.value = true
    const response = await locationService.getProvinces()
    if (response.status === 200) {
      provinces.value = response.result
    }
  } catch (error) {
    console.error('Failed to fetch provinces:', error)
    toast.error('Terjadi kesalahan saat mengambil data provinsi.')
  } finally {
    loadingProvinces.value = false
  }
}

// Fetch cities by province ID
const fetchCities = async (provinceId: string) => {
  if (!provinceId) {
    cities.value = []
    return
  }
  
  try {
    loadingCities.value = true
    const response = await locationService.getCities(provinceId)
    if (response.status === 200) {
      cities.value = response.result
    }
  } catch (error) {
    console.error('Failed to fetch cities:', error)
    toast.error('Terjadi kesalahan saat mengambil data kota.')
  } finally {
    loadingCities.value = false
  }
}

// Watch province changes to fetch cities
watch(selectedProvinceId, (newProvinceId) => {
  if (newProvinceId) {
    fetchCities(newProvinceId)
    // Reset city selection when province changes
    selectedCityId.value = ''
    selectedCityName.value = ''
  } else {
    cities.value = []
    selectedCityId.value = ''
    selectedCityName.value = ''
  }
})

// Watch province name selection to update province text
watch(selectedProvinceId, (newProvinceId) => {
  const selectedProvince = provinces.value.find(p => p.id === newProvinceId)
  if (selectedProvince) {
    selectedProvinceName.value = selectedProvince.text
  }
})

// Watch city name selection to update city text  
watch(selectedCityId, (newCityId) => {
  const selectedCity = cities.value.find(c => c.id === newCityId)
  if (selectedCity) {
    selectedCityName.value = selectedCity.text
  }
})

const handleSubmit = async () => {
  await handleShopCreation()
}

// Initialize component
onMounted(async () => {
  // Pre-fill shop data with user data if available
  if (authStore.user) {
    shopEmail.value = authStore.user.email
    shopPhone.value = authStore.user.phone || ''
  }
  
  // Load provinces
  await fetchProvinces()
})

const handleShopCreation = async () => {
  if (!shopName.value || !shopEmail.value || !shopAddress.value || !selectedProvinceName.value || !selectedCityName.value || !shopPhone.value) {
    toast.error('Please fill all shop fields')
    return
  }

  creatingShop.value = true
  try {
    const response = await shopService.createShop({
      name: shopName.value,
      email: shopEmail.value,
      address: shopAddress.value,
      type: shopType.value,
      province: selectedProvinceName.value,
      city: selectedCityName.value,
      phone: shopPhone.value,
    })

    if (response.status === 'success') {
      // Show success alert and redirect to login
      await alert.success(
        'Toko Berhasil Dibuat!', 
        'Toko Anda berhasil dibuat. Silahkan login untuk melanjutkan.'
      )
      // Clear auth tokens to allow fresh login
      authStore.clearTokens()
      router.push('/signin')
    }
  } catch (error) {
    console.error('Failed to create shop:', error)
    toast.error('Failed to create shop')
  } finally {
    creatingShop.value = false
  }
}
</script>

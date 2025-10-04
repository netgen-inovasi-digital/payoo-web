<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <!-- Loading State -->
    <div v-if="loading && !shop?.name" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <svg class="h-6 w-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">Memuat data toko...</span>
      </div>
    </div>

    <div v-else class="flex items-start gap-6">
      <!-- Store Image -->
      <div
        class="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-gray-100 shadow-sm"
      >
        <img
          :src="shop?.photo || 'https://p1.hiclipart.com/preview/314/450/342/circle-user-profile-avatar-computer-program-symbol-oval-png-clipart.jpg'"
          alt="Foto Toko"
          onerror="this.src='https://p1.hiclipart.com/preview/314/450/342/circle-user-profile-avatar-computer-program-symbol-oval-png-clipart.jpg'"
          class="h-full w-full object-cover object-center"
        />
      </div>

      <!-- Store Info -->
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
              {{ shop?.name }}
            </h2>
            <span
              class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600"
            >
              <!-- {{ formatShopType(shop.type) }} -->
                Akun Gratis
            </span>
          </div>
          <button
            @click="openModal"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <span>Edit Toko</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>

        <!-- Store Details -->
        <div class="mt-6 flex flex-wrap gap-6">
          <!-- Alamat -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Alamat</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ shop ? `${shop.address}, ${shop.city}, ${shop.province}` : '' }}
              </p>
            </div>
          </div>

          <!-- Pemilik -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-blue-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ shop?.email }}
              </p>
            </div>
          </div>

          <!-- Telepon -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Telepon</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ shop?.phone }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
      >
        <h3 class="mb-4 text-lg font-semibold">Edit Toko</h3>

        <form @submit.prevent="saveChanges" class="space-y-4">
          <!-- Upload Foto -->
          <div>
            <label class="block text-sm font-medium">Foto Toko<span class="text-error-500"> *</span></label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
              :disabled="savingShop || imageUpload.isUploading.value"
            />
            <div v-if="imageUpload.isUploading.value" class="text-sm text-blue-600 mt-1">
              Mengupload...
            </div>
            <div v-if="imageUpload.selectedFile.value" class="text-sm text-green-600 mt-1">
              Selected: {{ imageUpload.selectedFile.value.name }}
            </div>
            <div v-if="form.photo" class="mt-3">
              <img
                :src="form.photo || imageUpload.previewUrl.value"
                onerror="this.src='https://p1.hiclipart.com/preview/314/450/342/circle-user-profile-avatar-computer-program-symbol-oval-png-clipart.jpg'"
                alt="Preview Foto"
                class="h-24 rounded-lg object-cover"
              />
            </div>
          </div>

          <!-- Nama Toko -->
          <div>
            <label class="block text-sm font-medium">Nama Toko<span class="text-error-500"> *</span></label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium">Email<span class="text-error-500"> *</span></label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Tipe Toko -->
          <div>
            <label class="block text-sm font-medium">Tipe Toko<span class="text-error-500"> *</span></label>
            <select
              v-model="form.type"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            >
              <option v-for="option in shopTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium">Alamat<span class="text-error-500"> *</span></label>
            <input
              v-model="form.address"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Province -->
          <div>
            <label class="block text-sm font-medium">Provinsi<span class="text-error-500"> *</span></label>
            <select
              v-model="formProvinceId"
              required
              :disabled="loadingProvinces"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2 disabled:opacity-50"
            >
              <option value="">Pilih Provinsi...</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.text }}
              </option>
            </select>
            <div v-if="loadingProvinces" class="text-sm text-blue-600 mt-1">
              Memuat provinsi...
            </div>
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-medium">Kota<span class="text-error-500"> *</span></label>
            <select
              v-model="formCityId"
              required
              :disabled="loadingCities || !formProvinceId"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2 disabled:opacity-50"
            >
              <option value="">Pilih Kota...</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.text }}
              </option>
            </select>
            <div v-if="loadingCities" class="text-sm text-blue-600 mt-1">
              Memuat kota...
            </div>
            <div v-if="!formProvinceId" class="text-sm text-gray-500 mt-1">
              Pilih provinsi terlebih dahulu
            </div>
          </div>

          <!-- Telepon -->
          <div>
            <label class="block text-sm font-medium">Telepon<span class="text-error-500"> *</span></label>
            <input
              v-model="form.phone"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border px-4 py-2 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="savingShop || imageUpload.isUploading.value"
              class="rounded-lg bg-emerald-500 px-4 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="savingShop">Menyimpan...</span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { shopService } from '@/api/services/shop.service'
import { locationService } from '@/api/services/location.service'
import type { ShopUpdatePayload } from '@/api/types/shop.types'
import type { Province, City } from '@/api/types/location.types'
import { useImageUpload } from '@/composables/useImageUpload'
import { useAlert } from '@/composables/useAlert'
import { useShop } from '@/composables/useShop'
import { useAuthStore } from '@/stores/auth.store'
// import { useFormatters } from '@/composables/useFormatters'

// Composables
const alert = useAlert()
const imageUpload = useImageUpload()
const authStore = useAuthStore()
const { shop, loading, fetchShop, updateShop } = useShop()
// const { formatShopType } = useFormatters()

// State
const isModalOpen = ref(false)
const loadingProvinces = ref(false)
const loadingCities = ref(false)
const savingShop = ref(false)

// Location data
const provinces = ref<Province[]>([])
const cities = ref<City[]>([])
const selectedProvinceId = ref<string>('')

// Form edit
const form = ref<ShopUpdatePayload>({
  name: "",
  email: "",
  address: "",
  type: "mandiri",
  province: "",
  city: "",
  phone: "",
  photo: ""
})

// Form province & city IDs for API calls
const formProvinceId = ref<string>('')
const formCityId = ref<string>('')

// Shop type options
const shopTypeOptions = [
  { value: 'mandiri', label: 'Mandiri' },
  { value: 'perusahaan', label: 'Perusahaan' }
]

// API Functions

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
    alert.error('Gagal!', 'Terjadi kesalahan saat mengambil data provinsi.')
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
    alert.error('Gagal!', 'Terjadi kesalahan saat mengambil data kota.')
  } finally {
    loadingCities.value = false
  }
}

// Watch province changes to fetch cities
watch(formProvinceId, (newProvinceId) => {
  if (newProvinceId) {
    fetchCities(newProvinceId)
    // Reset city selection when province changes
    formCityId.value = ''
    form.value.city = ''
  } else {
    cities.value = []
    formCityId.value = ''
    form.value.city = ''
  }
})

// Watch province name selection to update province text
watch(formProvinceId, (newProvinceId) => {
  const selectedProvince = provinces.value.find(p => p.id === newProvinceId)
  if (selectedProvince) {
    form.value.province = selectedProvince.text
  }
})

// Watch city name selection to update city text  
watch(formCityId, (newCityId) => {
  const selectedCity = cities.value.find(c => c.id === newCityId)
  if (selectedCity) {
    form.value.city = selectedCity.text
  }
})

// Methods
async function openModal() {
  if (!shop.value) {
    alert.error('Error!', 'Data toko belum tersedia.')
    return
  }
  
  // Reset form dengan data shop terbaru
  form.value = {
    name: shop.value.name,
    email: shop.value.email,
    address: shop.value.address,
    type: shop.value.type,
    province: shop.value.province,
    city: shop.value.city,
    phone: shop.value.phone,
    photo: shop.value.photo
  }
  
  // Load provinces when modal opens
  await fetchProvinces()
  
  // Find and set selected province ID
  const currentProvince = provinces.value.find(p => p.text === shop.value?.province)
  if (currentProvince) {
    formProvinceId.value = currentProvince.id
    selectedProvinceId.value = currentProvince.id
    // Load cities for current province
    await fetchCities(currentProvince.id)
    
    // Find and set selected city ID
    const currentCity = cities.value.find(c => c.text === shop.value?.city)
    if (currentCity) {
      formCityId.value = currentCity.id
    }
  }
  
  imageUpload.resetUpload()
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  imageUpload.resetUpload()
}

const handleImageUpload = async (event: Event) => {
  const success = await imageUpload.handleImageSelect(event)
  if (success) {
    form.value.photo = imageUpload.previewUrl.value
  } else if (imageUpload.error.value) {
    alert.error('Upload Error', imageUpload.error.value)
  }
}

async function saveChanges() {
  // Konfirmasi sebelum simpan
  const confirmed = await alert.confirmSave('profil toko', true)
  if (!confirmed) return

  try {
    savingShop.value = true

    // Step 1: Upload image if a new file is selected
    if (imageUpload.selectedFile.value) {
      try {
        const uploadResponse = await imageUpload.uploadFile('shop')
        if (uploadResponse?.status === 'success') {
          form.value.photo = uploadResponse.data.url
        }
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError)
        alert.error('Gagal Upload!', 'Terjadi kesalahan saat mengupload gambar.')
        return
      }
    }

    // Step 2: Update shop data
    const shopId = authStore.user?.shop_id
    if (!shopId) {
      alert.error('Error!', 'Shop ID tidak ditemukan. Silakan login ulang.')
      return
    }
    
    const response = await shopService.updateShop(shopId, form.value)
    
    if (response.status === 'success') {
      updateShop(response.data)
      closeModal()
      alert.success('Berhasil!', 'Profil toko berhasil diupdate.')
    }
  } catch (error) {
    console.error('Failed to save shop:', error)
    alert.error('Gagal!', 'Terjadi kesalahan saat menyimpan profil toko.')
  } finally {
    savingShop.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Check if user is authenticated and has a shop ID
  if (!authStore.isAuthenticated) {
    alert.error('Error!', 'Anda harus login terlebih dahulu.')
    return
  }
  
  if (!authStore.user?.shop_id) {
    alert.error('Error!', 'Akun Anda belum terhubung dengan toko. Silakan hubungi administrator.')
    return
  }
  
  await fetchShop()
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img :src="userPhoto || 'https://p1.hiclipart.com/preview/314/450/342/circle-user-profile-avatar-computer-program-symbol-oval-png-clipart.jpg'" alt="User" onerror="this.src='https://p1.hiclipart.com/preview/314/450/342/circle-user-profile-avatar-computer-program-symbol-oval-png-clipart.jpg'"/>
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ userName }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute left-1/2 transform -translate-x-1/4 sm:left-auto sm:right-0 sm:transform-none sm:translate-x-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userEmail }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li>
          <button
            @click="openProfileModal"
            class="w-full flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            type="button"
          >
            <UserCircleIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            Edit akun
          </button>
        </li>
        <!-- <li>
          <router-link
            to="/chat"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <SettingsIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            Account settings
          </router-link>
        </li> -->
      </ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Keluar
      </router-link>
    </div>
    <!-- Dropdown End -->

    <!-- Profile Edit Modal (teleported to body so it escapes header stacking context) -->
    <teleport to="body" v-if="isProfileModalOpen">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 sm:p-6 shadow-lg dark:bg-gray-900">
          <h3 class="mb-4 text-lg font-semibold">Edit Profil</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <!-- Upload Foto -->
            <div>
              <label class="block text-sm font-medium">Foto Profil<span class="text-error-500"> *</span></label>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="mt-1 w-full rounded-lg border border-gray-300 p-2"
                :disabled="profileLoading || imageUpload.isUploading.value"
              />
              <div v-if="imageUpload.isUploading.value" class="text-sm text-blue-600 mt-1">
                Mengupload...
              </div>
              <div v-if="imageUpload.selectedFile.value" class="text-sm text-green-600 mt-1">
                Selected: {{ imageUpload.selectedFile.value.name }}
              </div>
              <div v-if="profileForm.photo" class="mt-3">
                <img
                  :src="profileForm.photo || imageUpload.previewUrl.value"
                  alt="Preview Foto"
                  class="h-24 rounded-lg object-cover"
                />
              </div>
            </div>
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium">Nama<span class="text-error-500"> *</span></label>
              <input
                v-model="profileForm.name"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium">Email<span class="text-error-500"> *</span></label>
              <input
                v-model="profileForm.email"
                type="email"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            <!-- Telepon -->
            <div>
              <label class="block text-sm font-medium">Telepon<span class="text-error-500"> *</span></label>
              <input
                v-model="profileForm.phone"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeProfileModal"
                class="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="profileLoading || imageUpload.isUploading.value"
                class="rounded-lg bg-emerald-500 px-4 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="profileLoading">Menyimpan...</span>
                <span v-else>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { profileService } from '@/api/services/profile.service'
import { useImageUpload } from '@/composables/useImageUpload'
import { useAlert } from '@/composables/useAlert'
import type { ProfileUpdatePayload } from '@/api/types/profile.types'

const authStore = useAuthStore()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')
const userPhoto = computed(() => authStore.user?.photo || null)

const isProfileModalOpen = ref(false)
const profileLoading = ref(false)
const imageUpload = useImageUpload()
const alert = useAlert()

const profileForm = ref<ProfileUpdatePayload>({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  photo: authStore.user?.photo || ''
})

function openProfileModal() {
  profileForm.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
    photo: authStore.user?.photo || ''
  }
  imageUpload.resetUpload()
  isProfileModalOpen.value = true
}

function closeProfileModal() {
  isProfileModalOpen.value = false
  imageUpload.resetUpload()
}

const handleImageUpload = async (event: Event) => {
  const success = await imageUpload.handleImageSelect(event)
  if (success) {
    profileForm.value.photo = imageUpload.previewUrl.value
  } else if (imageUpload.error.value) {
    alert.error('Upload Error', imageUpload.error.value)
  }
}

async function saveProfile() {
  // Konfirmasi sebelum simpan - tutup modal sementara untuk konfirmasi
  const tempModalState = isProfileModalOpen.value
  isProfileModalOpen.value = false
  
  const confirmed = await alert.confirmSave('profil', true)
  
  // Kembalikan modal jika user membatalkan
  if (!confirmed) {
    isProfileModalOpen.value = tempModalState
    return
  }

  try {
    profileLoading.value = true
    // Step 1: Upload image if a new file is selected
    if (imageUpload.selectedFile.value) {
      try {
        const uploadResponse = await imageUpload.uploadFile('user')
        if (uploadResponse?.status === 'success') {
          profileForm.value.photo = uploadResponse.data.url
        }
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError)
        alert.error('Gagal Upload!', 'Terjadi kesalahan saat mengupload gambar.')
        return
      }
    }
    // Step 2: Update profile
    const response = await profileService.updateProfile(profileForm.value)
    if (response.status === 'success') {
      authStore.setUser(response.data)
      closeProfileModal()
      alert.success('Berhasil!', 'Profil berhasil diupdate.')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
    isProfileModalOpen.value = true // Buka kembali modal jika error
    alert.error('Gagal!', 'Terjadi kesalahan saat menyimpan profil.')
  } finally {
    profileLoading.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  authStore.logout()
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

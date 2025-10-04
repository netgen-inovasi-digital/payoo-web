import { ref, computed } from 'vue'
import { shopService } from '@/api/services/shop.service'
import type { Shop } from '@/api/types/shop.types'
import { useAuthStore } from '@/stores/auth.store'

// Global state to be shared across all instances
const shop = ref<Shop | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let fetchPromise: Promise<Shop | null> | null = null

export const useShop = () => {
  const authStore = useAuthStore()

  const fetchShop = async (force = false) => {
    // If already have shop data and not forcing refresh, return it
    if (shop.value && !force) {
      return shop.value
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise && !force) {
      return fetchPromise
    }

    const shopId = authStore.user?.shop_id
    
    if (!shopId) {
      error.value = 'Shop ID tidak ditemukan'
      return null
    }
    
    // Create the fetch promise
    fetchPromise = (async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Fetching shop data for ID:', shopId)
        const response = await shopService.getShop(shopId)
        
        if (response.status === 'success') {
          shop.value = response.data
          return response.data
        }
      } catch (err) {
        console.error('Failed to fetch shop:', err)
        error.value = 'Terjadi kesalahan saat mengambil data toko'
      } finally {
        loading.value = false
        fetchPromise = null // Reset promise after completion
      }
      
      return null
    })()
    
    return fetchPromise
  }

  const updateShop = (updatedShop: Shop) => {
    shop.value = updatedShop
  }

  const clearShop = () => {
    shop.value = null
    error.value = null
    fetchPromise = null
  }

  // Computed properties for easy access
  const isLoading = computed(() => loading.value)
  const shopData = computed(() => shop.value)

  return {
    // State
    shop: shopData,
    loading: isLoading,
    error: computed(() => error.value),
    
    // Actions
    fetchShop,
    updateShop,
    clearShop
  }
}
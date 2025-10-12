<template>
  <AdminLayout>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Pembelian</h1>
        <p class="text-gray-600 mt-2">Kelola pembelian dan stok masuk produk</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <!-- Product Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Produk</label>
            <select
              v-model="selectedProductId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="">Semua Produk</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Product Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Produk</label>
            <select
              v-model="selectedProductType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="">Semua Tipe</option>
              <option value="composition">Komposisi</option>
              <option value="product">Produk</option>
            </select>
          </div>

          <!-- Action Button -->
          <div class="flex items-end">
            <button
              @click="openStockModal"
              class="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center justify-center gap-2"
            >
              <span class="text-xl">+</span>
              Tambah Pembelian
            </button>
          </div>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <input
              v-model="dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <input
              v-model="dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Riwayat Pembelian</h3>
            <span class="text-sm text-gray-600">
              Menampilkan {{ paginationInfo.from }}-{{ paginationInfo.to }} dari {{ paginationInfo.total }} data
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe Produk
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Beli
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="text-center">
                <td colspan="7" class="px-6 py-8 text-gray-500">
                  <div class="flex justify-center items-center gap-2">
                    <svg class="h-6 w-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
              <tr v-else-if="stocks.length === 0" class="text-center">
                <td colspan="7" class="px-6 py-8 text-gray-500">
                  {{ searchQuery ? 'Tidak ada pembelian yang sesuai dengan pencarian' : 'Tidak ada data pembelian produk' }}
                </td>
              </tr>
              <tr v-else v-for="(stock, index) in stocks" :key="stock.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ stock.product_name }}</div>
                  <!-- <div class="text-sm text-gray-500">ID: {{ stock.product_id }}</div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatProductType(stock.product_type) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ stock.buy_price ? formatCurrency(stock.buy_price) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ stock.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(stock.date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate" :title="stock.notes">
                    {{ stock.notes }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 bg-gray-50 border-t">
          <!-- Desktop View -->
          <div class="hidden md:flex items-center justify-between">
            <div class="flex items-center gap-4">
              <select
                v-model="perPage"
                @change="handlePerPageChange"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="10">10 per halaman</option>
                <option value="20">20 per halaman</option>
                <option value="50">50 per halaman</option>
                <option value="100">100 per halaman</option>
              </select>
              
              <span class="text-sm text-gray-600">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage <= 1 || totalPages === 0"
                @click="handlePageChange(1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ««
              </button>
              <button
                :disabled="currentPage <= 1 || totalPages === 0"
                @click="handlePageChange(currentPage - 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                « Prev
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  :class="[
                    'px-3 py-1 text-sm border rounded',
                    page === currentPage 
                      ? 'bg-brand-600 text-white border-brand-600' 
                      : 'hover:bg-gray-100'
                  ]"
                  @click="handlePageChange(page as number)"
                  :disabled="totalPages === 0"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>

              <button
                :disabled="currentPage >= totalPages || totalPages === 0"
                @click="handlePageChange(currentPage + 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next »
              </button>
              <button
                :disabled="currentPage >= totalPages || totalPages === 0"
                @click="handlePageChange(totalPages || 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »»
              </button>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden space-y-3">
            <!-- Page Info and Per Page -->
            <div class="flex items-center justify-between">
              <select
                v-model="perPage"
                @change="handlePerPageChange"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="10">10 per halaman</option>
                <option value="20">20 per halaman</option>
                <option value="50">50 per halaman</option>
                <option value="100">100 per halaman</option>
              </select>
              
              <span class="text-sm text-gray-600">
                {{ currentPage }}/{{ totalPages }}
              </span>
            </div>

            <!-- Navigation Controls -->
            <div class="flex items-center justify-center gap-1">
              <button
                :disabled="currentPage <= 1 || totalPages === 0"
                @click="handlePageChange(1)"
                class="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ««
              </button>
              <button
                :disabled="currentPage <= 1 || totalPages === 0"
                @click="handlePageChange(currentPage - 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>

              <!-- Mobile page numbers (simplified) -->
              <template v-for="page in Math.min(totalPages || 1, 5)" :key="page">
                <button
                  v-if="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages || totalPages <= 1"
                  :class="[
                    'px-2 py-1 text-sm border rounded min-w-[32px]',
                    page === currentPage 
                      ? 'bg-brand-600 text-white border-brand-600' 
                      : 'hover:bg-gray-100'
                  ]"
                  @click="handlePageChange(page)"
                  :disabled="totalPages === 0"
                >
                  {{ page }}
                </button>
              </template>

              <button
                :disabled="currentPage >= totalPages || totalPages === 0"
                @click="handlePageChange(currentPage + 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </button>
              <button
                :disabled="currentPage >= totalPages || totalPages === 0"
                @click="handlePageChange(totalPages || 1)"
                class="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Stock Modal -->
      <div v-if="showStockModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg w-full max-w-lg p-6">
          <h3 class="text-xl font-semibold mb-4">
            Tambah Pembelian Produk
          </h3>

          <form @submit.prevent="saveStock" class="space-y-4">
            <!-- Product Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Produk<span class="text-error-500"> *</span></label>
              <select
                v-model="stockForm.product_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Pilih Produk</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>



            <!-- Quantity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah<span class="text-error-500"> *</span></label>
              <input
                v-model.number="stockForm.quantity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <!-- Buy Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga Beli<span class="text-error-500"> *</span></label>
              <input
                v-model.number="stockForm.buy_price"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal<span class="text-error-500"> *</span></label>
              <input
                v-model="stockForm.date"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                v-model="stockForm.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Catatan transaksi..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showStockModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
              >
                <span v-if="loading">Menyimpan...</span>
                <span v-else>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { stockService } from '@/api/services/stock.service'
import { productService } from '@/api/services/product.service'
import { useAlert } from '@/composables/useAlert'
import { useFormatters } from '@/composables/useFormatters'
import { useDebounce } from '@/composables/useDebounce'
import type { Stock, StockTransaction } from '@/api/types/stock.types'
import type { Product } from '@/api/types/product.types'

defineOptions({
  name: 'PembelianIndex'
})

// Composables
const alert = useAlert()
const { formatDate, formatCurrency, formatProductType } = useFormatters()

// State
const stocks = ref<Stock[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const showStockModal = ref(false)

// Filters
const searchQuery = ref('')
const selectedProductId = ref<number | null | ''>('')
const selectedProductType = ref<string | null | ''>('')
const dateFrom = ref('')
const dateTo = ref('')

// Debounced search
const { debouncedValue: debouncedSearchQuery } = useDebounce(searchQuery, 500)

// Pagination
const currentPage = ref(1)
const perPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

// Form
const stockForm = ref<StockTransaction>({
  product_id: 0,
  quantity: 1,
  type: 'in',
  buy_price: null,
  notes: '',
  date: new Date().toISOString().slice(0, 16)
})

// Computed
const paginationInfo = computed(() => {
  const info = {
    from: totalItems.value > 0 ? (currentPage.value - 1) * perPage.value + 1 : 0,
    to: Math.min(currentPage.value * perPage.value, totalItems.value),
    total: totalItems.value
  }
  return info
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// Methods
const fetchStocks = async () => {
  try {
    loading.value = true
    
    const params: Record<string, string | number> = {
      page: currentPage.value,
      limit: perPage.value
    }
    
    if (debouncedSearchQuery.value) params.search = debouncedSearchQuery.value
    if (selectedProductType.value) params.product_type = selectedProductType.value
    if (selectedProductId.value) params.product_id = selectedProductId.value
    if (dateFrom.value) params.date_start = dateFrom.value
    if (dateTo.value) params.date_end = dateTo.value
        
    console.log('Fetching pembelian with params:', params)
    
    const response = await stockService.getPembelian(params)
    console.log('Pembelian API response:', response)
    
    if (response.status === 'success') {
      stocks.value = response.data
      // Update pagination info from API response
      if (response.meta?.pagination) {
        totalItems.value = response.meta.pagination.total
        totalPages.value = response.meta.pagination.total_pages
        currentPage.value = response.meta.pagination.current_page
        perPage.value = response.meta.pagination.per_page
      }
    }
  } catch (error) {
    console.error('Failed to fetch stocks:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchStocks()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchStocks()
}

const fetchProducts = async () => {
  try {
    const response = await productService.getProducts()
    if (response.status === 'success') {
      products.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const getLocalDateTime = () => {
  const now = new Date()
  // Kurangi timezone offset untuk mendapatkan waktu lokal
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localDateTime.toISOString().slice(0, 16)
}

const openStockModal = () => {
  stockForm.value = {
    product_id: 0,
    quantity: 1,
    type: 'in',
    buy_price: null,
    notes: '',
    date: getLocalDateTime()
  }
  showStockModal.value = true
}

const saveStock = async () => {
  const confirmed = await alert.confirmSave(
    'pembelian produk',
    false
  )

  if (!confirmed) return

  try {
    loading.value = true
    
    // Add new stock
    await stockService.createStock(stockForm.value)

    await fetchStocks() // Refresh the list
    showStockModal.value = false
    
    alert.success(
      'Berhasil!',
      'Pembelian produk berhasil ditambahkan.'
    )
  } catch (error) {
    console.error('Failed to save stock:', error)
    alert.error(
      'Error!', 
      'Terjadi kesalahan saat menyimpan transaksi.'
    )
  } finally {
    loading.value = false
  }
}



// Watch debounced search query for API calls
watch(debouncedSearchQuery, () => {
  currentPage.value = 1 // Reset to first page when searching
  fetchStocks()
})

// Watchers for other filters (immediate without debounce)
watch([selectedProductId, selectedProductType, dateFrom, dateTo], () => {
  currentPage.value = 1
  fetchStocks()
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchStocks(),
    fetchProducts()
  ])
})
</script>
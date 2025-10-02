<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { stockService } from '@/api/services/stock.service'
import { productService } from '@/api/services/product.service'
import { useAlert } from '@/composables/useAlert'
import type { Stock, StockTransaction } from '@/api/types/stock.types'
import type { Product } from '@/api/types/product.types'

defineOptions({
  name: 'PembelianIndex'
})

// Composables
const alert = useAlert()

// State
const stocks = ref<Stock[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const showStockModal = ref(false)
const searchQuery = ref('')
const selectedProductId = ref<number | null>(null)
const selectedProductType = ref<string | null>(null)
const dateFrom = ref('')
const dateTo = ref('')

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
const filteredStocks = computed(() => {
  return stocks.value.filter(stock => {
    const matchesSearch = !searchQuery.value || 
      stock.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      stock.notes.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesProduct = !selectedProductId.value || stock.product_id === selectedProductId.value
    const matchesProductType = !selectedProductType.value || stock.product_type === selectedProductType.value
    
    const matchesDateFrom = !dateFrom.value || new Date(stock.date) >= new Date(dateFrom.value)
    const matchesDateTo = !dateTo.value || new Date(stock.date) <= new Date(dateTo.value)
    
    return matchesSearch && matchesProduct && matchesProductType && matchesDateFrom && matchesDateTo
  })
})

// Methods
const fetchStocks = async () => {
  try {
    loading.value = true
    const response = await stockService.getPembelian()
    if (response.status === 'success') {
      stocks.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch stocks:', error)
  } finally {
    loading.value = false
  }
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

const openStockModal = () => {
  stockForm.value = {
    product_id: 0,
    quantity: 1,
    type: 'in',
    buy_price: null,
    notes: '',
    date: new Date().toISOString().slice(0, 16)
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount)
}

const formatProductType = (type: string) => {
  switch (type) {
    case 'composition':
      return 'Komposisi'
    case 'product':
      return 'Produk'
    default:
      return type
  }
}

// Watchers
watch([searchQuery, selectedProductId, selectedProductType, dateFrom, dateTo], () => {
  // Filter will be reactive automatically through computed
}, { deep: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchStocks(),
    fetchProducts()
  ])
})
</script>

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
              placeholder="Cari produk atau catatan..."
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
              Total: {{ filteredStocks.length }} pembelian
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
                  Quantity
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
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
              <tr v-else-if="filteredStocks.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Tidak ada data pembelian produk
                </td>
              </tr>
              <tr v-else v-for="stock in filteredStocks" :key="stock.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ filteredStocks.indexOf(stock) + 1 }}
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga Beli *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
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

<template>
  <AdminLayout>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-semibold mb-4">Laporan</h2>

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        <div class="w-full lg:w-96">
          <input v-model="searchQuery" type="text" placeholder="Cari riwayat transaksi"
            class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-between gap-4 lg:gap-8 w-full lg:w-auto">
          <!-- Date Range Inputs -->
          <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full sm:w-auto">
            <input
              v-model="filterForm.rangeStart"
              type="date"
              class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <span class="text-gray-500 self-center hidden sm:inline">-</span>
            <div class="flex items-center justify-center sm:hidden">
              <span class="text-gray-500 text-sm">sampai</span>
            </div>
            <input
              v-model="filterForm.rangeEnd"
              type="date"
              class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <button
              @click="fetchReportsV2"
              class="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <!-- Period Info -->
      <div v-if="reportDataV2" class="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-blue-800">
          <span v-if="reportDataV2.filters?.range_start && reportDataV2.filters?.range_end">
            <strong>Range:</strong> {{ formatDateFromISO(reportDataV2.filters.range_start) }} - {{ formatDateFromISO(reportDataV2.filters.range_end) }}
          </span>
          <span v-else>
            <strong>Periode:</strong> Hari Ini
          </span>
          <span>
            <strong>Total Transaksi:</strong> {{ reportDataV2.total_orders }}
          </span>
          <span>
            <strong>Total Pendapatan:</strong> {{ formatCurrency(totalRevenue) }}
          </span>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Id Transaksi</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">Tanggal</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Metode Bayar</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden md:table-cell">Item</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Total</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-3 sm:px-6 py-6 sm:py-8 text-gray-500">
                <div class="flex justify-center items-center gap-2">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-sm sm:text-base">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0" class="text-center">
              <td colspan="6" class="px-3 sm:px-6 py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                {{ searchQuery ? 'Tidak ada transaksi yang sesuai dengan pencarian' : 'Tidak ada data transaksi' }}
              </td>
            </tr>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                <div class="flex flex-col sm:block">
                  <span>{{ transaction.id }}</span>
                  <span class="text-xs text-gray-400 sm:hidden mt-1">{{ transaction.date }}</span>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{{ transaction.date }}</td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                <span class="inline-block px-2 py-1 text-xs rounded-full" :class="{
                  'bg-green-100 text-green-800': transaction.payment_method === 'cash',
                  'bg-blue-100 text-blue-800': transaction.payment_method === 'gopay',
                  'bg-purple-100 text-purple-800': transaction.payment_method === 'ovo',
                  'bg-yellow-100 text-yellow-800': transaction.payment_method === 'dana',
                  'bg-gray-100 text-gray-800': transaction.payment_method === 'qris'
                }">
                  {{ formatPaymentMethod(transaction.payment_method) }}
                </span>
                <div class="text-xs text-gray-500 mt-1 md:hidden">{{ transaction.items }} item</div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell">{{ transaction.items }}</td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-medium">{{ formatCurrency(transaction.revenue) }}</td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                <button @click="viewDetail(transaction.id)" class="text-blue-600 hover:text-blue-800 font-medium">Detail</button>
              </td>
            </tr>
            <tr v-if="transactions.length > 0" class="bg-gray-50 font-medium">
              <td colspan="2" class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 sm:hidden">Total Pendapatan</td>
              <td colspan="2" class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-bold sm:hidden">{{ formatCurrency(totalRevenue) }}</td>
              <td colspan="4" class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">Total Pendapatan</td>
              <td colspan="2" class="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-bold hidden sm:table-cell">{{ formatCurrency(totalRevenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Detail Transaksi</h3>

        <!-- Loading Detail -->
        <div v-if="loadingDetail" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p class="mt-2 text-gray-600">Memuat detail transaksi...</p>
        </div>

        <!-- Transaction Detail -->
        <div v-else-if="selectedTransaction" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="mb-2"><strong>ID Transaksi:</strong> {{ selectedTransaction.id }}</p>
              <p class="mb-0"><strong>Tanggal:</strong> {{ selectedTransaction.date }}</p>
            </div>
            <div>
              <p class="mb-2"><strong>Metode Bayar:</strong> {{ formatPaymentMethod(selectedTransaction.payment_method)
                }}</p>
              <p class="mb-0"><strong>Total Item:</strong> {{ selectedTransaction.items }}</p>
            </div>
          </div>
          <p class="mb-2 -mt-2"><strong>Catatan:</strong> {{ selectedTransaction.notes || '-' }}</p>

          <!-- Order Items (if available from API) -->
          <div v-if="selectedOrder?.order_items && selectedOrder.order_items.length > 0" class="border-t pt-4">
            <h4 class="font-medium mb-3">Detail Produk:</h4>
            <div class="overflow-x-auto">
              <table class="w-full border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Produk</th>
                    <th class="px-4 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Harga</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.order_items" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-sm">{{ item.name }}</td>
                    <td class="px-4 py-2 text-sm text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-sm text-right">{{ formatCurrency(item.price) }}</td>
                    <td class="px-4 py-2 text-sm text-right">{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payment Summary -->
          <div v-if="selectedOrder" class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(selectedOrder.total) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Pajak:</span>
              <span>{{ formatCurrency(selectedOrder.tax || 0) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{{ formatCurrency(selectedOrder.total) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Dibayar:</span>
              <span>{{ formatCurrency(selectedOrder.amount_paid) }}</span>
            </div>
            <div v-if="(selectedOrder.change_money || 0) > 0" class="flex justify-between text-sm text-gray-600">
              <span>Kembalian:</span>
              <span>{{ formatCurrency(selectedOrder.change_money || 0) }}</span>
            </div>
          </div>

          <!-- Fallback total if no detailed order -->
          <div v-else class="border-t pt-4">
            <p class="text-lg font-medium text-right">
              <strong>Total: {{ formatCurrency(selectedTransaction.revenue) }}</strong>
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="showDetailModal = false" class="px-4 py-2 bg-emerald-500 text-white rounded-lg">Tutup</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { reportService } from '@/api/services/report.service'
import { orderService } from '@/api/services/order.service'
import { useFormatters } from '@/composables/useFormatters'
import { useAuthStore } from '@/stores/auth.store'
import type { ReportData, ReportPeriod, ReportV2Data } from '@/api/types/report.types'
import type { Order } from '@/api/types/order.types'

defineOptions({
  name: 'RiwayatIndex'
})

// Composables
const { formatDate, formatPaymentMethod, formatCurrency } = useFormatters()
const authStore = useAuthStore()

interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  cashier: string;
  customer: string;
  revenue: number;
  items: number;
  payment_method: string;
  status: string;
  notes: string;
  details?: TransactionItem[];
}

// State
const searchQuery = ref('')
const showDetailModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const selectedOrder = ref<Order | null>(null)
const loading = ref(false)
const loadingDetail = ref(false)
const reportData = ref<ReportData | null>(null)
const reportDataV2 = ref<ReportV2Data | null>(null)

// Filter form
const filterForm = ref({
  period: 'today' as ReportPeriod,
  rangeStart: '',
  rangeEnd: ''
})

// Transactions data - computed from API response (prioritize V2 API)
const transactions = computed<Transaction[]>(() => {
  const orders = reportDataV2.value?.orders || reportData.value?.orders || []

  return orders.map(order => ({
    id: order.id,
    date: formatDate(order.created_at),
    cashier: 'Admin', // Hardcode for now since API doesn't provide cashier info
    customer: `Customer #${order.id}`, // Hardcode for now since API doesn't provide customer info
    revenue: parseFloat(order.total),
    items: parseInt(order.total_items),
    payment_method: order.payment_method,
    status: order.status,
    notes: order.notes
  }))
})



// Computed
const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return transactions.value.filter(transaction =>
    transaction.id.toLowerCase().includes(query) ||
    transaction.customer.toLowerCase().includes(query) ||
    transaction.cashier.toLowerCase().includes(query) ||
    transaction.payment_method.toLowerCase().includes(query)
  )
})

const totalRevenue = computed(() => {
  return filteredTransactions.value.reduce((sum, trx) => sum + trx.revenue, 0)
})

// Helper function to format date from DD-MM-YYYY to display format
const formatDateFromISO = (dateStr: string) => {
  if (!dateStr) return ''
  
  // Convert DD-MM-YYYY to Date object
  const [day, month, year] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return formatDate(date.toISOString())
}

// Helper function to format date to DD-MM-YYYY for API
const formatDateForAPI = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Methods
const fetchReportsV2 = async () => {
  try {
    loading.value = true
    const shopId = String(authStore.user?.shop_id)
    
    if (!shopId || shopId === 'undefined') {
      console.error('Shop ID is not available')
      return
    }
    
    const response = await reportService.getReportsV2(
      shopId,
      filterForm.value.rangeStart ? formatDateForAPI(new Date(filterForm.value.rangeStart)) : undefined,
      filterForm.value.rangeEnd ? formatDateForAPI(new Date(filterForm.value.rangeEnd)) : undefined
    )

    console.log('API Response:', response) // Debug log

    if (response.status === 'success') {
      // Check if response.data has the expected structure
      if (response.data && Array.isArray(response.data.orders)) {
        reportDataV2.value = response.data
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where API returns orders directly
        reportDataV2.value = {
          orders: response.data,
          total_orders: response.data.length,
          date_range: {
            start: filterForm.value.rangeStart || new Date().toISOString().split('T')[0],
            end: filterForm.value.rangeEnd || new Date().toISOString().split('T')[0]
          }
        }
      } else {
        console.warn('Unexpected API response structure:', response.data)
      }
      
      // Clear old data
      reportData.value = null
    } else {
      console.error('API returned error status:', response)
    }
  } catch (error) {
    console.error('Failed to fetch reports V2:', error)
    // You might want to show an error message to the user here
  } finally {
    loading.value = false
  }
}

const viewDetail = async (transactionId: string) => {
  try {
    loadingDetail.value = true
    const trx = transactions.value.find(t => t.id === transactionId)

    if (trx) {
      selectedTransaction.value = trx

      // Fetch detailed order data from API
      const response = await orderService.getOrder(parseInt(transactionId))

      if (response.status === 'success') {
        selectedOrder.value = response.data
      }

      showDetailModal.value = true
    }
  } catch (error) {
    console.error('Failed to fetch order detail:', error)
    // Still show modal with basic transaction info even if API fails
    const trx = transactions.value.find(t => t.id === transactionId)
    if (trx) {
      selectedTransaction.value = trx
      selectedOrder.value = null
      showDetailModal.value = true
    }
  } finally {
    loadingDetail.value = false
  }
}

// Initialize default dates
const initializeDefaultDates = () => {
  const today = new Date()
  filterForm.value.rangeStart = today.toISOString().split('T')[0]
  filterForm.value.rangeEnd = today.toISOString().split('T')[0]
}

// Lifecycle
onMounted(async () => {
  // Initialize dates and fetch data
  initializeDefaultDates()
  
  // Only fetch if user has shop_id
  if (authStore.user?.shop_id) {
    await fetchReportsV2()
  } else {
    console.warn('User does not have shop_id, cannot fetch reports')
  }
})
</script>
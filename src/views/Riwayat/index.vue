<template>
  <AdminLayout>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-semibold mb-4">Laporan</h2>

      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Cari riwayat transaksi"
            class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        <div class="text-gray-600 whitespace-nowrap">
          Total transaksi : {{ filteredTransactions.length }}
        </div>

        <div class="flex gap-2 ml-auto">
          <select 
            v-model="filterForm.period" 
            @change="fetchReports"
            class="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="today">Hari Ini</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
          </select>
        </div>
      </div>

      <!-- Period Info -->
      <div v-if="reportData" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          <strong>Periode:</strong> {{ reportData.period === 'today' ? 'Hari Ini' : reportData.period === 'this_week' ? 'Minggu Ini' : 'Bulan Ini' }}
          <span class="ml-4">
            <strong>Range:</strong> {{ formatDate(reportData.date_range.start) }} - {{ formatDate(reportData.date_range.end) }}
          </span>
          <span class="ml-4">
            <strong>Total Orders:</strong> {{ reportData.total_orders }}
          </span>
        </p>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Id Transaksi</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Metode Bayar</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Item</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
            <tr v-else-if="filteredTransactions.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                Tidak ada data transaksi
              </td>
            </tr>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 text-sm text-gray-500">{{ transaction.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.date }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <span class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': transaction.payment_method === 'cash',
                    'bg-blue-100 text-blue-800': transaction.payment_method === 'gopay',
                    'bg-purple-100 text-purple-800': transaction.payment_method === 'ovo',
                    'bg-yellow-100 text-yellow-800': transaction.payment_method === 'dana',
                    'bg-gray-100 text-gray-800': transaction.payment_method === 'qris'
                  }">
                  {{ formatPaymentMethod(transaction.payment_method) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ transaction.items }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(transaction.revenue) }}</td>
              <td class="px-6 py-4 text-sm">
                <button @click="viewDetail(transaction.id)" class="text-blue-600 hover:text-blue-800">Detail</button>
              </td>
            </tr>
            <tr class="bg-gray-50 font-medium">
              <td colspan="4" class="px-6 py-4 text-sm text-gray-900">Total Pendapatan</td>
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(totalRevenue) }}</td>
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
              <p class="mb-2"><strong>Metode Bayar:</strong> {{ formatPaymentMethod(selectedTransaction.payment_method) }}</p>
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
import type { ReportData, ReportPeriod } from '@/api/types/report.types'
import type { Order } from '@/api/types/order.types'

defineOptions({
  name: 'RiwayatIndex'
})

// Composables
const { formatDate, formatPaymentMethod, formatCurrency } = useFormatters()

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

// Filter form
const filterForm = ref({
  period: 'today' as ReportPeriod
})

// Transactions data - computed from API response
const transactions = computed<Transaction[]>(() => {
  if (!reportData.value?.orders) return []
  
  return reportData.value.orders.map(order => ({
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

// Methods
const fetchReports = async () => {
  try {
    loading.value = true
    const shopId = '1' // Hardcode for now, should get from auth/store
    const response = await reportService.getReports(shopId, filterForm.value.period)
    
    if (response.status === 'success') {
      reportData.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch reports:', error)
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

// Lifecycle
onMounted(async () => {
  await fetchReports()
})
</script>
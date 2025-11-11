<template>
  <AdminLayout>
    <div class="container mx-auto sm:p-6">
      <div class="flex justify-between items-center mb-6 no-print">
        <h2 class="text-2xl font-semibold">Cetak Laporan</h2>
        <button @click="goBack" class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
          Kembali
        </button>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 no-print">
        <h3 class="text-lg font-medium mb-4">Filter Laporan</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input v-model="filterForm.rangeStart" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input v-model="filterForm.rangeEnd" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <div class="sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-self-end">
            <button @click="fetchPrintReport" :disabled="loading"
              class="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {{ loading ? 'Memuat...' : 'Tampilkan' }}
            </button>
            <button v-if="printData" @click="handlePrint"
              class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              🖨️ Cetak
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 no-print">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p class="mt-4 text-gray-600">Memuat data laporan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center no-print">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchPrintReport" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Coba Lagi
        </button>
      </div>

      <!-- Print Preview -->
      <div v-else-if="printData" id="printArea" class="bg-white rounded-lg shadow">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200">
          <div class="text-center mb-3">
            <h1 class="text-3xl font-bold text-gray-800">LAPORAN PENJUALAN</h1>
            <p class="text-lg text-gray-600 mt-2">Toko</p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Periode:</strong></p>
              <p>{{ formatDisplayDate(printData.filters.range_start) }} - {{ formatDisplayDate(printData.filters.range_end) }}</p>
            </div>
            <div class="text-right">
              <p><strong>Tanggal Cetak:</strong></p>
              <p>{{ formatDisplayDate(new Date().toISOString()) }}</p>
            </div>
          </div>
        </div>



        <!-- Orders List -->
        <div class="p-4">
          <h2 class="text-base font-semibold mb-3">Detail Transaksi</h2>

          <div v-if="printData.orders.length === 0" class="text-center py-4 print:py-2 text-gray-500 text-sm">
            Tidak ada transaksi pada periode ini
          </div>

          <div v-else>
            <!-- Loop through each order -->
            <div v-for="(order) in printData.orders" :key="order.id" class="mb-2 page-break-inside-avoid">
              <!-- Order Header -->
              <div class="bg-gray-100 border-t-1 border-b border-l border-r border-gray-300 px-3 py-2">
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span class="font-semibold">{{ order.id }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">{{ formatShortDate(order.created_at) }}</span>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-2 py-0.5 bg-gray-200 rounded text-[10px]">
                      {{ formatPaymentMethod(order.payment_method) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order Items Table -->
              <div class="border-l border-r border-b border-gray-300 overflow-x-auto sm:overflow-x-visible">
                <table class="min-w-[640px] sm:min-w-full w-full text-xs table-fixed">
                  <colgroup>
                    <col style="width:6%" />
                    <col style="width:54%" />
                    <col style="width:10%" />
                    <col style="width:15%" />
                    <col style="width:15%" />
                  </colgroup>
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      <th class="text-left py-1 px-2 font-semibold">No</th>
                      <th class="text-left py-1 px-2 font-semibold">Produk</th>
                      <th class="text-center py-1 px-2 font-semibold">Qty</th>
                      <th class="text-right py-1 px-2 font-semibold">Harga</th>
                      <th class="text-right py-1 px-2 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, itemIndex) in order.items" :key="item.id" class="border-b border-gray-100">
                      <td class="py-1 px-2">{{ itemIndex + 1 }}</td>
                      <td class="py-1 px-2 align-top whitespace-normal break-words">
                        <div>
                          <p class="font-medium">{{ item.product_name }}</p>
                          <p v-if="item.notes" class="text-[10px] text-gray-500 italic whitespace-pre-line break-words">
                            {{ item.notes }}</p>
                        </div>
                      </td>
                      <td class="text-center py-1 px-2">{{ item.quantity }}</td>
                      <td class="text-right py-1 px-2">{{ formatCurrency(item.price) }}</td>
                      <td class="text-right py-1 px-2 font-medium">{{ formatCurrency(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-100 border-t-1 border-gray-300 font-bold">
                      <td colspan="4" class="text-right py-1 px-2 text-sm">TOTAL:</td>
                      <td class="text-right py-1 px-2 text-sm">{{ formatCurrency(order.total) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Order Notes -->
              <div v-if="order.notes" class="border-l border-r border-b border-gray-300 px-3 py-1 bg-yellow-50 text-xs">
                <strong>Catatan:</strong> {{ order.notes }}
              </div>
            </div>

            <!-- Grand Total -->
            <div class="mt-4 border border-gray-300 bg-white overflow-x-auto sm:overflow-x-visible">
              <table class="min-w-[480px] w-full text-sm">
                <tbody>
                  <tr>
                    <td class="py-2 px-3 font-semibold">Total Transaksi:</td>
                    <td class="text-right py-2 px-3 font-semibold">{{ printData.summary.total_orders }}</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-bold">TOTAL PENDAPATAN:</td>
                    <td class="text-right py-2 px-3 font-bold">{{ formatCurrency(printData.summary.total_revenue) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-gray-200 text-center text-sm text-gray-600 print:border-black">
          <p>Laporan ini dicetak pada {{ new Date().toLocaleString('id-ID') }}</p>
          <p class="mt-2">Toko</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center no-print">
        <p class="text-gray-600 text-lg">Pilih rentang tanggal dan klik "Tampilkan" untuk melihat laporan</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { reportService } from '@/api/services/report.service'
import { useFormatters } from '@/composables/useFormatters'
import { useAuthStore } from '@/stores/auth.store'
import type { PrintReportData } from '@/api/types/report.types'

defineOptions({
  name: 'PrintReport'
})

// Composables
const router = useRouter()
const { formatCurrency, formatPaymentMethod } = useFormatters()
const authStore = useAuthStore()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const printData = ref<PrintReportData | null>(null)

// Filter form
const filterForm = ref({
  rangeStart: '',
  rangeEnd: ''
})

// Helper function to format date to DD-MM-YYYY for API
const formatDateForAPI = (dateStr: string) => {
  if (!dateStr) return undefined
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Helper function to format date for display
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return ''

  // Handle DD-MM-YYYY format
  if (dateStr.includes('-') && dateStr.split('-')[2]?.length === 4) {
    const [day, month, year] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  // Handle ISO format
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper function to format short date
const formatShortDate = (dateStr: string) => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// (Removed) calculateTotalSubtotal no longer needed after simplifying totals

// Fetch print report
const fetchPrintReport = async () => {
  try {
    loading.value = true
    error.value = null

    const shopId = String(authStore.user?.shop_id)

    if (!shopId || shopId === 'undefined') {
      error.value = 'Shop ID tidak tersedia'
      return
    }

    if (!filterForm.value.rangeStart || !filterForm.value.rangeEnd) {
      error.value = 'Silakan pilih rentang tanggal'
      return
    }

    // Validate date range
    const startDate = new Date(filterForm.value.rangeStart)
    const endDate = new Date(filterForm.value.rangeEnd)

    if (startDate > endDate) {
      error.value = 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir'
      return
    }

    const response = await reportService.getPrintReport(
      shopId,
      formatDateForAPI(filterForm.value.rangeStart),
      formatDateForAPI(filterForm.value.rangeEnd)
    )

    if (response.status === 'success') {
      printData.value = response.data
    } else {
      error.value = 'Gagal memuat data laporan'
    }
  } catch (err) {
    console.error('Failed to fetch print report:', err)
    error.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Terjadi kesalahan saat memuat laporan'
  } finally {
    loading.value = false
  }
}

// Handle print
const handlePrint = () => {
  window.print()
}

// Go back
const goBack = () => {
  router.push('/laporan')
}

// Initialize default dates (today)
const initializeDefaultDates = () => {
  const today = new Date()
  filterForm.value.rangeStart = today.toISOString().split('T')[0]
  filterForm.value.rangeEnd = today.toISOString().split('T')[0]
}

// Lifecycle
onMounted(() => {
  initializeDefaultDates()
})
</script>

<style scoped>
/* Print: keep on-screen styling; only hide elements explicitly marked no-print */
@media print {
  :deep(.no-print) {
    display: none !important;
  }
}
</style>

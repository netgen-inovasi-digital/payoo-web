<script setup lang="ts">
import { ref, computed } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface Transaction {
  id: string;
  date: string;
  cashier: string;
  customer: string;
  revenue: number;
  items: number;
}

// Filter state
const showFilterModal = ref(false)
const searchQuery = ref('')

// Filter form
const filterForm = ref({
  startDate: '',
  endDate: '',
  cashier: '',
  customer: ''
})

// Transactions data
const transactions = ref<Transaction[]>([
  {
    id: '30082501',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Dijah',
    revenue: 30000,
    items: 2
  },
  {
    id: '30082502',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Rohmat',
    revenue: 30000,
    items: 2
  },
  {
    id: '30082503',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Ridha',
    revenue: 30000,
    items: 2
  },
  {
    id: '30082504',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Alex',
    revenue: 30000,
    items: 2
  },
  {
    id: '30082505',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Jonathan',
    revenue: 30000,
    items: 2
  },
  {
    id: '30082506',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Budi',
    revenue: 30000,
    items: 2
  }
])

// Computed properties
const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return transactions.value.filter(transaction => 
    transaction.id.toLowerCase().includes(query) ||
    transaction.customer.toLowerCase().includes(query) ||
    transaction.cashier.toLowerCase().includes(query)
  )
})

const totalRevenue = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => sum + transaction.revenue, 0)
})

// Action handlers
const openFilter = () => {
  showFilterModal.value = true
}

const applyFilter = () => {
  // Here you would implement the actual filtering logic based on filterForm
  showFilterModal.value = false
}

const printReport = () => {
  window.print() // Basic print functionality - could be enhanced with a proper report template
}

const viewDetail = (transactionId: string) => {
  // Here you would implement the navigation to transaction detail page
  console.log('View detail:', transactionId)
}
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Laporan" />
    
    <div class="container mx-auto p-6">
      <!-- Header Section -->
      <h1 class="text-2xl font-semibold mb-6">Laporan</h1>

      <!-- Search and Actions Bar -->
      <div class="flex justify-between items-center mb-6">
        <div class="relative flex-1 max-w-2xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari riwayat transaksi"
            class="w-full px-4 py-2 border rounded-lg"
          />
          <div class="absolute right-4 top-3 text-gray-400">
            <span>Total transaksi : {{ filteredTransactions.length }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            @click="openFilter"
            class="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button 
            @click="printReport"
            class="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak
          </button>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Id Transaksi</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Kasir</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Pelanggan</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Pendapatan</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Item</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 text-sm text-gray-500">{{ transaction.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.date }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.cashier }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.customer }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">Rp{{ transaction.revenue.toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ transaction.items }}</td>
              <td class="px-6 py-4 text-sm">
                <button 
                  @click="viewDetail(transaction.id)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Detail
                </button>
              </td>
            </tr>
            <!-- Total Row -->
            <tr class="bg-gray-50 font-medium">
              <td colspan="4" class="px-6 py-4 text-sm text-gray-900">Total Pendapatan</td>
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900">Rp{{ totalRevenue.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">Filter Transaksi</h3>
        
        <div class="space-y-4">
          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                v-model="filterForm.startDate"
                type="date"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                v-model="filterForm.endDate"
                type="date"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <!-- Cashier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kasir</label>
            <input
              v-model="filterForm.cashier"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Customer -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pelanggan</label>
            <input
              v-model="filterForm.customer"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="showFilterModal = false"
            class="px-4 py-2 text-gray-600 border rounded-lg"
          >
            Batal
          </button>
          <button 
            @click="applyFilter"
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style>
/* Print styles */
@media print {
  .container {
    max-width: none;
    padding: 0;
  }
  
  button {
    display: none;
  }
  
  .shadow {
    box-shadow: none;
  }
  
  /* Add more print-specific styles as needed */
}
</style>

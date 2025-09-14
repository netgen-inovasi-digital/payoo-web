<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string; // format dd/mm/yyyy
  cashier: string;
  customer: string;
  revenue: number;
  items: number;
  details: TransactionItem[];
}

// State
const showFilterModal = ref(false)
const searchQuery = ref('')
const showDetailModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

// Filter form
const filterForm = ref({
  startDate: '',
  endDate: ''
})

// Transactions data
const transactions = ref<Transaction[]>([
  {
    id: '30082501',
    date: '30/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Dijah',
    revenue: 30000,
    items: 2,
    details: [
      { name: 'Nasi Goreng', qty: 1, price: 15000 },
      { name: 'Es Teh', qty: 1, price: 15000 }
    ]
  },
  {
    id: '30082502',
    date: '29/08/2025',
    cashier: 'Rahmat B.',
    customer: 'Rohmat',
    revenue: 30000,
    items: 2,
    details: [
      { name: 'Mie Ayam', qty: 1, price: 20000 },
      { name: 'Es Jeruk', qty: 1, price: 10000 }
    ]
  }
])

// Helper untuk parse tanggal (dd/mm/yyyy)
const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// Computed
const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  let data = transactions.value.filter(transaction =>
    transaction.id.toLowerCase().includes(query) ||
    transaction.customer.toLowerCase().includes(query) ||
    transaction.cashier.toLowerCase().includes(query)
  )

  // Filter berdasarkan tanggal mulai & akhir
  if (filterForm.value.startDate && filterForm.value.endDate) {
    const start = new Date(filterForm.value.startDate)
    const end = new Date(filterForm.value.endDate)
    data = data.filter(trx => {
      const trxDate = parseDate(trx.date)
      return trxDate >= start && trxDate <= end
    })
  }

  return data
})

const totalRevenue = computed(() => {
  return filteredTransactions.value.reduce((sum, trx) => sum + trx.revenue, 0)
})

// Actions
const openFilter = () => {
  showFilterModal.value = true
}

const applyFilter = () => {
  showFilterModal.value = false
}

const printReport = () => {
  window.print()
}

const viewDetail = (transactionId: string) => {
  const trx = transactions.value.find(t => t.id === transactionId)
  if (trx) {
    selectedTransaction.value = trx
    showDetailModal.value = true
  }
}
</script>

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
          <button @click="openFilter" class="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg">
            Filter
          </button>
          <button @click="printReport" class="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg">
            Cetak
          </button>
        </div>
      </div>

      <!-- Table -->
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
                <button @click="viewDetail(transaction.id)" class="text-blue-600 hover:text-blue-800">Detail</button>
              </td>
            </tr>
            <tr class="bg-gray-50 font-medium">
              <td colspan="4" class="px-6 py-4 text-sm text-gray-900">Total Pendapatan</td>
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900">Rp{{ totalRevenue.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Filter Transaksi</h3>

        <div class="space-y-4">
          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input v-model="filterForm.startDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input v-model="filterForm.endDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="showFilterModal = false" class="px-4 py-2 text-gray-600 border rounded-lg">Batal</button>
          <button @click="applyFilter" class="px-4 py-2 bg-emerald-500 text-white rounded-lg">Terapkan</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Detail Transaksi</h3>

        <div v-if="selectedTransaction">
          <p class="mb-2"><strong>ID:</strong> {{ selectedTransaction.id }}</p>
          <p class="mb-2"><strong>Tanggal:</strong> {{ selectedTransaction.date }}</p>
          <p class="mb-2"><strong>Kasir:</strong> {{ selectedTransaction.cashier }}</p>
          <p class="mb-2"><strong>Pelanggan:</strong> {{ selectedTransaction.customer }}</p>

          <table class="w-full mt-4 border rounded-lg">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left text-sm">Item</th>
                <th class="px-4 py-2 text-sm">Qty</th>
                <th class="px-4 py-2 text-sm">Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectedTransaction.details" :key="idx" class="border-t">
                <td class="px-4 py-2 text-sm">{{ item.name }}</td>
                <td class="px-4 py-2 text-sm text-center">{{ item.qty }}</td>
                <td class="px-4 py-2 text-sm">Rp{{ item.price.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>

          <p class="mt-4 font-medium text-right">
            Total: Rp{{ selectedTransaction.revenue.toLocaleString() }}
          </p>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="showDetailModal = false" class="px-4 py-2 bg-emerald-500 text-white rounded-lg">Tutup</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

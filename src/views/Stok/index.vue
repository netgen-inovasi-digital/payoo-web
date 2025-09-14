<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface StockItem {
  id: number
  name: string
  costPrice: number
  sellingPrice: number
  unit: string
  stock: number
}

// --- State ---
const showStockModal = ref(false)
const isEditing = ref(false)
const formError = ref('')
const searchQuery = ref('')

// Modal delete
const showDeleteModal = ref(false)
const stockToDelete = ref<StockItem | null>(null)

// Form
const stockForm = ref<StockItem>({
  id: 0,
  name: '',
  costPrice: 0,
  sellingPrice: 0,
  unit: 'Pcs',
  stock: 0,
})

// Data stok awal
const stocks = ref<StockItem[]>([
  { id: 1, name: 'Roti', costPrice: 2500, sellingPrice: 3000, unit: 'Pcs', stock: 5 },
  { id: 2, name: 'Daging', costPrice: 2500, sellingPrice: 3000, unit: 'Pcs', stock: 5 },
  { id: 3, name: 'Keju', costPrice: 2500, sellingPrice: 3000, unit: 'Pcs', stock: 5 },
  { id: 4, name: 'Selada', costPrice: 2500, sellingPrice: 3000, unit: 'Pcs', stock: 5 },
  { id: 5, name: 'Saus Tomat', costPrice: 2500, sellingPrice: 3000, unit: 'Pcs', stock: 5 },
])

// --- Methods ---
const openAddStock = () => {
  isEditing.value = false
  stockForm.value = {
    id: stocks.value.length + 1,
    name: '',
    costPrice: 0,
    sellingPrice: 0,
    unit: 'Pcs',
    stock: 0,
  }
  formError.value = ''
  showStockModal.value = true
}

const openEditStock = (stock: StockItem) => {
  isEditing.value = true
  stockForm.value = { ...stock }
  formError.value = ''
  showStockModal.value = true
}

const saveStock = () => {
  if (!stockForm.value.name) {
    formError.value = 'Mohon isi semua field yang diperlukan'
    return
  }

  if (isEditing.value) {
    const index = stocks.value.findIndex((p) => p.id === stockForm.value.id)
    if (index !== -1) {
      stocks.value[index] = { ...stockForm.value }
    }
  } else {
    stocks.value.push({ ...stockForm.value })
  }

  showStockModal.value = false
}

const confirmDeleteStock = (stock: StockItem) => {
  stockToDelete.value = stock
  showDeleteModal.value = true
}

const deleteStockConfirmed = () => {
  if (stockToDelete.value) {
    stocks.value = stocks.value.filter((p) => p.id !== stockToDelete.value?.id)
  }
  showDeleteModal.value = false
  stockToDelete.value = null
}

// --- Computed ---
const filteredStocks = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return stocks.value.filter((stock) => stock.name.toLowerCase().includes(query))
})
</script>

<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-8">
      <!-- Header -->
      <h2 class="text-2xl font-semibold mb-4">Stok</h2>

      <!-- Toolbar -->
      <div class="flex items-center gap-4 mb-6">
        <!-- Search -->
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Cari Stok"
            class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        <!-- Total Stok -->
        <div class="text-gray-600 whitespace-nowrap">Total Stok : {{ stocks.length }}</div>

        <!-- Tambah -->
        <button @click="openAddStock"
          class="ml-auto px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
          Tambah Stok
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">No</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Modal</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Jual</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Satuan</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="stock in filteredStocks" :key="stock.id">
              <td class="px-6 py-4 text-sm text-gray-500">{{ stock.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ stock.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">Rp{{ stock.costPrice.toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">Rp{{ stock.sellingPrice.toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ stock.unit }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ stock.stock }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                  <button @click="confirmDeleteStock(stock)" class="text-red-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button @click="openEditStock(stock)" class="text-blue-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Modal -->
    <div v-if="showStockModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Stok' : 'Tambah Stok' }}</h3>

        <div class="space-y-4">
          <!-- Stock Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Stok</label>
            <input v-model="stockForm.name" type="text" class="w-full px-3 py-2 border rounded-lg" />
          </div>

          <!-- Prices -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Modal</label>
              <input v-model.number="stockForm.costPrice" type="number" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Jual</label>
              <input v-model.number="stockForm.sellingPrice" type="number" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <!-- Unit and Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
              <select v-model="stockForm.unit" class="w-full px-3 py-2 border rounded-lg">
                <option value="Pcs">Pcs</option>
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Liter">Liter</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Stok</label>
              <input v-model.number="stockForm.stock" type="number" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="showStockModal = false" class="px-4 py-2 text-gray-600 border rounded-lg">Batal</button>
          <button @click="saveStock" class="px-4 py-2 bg-emerald-500 text-white rounded-lg">
            {{ isEditing ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center shadow-xl">
        <h3 class="text-lg font-semibold mb-2 text-gray-900">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus <span class="font-semibold">{{ stockToDelete?.name }}</span>?
        </p>

        <div class="flex justify-center gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            Batal
          </button>
          <button @click="deleteStockConfirmed" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Hapus
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

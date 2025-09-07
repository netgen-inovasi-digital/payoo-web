<script setup lang="ts">
import { ref, computed } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';

interface StockItem {
  id: number;
  name: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  stock: number;
}

// Form states
const showStockModal = ref(false)
const isEditing = ref(false)
const formError = ref('')
const searchQuery = ref('')

// Stock form state
const stockForm = ref<StockItem>({
  id: 0,
  name: '',
  costPrice: 0,
  sellingPrice: 0,
  unit: 'Pcs',
  stock: 0
})

// Form handlers
const openAddStock = () => {
  isEditing.value = false
  stockForm.value = {
    id: stocks.value.length + 1,
    name: '',
    costPrice: 0,
    sellingPrice: 0,
    unit: 'Pcs',
    stock: 0
  }
  showStockModal.value = true
}

const openEditStock = (stock: StockItem) => {
  isEditing.value = true
  stockForm.value = { ...stock }
  showStockModal.value = true
}

const saveStock = () => {
  if (!stockForm.value.name) {
    formError.value = 'Mohon isi semua field yang diperlukan'
    return
  }

  if (isEditing.value) {
    const index = stocks.value.findIndex(p => p.id === stockForm.value.id)
    if (index !== -1) {
      stocks.value[index] = { ...stockForm.value }
    }
  } else {
    stocks.value.push({ ...stockForm.value })
  }
  
  showStockModal.value = false
  formError.value = ''
}

const deleteStock = (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus stok ini?')) {
    stocks.value = stocks.value.filter(p => p.id !== id)
  }
}

// Filtered stocks based on search query
const filteredStocks = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return stocks.value.filter(stock => 
    stock.name.toLowerCase().includes(query)
  )
})

const stocks = ref<StockItem[]>([
  {
    id: 1,
    name: 'Roti',
    costPrice: 2500,
    sellingPrice: 3000,
    unit: 'Pcs',
    stock: 5
  },
  {
    id: 2,
    name: 'Daging',
    costPrice: 2500,
    sellingPrice: 3000,
    unit: 'Pcs',
    stock: 5
  },
  {
    id: 3,
    name: 'Keju',
    costPrice: 2500,
    sellingPrice: 3000,
    unit: 'Pcs',
    stock: 5
  },
  {
    id: 4,
    name: 'Selada',
    costPrice: 2500,
    sellingPrice: 3000,
    unit: 'Pcs',
    stock: 5
  },
  {
    id: 5,
    name: 'Saus Tomat',
    costPrice: 2500,
    sellingPrice: 3000,
    unit: 'Pcs',
    stock: 5
  }
])
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Stok" />
    
    <div class="container mx-auto py-6">
      <!-- Header Section -->
      <!-- Search and Add Stock Bar -->
      <div class="flex justify-between items-center mb-6">
        <div class="relative flex-1 max-w-2xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari Stok"
            class="w-full px-4 py-2 border rounded-lg"
          />
          <div class="absolute right-4 top-3 text-gray-400">
            <span>Total Stok : {{ stocks.length }}</span>
          </div>
        </div>
        <button 
          @click="openAddStock"
          class="ml-4 px-6 py-2 bg-emerald-500 text-white rounded-lg"
        >
          Tambah Stok
        </button>
      </div>

      <!-- Stocks Table -->
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
                  <button @click="deleteStock(stock.id)" class="text-red-500">
                    <span class="sr-only">Delete</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button @click="openEditStock(stock)" class="text-blue-500">
                    <span class="sr-only">Edit</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
    <div v-if="showStockModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Stok' : 'Tambah Stok' }}</h3>
        
        <div class="space-y-4">
          <!-- Stock Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Stok</label>
            <input
              v-model="stockForm.name"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Prices -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Modal</label>
              <input
                v-model.number="stockForm.costPrice"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Jual</label>
              <input
                v-model.number="stockForm.sellingPrice"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <!-- Unit and Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
              <select
                v-model="stockForm.unit"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Pcs">Pcs</option>
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Liter">Liter</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Stok</label>
              <input
                v-model.number="stockForm.stock"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="showStockModal = false"
            class="px-4 py-2 text-gray-600 border rounded-lg"
          >
            Batal
          </button>
          <button 
            @click="saveStock"
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            {{ isEditing ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
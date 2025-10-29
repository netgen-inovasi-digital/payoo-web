<template>
    <AdminLayout>
      <div class="container mx-auto p-4 sm:p-6">
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-2xl font-semibold mb-4">Manajemen Komposisi</h1>
          
          <!-- Search, Total & Tambah Komposisi -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
            <!-- Search -->
            <div class="flex-1">
              <input v-model="searchQuery" type="text" placeholder="Cari Komposisi"
                class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />
            </div>

            <!-- Total Komposisi -->
            <div class="text-gray-600 whitespace-nowrap order-last sm:order-none">
              <span>Total: {{ filteredCompositions.length }}</span>
            </div>

            <!-- Tambah Komposisi -->
            <button @click="openAddCompositionModal"
              class="w-full sm:w-auto px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
              Tambah Komposisi
            </button>
          </div>
        </div>

        <!-- Komposisi Section -->
        <!-- Komposisi Table -->
        <div class="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
          <div class="min-w-[800px]">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 whitespace-nowrap">
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">No</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Nama Komposisi</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Modal</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Jual</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Unit</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="loading" class="text-center">
                <td colspan="6" class="px-6 py-8 text-gray-500">
                  <div class="flex justify-center items-center gap-2">
                    <svg class="h-6 w-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredCompositions.length === 0" class="text-center">
                <td colspan="6" class="px-6 py-8 text-gray-500">
                  {{ searchQuery ? 'Tidak ada komposisi yang sesuai dengan pencarian' : 'Belum ada komposisi' }}
                </td>
              </tr>
              <tr v-else v-for="(composition, index) in filteredCompositions" :key="composition.id">
                <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ composition.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(composition.cost_price) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(composition.selling_price) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ composition.stock }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatUnit(composition.unit) }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button @click="editComposition(composition)" class="text-blue-500 hover:text-blue-700">
                      <span class="sr-only">Edit</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteComposition(composition)" class="text-red-500 hover:text-red-700">
                      <span class="sr-only">Delete</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <!-- Add/Edit Composition Modal -->
        <div v-if="showCompositionModal" class="fixed inset-0 bg-black/30 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div class="bg-white rounded-lg w-full max-w-lg mx-3 sm:mx-0 p-4 sm:p-6 my-4">
            <h3 class="text-xl font-semibold mb-4">
              {{ editingComposition ? 'Edit Komposisi' : 'Tambah Komposisi Baru' }}
            </h3>

            <form @submit.prevent="saveComposition" class="space-y-4">
              <!-- Nama Komposisi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Komposisi<span class="text-error-500"> *</span></label>
                <input v-model="compositionForm.name" type="text" required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Contoh: Susu" />
              </div>

              <!-- Harga Modal -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Modal (Rp)<span class="text-error-500"> *</span></label>
                <input v-model.number="compositionForm.cost_price" type="number" required min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="0" />
              </div>

              <!-- Harga Jual -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)<span class="text-error-500"> *</span></label>
                <input v-model.number="compositionForm.selling_price" type="number" required min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="0" />
              </div>

              <!-- Unit -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Unit<span class="text-error-500"> *</span></label>
                <select v-model="compositionForm.unit" required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500">
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
              </div>

              <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button type="button" @click="showCompositionModal = false" class="w-full sm:w-auto px-4 py-2 border rounded-lg">
                  Batal
                </button>
                <button type="submit" :disabled="loading"
                  class="w-full sm:w-auto px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="loading">Menyimpan...</span>
                  <span v-else>{{ editingComposition ? 'Simpan Perubahan' : 'Tambah Komposisi' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CompositionIndex'
})

import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { compositionService } from '@/api/services/composition.service'
import type { Composition, CompositionPayload, CompositionUnit } from '@/api/types/composition.types'
import { useAlert } from '@/composables/useAlert'
import { useFormatters } from '@/composables/useFormatters'

// Composables
const alert = useAlert()
const { formatCurrency, formatUnit } = useFormatters()

// Unit options
const unitOptions: { value: CompositionUnit; label: string }[] = [
  { value: 'pcs', label: 'Pcs' },
  { value: 'gr', label: 'Gram' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'ml', label: 'Mililiter' },
  { value: 'liter', label: 'Liter' },
  { value: 'lembar', label: 'Lembar' },
  { value: 'slice', label: 'Slice' },
  { value: 'butir', label: 'Butir' },
  { value: 'pack', label: 'Pack' },
  { value: 'botol', label: 'Botol' }
]

// State
const compositions = ref<Composition[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showCompositionModal = ref(false)
const editingComposition = ref<Composition | null>(null)

// Composition form
const compositionForm = ref<CompositionPayload>({
  name: '',
  cost_price: 0,
  selling_price: 0,
  unit: 'pcs'
})

// Computed
const filteredCompositions = computed(() => {
  return compositions.value.filter(composition => {
    const matchesSearch = composition.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

// API Functions
const fetchCompositions = async () => {
  try {
    loading.value = true
    const response = await compositionService.getCompositions()
    if (response.status === 'success') {
      compositions.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch compositions:', error)
    alert.error('Gagal!', 'Terjadi kesalahan saat mengambil data komposisi.')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchCompositions()
})

// Methods
const openAddCompositionModal = () => {
  editingComposition.value = null
  compositionForm.value = {
    name: '',
    cost_price: 0,
    selling_price: 0,
    unit: 'pcs'
  }
  showCompositionModal.value = true
}

const editComposition = (composition: Composition) => {
  editingComposition.value = composition
  compositionForm.value = {
    name: composition.name,
    cost_price: composition.cost_price,
    selling_price: composition.selling_price,
    unit: composition.unit
  }
  showCompositionModal.value = true
}

const deleteComposition = async (composition: Composition) => {
  const confirmed = await alert.confirmDelete(composition.name, 'komposisi')
  
  if (confirmed) {
    try {
      loading.value = true
      await compositionService.deleteComposition(composition.id)
      await fetchCompositions() // Refresh the list
      alert.success('Berhasil!', 'Komposisi berhasil dihapus.')
    } catch (error) {
      console.error('Failed to delete composition:', error)
      alert.error('Gagal!', 'Terjadi kesalahan saat menghapus komposisi.')
    } finally {
      loading.value = false
    }
  }
}

const saveComposition = async () => {
  // Konfirmasi sebelum simpan
  const confirmed = await alert.confirmSave(
    compositionForm.value.name, 
    !!editingComposition.value
  )

  if (!confirmed) return

  try {
    loading.value = true

    if (editingComposition.value) {
      // Update existing composition
      await compositionService.updateComposition(editingComposition.value.id, compositionForm.value)
    } else {
      // Add new composition
      await compositionService.createComposition(compositionForm.value)
    }

    await fetchCompositions() // Refresh the list
    showCompositionModal.value = false

    // Success notification
    alert.success(
      'Berhasil!',
      editingComposition.value
        ? 'Komposisi berhasil diupdate.'
        : 'Komposisi berhasil ditambahkan.'
    )
  } catch (error) {
    console.error('Failed to save composition:', error)
    alert.error(
      'Gagal!',
      editingComposition.value
        ? 'Terjadi kesalahan saat mengupdate komposisi.'
        : 'Terjadi kesalahan saat menyimpan komposisi.'
    )
  } finally {
    loading.value = false
  }
}
</script>

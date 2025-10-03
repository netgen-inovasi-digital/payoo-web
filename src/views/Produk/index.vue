<template>
    <AdminLayout>
      <!-- <PageBreadcrumb pageTitle="Product Management" /> -->
      <div class="container mx-auto p-6">
        <!-- Kategori Section -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Kategori</h2>
          <div class="flex flex-wrap gap-2">
            <button @click="clearCategoryFilter" :class="[
              'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-gray-50',
              selectedCategoryId === null
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-300 text-gray-600'
            ]">
              Semua Kategori
            </button>
            <button v-for="category in categories" :key="category.id" @click="filterByCategory(category.id)" :class="[
              'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-brand-50',
              selectedCategoryId === category.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-brand-500 text-brand-600'
            ]">
              {{ category.name }}
              <!-- <span @click.stop="deleteCategory(category)" class="text-red-500 hover:text-red-700">×</span> -->
            </button>
            <button @click="openCategoryModal"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 flex items-center gap-2 hover:bg-gray-50">
              Tambah Kategori
              <span class="text-xl">+</span>
            </button>
          </div>
        </div>

        <!-- Produk Section -->
        <div>
          <!-- Produk Section -->
          <div>
            <!-- Caption Produk -->
            <h2 class="text-2xl font-semibold mb-4">Produk</h2>

            <!-- Search, Total & Tambah Produk -->
            <div class="flex items-center gap-4 mb-4">
              <!-- Search -->
              <input v-model="searchQuery" type="text" placeholder="Cari Produk"
                class="flex-1 px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />

              <!-- Total Produk -->
              <div class="text-gray-600 whitespace-nowrap">
                <span v-if="selectedCategoryId">
                  {{ getCategoryName(selectedCategoryId) }}: {{ filteredProducts.length }}
                </span>
                <span v-else>
                  Total Produk: {{ filteredProducts.length }}
                </span>
                <span v-if="searchQuery" class="text-sm text-gray-500 ml-1">
                  (filtered)
                </span>
              </div>

              <!-- Tambah Produk -->
              <button @click="openAddProductModal"
                class="ml-auto px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                Tambah Produk
              </button>
            </div>


          </div>



          <!-- Products Table -->
          <div class="bg-white rounded-lg shadow overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">No</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Foto</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Modal</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Jual</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="loading" class="text-center">
                  <td colspan="7" class="px-6 py-8 text-gray-500">
                    <div class="flex justify-center items-center">
                      <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredProducts.length === 0" class="text-center">
                  <td colspan="7" class="px-6 py-8 text-gray-500">
                    {{ searchQuery ? 'Tidak ada produk yang sesuai dengan pencarian' : 'Belum ada produk' }}
                  </td>
                </tr>
                <tr v-else v-for="(product, index) in filteredProducts" :key="product.id">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
                  <td class="px-6 py-4">
                    <img :src="product.photo" :alt="product.name" class="h-12 w-12 object-cover rounded-lg"
                      loading="lazy" />
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ getCategoryName(product.category_id) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(product.cost_price) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(product.selling_price) }}</td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button @click="editProduct(product)" class="text-blue-500">
                        <span class="sr-only">Edit</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="deleteProduct(product)" class="text-red-500">
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

        <!-- Add/Edit Product Modal -->
        <div v-if="showProductModal" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 class="text-xl font-semibold mb-4">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>

            <form @submit.prevent="saveProduct" class="space-y-4">
              <!-- Product Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  :disabled="loading || imageUpload.isUploading.value"
                  :required="!productForm.photo"
                />
                <div v-if="imageUpload.isUploading.value" class="text-sm text-blue-600 mt-1">
                  Mengupload...
                </div>
                <div v-if="imageUpload.selectedFile.value" class="text-sm text-green-600 mt-1">
                  Selected: {{ imageUpload.selectedFile.value.name }}
                </div>
                <div v-if="productForm.photo" class="mt-3">
                  <img
                    :src="productForm.photo || imageUpload.previewUrl.value"
                    alt="Preview Foto"
                    class="h-24 rounded-lg object-cover"
                  />
                </div>
              </div>

              <!-- Product Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input v-model="productForm.name" type="text" required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="productForm.description" required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  rows="3"></textarea>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select v-model="productForm.category_id" required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500">
                  <option value="0">Select category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Cost Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Modal (Rp)</label>
                <input v-model.number="productForm.cost_price" type="number" required min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />
              </div>

              <!-- Selling Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
                <input v-model.number="productForm.selling_price" type="number" required min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" @click="showProductModal = false" class="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" :disabled="loading || imageUpload.isUploading.value"
                  class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="imageUpload.isUploading.value">Mengupload...</span>
                  <span v-else-if="loading">Menyimpan...</span>
                  <span v-else>{{ editingProduct ? 'Simpan Perubahan' : 'Tambah Produk' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Category Management Modal -->
        <div v-if="showCategoryModal" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <h3 class="text-xl font-semibold mb-4">Manage Categories</h3>

            <!-- Add Category Form -->
            <form @submit.prevent="addCategory" class="mb-6">
              <div class="flex gap-2">
                <input v-model="newCategory" type="text" placeholder="Nama kategori baru" required
                  class="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500" />
                <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                  Tambah
                </button>
              </div>
            </form>

            <!-- Categories List -->
            <div class="space-y-2">
              <div v-for="category in categories" :key="category.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>{{ category.name }}</span>
                <button @click="deleteCategory(category)" class="text-red-600 hover:text-red-700">
                  Hapus
                </button>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="showCategoryModal = false" class="px-4 py-2 border rounded-lg">
                Tutup
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal - Removed, replaced with SweetAlert -->
      </div>
    </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ProductIndex'
})

import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { productService } from '@/api/services/product.service'
import { categoryService } from '@/api/services/category.service'
import type { Product } from '@/api/types/product.types'
import type { Category } from '@/api/types/category.types'
import { useImageUpload } from '@/composables/useImageUpload'
import { useAlert } from '@/composables/useAlert'
import { useFormatters } from '@/composables/useFormatters'

// Composables
const alert = useAlert()
const imageUpload = useImageUpload()
const { formatCurrency } = useFormatters()

// State
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategoryId = ref<number | null>(null)
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const newCategory = ref('')
const editingProduct = ref<Product | null>(null)

// Product form
const productForm = ref<Omit<Product, 'id' | 'created_at' | 'updated_at'>>({
  shop_id: 3, // Default shop ID - you might want to make this dynamic
  category_id: 0,
  name: '',
  description: '',
  photo: '',
  cost_price: 0,
  selling_price: 0
})

// Computed
const filteredProducts = computed(() => {
  return products.value
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = selectedCategoryId.value === null || product.category_id === selectedCategoryId.value
      return matchesSearch && matchesCategory
    })
})

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : 'Unknown'
}

// Filter Methods
const filterByCategory = (categoryId: number) => {
  selectedCategoryId.value = selectedCategoryId.value === categoryId ? null : categoryId
}

const clearCategoryFilter = () => {
  selectedCategoryId.value = null
}

// API Functions
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await productService.getProducts()
    if (response.status === 'success') {
      products.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    if (response.status === 'success') {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})

// Methods
const openAddProductModal = () => {
  editingProduct.value = null
  imageUpload.resetUpload() // Reset image upload state
  productForm.value = {
    shop_id: 3,
    category_id: 0,
    name: '',
    description: '',
    photo: '',
    cost_price: 0,
    selling_price: 0
  }
  showProductModal.value = true
}

const openCategoryModal = () => {
  showCategoryModal.value = true
  newCategory.value = ''
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  imageUpload.resetUpload() // Reset image upload state
  productForm.value = { ...product }
  showProductModal.value = true
}

const deleteProduct = async (product: Product) => {
  const confirmed = await alert.confirmDelete(product.name, 'produk')
  
  if (confirmed) {
    try {
      loading.value = true
      await productService.deleteProduct(product.id)
      await fetchProducts() // Refresh the list
      alert.success('Berhasil!', 'Produk berhasil dihapus.')
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert.error('Gagal!', 'Terjadi kesalahan saat menghapus produk.')
    } finally {
      loading.value = false
    }
  }
}

const handleImageUpload = async (event: Event) => {
  const success = await imageUpload.handleImageSelect(event)
  if (success) {
    productForm.value.photo = imageUpload.previewUrl.value
  } else if (imageUpload.error.value) {
    alert.error('Upload Error', imageUpload.error.value)
  }
}

const saveProduct = async () => {
  // Konfirmasi sebelum simpan
  const confirmed = await alert.confirmSave(
    productForm.value.name, 
    !!editingProduct.value
  )

  if (!confirmed) return

  try {
    loading.value = true

    // Step 1: Upload image if a new file is selected
    if (imageUpload.selectedFile.value) {
      try {
        const uploadResponse = await imageUpload.uploadFile('produk')
        if (uploadResponse?.status === 'success') {
          // Use the uploaded image URL
          productForm.value.photo = uploadResponse.data.url
        }
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError)
        alert.error('Gagal Upload!', 'Terjadi kesalahan saat mengupload gambar.')
        return
      }
    }

    // Step 2: Save product with the image URL
    if (editingProduct.value) {
      // Update existing product
      await productService.updateProduct(editingProduct.value.id, productForm.value)
    } else {
      // Add new product
      await productService.createProduct(productForm.value)
    }

    await fetchProducts() // Refresh the list
    showProductModal.value = false
    imageUpload.resetUpload() // Reset image upload state

    // Success notification
    alert.success(
      'Berhasil!',
      editingProduct.value
        ? 'Produk berhasil diupdate.'
        : 'Produk berhasil ditambahkan.'
    )
  } catch (error) {
    console.error('Failed to save product:', error)
    alert.error(
      'Gagal!',
      editingProduct.value
        ? 'Terjadi kesalahan saat mengupdate produk.'
        : 'Terjadi kesalahan saat menyimpan produk.'
    )
  } finally {
    loading.value = false
  }
}

const addCategory = async () => {
  if (newCategory.value && !categories.value.some(cat => cat.name === newCategory.value)) {
    // Konfirmasi sebelum tambah kategori
    const confirmed = await alert.confirm({
      title: 'Tambah Kategori?',
      text: `Apakah Anda yakin ingin menambahkan kategori "${newCategory.value}"?`,
      icon: 'question',
      confirmButtonText: 'Ya, Tambah!',
      cancelButtonText: 'Batal'
    })

    if (!confirmed) return

    try {
      await categoryService.createCategory({
        name: newCategory.value,
        shop_id: 3 // Default shop ID - you might want to make this dynamic
      })
      await fetchCategories() // Refresh the list
      newCategory.value = ''

      alert.success('Berhasil!', 'Kategori berhasil ditambahkan.')
    } catch (error) {
      console.error('Failed to add category:', error)
      alert.error('Gagal!', 'Terjadi kesalahan saat menambahkan kategori.')
    }
  } else if (categories.value.some(cat => cat.name === newCategory.value)) {
    alert.warning('Peringatan!', 'Kategori dengan nama tersebut sudah ada.')
  } else {
    alert.warning('Peringatan!', 'Nama kategori tidak boleh kosong.')
  }
}

const deleteCategory = async (category: Category) => {
  const confirmed = await alert.confirmDelete(category.name, 'kategori')
  
  if (confirmed) {
    try {
      await categoryService.deleteCategory(category.id)
      await fetchCategories() // Refresh the list
      alert.success('Berhasil!', 'Kategori berhasil dihapus.')
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert.error('Gagal!', 'Terjadi kesalahan saat menghapus kategori.')
    }
  }
}
</script>

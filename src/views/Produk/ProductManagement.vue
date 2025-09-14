<!-- ProductManagement.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';

interface Product {
  id: number;
  name: string;
  category: string;
  sellingPrice: string;
  costPrice: string;
  stock: number;
  image: string;
  imagePreview?: string;
}

// States
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const showDeleteProductModal = ref(false)
const showDeleteCategoryModal = ref(false)

const isEditing = ref(false)
const formError = ref('')

// Category state
const categories = ref(['Makanan', 'Minuman'])
const newCategory = ref('')
const categoryToDelete = ref('')

// Product form state
const productForm = ref<Product>({
  id: 0,
  name: '',
  category: '',
  sellingPrice: '',
  costPrice: '',
  stock: 0,
  image: '',
  imagePreview: ''
})

// Products data
const products = ref<Product[]>([
  {
    id: 1,
    name: 'Burger',
    category: 'Makanan',
    sellingPrice: '15.000',
    costPrice: '10.000',
    stock: 10,
    image: '/images/product/burger.jpg'
  },
  {
    id: 2,
    name: 'Pizza',
    category: 'Makanan',
    sellingPrice: '15.000',
    costPrice: '10.000',
    stock: 10,
    image: '/images/product/pizza.jpg'
  }
])

// ===== Handlers Produk =====
const openAddProduct = () => {
  isEditing.value = false
  productForm.value = {
    id: products.value.length + 1,
    name: '',
    category: '',
    sellingPrice: '',
    costPrice: '',
    stock: 0,
    image: '',
    imagePreview: ''
  }
  showProductModal.value = true
}

const openEditProduct = (product: Product) => {
  isEditing.value = true
  productForm.value = { ...product, imagePreview: product.image }
  showProductModal.value = true
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target?.result as string
      productForm.value.imagePreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveProduct = () => {
  if (!productForm.value.name || !productForm.value.category) {
    formError.value = 'Please fill in all required fields'
    return
  }

  if (isEditing.value) {
    const index = products.value.findIndex(p => p.id === productForm.value.id)
    if (index !== -1) {
      products.value[index] = { ...productForm.value }
    }
  } else {
    products.value.push({ ...productForm.value })
  }

  showProductModal.value = false
  formError.value = ''
}

// Delete product with modal
const productToDelete = ref<number | null>(null)
const confirmDeleteProduct = (id: number) => {
  productToDelete.value = id
  showDeleteProductModal.value = true
}
const deleteProduct = () => {
  if (productToDelete.value !== null) {
    products.value = products.value.filter(p => p.id !== productToDelete.value)
    productToDelete.value = null
    showDeleteProductModal.value = false
  }
}

// ===== Handlers Kategori =====
const saveCategory = () => {
  if (!newCategory.value) {
    formError.value = 'Please enter a category name'
    return
  }

  if (!categories.value.includes(newCategory.value)) {
    categories.value.push(newCategory.value)
    newCategory.value = ''
    showCategoryModal.value = false
    formError.value = ''
  }
}

const confirmDeleteCategory = (category: string) => {
  categoryToDelete.value = category
  showDeleteCategoryModal.value = true
}
const deleteCategory = () => {
  categories.value = categories.value.filter(c => c !== categoryToDelete.value)
  categoryToDelete.value = ''
  showDeleteCategoryModal.value = false
}
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Produk" />

    <div class="container mx-auto p-6">
      <!-- Categories Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Kategori</h2>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="category in categories"
            :key="category"
            class="px-4 py-2 rounded-full bg-emerald-500 text-white flex items-center gap-2"
          >
            {{ category }}
            <span
              @click="confirmDeleteCategory(category)"
              class="rounded-full bg-white w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              <span class="text-emerald-500">×</span>
            </span>
          </button>
          <button
            @click="showCategoryModal = true"
            class="px-4 py-2 rounded-full border border-gray-300 text-gray-600 flex items-center gap-2"
          >
            Tambah Kategori
            <span class="text-gray-400">+</span>
          </button>
        </div>
      </div>

      <!-- Products Section -->
      <div>
        <h2 class="text-2xl font-semibold mb-4">Produk</h2>

        <!-- Search and Add Product Bar -->
        <div class="flex justify-between items-center mb-6">
          <div class="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Cari Produk"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <div class="absolute right-4 top-3 text-gray-400">
              <span>Total Produk : {{ products.length }}</span>
            </div>
          </div>
          <button
            @click="openAddProduct"
            class="ml-4 px-6 py-2 bg-emerald-500 text-white rounded-lg"
          >
            Tambah Produk
          </button>
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
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Jual</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Harga Modal</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id">
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.id }}</td>
                <td class="px-6 py-4">
                  <img :src="product.image" alt="" class="w-12 h-12 object-cover rounded" />
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.category }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.sellingPrice }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.costPrice }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.stock }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button @click="confirmDeleteProduct(product.id)" class="text-red-500">
                      <span class="sr-only">Delete</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="openEditProduct(product)" class="text-blue-500">
                      <span class="sr-only">Edit</span>
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
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}</h3>
        <!-- Form isi produk -->
        <!-- ... sama kayak sebelumnya ... -->
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">Tambah Kategori</h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
          <input v-model="newCategory" type="text" class="w-full px-3 py-2 border rounded-lg mb-4" />
          <p v-if="formError" class="text-red-500 text-sm mb-4">{{ formError }}</p>
          <div class="flex justify-end gap-3">
            <button @click="showCategoryModal = false" class="px-4 py-2 text-gray-600 border rounded-lg">
              Batal
            </button>
            <button @click="saveCategory" class="px-4 py-2 bg-emerald-500 text-white rounded-lg">
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Product Modal -->
    <div v-if="showDeleteProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center">
        <h3 class="text-lg font-semibold mb-4">Hapus Produk</h3>
        <p class="text-gray-600 mb-6">Apakah kamu yakin ingin menghapus produk ini?</p>
        <div class="flex justify-center gap-3">
          <button @click="showDeleteProductModal = false" class="px-4 py-2 text-gray-600 border rounded-lg">Batal</button>
          <button @click="deleteProduct" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Category Modal -->
    <div v-if="showDeleteCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center">
        <h3 class="text-lg font-semibold mb-4">Hapus Kategori</h3>
        <p class="text-gray-600 mb-6">Apakah kamu yakin ingin menghapus kategori
          "<span class="font-semibold">{{ categoryToDelete }}</span>"?</p>
        <div class="flex justify-center gap-3">
          <button @click="showDeleteCategoryModal = false" class="px-4 py-2 text-gray-600 border rounded-lg">Batal</button>
          <button @click="deleteCategory" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

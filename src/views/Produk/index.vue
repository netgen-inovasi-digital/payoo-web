<template>
  <AdminLayout>
    <!-- <PageBreadcrumb pageTitle="Product Management" /> -->

    <div class="container mx-auto p-6">
      <!-- Kategori Section -->
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Kategori</h2>
        <div class="flex flex-wrap gap-2">
          <button v-for="category in categories" :key="category"
            class="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-600 flex items-center gap-2 hover:bg-emerald-50">
            {{ category }}
            <span @click.stop="deleteCategory(category)" class="text-red-500 hover:text-red-700">×</span>
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
              class="flex-1 px-4 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />

            <!-- Total Produk -->
            <div class="text-gray-600 whitespace-nowrap">
              Total Produk: {{ filteredProducts.length }}
            </div>

            <!-- Tambah Produk -->
            <button @click="openAddProductModal"
              class="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
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
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(product, index) in filteredProducts" :key="product.id">
                <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <img :src="product.image" :alt="product.name" class="h-12 w-12 object-cover rounded-lg" />
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.category }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.costPrice.toLocaleString() }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.price.toLocaleString() }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.stock }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button @click="deleteProduct(product)" class="text-red-500">
                      <span class="sr-only">Delete</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="editProduct(product)" class="text-blue-500">
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
              <div class="flex items-center gap-4">
                <img :src="productForm.image || '/images/product/default.jpg'" alt="Product preview"
                  class="w-24 h-24 object-cover rounded" />
                <input type="file" accept="image/*" @change="handleImageUpload" class="flex-1" />
              </div>
            </div>

            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input v-model="productForm.name" type="text" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="productForm.category" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Selling Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
              <input v-model.number="productForm.price" type="number" required min="0"
                class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <!-- Cost Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga Modal (Rp)</label>
              <input v-model.number="productForm.costPrice" type="number" required min="0"
                class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <!-- Stock -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input v-model.number="productForm.stock" type="number" required min="0"
                class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showProductModal = false" class="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                {{ editingProduct ? 'Save Changes' : 'Add Product' }}
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
              <input v-model="newCategory" type="text" placeholder="New category name"
                class="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
              <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Add
              </button>
            </div>
          </form>

          <!-- Categories List -->
          <div class="space-y-2">
            <div v-for="category in categories" :key="category"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>{{ category }}</span>
              <button @click="deleteCategory(category)" class="text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button @click="showCategoryModal = false" class="px-4 py-2 border rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center">
          <h3 class="text-xl font-semibold mb-4">Delete Product</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "{{ productToDelete?.name }}"? This action cannot be undone.
          </p>
          <div class="flex justify-center gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ProductIndex'
})

import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

interface Product {
  id: string;
  name: string;
  price: number; // harga jual
  costPrice: number; // harga modal
  stock: number;
  image: string;
  category: string;
}

// State
const products = ref<Product[]>([
  {
    id: '1',
    name: 'Omelette',
    price: 15000,
    costPrice: 10000,
    stock: 50,
    image: '/images/product/omelette.jpg',
    category: 'Food'
  },
  {
    id: '2',
    name: 'Chicken Noodle',
    price: 18000,
    costPrice: 12000,
    stock: 30,
    image: '/images/product/chicken-noodle.jpg',
    category: 'Food'
  },
  {
    id: '3',
    name: 'Meatball',
    price: 17000,
    costPrice: 11000,
    stock: 45,
    image: '/images/product/meatball.jpg',
    category: 'Food'
  }
])

const categories = ref(['Food', 'Beverage', 'Desserts'])
const searchQuery = ref('')
const selectedCategory = ref('')
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const showDeleteModal = ref(false)
const newCategory = ref('')
const editingProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)

// Product form
const productForm = ref<Omit<Product, 'id'>>({
  name: '',
  price: 0,
  costPrice: 0,
  stock: 0,
  image: '',
  category: ''
})

// Computed
const filteredProducts = computed(() => {
  return products.value
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (selectedCategory.value ? product.category === selectedCategory.value : true)
    )
})

// Methods
const openAddProductModal = () => {
  editingProduct.value = null
  productForm.value = {
    name: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    image: '',
    category: ''
  }
  showProductModal.value = true
}

const openCategoryModal = () => {
  showCategoryModal.value = true
  newCategory.value = ''
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showProductModal.value = true
}

const deleteProduct = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    const index = products.value.findIndex(p => p.id === productToDelete.value!.id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }
  showDeleteModal.value = false
  productToDelete.value = null
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const saveProduct = () => {
  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...productForm.value,
      }
    }
  } else {
    // Add new product
    products.value.push({
      id: String(Date.now()),
      ...productForm.value,
    })
  }
  showProductModal.value = false
}

const addCategory = () => {
  if (newCategory.value && !categories.value.includes(newCategory.value)) {
    categories.value.push(newCategory.value)
    newCategory.value = ''
  }
}

const deleteCategory = (category: string) => {
  const index = categories.value.indexOf(category)
  if (index !== -1) {
    categories.value.splice(index, 1)
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

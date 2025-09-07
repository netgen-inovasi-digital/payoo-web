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

// Form states
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const isEditing = ref(false)
const formError = ref('')

// Category state
const categories = ref(['Makanan', 'Minuman'])
const newCategory = ref('')

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
  },
  {
    id: 3,
    name: 'Hotdog',
    category: 'Makanan',
    sellingPrice: '15.000',
    costPrice: '10.000',
    stock: 10,
    image: '/images/product/hotdog.jpg'
  },
  {
    id: 4,
    name: 'Kebab',
    category: 'Makanan',
    sellingPrice: '15.000',
    costPrice: '10.000',
    stock: 10,
    image: '/images/product/kebab.jpg'
  },
  {
    id: 5,
    name: 'Sandwich',
    category: 'Makanan',
    sellingPrice: '15.000',
    costPrice: '10.000',
    stock: 10,
    image: '/images/product/sandwich.jpg'
  }
])

// Form handlers
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

const removeCategory = (category: string) => {
  categories.value = categories.value.filter(c => c !== category)
}

const deleteProduct = (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter(p => p.id !== id)
  }
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
              @click="removeCategory(category)"
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
                  <img :src="product.image" alt="" class="w-12 h-12 object-cover rounded"/>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.category }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.sellingPrice }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">Rp{{ product.costPrice }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.stock }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button @click="deleteProduct(product.id)" class="text-red-500">
                      <span class="sr-only">Delete</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="openEditProduct(product)" class="text-blue-500">
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
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}</h3>
        
        <div class="space-y-4">
          <!-- Product Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
            <div class="flex items-center gap-4">
              <img 
                v-if="productForm.imagePreview"
                :src="productForm.imagePreview" 
                alt="Preview"
                class="w-24 h-24 object-cover rounded"
              />
              <label class="cursor-pointer bg-gray-50 border rounded-lg px-4 py-2">
                <span class="text-sm text-gray-600">Upload Foto</span>
                <input 
                  type="file" 
                  class="hidden" 
                  accept="image/*"
                  @change="handleImageUpload"
                />
              </label>
            </div>
          </div>

          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input
              v-model="productForm.name"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              v-model="productForm.category"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Pilih Kategori</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Prices -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Jual</label>
              <input
                v-model="productForm.sellingPrice"
                type="text"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Harga Modal</label>
              <input
                v-model="productForm.costPrice"
                type="text"
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stok</label>
            <input
              v-model="productForm.stock"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="showProductModal = false"
            class="px-4 py-2 text-gray-600 border rounded-lg"
          >
            Batal
          </button>
          <button 
            @click="saveProduct"
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            {{ isEditing ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">Tambah Kategori</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
          <input
            v-model="newCategory"
            type="text"
            class="w-full px-3 py-2 border rounded-lg mb-4"
          />
          
          <p v-if="formError" class="text-red-500 text-sm mb-4">{{ formError }}</p>

          <div class="flex justify-end gap-3">
            <button 
              @click="showCategoryModal = false"
              class="px-4 py-2 text-gray-600 border rounded-lg"
            >
              Batal
            </button>
            <button 
              @click="saveCategory"
              class="px-4 py-2 bg-emerald-500 text-white rounded-lg"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

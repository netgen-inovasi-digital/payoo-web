<template>
  <AdminLayout>
    <div class="container mx-auto p-4 sm:p-6 mb-[calc(100vh-220px)] lg:mb-0">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <!-- Left side - Orders and Products -->
        <div class="col-span-1 lg:col-span-8">

          <!-- Category and Products -->
          <div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 class="text-2xl font-semibold">Produk</h2>
              <div class="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <button @click="clearCategoryFilter" :class="[
                  'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-gray-50 whitespace-nowrap',
                  selectedCategory === null
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-300 text-gray-600'
                ]">
                  Semua Kategori
                </button>
                
                <!-- Loading Categories -->
                <div v-if="loading" class="flex gap-2">
                  <div class="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 animate-pulse">
                    <div class="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                  <div class="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 animate-pulse">
                    <div class="h-4 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                <!-- Categories List -->
                <button v-else v-for="category in categories" :key="category.id" @click="filterByCategory(category.id)" :class="[
                  'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-brand-50 whitespace-nowrap',
                  selectedCategory === category.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-brand-500 text-brand-600'
                ]">
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-[40vh] sm:pb-0 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
              <!-- Loading State with Skeleton -->
              <template v-if="loading">
                <div v-for="n in 6" :key="n" class="bg-white rounded-lg p-3 sm:p-4 shadow animate-pulse">
                  <div class="w-full h-28 md:h-36 lg:h-40 bg-gray-200 rounded-lg mb-2 sm:mb-3"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="flex justify-between items-center">
                      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- No Products State -->
              <div v-else-if="filteredProducts.length === 0" class="col-span-2 lg:col-span-3 text-center py-12">
                <div class="text-gray-400 mb-2">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l3-3 3 3v12"/>
                  </svg>
                </div>
                <p class="text-gray-500 font-medium mb-1">Tidak ada produk</p>
                <p class="text-gray-400 text-sm">
                  {{ selectedCategory ? 'Tidak ada produk di kategori ini' : 'Belum ada produk yang tersedia' }}
                </p>
              </div>

              <!-- Products List -->
              <div v-else v-for="product in filteredProducts" :key="product.id"
                class="bg-white rounded-lg p-3 sm:p-4 shadow relative">
                <button @click="addToCart(product)"
                  :disabled="cartLoading === product.id"
                  class="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                  <svg v-if="cartLoading === product.id" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-else class="text-xl">+</span>
                </button>

                <img :src="product.photo || '/images/product/default.jpg'" :alt="product.name" class="w-full h-28 md:h-36 lg:h-40 object-cover rounded-lg mb-2 sm:mb-3">
                <h3 class="font-medium mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">{{ product.name }}</h3>
                <div class="flex justify-between items-center">
                  <span class="text-emerald-500 font-medium text-sm sm:text-base">{{ formatCurrency(product.selling_price) }}</span>
                  <span class="text-gray-500 text-xs sm:text-sm">/ Pcs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Right side - Cart -->
        <div class="col-span-1 lg:col-span-4 fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto z-50 sm:z-auto">
          <div class="bg-white rounded-none sm:rounded-lg p-4 sm:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:shadow sm:sticky sm:top-6">
            <h2 class="text-xl font-semibold mb-4">Pesanan Anda</h2>

            <!-- Scrollable content area (keeps sheet fixed on mobile) -->
            <!-- handle for mobile sheet -->
            <div class="sm:hidden w-full flex justify-center mb-2">
              <div class="w-10 h-1.5 rounded-full bg-gray-200"></div>
            </div>

            <div class="space-y-4 mb-4 max-h-[30vh] sm:max-h-none overflow-y-auto">
              <!-- Cart Items -->
              <div class="space-y-4 mb-6">
              <!-- Empty Cart Message -->
              <div v-if="cartItems.length === 0" class="text-center py-8">
                <div class="text-gray-400 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">Silahkan pilih produk</p>
                <p class="text-gray-400 text-sm">Pilih produk dari menu sebelah kiri</p>
              </div>

              <!-- Cart Items List -->
              <div v-else v-for="item in cartItems" :key="item.product.id" class="flex items-start gap-3 p-3 border rounded-lg">
                <img :src="item.product.photo || '/images/product/default.jpg'" :alt="item.product.name"
                  class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0" />

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3">
                    <h4 class="font-medium text-sm md:text-base truncate">{{ item.product.name }}</h4>
                    <div class="text-emerald-600 font-medium text-sm md:text-base">{{ formatCurrency(item.product.selling_price) }}</div>
                  </div>

                  <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <button @click="updateQuantity(item.product.id, false)" aria-label="decrease quantity"
                        class="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50">
                        -
                      </button>
                      <span class="px-3 text-sm md:text-base">{{ item.quantity }}</span>
                      <button @click="updateQuantity(item.product.id, true)" aria-label="increase quantity"
                        class="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50">
                        +
                      </button>
                    </div>

                    <button @click="removeFromCart(item.product.id)" class="text-red-500 text-sm md:text-base">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
              </div>

              <!-- Inputs -->
              <div v-if="cartItems.length > 0" class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran<span class="text-error-500"> *</span></label>
                <select v-model="orderForm.payment_method"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Pilih metode pembayaran</option>
                  <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                    {{ method.name }}
                  </option>
                </select>
              </div>
              <div v-if ="orderForm.payment_method === 'cash'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Dibayar<span class="text-error-500"> *</span></label>
                <input type="number" v-model="orderForm.amount_paid"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg',
                    orderForm.payment_method === 'cash' && (!orderForm.amount_paid || orderForm.amount_paid < total)
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500'
                  ]"
                  placeholder="Masukkan jumlah yang dibayar..." />
                <div v-if="orderForm.payment_method === 'cash' && (!orderForm.amount_paid || orderForm.amount_paid <= 0)" class="text-red-500 text-sm mt-1">
                  Jumlah dibayar harus diisi
                </div>
                <div v-else-if="orderForm.payment_method === 'cash' && orderForm.amount_paid > 0 && orderForm.amount_paid < total" class="text-red-500 text-sm mt-1">
                  Jumlah dibayar minimal {{ formatCurrency(total) }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea v-model="orderForm.notes" rows="2"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan catatan untuk pesanan..."></textarea>
              </div>
              </div>

              <!-- Order Summary -->
              <div v-if="cartItems.length > 0" class="space-y-2 mb-6">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div v-if="orderForm.payment_method === 'cash' && orderForm.amount_paid >= total" class="flex justify-between">
                <span>Kembalian</span>
                <span>{{ formatCurrency(orderForm.amount_paid - total) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Pajak</span>
                <span>{{ formatCurrency(tax) }}</span>
              </div>
              <div class="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span class="text-emerald-500">{{ formatCurrency(total) }}</span>
              </div>
              </div>
            </div>

            <!-- Checkout Button (kept visible at bottom of sheet) -->
            <div class="mt-2">
              <button v-if="cartItems.length > 0" @click="checkout"
                class="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="cartItems.length === 0 || !isFormValid || isProcessingPayment">
                <svg v-if="isProcessingPayment" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="isProcessingPayment">Memproses...</span>
                <span v-else>Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-sm p-4 sm:p-6 text-center mx-4 sm:mx-0">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p class="text-gray-600 mb-4">Your order has been processed successfully.</p>
        <div class="text-sm text-emerald-500">
          Order #{{ orders[orders.length - 1]?.id }} has been created
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { orderService, type OrderCreatePayload } from '@/api/services/order.service'
import { productService } from '@/api/services/product.service'
import { categoryService } from '@/api/services/category.service'
import type { Product } from '@/api/types/product.types'
import type { Category } from '@/api/types/category.types'
import type { Order } from '@/api/types/order.types'
import { useAlert } from '@/composables/useAlert'
import { useFormatters } from '@/composables/useFormatters'

defineOptions({
  name: 'OrderPOS'
})

const alert = useAlert()
const { formatCurrency } = useFormatters()

interface OrderItem {
  product: Product;
  quantity: number;
}

// Modal states
const showSuccessModal = ref(false)
const isProcessingPayment = ref(false)
const loading = ref(false)

// Payment methods
const paymentMethods = [
  { id: 'cash', name: 'Cash'},
  { id: 'gopay', name: 'GoPay'},
  { id: 'ovo', name: 'OVO'},
  { id: 'dana', name: 'DANA'},
  { id: 'qris', name: 'QRIS'}
]

// Data
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const orders = ref<Order[]>([])

// Cart state
const cartItems = ref<OrderItem[]>([])
const selectedCategory = ref<number | null>(null)

// Order form
const orderForm = ref({
  payment_method: '',
  notes: '',
  amount_paid: 0
})

// Form validation
const isFormValid = computed(() => {
  const hasPaymentMethod = orderForm.value.payment_method !== ''
  
  // If payment method is cash, amount_paid must be greater than or equal to total
  if (orderForm.value.payment_method === 'cash') {
    return hasPaymentMethod && orderForm.value.amount_paid >= total.value
  }
  
  return hasPaymentMethod
})

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await productService.getProducts()
    products.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    alert.error('Error!', 'Gagal mengambil data produk.')
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    if (response.status === 'success') {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    alert.error('Error!', 'Gagal mengambil data kategori.')
  }
}

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = selectedCategory.value === null || product.category_id === selectedCategory.value
    return matchesCategory
  })
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0)
})

const tax = computed(() => 0)
const total = computed(() => subtotal.value + tax.value)

// Filter methods
const filterByCategory = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

const clearCategoryFilter = () => {
  selectedCategory.value = null
}

// Cart operation loading
const cartLoading = ref<number | null>(null)

// Methods
const addToCart = async (product: Product) => {
  cartLoading.value = product.id
  
  // Small delay to show loading (you can remove this in production)
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const existingItem = cartItems.value.find(item => item.product.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({ product, quantity: 1 })
  }
  
  cartLoading.value = null
}

const removeFromCart = (productId: number) => {
  const index = cartItems.value.findIndex(item => item.product.id === productId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const updateQuantity = (productId: number, increment: boolean) => {
  const item = cartItems.value.find(item => item.product.id === productId)
  if (item) {
    if (increment) {
      item.quantity++
    } else if (item.quantity > 0) {
      item.quantity--
      if (item.quantity === 0) {
        removeFromCart(productId)
      }
    }
  }
}

const checkout = async () => {
  if (cartItems.value.length === 0) return
  if (!isFormValid.value) {
    alert.error('Error!', 'Silahkan pilih metode pembayaran terlebih dahulu')
    return
  }

  // Konfirmasi pesanan dengan Sweet Alert
  const confirmed = await alert.confirm({
    title: 'Konfirmasi Pesanan',
    text: `Total pesanan: ${formatCurrency(total.value)}\nMetode pembayaran: ${paymentMethods.find(m => m.id === orderForm.value.payment_method)?.name || orderForm.value.payment_method}\nApakah Anda yakin ingin melanjutkan?`,
    icon: 'question',
    confirmButtonText: 'Ya, Proses!',
    cancelButtonText: 'Batal'
  })

  if (confirmed) {
    await processPayment()
  }
}

const processPayment = async () => {
  if (!orderForm.value.payment_method || !isFormValid.value) return

  isProcessingPayment.value = true

  try {
    // Calculate payment details
    let finalAmountPaid: number
    let changeMoney: number

    if (orderForm.value.payment_method === 'cash') {
      // For cash payment, use user input or default to total
      finalAmountPaid = orderForm.value.amount_paid || total.value
      changeMoney = finalAmountPaid - total.value
    } else {
      // For non-cash payments, amount paid equals total (no change)
      finalAmountPaid = total.value
      changeMoney = 0
    }

    // Prepare order data for API
    const orderData: OrderCreatePayload = {
      status: 'pending',
      notes: orderForm.value.notes,
      total: total.value,
      amount_paid: finalAmountPaid,
      change_money: changeMoney > 0 ? changeMoney : 0,
      tax: tax.value,
      payment_method: orderForm.value.payment_method,
      order_items: cartItems.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.selling_price
      }))
    }

    // Create order via API
    const response = await orderService.createOrder(orderData)

    // Add to local orders list (use the actual order from API response)
    orders.value.push(response.data)

    // Show success
    showSuccessModal.value = true

    // Reset states
    orderForm.value = {
      payment_method: '',
      notes: '',
      amount_paid: 0
    }
    cartItems.value = []

    // Show success message
    alert.success('Berhasil!', 'Order berhasil dibuat!')

    // Auto close success modal after 2 seconds
    setTimeout(() => {
      showSuccessModal.value = false
    }, 2000)

  } catch (error) {
    console.error('Payment failed:', error)
    alert.error('Error!', 'Gagal memproses pembayaran.')
  } finally {
    isProcessingPayment.value = false
  }
}

// Initialize data
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchProducts(),
      fetchCategories()
    ])
  } catch (error) {
    console.error('Failed to initialize data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>

.sticky {
  position: sticky;
  top: 1.5rem;
}
</style>

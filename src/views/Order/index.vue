<template>
  <AdminLayout>
    <div class="container mx-auto p-6">
      <div class="grid grid-cols-12 gap-6">
        <!-- Left side - Orders and Products -->
        <div class="col-span-8">

          <!-- Category and Products -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-semibold">Produk</h2>
              <div class="flex gap-2">
                <button @click="clearCategoryFilter" :class="[
                  'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-gray-50',
                  selectedCategory === null
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-300 text-gray-600'
                ]">
                  Semua Kategori
                </button>
                <button v-for="category in categories" :key="category.id" @click="filterByCategory(category.id)" :class="[
                  'px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-brand-50',
                  selectedCategory === category.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-brand-500 text-brand-600'
                ]">
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
              <div v-for="product in filteredProducts" :key="product.id"
                class="bg-white rounded-lg p-4 shadow relative">
                <button @click="addToCart(product)"
                  class="absolute top-4 right-4 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  <span class="text-xl">+</span>
                </button>

                <img :src="product.photo || '/images/product/default.jpg'" :alt="product.name" class="w-full h-40 object-cover rounded-lg mb-3">
                <h3 class="font-medium mb-2">{{ product.name }}</h3>
                <div class="flex justify-between items-center">
                  <span class="text-emerald-500 font-medium">{{ formatCurrency(product.selling_price) }}</span>
                  <span class="text-gray-500 text-sm">/ Pcs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Right side - Cart -->
        <div class="col-span-4">
          <div class="bg-white rounded-lg p-6 shadow sticky top-6">
            <h2 class="text-xl font-semibold mb-4">Your Order</h2>

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
              <div v-else v-for="item in cartItems" :key="item.product.id" class="flex items-center gap-4">
                <img :src="item.product.photo || '/images/product/default.jpg'" :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                  <h4 class="font-medium">{{ item.product.name }}</h4>
                  <div class="flex justify-between items-center">
                    <span>{{ formatCurrency(item.product.selling_price) }}</span>
                    <button @click="removeFromCart(item.product.id)" class="text-red-500 text-sm">
                      Hapus
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="updateQuantity(item.product.id, false)"
                    class="w-6 h-6 rounded-full border flex items-center justify-center">
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.product.id, true)"
                    class="w-6 h-6 rounded-full border flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Inputs -->
            <div v-if="cartItems.length > 0" class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select v-model="orderForm.payment_method"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Pilih metode pembayaran</option>
                  <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                    {{ method.name }}
                  </option>
                </select>
              </div>
              <div v-if ="orderForm.payment_method === 'cash'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Dibayar</label>
                <input type="number" v-model="orderForm.amount_paid"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan jumlah yang dibayar..." />
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
              <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ formatCurrency(tax) }}</span>
              </div>
              <div class="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span class="text-emerald-500">{{ formatCurrency(total) }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button v-if="cartItems.length > 0" @click="checkout"
              class="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="cartItems.length === 0 || !isFormValid">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center">
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
  return orderForm.value.payment_method !== ''
})

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await productService.getProducts()
    products.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    alert.error('Error!', 'Gagal mengambil data produk.')
  } finally {
    loading.value = false
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

// Methods
const addToCart = (product: Product) => {
  const existingItem = cartItems.value.find(item => item.product.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({ product, quantity: 1 })
  }
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
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 1.5rem;
}
</style>

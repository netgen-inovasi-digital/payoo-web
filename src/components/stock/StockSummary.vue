<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Stock Summary</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total Stock In -->
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">Stock Masuk</p>
            <p class="text-2xl font-semibold text-green-900">{{ totalStockIn }}</p>
          </div>
        </div>
      </div>

      <!-- Total Stock Out -->
      <div class="bg-red-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">Stock Keluar</p>
            <p class="text-2xl font-semibold text-red-900">{{ totalStockOut }}</p>
          </div>
        </div>
      </div>

      <!-- Net Stock -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800">Stock Bersih</p>
            <p class="text-2xl font-semibold text-blue-900">{{ netStock }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="mt-6">
      <h4 class="text-md font-medium text-gray-900 mb-3">Transaksi Terbaru</h4>
      <div class="space-y-2">
        <div 
          v-for="stock in recentStocks" 
          :key="stock.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center">
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-3',
              stock.type === 'in' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ stock.type === 'in' ? 'IN' : 'OUT' }}
            </span>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ stock.product_name }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(stock.date) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ stock.quantity }}</p>
            <p class="text-xs text-gray-500">
              {{ stock.buy_price ? formatCurrency(stock.buy_price) : '-' }}
            </p>
          </div>
        </div>
        
        <div v-if="recentStocks.length === 0" class="text-center py-4 text-gray-500">
          Belum ada transaksi
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Stock } from '@/api/types/stock.types'

interface Props {
  stocks: Stock[]
}

const props = defineProps<Props>()

// Computed
const totalStockIn = computed(() => {
  return props.stocks
    .filter(stock => stock.type === 'in')
    .reduce((total, stock) => total + stock.quantity, 0)
})

const totalStockOut = computed(() => {
  return props.stocks
    .filter(stock => stock.type === 'out')
    .reduce((total, stock) => total + stock.quantity, 0)
})

const netStock = computed(() => {
  return totalStockIn.value - totalStockOut.value
})

const recentStocks = computed(() => {
  return props.stocks
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount)
}
</script>
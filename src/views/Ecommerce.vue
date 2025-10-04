<template>
  <admin-layout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <svg class="h-6 w-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">Memuat dashboard...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button @click="fetchDashboardData" class="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
        Coba Lagi
      </button>
    </div>

    <div v-else class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Store Profile Card -->
      <div class="col-span-12">
        <store-profile />
      </div>

      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics :metrics="summaryMetrics" />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale 
          :chart-data="monthlyRevenueChartData" 
          :month-labels="monthLabels"
        />
      </div>

      <div class="col-span-12">
        <statistics-chart 
          :chart-data="statisticsChartData"
          :month-labels="monthLabels"
          :note="statistics?.note"
        />
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import StoreProfile from '../components/ecommerce/StoreProfile.vue'
import { useDashboard } from '@/composables/useDashboard'

const {
  loading,
  error,
  summaryMetrics,
  statistics,
  monthlyRevenueChartData,
  statisticsChartData,
  monthLabels,
  fetchDashboardData
} = useDashboard()

defineOptions({
  name: 'EcommerceDashboard'
})

onMounted(() => {
  fetchDashboardData()
})
</script>

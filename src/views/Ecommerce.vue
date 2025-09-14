<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Store Profile Card -->
      <div class="col-span-12">
        <store-profile />
      </div>

      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import StoreProfile from '../components/ecommerce/StoreProfile.vue'

defineOptions({
  name: 'EcommerceDashboard'
})
</script>

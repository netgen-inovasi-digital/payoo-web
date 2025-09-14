<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
    <!-- Customers Card -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] h-[250px] sm:px-6 sm:pt-6">
      <div class="flex mb-4">
        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      </div>
      <div class="text-sm text-gray-500 mb-4">Pelanggan</div>
      <div class="text-2xl font-semibold mb-8">3,782</div>
      <div class="flex flex-col text-sm text-green-500 gap-1">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-2" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0l6 8H0z" />
          </svg>
          <span>11.01%</span>
        </div>
        <span class="text-gray-500">vs. bulan lalu</span>
      </div>
    </div>

    <!-- Orders Card -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] h-[250px] sm:px-6 sm:pt-6">
      <div class="flex mb-4">
        <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
          </svg>
        </div>
      </div>
      <div class="text-sm text-gray-500 mb-4">Pesanan</div>
      <div class="text-2xl font-semibold mb-8">5,359</div>
      <div class="flex flex-col text-sm text-red-500 gap-1">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-2 transform rotate-180" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0l6 8H0z" />
          </svg>
          <span>9.05%</span>
        </div>
        <span class="text-gray-500">vs. bulan lalu</span>
      </div>
    </div>

    <!-- Total Produk Card -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] h-[250px] sm:px-6 sm:pt-6">
      <div class="flex mb-4">
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fill-rule="evenodd"
              d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <div class="text-sm text-gray-500 mb-4">Total Produk</div>
      <div class="text-2xl font-semibold mb-8">24</div>
      <div class="flex flex-col text-sm text-green-500 gap-1">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-2" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0l6 8H0z" />
          </svg>
          <span>5.27%</span>
        </div>
        <span class="text-gray-500">vs. bulan lalu</span>
      </div>
    </div>

    <!-- Total Kategori Card -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] h-[250px] sm:px-6 sm:pt-6">
      <div class="flex mb-4">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M2 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 5a1 1 0 100 2h14a1 1 0 100-2H3z"
              clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <div class="text-sm text-gray-500 mb-4">Total Kategori</div>
      <div class="text-2xl font-semibold mb-8">8</div>
      <div class="flex flex-col text-sm text-green-500 gap-1">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-2" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0l6 8H0z" />
          </svg>
          <span>2.15%</span>
        </div>
        <span class="text-gray-500">vs. bulan lalu</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EcommerceMetrics'
})
</script>
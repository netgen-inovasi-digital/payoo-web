<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Statistik</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          {{ note }}
        </p>
      </div>

      <div class="relative">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            v-for="option in options"
            :key="option.value"
            @click="selected = option.value"
            :class="[
              selected === option.value
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <VueApexCharts 
          v-if="chartReady"
          type="area" 
          height="310" 
          :options="chartOptions" 
          :series="series" 
        />
        <div v-else class="flex items-center justify-center h-[310px]">
          <div class="text-gray-500">Loading chart...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  chartData?: {
    orders: number[]
    itemsSold: number[]
  }
  monthLabels?: string[]
  note?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => ({ orders: [], itemsSold: [] }),
  monthLabels: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  note: 'Berdasarkan total pesanan selesai.'
})

const options = [
  { value: 'optionOne', label: 'Perbulan' },
  // { value: 'optionTwo', label: 'Hari' },
  // { value: 'optionThree', label: 'Tahun' },
]

const selected = ref('optionOne')
const chartReady = ref(false)

onMounted(async () => {
  await nextTick()
  chartReady.value = true
})

const series = ref([
  {
    name: 'Pesanan',
    data: props.chartData.orders.length > 0 ? props.chartData.orders : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Barang Terjual',
    data: props.chartData.itemsSold.length > 0 ? props.chartData.itemsSold : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
])

// Watch for prop changes and update chart data
watch(() => props.chartData, (newData) => {
  if (newData) {
    series.value = [
      {
        name: 'Pesanan',
        data: newData.orders.length > 0 ? newData.orders : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'Barang Terjual',
        data: newData.itemsSold.length > 0 ? newData.itemsSold : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  }
}, { immediate: true })

const chartOptions = ref({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#2fa36b', '#9CB9FF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  fill: {
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2, 2],
  },
  markers: {
    size: 0,
  },
  labels: {
    show: false,
    position: 'top',
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  xaxis: {
    type: 'category',
    categories: props.monthLabels,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
})

watch(() => props.monthLabels, (newLabels) => {
  if (newLabels && newLabels.length > 0) {
    chartOptions.value.xaxis.categories = newLabels
  }
}, { immediate: true })
</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>

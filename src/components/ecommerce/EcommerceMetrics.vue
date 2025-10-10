<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-6">
    <!-- Metric Cards -->
    <div
      v-for="(metric, index) in displayMetrics"
      :key="metric.key"
      class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-5 dark:border-gray-800 dark:bg-white/[0.03] min-h-[220px] sm:px-5 sm:pt-5 sm:pb-6 min-w-0"
    >
      <!-- Icon -->
      <div class="flex mb-3 flex-shrink-0">
        <div :class="getIconBg(index)" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <component :is="getIcon(metric.key)" :class="getIconColor(index)" class="w-5 h-5" />
        </div>
      </div>
      
      <!-- Label -->
      <div class="text-sm text-gray-500 mb-3 break-words line-clamp-2 min-w-0">
        {{ metric.label }}
      </div>
      
      <!-- Value -->
      <div class="text-xl sm:text-2xl font-semibold mb-auto pb-4 min-w-0 break-words overflow-wrap-anywhere">
        {{ formatValue(metric.key, metric.total) }}
      </div>
      
      <!-- Growth Stats -->
      <div 
        class="flex flex-col text-sm gap-1 min-w-0 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800" 
        :class="metric.direction === 'up' ? 'text-green-500' : 'text-red-500'"
      >
        <div class="flex items-center flex-wrap gap-1">
          <svg 
            class="w-3 h-3 flex-shrink-0" 
            :class="{ 'transform rotate-180': metric.direction === 'down' }" 
            viewBox="0 0 12 12" 
            fill="currentColor"
          >
            <path d="M6 0l6 8H0z" />
          </svg>
          <span class="font-medium">{{ metric.growth_pct.toFixed(2) }}%</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 break-words">
          {{ metric.compare_text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { SummaryMetric } from '@/api/types/dashboard.types'
import { useFormatters } from '@/composables/useFormatters'

interface Props {
  metrics?: SummaryMetric[]
}

const props = withDefaults(defineProps<Props>(), {
  metrics: () => []
})

const { formatCurrency } = useFormatters()

// Create a computed property that ensures we always have 4 metrics to display
const displayMetrics = computed(() => {
  // Default metrics with placeholder data
  const defaultMetrics: SummaryMetric[] = [
    {
      key: 'transactions',
      label: 'Transaksi',
      total: 0,
      growth_pct: 0,
      direction: 'up',
      compare_text: 'vs. bulan lalu'
    },
    {
      key: 'gross_revenue',
      label: 'Pendapatan Kotor',
      total: 0,
      growth_pct: 0,
      direction: 'up',
      compare_text: 'vs. bulan lalu'
    },
    {
      key: 'items_sold',
      label: 'Barang Terjual',
      total: 0,
      growth_pct: 0,
      direction: 'up',
      compare_text: 'vs. bulan lalu'
    },
    {
      key: 'aov',
      label: 'Rata-rata Transaksi',
      total: 0,
      growth_pct: 0,
      direction: 'up',
      compare_text: 'vs. bulan lalu'
    }
  ]

  // If we have props metrics, use them, otherwise use defaults
  if (props.metrics && props.metrics.length > 0) {
    return props.metrics.slice(0, 4) // Limit to 4 metrics
  }
  
  return defaultMetrics
})

const formatValue = (key: string, value: number): string => {
  switch (key) {
    case 'gross_revenue':
    case 'aov':
      return formatCurrency(value)
    default:
      return value.toLocaleString()
  }
}

const getIcon = (key: string) => {
  const icons = {
    transactions: () => h('svg', {
      viewBox: '0 0 20 20',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z'
      })
    ]),
    gross_revenue: () => h('svg', {
      viewBox: '0 0 20 20',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z'
      }),
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z',
        'clip-rule': 'evenodd'
      })
    ]),
    items_sold: () => h('svg', {
      viewBox: '0 0 20 20',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4z'
      }),
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',
        'clip-rule': 'evenodd'
      })
    ]),
    aov: () => h('svg', {
      viewBox: '0 0 20 20',
      fill: 'currentColor'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd'
      })
    ])
  }
  
  return icons[key as keyof typeof icons] || icons.transactions
}

const getIconBg = (index: number): string => {
  const backgrounds = [
    'bg-orange-100',
    'bg-emerald-100', 
    'bg-indigo-100',
    'bg-blue-100'
  ]
  return backgrounds[index % backgrounds.length]
}

const getIconColor = (index: number): string => {
  const colors = [
    'text-orange-600',
    'text-emerald-600',
    'text-indigo-600', 
    'text-blue-600'
  ]
  return colors[index % colors.length]
}

defineOptions({
  name: 'EcommerceMetrics'
})
</script>

<style scoped>
/* Fallback untuk overflow-wrap jika Tailwind tidak support */
.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Line clamp untuk label - fallback manual jika tidak support */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
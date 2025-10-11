import { ref, computed } from 'vue'
import { dashboardService } from '@/api/services/dashboard.service'
import type { DashboardData } from '@/api/types/dashboard.types'

const dashboardData = ref<DashboardData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useDashboard = () => {
  const fetchDashboardData = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardService.getDashboardData()
      
      if (response.status === 'success' && response.data) {
        dashboardData.value = response.data
      } else {
        error.value = 'Data dashboard tidak tersedia'
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      error.value = 'Gagal memuat data dashboard. Silakan coba lagi.'
    } finally {
      loading.value = false
    }
  }

  // Computed properties for easy access to specific data
  const summaryMetrics = computed(() => dashboardData.value?.summary || [])
  const monthlySales = computed(() => dashboardData.value?.monthly_sales || [])
  const statistics = computed(() => dashboardData.value?.statistics || null)

  // Format data for charts with safe fallbacks
  const monthlyRevenueChartData = computed(() => {
    if (!dashboardData.value?.monthly_sales || !Array.isArray(dashboardData.value.monthly_sales)) return []
    return dashboardData.value.monthly_sales.map(item => item?.revenue ?? 0)
  })

  const monthlyTransactionsChartData = computed(() => {
    if (!dashboardData.value?.monthly_sales || !Array.isArray(dashboardData.value.monthly_sales)) return []
    return dashboardData.value.monthly_sales.map(item => item?.transactions ?? 0)
  })

  const statisticsChartData = computed(() => {
    if (!dashboardData.value?.statistics?.series || !Array.isArray(dashboardData.value.statistics.series)) {
      return { orders: [], itemsSold: [] }
    }
    
    return {
      orders: dashboardData.value.statistics.series.map(item => item?.orders ?? 0),
      itemsSold: dashboardData.value.statistics.series.map(item => item?.items_sold ?? 0)
    }
  })

  const monthLabels = computed(() => {
    if (!dashboardData.value?.monthly_sales || !Array.isArray(dashboardData.value.monthly_sales)) return []
    return dashboardData.value.monthly_sales.map(item => item?.month ?? '')
  })

  return {
    // State
    dashboardData,
    loading,
    error,
    
    // Actions
    fetchDashboardData,
    
    // Computed data
    summaryMetrics,
    monthlySales,
    statistics,
    monthlyRevenueChartData,
    monthlyTransactionsChartData,
    statisticsChartData,
    monthLabels
  }
}
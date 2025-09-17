import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'

import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('ApexChart', VueApexCharts)

app.mount('#app')

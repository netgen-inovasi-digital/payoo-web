import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true
      },
    },
    {
      path: '/laporan',
      name: 'Laporan',
      component: () => import('../views/Riwayat/index.vue'),
      meta: {
        title: 'Laporan',
        requiresAuth: true
      },
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/Order/index.vue'),
      meta: {
        title: 'Order',
        requiresAuth: true
      },
    },
    {
      path: '/produk',
      name: 'Produk',
      component: () => import('../views/Produk/index.vue'),
      meta: {
        title: 'Produk',
        requiresAuth: true
      },
    },
    {
      path: '/komposisi',
      name: 'Komposisi',
      component: () => import('../views/Komposisi/index.vue'),
      meta: {
        title: 'Komposisi',
        requiresAuth: true
      },
    },
    {
      path: '/pembelian',
      name: 'Pembelian',
      component: () => import('../views/Pembelian/index.vue'),
      meta: {
        title: 'Pembelian',
        requiresAuth: true
      },
    },
    {
      path: '/stok',
      name: 'Stok',
      component: () => import('../views/Stok/index.vue'),
      meta: {
        title: 'Stok',
        requiresAuth: true
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
        requiresGuest: true
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
        requiresGuest: true
      },
    },
    {
      path: '/signup-shop',
      name: 'SignupShop',
      component: () => import('../views/Auth/SignupShop.vue'),
      meta: {
        title: 'Create Shop',
        requiresAuth: true
      },
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('../views/Errors/Forbidden.vue'),
      meta: {
        title: 'Access Forbidden'
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/signin')
    return
  }
  
  // Check if route is for guests only
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  // Get current user if authenticated but no user data
  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.getCurrentUser()
  }
  
  document.title = `PAYOO ${to.meta.title} | Owner Dashboard`
  next()
})

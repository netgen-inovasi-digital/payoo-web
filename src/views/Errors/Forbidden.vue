<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          403 - Access Forbidden
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          You don't have permission to access this resource.
        </p>
      </div>
      <div class="text-center">
        <router-link 
          to="/"
          class="font-medium text-brand-600 hover:text-brand-500"
        >
          Go back to dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 403 Forbidden page
defineOptions({
  name: 'ForbiddenPage'
})
</script>

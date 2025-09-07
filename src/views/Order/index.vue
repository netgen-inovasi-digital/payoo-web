<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />

        <div class="order-container p-4">
            <!-- Order Header -->
            <div class="flex justify-between mb-4">
                <h2 class="text-xl font-bold">Order Management</h2>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <font-awesome-icon icon="plus" class="mr-2" />
                    New Order
                </button>
            </div>

            <!-- Order List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="order in orders" :key="order.id" class="bg-white p-4 rounded-lg shadow-md">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold">#{{ order.id }}</span>
                        <span :class="getStatusClass(order.status)">
                            {{ order.status }}
                        </span>
                    </div>
                    <div class="mb-2">
                        <font-awesome-icon icon="user" class="mr-2 text-gray-600" />
                        {{ order.customer }}
                    </div>
                    <div class="mb-2">
                        <font-awesome-icon icon="clock" class="mr-2 text-gray-600" />
                        {{ order.date }}
                    </div>
                    <div class="text-xl font-bold mb-2">
                    </div>
                    ${{ order.total.toFixed(2) }}
                </div>
                <div class="flex gap-2">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded">
                        <font-awesome-icon icon="edit" />
                    </button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded">
                        <font-awesome-icon icon="trash" />
                    </button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const currentPageTitle = ref('Orders')

// Sample orders data
const orders = ref([
    {
        id: '001',
        customer: 'John Doe',
        date: '2023-07-20',
        total: 125.50,
        status: 'pending'
    },
    {
        id: '002',
        customer: 'Jane Smith',
        date: '2023-07-20',
        total: 75.25,
        status: 'completed'
    }
])

const getStatusClass = (status: string) => {
    return {
        'pending': 'text-yellow-600 bg-yellow-100 px-2',
        'completed': 'text-green-600 bg-green-100 px-2',
        'canceled': 'text-red-600 bg-red-100 px-2'
    }[status] || 'text-gray-600 bg-gray-100 px-2'
}   
</script>
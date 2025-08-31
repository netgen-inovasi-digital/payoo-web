# API Implementation Guide

This project now includes a complete API integration setup with best practices. Here's what has been implemented:

## ✅ Implementation Status

### 1. **Separation of Concerns** ✅
- API logic separated in `src/api/` directory
- Services layer for different modules (auth, products, dashboard)
- Clean separation between UI and data layer

### 2. **Type Safety** ✅
- Complete TypeScript types in `src/api/types/`
- Strongly typed API responses and request payloads
- Type-safe error handling

### 3. **Centralized Configuration** ✅
- Axios instance with interceptors in `src/api/index.ts`
- Environment-based configuration
- Global request/response handling

### 4. **Error Handling** ✅
- Global error interceptors for API calls
- Automatic token refresh on 401 errors
- User-friendly error messages

### 5. **Authentication** ✅
- Token-based authentication with refresh tokens
- Automatic token storage and retrieval
- Protected routes with auth guards

### 6. **State Management** ✅
- Pinia stores for centralized state management
- Auth store with login/logout functionality
- Products store with CRUD operations

### 7. **Composables** ✅
- Reusable API composable (`useApi`)
- Toast notifications composable
- Modal management composable

### 8. **Route Guards** ✅
- Authentication middleware
- Guest-only routes
- Admin-only access control

### 9. **Environment Variables** ✅
- Development and production configurations
- API base URL configuration

## 📁 Directory Structure

```
src/
├── api/                    # API Layer
│   ├── index.ts           # Axios configuration
│   ├── types/             # TypeScript types
│   │   ├── index.ts       # Common types
│   │   ├── auth.types.ts  # Auth types
│   │   └── product.types.ts # Product types
│   └── services/          # API services
│       ├── auth.service.ts
│       ├── product.service.ts
│       ├── dashboard.service.ts
│       └── index.ts
├── stores/                # Pinia stores
│   ├── index.ts          # Store setup
│   ├── auth.store.ts     # Authentication state
│   └── products.store.ts # Products state
├── composables/          # Vue composables
│   ├── useApi.ts         # Generic API calls
│   ├── useToast.ts       # Notifications
│   └── useModal.ts       # Modal management
├── router/               # Vue Router
│   ├── index.ts          # Routes configuration
│   └── guards.ts         # Route guards
└── views/
    ├── Products/         # Product CRUD pages
    ├── Auth/            # Authentication pages
    └── Errors/          # Error pages
```

## 🚀 Usage Examples

### Using Auth Store
```typescript
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// Login
await authStore.login({ email, password })

// Check authentication
if (authStore.isAuthenticated) {
  // User is logged in
}

// Logout
await authStore.logout()
```

### Using Product Store
```typescript
import { useProductsStore } from '@/stores/products.store'

const productsStore = useProductsStore()

// Fetch products
await productsStore.fetchProducts(page, limit, filters)

// Create product
await productsStore.createProduct(productData)

// Update product
await productsStore.updateProduct(id, updateData)
```

### Using API Composable
```typescript
import { useApi } from '@/composables/useApi'
import { productService } from '@/api/services'

const { data, loading, error, execute } = useApi(productService.getProducts)

// Execute API call
await execute(1, 10, filters)
```

### Using Toast Notifications
```typescript
import { useToast } from '@/composables/useToast'

const toast = useToast()

toast.success('Operation successful!')
toast.error('Something went wrong')
toast.warning('Warning message')
toast.info('Information message')
```

## 🔧 Environment Setup

1. **Development** (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=TailAdmin Development
```

2. **Production** (`.env.production`)
```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_APP_NAME=TailAdmin
```

## 🛡️ Route Protection

Routes are protected using meta fields:

```typescript
{
  path: '/products',
  component: ProductList,
  meta: {
    requiresAuth: true    // Requires authentication
  }
}

{
  path: '/signin',
  component: Signin,
  meta: {
    requiresGuest: true   // Only for non-authenticated users
  }
}

{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true,
    requiresAdmin: true   // Admin only access
  }
}
```

## 📋 Next Steps

1. **Implement remaining CRUD views**:
   - ProductCreate.vue
   - ProductEdit.vue
   - ProductDetail.vue

2. **Add more services**:
   - User management
   - Order management
   - Settings

3. **Enhance error handling**:
   - Custom error pages
   - Retry mechanisms
   - Offline handling

4. **Add testing**:
   - Unit tests for stores
   - API service tests
   - Component tests

## 🚨 Important Notes

- Replace mock API endpoints with your actual backend URLs
- Implement proper error boundary components
- Add loading states to UI components
- Configure CORS properly on your backend
- Implement proper token refresh mechanism on backend
- Add request/response logging for debugging

This implementation provides a solid foundation for a scalable Vue.js application with proper API integration patterns.

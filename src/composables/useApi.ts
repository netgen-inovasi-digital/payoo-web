import { ref, type Ref } from 'vue'

export function useApi<T>(apiFunction: (...args: unknown[]) => Promise<T>) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (...args: unknown[]) => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await apiFunction(...args)
      return data.value
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

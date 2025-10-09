import { ref, watch, type Ref } from 'vue'

/**
 * Composable untuk debouncing value
 * @param value - Reactive value yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 300ms)
 * @returns Object dengan debouncedValue dan isDebouncing state
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref<T>(value.value as T) as Ref<T>
  const isDebouncing = ref(false)
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // Watch for changes in the original value
  watch(value, (newValue) => {
    isDebouncing.value = true
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
      isDebouncing.value = false
      timeoutId = null
    }, delay)
  }, { immediate: false })

  // Cleanup function
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      isDebouncing.value = false
    }
  }

  // Force update immediately
  const flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      debouncedValue.value = value.value
      isDebouncing.value = false
      timeoutId = null
    }
  }

  return {
    debouncedValue,
    isDebouncing,
    cancel,
    flush
  }
}

/**
 * Composable untuk debouncing function calls
 * @param fn - Function yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 300ms)
 * @returns Debounced function dan utility functions
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T, 
  delay: number = 300
) {
  const isDebouncing = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedFn = (...args: Parameters<T>) => {
    isDebouncing.value = true
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      fn(...args)
      isDebouncing.value = false
      timeoutId = null
    }, delay)
  }

  // Cancel pending execution
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      isDebouncing.value = false
    }
  }

  // Execute immediately
  const flush = (...args: Parameters<T>) => {
    cancel()
    fn(...args)
  }

  return {
    debouncedFn: debouncedFn as T,
    isDebouncing,
    cancel,
    flush
  }
}
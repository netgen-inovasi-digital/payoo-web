import { ref } from 'vue'

export function useModal() {
  const isOpen = ref(false)
  const data = ref<unknown>(null)

  const open = (modalData?: unknown) => {
    data.value = modalData
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    data.value = null
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}

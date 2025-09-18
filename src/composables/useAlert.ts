import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'

export interface AlertOptions {
  title: string
  text?: string
  icon?: SweetAlertIcon
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
}

export function useAlert() {
  
  // Konfirmasi dengan tombol Ya/Tidak
  const confirm = async (options: AlertOptions): Promise<boolean> => {
    const result: SweetAlertResult = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon || 'question',
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor || '#00bc7d',
      cancelButtonColor: options.cancelButtonColor || '#6b7280',
      confirmButtonText: options.confirmButtonText || 'Ya',
      cancelButtonText: options.cancelButtonText || 'Batal'
    })
    
    return result.isConfirmed
  }

  // Alert sukses
  const success = async (title: string, text?: string): Promise<void> => {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#059669'
    })
  }

  // Alert error
  const error = async (title: string, text?: string): Promise<void> => {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#dc2626'
    })
  }

  // Alert warning
  const warning = async (title: string, text?: string): Promise<void> => {
    await Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#f59e0b'
    })
  }

  // Alert info
  const info = async (title: string, text?: string): Promise<void> => {
    await Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#3b82f6'
    })
  }

  // Konfirmasi hapus (preset untuk delete operations)
  const confirmDelete = async (itemName: string, itemType: string = 'item'): Promise<boolean> => {
    return await confirm({
      title: `Hapus ${itemType}?`,
      text: `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626'
    })
  }

  // Konfirmasi save (preset untuk save operations)
  const confirmSave = async (itemName: string, isUpdate: boolean = false): Promise<boolean> => {
    const action = isUpdate ? 'update' : 'simpan'
    const actionText = isUpdate ? 'Update' : 'Simpan'
    
    return await confirm({
      title: `${actionText} ${itemName}?`,
      text: `Apakah Anda yakin ingin ${action} "${itemName}"?`,
      icon: 'question',
      confirmButtonText: `Ya, ${actionText}!`,
      cancelButtonText: 'Batal'
    })
  }

  // Toast notification (non-blocking)
  const toast = {
    success: (message: string) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    },
    error: (message: string) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    },
    warning: (message: string) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    },
    info: (message: string) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    }
  }

  return {
    confirm,
    success,
    error,
    warning,
    info,
    confirmDelete,
    confirmSave,
    toast
  }
}
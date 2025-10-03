/**
 * Composable for common formatting functions
 * Used across the application for consistent formatting
 */
export const useFormatters = () => {
  /**
   * Format date string to Indonesian locale format
   * @param dateString - ISO date string
   * @param includeTime - Whether to include time (default: true)
   * @returns Formatted date string
   */
  const formatDate = (dateString: string, includeTime: boolean = true) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }

    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    return new Date(dateString).toLocaleString('id-ID', options)
  }

  /**
   * Format number to Indonesian currency (Rupiah)
   * @param amount - Number to format
   * @returns Formatted currency string (Rp 10.000)
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  /**
   * Format product type to Indonesian
   * @param type - Product type ('composition' | 'product')
   * @returns Formatted type string
   */
  const formatProductType = (type: string) => {
    switch (type) {
      case 'composition':
        return 'Komposisi'
      case 'product':
        return 'Produk'
      default:
        return type
    }
  }

  /**
   * Format payment method to Indonesian
   * @param method - Payment method string
   * @returns Formatted payment method string
   */
  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'Tunai',
      gopay: 'GoPay',
      ovo: 'OVO',
      dana: 'DANA',
      qris: 'QRIS'
    }
    return methods[method] || method
  }

  /**
   * Format transaction status to Indonesian
   * @param status - Transaction status
   * @returns Formatted status string
   */
  const formatStatus = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Menunggu',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Diterima'
    }
    return statuses[status] || status
  }

  /**
   * Format transaction type to Indonesian
   * @param type - Transaction type ('in' | 'out')
   * @returns Formatted type string
   */
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'in':
        return 'Masuk'
      case 'out':
        return 'Keluar'
      default:
        return type
    }
  }

  /**
   * Format number with Indonesian locale
   * @param number - Number to format
   * @returns Formatted number string
   */
  const formatNumber = (number: number) => {
    return number.toLocaleString('id-ID')
  }

  /**
   * Format unit to Indonesian
   * @param unit - Unit string
   * @returns Formatted unit string
   */
  const formatUnit = (unit: string) => {
    const units: Record<string, string> = {
      pcs: 'Pcs',
      gr: 'Gram',
      kg: 'Kilogram', 
      ml: 'Mililiter',
      liter: 'Liter',
      lembar: 'Lembar',
      slice: 'Slice',
      butir: 'Butir',
      pack: 'Pack',
      botol: 'Botol'
    }
    return units[unit] || unit
  }

  return {
    formatDate,
    formatCurrency,
    formatProductType,
    formatPaymentMethod,
    formatStatus,
    formatTransactionType,
    formatNumber,
    formatUnit
  }
}
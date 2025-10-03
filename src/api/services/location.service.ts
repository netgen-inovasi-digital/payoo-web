import axios from 'axios'
import type { ProvinceResponse, CityResponse } from '@/api/types/location.types'

// Base URL for location API
const baseUrlLokasi = 'https://alamat.thecloudalert.com/api'

class LocationService {
  // Get all provinces
  async getProvinces(): Promise<ProvinceResponse> {
    const lokasiProvinsiUrl = `${baseUrlLokasi}/provinsi/get`
    const response = await axios.get<ProvinceResponse>(lokasiProvinsiUrl)
    return response.data
  }

  // Get cities by province ID
  async getCities(provinceId: string): Promise<CityResponse> {
    const lokasiKotaUrl = `${baseUrlLokasi}/kabkota/get/?d_provinsi_id=${provinceId}`
    const response = await axios.get<CityResponse>(lokasiKotaUrl)
    return response.data
  }
}

export const locationService = new LocationService()
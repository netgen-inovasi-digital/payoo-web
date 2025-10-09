// Location API response types
export interface LocationApiResponse<T> {
  status: number
  message: string
  result: T[]
}

// Province data structure
export interface Province {
  id: string
  text: string
}

// City data structure  
export interface City {
  id: string
  text: string
}

// Location service response types
export type ProvinceResponse = LocationApiResponse<Province>
export type CityResponse = LocationApiResponse<City>
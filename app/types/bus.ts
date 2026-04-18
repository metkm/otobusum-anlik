export interface BusStop {
  id: number
  code: number
  name: string
  lng: number
  lat: number
  province?: string
  smart?: string
  stop_type?: string
  disabled_can_use?: string
  physical?: string
  city: string
}

export interface BusLine {
  id: number
  code: string
  name: string
  city: string
}

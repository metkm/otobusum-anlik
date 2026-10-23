interface StopArrivalBusFeatures {
  accessible: boolean
  usb_available: boolean
  wifi_available: boolean
  ac_active: boolean
  bicycle_rack: boolean
}

export interface StopArrival {
  stop_order: number
  stop_code: number
  door_no: string
  garage: string
  line_code: string
  lat: number
  lng: number
  last_speed: number
  arrival_time: string
  minutes_left: number
  line_name: string
  last_location_time: string
  route_code: string
  stop_name: string
  features: StopArrivalBusFeatures
}

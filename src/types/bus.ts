export interface Stop {
  id: number
  code: number
  name: string
  lng: number
  lat: number
  province?: string
  city: string
}

export interface Line {
  id: number
  code: string
  name: string
  city: string
}

export interface BusLocation {
  bus_id: string
  lng: number
  lat: number
  route_code: string
  closest_stop_code: number
  last_update_time: Date
}

export interface BusLocationResponse {
  data: BusLocation[]
  next_poll: number
}

export interface StopWithBuses {
  buses: string[]
  stop: Stop
}

export interface BusInfo {
  operator: string
  garage?: string
  door_no: string
  hour: string
  lng: number
  lat: number
  speed: number
  plate: string
}

export interface BusLocationOpenData {
  kapino: string
  boylam: string
  enlem: string
  guzergahkodu: string
  son_konum_zamani: string
  yakinDurakKodu: string
}

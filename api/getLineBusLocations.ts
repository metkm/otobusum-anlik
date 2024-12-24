import { api } from './api'

export interface BusLocation {
  door_no: string
  lng: number
  lat: number
  line_code: string
  route_code: string
  line_name: string
  direction: string
  last_location_update: string
  closest_stop_code: number
}

export async function getLineBusLocations(lineCode: string): Promise<BusLocation[]> {
  return api(`/bus-locations/${lineCode}`)
}

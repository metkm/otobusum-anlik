import { api } from './api'

import { Direction } from '@/types/timetable'

export type RouteCode = `${string}_${Direction}_${string}`

export interface LineRoute {
  id: number
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_type: string
  route_desc: string
  route_code: RouteCode
  route_path?: { lat: number, lng: number }[]
}

export async function getAllRoutes(lineCode: string) {
  return api<LineRoute[]>(`/routes/${lineCode}`)
}

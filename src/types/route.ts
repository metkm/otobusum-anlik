import type { RouteCode } from './line'

export interface Route {
  id: number
  agency_id: string
  line_code: string
  name: string
  type: string
  desc: string
  code: RouteCode
  path?: { lat: number; lng: number }[]
}

import type { RouteCode } from './line'
import type { Point } from './point'

export interface Route {
  id: number
  agency_id: string
  line_code: string
  name: string
  type: string
  desc: string
  code: RouteCode
  path?: Point[]
}

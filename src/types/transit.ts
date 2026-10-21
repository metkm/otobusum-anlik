import type { BusStop } from './bus'
import type { Route } from './route'

export interface TransitNearby {
  routes_radius: number
  stops_radius: number
  stops: BusStop[]
  routes: Route[]
}

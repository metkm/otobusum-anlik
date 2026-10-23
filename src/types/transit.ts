import type { Stop } from './bus'
import type { Route } from './route'

export interface TransitNearby {
  routes_radius: number
  stops_radius: number
  stops: Stop[]
  routes: Route[]
}

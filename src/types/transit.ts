import { BusStop } from './bus'
import { Route } from './route'

export interface TransitNearby {
  routes_radius: number
  stops_radius: number
  stops: BusStop[]
  routes: Route[]
}

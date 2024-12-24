import { api } from './api'

import { BusStop } from '@/types/bus'

export async function getLineBusStops(routeCode: string): Promise<BusStop[]> {
  return api(`/route-stops/${routeCode}`)
}

import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'

import { useLineStore } from '@/stores/line'

export type Direction = 'G' | 'D'
export type RouteCode = `${string}_${Direction}_${string}`

export interface LineRoute {
  id: number
  agency_id: string
  line_code: string
  name: string
  type: string
  desc: string
  code: RouteCode
  path?: { lat: number, lng: number }[]
}

export const useLineRoutes = () => {
  const { code } = useLine()
  const routeCode = useLineStore(useShallow(state => state.routes()[code])) || `${code}_G_D0`

  const query = useQuery({
    queryKey: ['line', code, 'routes'],
    queryFn: () => ky.get<LineRoute[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/routes/${code}`).json(),
    staleTime: Infinity,
  })

  const route = query.data?.find(r => r.code === routeCode)
  const direction = routeCode.split('_')[1] || 'G' as Direction

  return {
    query,
    routeCode,
    route,
    direction,
  }
}

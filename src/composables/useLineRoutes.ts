import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'

import { LONG_CACHE_MS } from '@/constants/app'
import { useLineStore } from '@/stores'
import { RouteCode, RouteDirection } from '@/types/line'

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
  const routeCode = useLineStore(useShallow(state => state.getRoutes()[code])) || `${code}_G_D0` as RouteCode

  const query = useQuery({
    queryKey: ['line', code, 'routes'],
    queryFn: () => ky.get<LineRoute[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/routes/${code}`).json(),
    staleTime: LONG_CACHE_MS,
    meta: { persist: true },
  })

  const route = query.data?.find(r => r.code === routeCode)

  const direction = (routeCode.split('_')[1] || 'G') as RouteDirection
  const otherDirectionCode = routeCode.replace(/G|D/, direction === 'G' ? 'D' : 'G')
  const otherDirectionRoute = query.data?.find(r => r.code === otherDirectionCode)

  return {
    query,
    routeCode,
    route,
    direction,
    otherDirectionRoute,
  }
}

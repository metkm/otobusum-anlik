import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'

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
  const routeCode = useLineStore(useShallow(state => state.routes()[code])) || `${code}_G_D0` as RouteCode
  // const setRoute = useLineStore(useShallow(state => state.setRoute))

  const query = useQuery({
    queryKey: ['line', code, 'routes'],
    queryFn: () => ky.get<LineRoute[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/routes/${code}`).json(),
    staleTime: 86_400_000,
    meta: { persist: true },
  })

  const route = query.data?.find(r => r.code === routeCode)

  const direction = routeCode.split('_')[1] || 'G' as RouteDirection
  const otherDirectionCode = routeCode.replace(/G|D/, direction === 'G' ? 'D' : 'G')
  const otherDirectionRoute = query.data?.find(r => r.code === otherDirectionCode)

  // const changeDirection = () => {
  //   if (!otherDirectionRoute) return
  //   setRoute(code, otherDirectionRoute.code)
  // }

  return {
    query,
    routeCode,
    route,
    direction,
    // changeDirection,
    otherDirectionRoute,
  }
}

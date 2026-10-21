import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { CACHE_MS_3_DAYS } from '@/constants/app'
import { useFilterStore, useLineStore } from '@/stores'
import type { RouteCode, RouteDirection } from '@/types/line'
import type { Route } from '@/types/route'

import { useLine } from './useLine'

export const useLineRoutes = () => {
  const { code } = useLine()
  const city = useFilterStore(useShallow((state) => state.city))
  const routeCode =
    useLineStore(useShallow((state) => state.routes[city][code])) || (`${code}_G_D0` as RouteCode)

  const query = useQuery({
    meta: { persist: true },
    queryFn: () =>
      ky
        .get<Route[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/routes/${code}`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['line', code, 'routes'],
    staleTime: CACHE_MS_3_DAYS,
  })

  const route = query.data?.find((r) => r.code === routeCode)

  const direction = (routeCode.split('_')[1] || 'G') as RouteDirection
  const otherDirectionCode = routeCode.replace(/G|D/, direction === 'G' ? 'D' : 'G')
  const otherDirectionRoute = query.data?.find((r) => r.code === otherDirectionCode)

  return {
    direction,
    otherDirectionRoute,
    query,
    route,
    routeCode,
  }
}

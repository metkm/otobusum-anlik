import { queryOptions, useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useGroupItem } from '@/composables'
import { MS_3_DAYS } from '@/constants/time'
import { useFilterStore, useTransitStore } from '@/stores'
import type { City } from '@/types/city'
import type { RouteDirection } from '@/types/line'
import type { Route } from '@/types/route'

export const routesQueryOptions = (code: string, city: City) =>
  queryOptions({
    meta: { persist: true },
    queryFn: () =>
      ky
        .get<Route[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/routes/${code}`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['routes', code, city],
    staleTime: MS_3_DAYS,
  })

export const getDefaultRouteCode = (code: string) => `${code}_G_D0`

export const useLineRoutes = () => {
  const { code } = useGroupItem()
  const city = useFilterStore(useShallow((state) => state.city))
  const routeCode =
    useTransitStore(useShallow((state) => state.routes[city][code])) ?? getDefaultRouteCode(code)

  const query = useQuery(routesQueryOptions(code, city))

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

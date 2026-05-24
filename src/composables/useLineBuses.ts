import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { useFilterStore } from '@/stores'
import { BusLocation } from '@/types/bus'

export const REFETCH_INTERVAL = 50_000

export const useLineBuses = () => {
  const { code } = useLine()
  const { routeCode } = useLineRoutes()
  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: () => ky.get<BusLocation[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-locations/${code}`, {
      searchParams: {
        city,
      },
    }).json(),
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  })

  const buses = query.data?.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

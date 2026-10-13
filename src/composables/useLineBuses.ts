import { type Query, useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { useFilterStore } from '@/stores'
import { BusLocationResponse } from '@/types/bus'

const getRefetchAndStaleTime = (query: Query<BusLocationResponse>) => {
  const data = query.state.data
  if (!data)
    return 0

  const left = (data.next_poll - Math.ceil(query.state.dataUpdatedAt / 1000)) * 1000

  return Math.max(1_000, left)
}

export const useLineBuses = () => {
  const { code } = useLine()
  const { routeCode } = useLineRoutes()

  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: () => {
      return ky.get<BusLocationResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-locations/${code}`, {
        searchParams: {
          city,
        },
      }).json()
    },
    staleTime: getRefetchAndStaleTime,
    refetchInterval: getRefetchAndStaleTime,
  })

  const buses = query.data?.data.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

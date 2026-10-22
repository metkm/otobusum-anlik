import { type Query, useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { BusLocationResponse } from '@/types/bus'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

const getRefetchAndStaleTime = (query: Query<BusLocationResponse>) => {
  const { data } = query.state
  if (!data) {
    return 0
  }

  const left = (data.next_poll - Math.ceil(query.state.dataUpdatedAt / 1000)) * 1000

  return Math.max(1000, left)
}

export const useLineBuses = () => {
  const { code } = useLine()
  const { routeCode } = useLineRoutes()

  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    queryFn: () =>
      ky
        .get<BusLocationResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-locations/${code}`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['line', code, 'buses'],

    refetchInterval: getRefetchAndStaleTime,
    staleTime: getRefetchAndStaleTime,
  })

  const buses = query.data?.data.filter((bus) => bus.route_code === routeCode) || []

  return {
    buses,
    query,
  }
}

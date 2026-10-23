import { type Query, useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { fetchBusLocations } from '@/api/bus'
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
    queryFn: () => fetchBusLocations(code, city),
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

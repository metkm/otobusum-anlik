import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { LINE_UPDATE_DELAY, LINE_UPDATE_INTERVAL } from '@/constants/app'
import { useFilterStore } from '@/stores'
import { BusLocationResponse } from '@/types/bus'

export const useLineBuses = () => {
  const { code } = useLine()
  const { routeCode } = useLineRoutes()

  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: () =>
      ky.get<BusLocationResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-locations/${code}`, {
        searchParams: {
          city,
        },
      }).json(),
    // staleTime: LINE_UPDATE_INTERVAL,
    refetchInterval: (query) => {
      const data = query.state.data

      if (!data)
        return LINE_UPDATE_INTERVAL

      const fetchedAt = new Date(data.fetched_at).getTime()
      // Target: 62 seconds after the backend's fetched_at timestamp

      // Use dataUpdatedAt as our anchor point since it doesn't change on every evaluation tick
      const elapsedSinceUpdate = query.state.dataUpdatedAt - fetchedAt
      const remainingInterval = LINE_UPDATE_DELAY - elapsedSinceUpdate

      return remainingInterval > 0 ? remainingInterval : 1000
    },
  })

  const buses = query.data?.data.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

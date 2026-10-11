import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

// import { LINE_UPDATE_INTERVAL, LINE_UPDATE_INTERVAL_BUFFER } from '@/constants/app'
import { LINE_UPDATE_INTERVAL, LINE_UPDATE_INTERVAL_BUFFER } from '@/constants/app'
import { useFilterStore } from '@/stores'
import { BusLocationResponse } from '@/types/bus'

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
    staleTime: 'static',
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data)
        return LINE_UPDATE_INTERVAL

      if (data.next_poll) {
        const nextPoll = new Date(data.next_poll)
        return Math.max(1_000, nextPoll.getTime() - query.state.dataUpdatedAt) // math max is just to be safe, we don't want it to be negative
      }

      const fetchedAt = new Date(data.polled_at).getTime()
      const elapsed = query.state.dataUpdatedAt - fetchedAt

      return Math.max(1_000, LINE_UPDATE_INTERVAL + LINE_UPDATE_INTERVAL_BUFFER - elapsed)
    },
  })

  const buses = query.data?.data.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

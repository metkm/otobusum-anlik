import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { LINE_UPDATE_INTERVAL, LINE_UPDATE_INTERVAL_BUFFER } from '@/constants/app'
import { useFilterStore } from '@/stores'
import { BusLocationResponse } from '@/types/bus'

export const useLineBuses = () => {
  const { code } = useLine()
  const { routeCode } = useLineRoutes()

  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: async () => {
      return await ky.get<BusLocationResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-locations/${code}`, {
        searchParams: {
          city,
        },
      }).json()
    },
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data)
        return LINE_UPDATE_INTERVAL

      const fetchedAt = new Date(data.fetched_at).getTime()
      const elapsed = query.state.dataUpdatedAt - fetchedAt

      return LINE_UPDATE_INTERVAL + LINE_UPDATE_INTERVAL_BUFFER - elapsed
    },
  })

  const buses = query.data?.data.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { useFilterStore } from '@/stores'
import { BusLocationResponse } from '@/types/bus'

export const getRefetchIntervalFromDataUpdatedAt = (fetchedAt: number, dataUpdatedAt: number) => {
  // Target: exactly 62 seconds after the backend fetched the data
  const targetFetchTime = fetchedAt + LINE_UPDATE_INTERVAL + 1000

  // Remaining time from when our last query finished (dataUpdatedAt) to the target time
  const diff = targetFetchTime - dataUpdatedAt

  // If the target time has already passed (e.g., slow network), retry in 1 second
  if (diff <= 0) {
    return 1000
  }

  return diff
}

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

      return getRefetchIntervalFromDataUpdatedAt(fetchedAt, query.state.dataUpdatedAt)
    },
  })

  const buses = query.data?.data.filter(bus => bus.route_code === routeCode) || []

  return {
    query,
    buses,
  }
}

import { queryOptions, useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { fetchBusLocations } from '@/api/bus'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { useFilterStore } from '@/stores'
import type { City } from '@/types/city'
import { getNextPollDelay } from '@/utils/query'

import { useGroupItem } from '../useGroupItem'
import { useLineRoutes } from './useLineRoutes'

export const busesQueryOptions = (code: string, city: City) =>
  queryOptions({
    queryFn: async () => {
      const data = await fetchBusLocations(code, city)
      return {
        data: data.data,
        next_poll: data.next_poll * 1000,
      }
    },
    queryKey: ['buses', code, city],
    refetchInterval: (query) => getNextPollDelay(query.state, LINE_UPDATE_INTERVAL),
    staleTime: LINE_UPDATE_INTERVAL,
  })

export const useLineBuses = () => {
  const { code } = useGroupItem()
  const { routeCode } = useLineRoutes()

  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery(busesQueryOptions(code, city))

  const buses = query.data?.data.filter((bus) => bus.route_code === routeCode) ?? []

  return {
    buses,
    query,
  }
}

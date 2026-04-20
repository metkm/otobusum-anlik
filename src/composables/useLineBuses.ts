import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'

import { BusLocation } from '@/types/bus'

export const REFETCH_INTERVAL = 50_000

export const useLineBuses = () => {
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: () => ky.get<BusLocation[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-locations/${code}`).json(),
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  })

  return query
}

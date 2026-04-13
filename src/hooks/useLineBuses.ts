import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

export interface BusLocation {
  bus_id: string
  lng: number
  lat: number
  route_code: string
  closest_stop_code?: number
}

export const REFETCH_INTERVAL = 50_000

export const useLineBuses = (code: string) => {
  const query = useQuery({
    queryKey: ['line', code, 'buses'],
    queryFn: () => ky.get<BusLocation[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-locations/${code}`).json(),
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  })

  return query
}

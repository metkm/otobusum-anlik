import { CapacitorHttp } from '@capacitor/core'
import { useQuery } from '@tanstack/vue-query'

interface BusLocation {
  bus_id: string
  lng: number
  lat: number
  route_code: string
  closest_stop_code: string
}

export const REFETCH_INTERVAL = 50_000

export const useLineBuses = (code: string) => {
  const query = useQuery({
    queryKey: [`line-${code}-buses`],
    queryFn: () =>
      CapacitorHttp.get({
        url: `https://otobusum.metkm.win/bus-locations/${code}`,
      }).then(response => response.data as BusLocation[]),
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  })

  return query
}

import { CapacitorHttp } from '@capacitor/core'
import { useQuery } from '@tanstack/vue-query'

export type Direction = 'G' | 'D'
export type RouteCode = `${string}_${Direction}_${string}`

export interface LineRoute {
  id: number
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_type: string
  route_desc: string
  route_code: RouteCode
  route_path?: { lat: number, lng: number }[]
}

export const useLineRoutes = () => {
  const runtimeConfig = useRuntimeConfig()
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['line', toValue(code), 'routes'],
    queryFn: () =>
      CapacitorHttp.get({
        url: `${runtimeConfig.public.baseUrl}/routes/${toValue(code)}`,
      }).then(response => response.data as LineRoute[]),
  })

  return query
}

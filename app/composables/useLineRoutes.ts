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
  const lineStore = useLineStore()
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['line', toValue(code), 'routes'],
    queryFn: () =>
      CapacitorHttp.get({
        url: `${runtimeConfig.public.baseUrl}/routes/${toValue(code)}`,
      }).then(response => response.data as LineRoute[]),
  })

  const routeCode = computed({
    get() {
      return lineStore.routes[toValue(code)] || `${toValue(code)}_G_D0`
    },
    set(routeCode: string) {
      lineStore.routes[toValue(code)] = routeCode
    },
  })

  const route = computed(() => query.data.value?.find(r => r.route_code === routeCode.value))

  return { query, routeCode, route }
}

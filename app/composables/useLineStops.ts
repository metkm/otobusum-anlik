import { CapacitorHttp } from '@capacitor/core'
import { useQuery } from '@tanstack/vue-query'
import type { BusStop } from '~/types/bus'

export const useLineStops = () => {
  const runtimeConfig = useRuntimeConfig()
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['line', code, 'stops'],
    queryFn: () =>
      CapacitorHttp.get({
        url: `${runtimeConfig.public.baseUrl}/v1/route-stops/${toValue(code)}`,
        params: {
          direction: 'G',
        },
      }).then(response => response.data as BusStop[]),
  })

  return { query }
}

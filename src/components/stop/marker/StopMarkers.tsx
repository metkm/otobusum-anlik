import { GeoJSONSource } from '@maplibre/maplibre-react-native'
import { useCSSVariable } from 'uniwind'

import { MarkerStopLayer } from '@/components/marker/MarkerStopLayer'
import { useGroupItem } from '@/composables'
import { useStop } from '@/composables/query'

export const StopMarkers = () => {
  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const borderColor = useCSSVariable('--border-color-muted')?.toString()

  const { code } = useGroupItem()
  const { query } = useStop(code)

  if (!query.data) {
    return
  }

  return (
    <GeoJSONSource
      data={{
        geometry: {
          coordinates: [query.data.stop.lng, query.data.stop.lat],
          type: 'Point',
        },
        properties: {
          backgroundColor: primaryColor,
          borderColor,
        },
        type: 'Feature',
      }}
    >
      <MarkerStopLayer />
    </GeoJSONSource>
  )
}

import { GeoJSONSource, Images } from '@maplibre/maplibre-react-native'
import { Lucide } from '@react-native-vector-icons/lucide'
import type { GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { MarkerRouteLayer } from '@/components/marker/MarkerRouteLayer'
import { useGroupItem } from '@/composables'
import { useLineRoutes } from '@/composables/query'
import { useFilterStore } from '@/stores'

export const LineMarkerRoute = () => {
  const { code } = useGroupItem()
  const { route } = useLineRoutes()

  const textColor = useCSSVariable('--text-color-inverted')?.toString()
  const primaryColor = useCSSVariable('--color-primary')?.toString()

  const isHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!route?.path || route.path.length < 1) {
    return
  }

  const coordinates = route.path.map((p) => [p.lng, p.lat])

  const data: GeoJSON<Geometry, GeoJsonProperties> = {
    geometry: {
      coordinates,
      type: 'LineString',
    },
    properties: {
      accentColor: textColor,
      backgroundColor: primaryColor,
      textColor,
    },
    type: 'Feature',
  }

  const iconName = `arrows-${code}`

  return (
    <>
      <Images
        images={{
          [iconName]: Lucide.getImageSourceSync('arrow-right', 20, textColor).uri,
        }}
      />

      <GeoJSONSource data={data}>
        <MarkerRouteLayer
          isHidden={isHidden}
          code={code}
        />
      </GeoJSONSource>
    </>
  )
}

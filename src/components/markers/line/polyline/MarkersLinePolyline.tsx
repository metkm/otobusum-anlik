import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
// eslint-disable-next-line import/no-unresolved
import { Position } from 'geojson'
import { useMemo } from 'react'
// import { LatLng, Polyline } from 'react-native-maps'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

interface PolylineProps {
  lineCode: string
}

export const MarkersLinePolyline = ({ lineCode }: PolylineProps) => {
  const { schemeColor } = useTheme(lineCode)

  const { getRouteFromCode } = useRoutes(lineCode)
  const route = getRouteFromCode()

  const coordinates: Position[] = useMemo(
    () =>
      route?.route_path?.map(path => [path.lng, path.lat]) || [],
    [route],
  )

  return (
    <GeoJSONSource data={{
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: `${lineCode}-polyline-feature`,
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        } as const,
      ],
    }}
    >
      <Layer
        type="line"
        paint={{
          'line-width': 6,
          'line-color': schemeColor.primary,
        }}
        layerIndex={9}
      />
    </GeoJSONSource>
  )
}

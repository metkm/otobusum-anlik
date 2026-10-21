import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'

import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'

import { LineMarkerRouteLayer } from './line/marker/LineMarkerRoute'
import { LineMarkerStopLayer } from './line/marker/LineMarkerStops'

export const MapTemporaryMarkers = () => {
  const temporaryMarkerStore = useTemporaryMarkerStore()

  if (!temporaryMarkerStore.data) {
    return
  }

  return temporaryMarkerStore.data.map((data) =>
    data.data ? (
      <GeoJSONSource
        key={data.id}
        data={data.data}
      >
        {data.renderer === 'layer' ? (
          <Layer {...data.layerProps} />
        ) : data.renderer === 'route' ? (
          <LineMarkerRouteLayer />
        ) : (
          <LineMarkerStopLayer />
        )}
      </GeoJSONSource>
    ) : undefined,
  )
}

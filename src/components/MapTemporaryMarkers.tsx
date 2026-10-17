import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'

import { LineMarkerRouteLayer } from './line/marker/LineMarkerRoute'
import { LineMarkerStopLayer } from './line/marker/LineMarkerStops'

import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'

export const MapTemporaryMarkers = () => {
  const temporaryMarkerStore = useTemporaryMarkerStore()

  if (!temporaryMarkerStore.data) {
    return
  }

  return temporaryMarkerStore.data.map(data => (
    <GeoJSONSource key={data.id} data={data.data}>
      {data.type === 'stops' && (
        <LineMarkerStopLayer />
      )}

      {data.type === 'routes' && (
        <LineMarkerRouteLayer />
      )}

      {data.type === 'polygon' && (
        <Layer
          type="fill"
          paint={{
            'fill-color': 'white',
            'fill-opacity': 0.2,
          }}
        />
      )}
    </GeoJSONSource>
  ))
}

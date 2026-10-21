import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'

import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'

import { LineMarkerRouteLayer } from './line/marker/LineMarkerRoute'
import { LineMarkerStopLayer } from './line/marker/LineMarkerStops'

export const MapTemporaryMarkers = () => {
  const temporaryMarkerStore = useTemporaryMarkerStore()

  return temporaryMarkerStore.data.map(({ data, id, renderer, layerProps }) => {
    if (!data) {
      return
    }

    const Renderer = () => {
      if (renderer === 'layer') {
        return <Layer {...layerProps} />
      }

      if (renderer === 'route') {
        return <LineMarkerRouteLayer />
      }

      return <LineMarkerStopLayer />
    }

    return (
      <GeoJSONSource
        key={id}
        data={data}
      >
        <Renderer />
      </GeoJSONSource>
    )
  })
}

import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'

import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'

import { MarkerRouteLayer } from './marker/MarkerRouteLayer'
import { MarkerStopLayer } from './marker/MarkerStopLayer'

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
        return <MarkerRouteLayer />
      }

      return <MarkerStopLayer />
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

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
    <GeoJSONSource
      key={data.id}
      data={data.data}
    >
      {
        data.renderer === 'layer'
          ? (<Layer {...data.layerProps} />)
          : data.renderer === 'route'
            ? <LineMarkerRouteLayer />
            : <LineMarkerStopLayer />

        // data.renderer === 'stops'
        //   ? (<LineMarkerStopLayer />)
        //   : data.renderer === 'route'
        //     ? (<LineMarkerRouteLayer />)
        //     : (<Layer {...data.layerProps} />)
      }
    </GeoJSONSource>
  ))
}

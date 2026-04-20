import { useShallow } from 'zustand/react/shallow'

import { LineMarkerBuses } from './marker/LineMarkerBuses'
import { LineMarkerRoute } from './marker/LineMarkerRoute'

import { LineContext } from '@/composables/useLine'
import { useFilterStore } from '@/stores/filter'
import { useLineStore } from '@/stores/line'

export const LineMarkers = () => {
  const _lines = useLineStore(useShallow(state => state.lines()))
  const hiddenLines = useFilterStore(useShallow(state => state.hiddenLines))

  const lines = _lines.filter(l => !hiddenLines.includes(l))

  return lines.map(code => (
    <LineContext value={code} key={code}>
      <LineMarkerBuses />
      <LineMarkerRoute />
    </LineContext>
  ))

  // return [1, 2, 3, 4, 5].map(i => (
  //   <GeoJSONSource
  //     key={i}
  //     data={{
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           properties: {},
  //           geometry: {
  //             type: 'Point',
  //             coordinates: [29.120912360981606 + (i * 0.05), 40.94999488610106],
  //           },
  //         },
  //       ],
  //     }}
  //   >
  //     <Layer
  //       type="circle"
  //       paint={{ 'circle-radius': 20 }}
  //     />

  //     <Layer
  //       type="symbol"
  //       layout={{
  //         'icon-image': 'bus',
  //         'icon-size': 0.3,
  //       }}
  //       paint={{
  //         'icon-opacity-transition': { duration: 0 },
  //         'icon-color-transition': { duration: 0 },
  //       }}
  //     />
  //   </GeoJSONSource>
  // ))
}

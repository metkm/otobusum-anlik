import { useShallow } from 'zustand/react/shallow'

import { LineMarkersBuses } from './markers/LineMarkersBuses'

import { useLinesStore } from '@/stores/lines'

export const LineMarkers = () => {
  const lines = useLinesStore(useShallow(state => state.lines()))

  return lines.map(code => <LineMarkersBuses key={code} code={code} />)

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

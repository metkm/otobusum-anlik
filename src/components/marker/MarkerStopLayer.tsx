import { Layer } from '@maplibre/maplibre-react-native'

export const MarkerStopLayer = ({ isHidden }: { isHidden?: boolean }) => {
  const visibility = isHidden ? 'none' : 'visible'

  return (
    <Layer
      type="circle"
      paint={{
        'circle-color': ['get', 'backgroundColor'],
        'circle-pitch-alignment': 'map',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 4, 16, 7],
        'circle-stroke-color': ['get', 'borderColor'],
        'circle-stroke-width': 2,
      }}
      layout={{
        visibility,
      }}
      afterId="stop-layer"
      minzoom={11}
    />
  )
}

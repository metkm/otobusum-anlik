import { Layer } from '@maplibre/maplibre-react-native'

export const MarkerBusLayer = ({ code, isHidden }: { code: string; isHidden?: boolean }) => {
  const visibility = isHidden ? 'none' : 'visible'

  return (
    <>
      <Layer
        id={`bus-circle-${code}`}
        type="circle"
        paint={{
          'circle-color': ['get', 'backgroundColor'],
          'circle-pitch-alignment': 'map',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 14, 16, 16],
        }}
        layout={{ visibility }}
        minzoom={8}
        afterId="buses-layer"
      />

      <Layer
        type="symbol"
        layout={{
          'icon-allow-overlap': true,
          'icon-image': `bus-front-${code}`,
          'icon-pitch-alignment': 'map',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.25, 16, 0.3],
          visibility,
        }}
        paint={{
          'icon-color-transition': { duration: 0 },
          'icon-opacity-transition': { duration: 0 },
        }}
        afterId={`bus-circle-${code}`}
        minzoom={8}
      />
    </>
  )
}

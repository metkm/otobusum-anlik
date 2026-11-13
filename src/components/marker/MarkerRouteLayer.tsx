import { Layer } from '@maplibre/maplibre-react-native'

export const MarkerRouteLayer = ({ code, isHidden }: { code?: string; isHidden?: boolean }) => {
  const visibility = isHidden ? 'none' : 'visible'

  return (
    <>
      <Layer
        id={`route-path-${code}`}
        type="line"
        paint={{
          'line-color': ['get', 'backgroundColor'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 8, 17, 12],
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
          visibility,
        }}
        afterId="route-layer"
      />

      <Layer
        id={`route-path-arrows-${code}`}
        type="symbol"
        layout={{
          'icon-image': `arrows-${code}`,
          'icon-size': 0.2,
          'symbol-placement': 'line',
          'symbol-spacing': 16,
          visibility,
        }}
        paint={{
          'icon-opacity': 0.8,
        }}
        afterId={`route-path-${code}`}
      />

      <Layer
        id={`route-label-${code}`}
        type="symbol"
        layout={{
          'symbol-placement': 'line',
          'symbol-spacing': 100,
          'text-field': code ?? ['get', 'line_code'],
          'text-font': ['Roboto Bold'],
          'text-offset': [0, 0],
          'text-size': 10,
          visibility,
        }}
        paint={{
          'text-color': ['get', 'textColor'],
          'text-opacity': 0.6,
        }}
        afterId={`route-path-arrows-${code}`}
      />
    </>
  )
}

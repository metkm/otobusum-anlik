import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLines, useLineBuses, useLineRoutes, useLineTheme, useMapStyle } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerBuses = () => {
  const lines = useLines()
  const { mapColorScheme } = useMapStyle()
  const { code } = useLine()
  const { routeCode } = useLineRoutes()
  const { query: lineBusesQuery, buses } = useLineBuses()

  const theme = useLineTheme(mapColorScheme)
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))

  if (!lineBusesQuery.data)
    return

  const background = theme?.background({ variant: 'solid' })
  const text = theme?.text({ variant: 'solid' })

  const iconImage = `bus-${code}`
  const images: Record<string, ImageEntry> = {}
  images[iconImage] = Lucide.getImageSourceSync('bus-front', 20, text?.color).uri

  const features: Feature[] = buses.filter(bus => bus.route_code === routeCode)
    .map(bus => ({
      type: 'Feature',
      properties: {
        doorNo: bus.bus_id,
      },
      geometry: {
        type: 'Point',
        coordinates: [bus.lng, bus.lat],
      },
    }))

  const minZoom = lines.length < 2 ? undefined : 8

  return (
    <>
      <Images images={images} />

      <GeoJSONSource
        data={{
          type: 'FeatureCollection',
          features,
        }}
        onPress={(event) => {
          const doorNo = event.nativeEvent.features[0]?.properties?.doorNo
          if (!doorNo)
            return
          router.navigate(`/bus-info/${doorNo}`)
        }}
      >
        <Layer
          id={`bus-circle-${code}`}
          type="circle"
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'], ['zoom'],
              10, 14,
              16, 16,
            ],
            'circle-color': background?.backgroundColor as string,
            'circle-pitch-alignment': 'map',
          }}
          layout={{ visibility: isLineHidden ? 'none' : 'visible' }}
          layerIndex={50_000_000}
          minzoom={minZoom}
        />

        <Layer
          type="symbol"
          layout={{
            'icon-image': iconImage,
            'icon-size': [
              'interpolate',
              ['linear'], ['zoom'],
              10, 0.25,
              16, 0.3,
            ],
            'visibility': isLineHidden ? 'none' : 'visible',
            'icon-pitch-alignment': 'map',
          }}
          paint={{
            'icon-opacity-transition': { duration: 0 },
            'icon-color-transition': { duration: 0 },
          }}
          afterId={`bus-circle-${code}`}
          minzoom={minZoom}
        />
      </GeoJSONSource>
    </>

  )
}

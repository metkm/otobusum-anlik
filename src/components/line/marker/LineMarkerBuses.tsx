import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineBuses, useLineGroup, useLineRoutes } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerBuses = () => {
  const { codes } = useLineGroup()
  const { code } = useLine()
  const { routeCode } = useLineRoutes()
  const { query: lineBusesQuery, buses } = useLineBuses()

  const textColor = useCSSVariable('--text-color-inverted')?.toString()
  const primaryColor = useCSSVariable('--color-primary')?.toString()

  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!lineBusesQuery.data) {
    return
  }

  const iconImage = `bus-${code}`
  const images: Record<string, ImageEntry> = {}
  images[iconImage] = Lucide.getImageSourceSync('bus-front', 20, textColor).uri

  const features: Feature[] = buses
    .filter((bus) => bus.route_code === routeCode)
    .map((bus) => ({
      geometry: {
        coordinates: [bus.lng, bus.lat],
        type: 'Point',
      },
      properties: {
        color: primaryColor,
        doorNo: bus.bus_id,
      },
      type: 'Feature',
    }))

  const minZoom = codes.length < 2 ? undefined : 8

  return (
    <>
      <Images images={images} />

      <GeoJSONSource
        data={{
          features,
          type: 'FeatureCollection',
        }}
        onPress={(event) => {
          const doorNo = event.nativeEvent.features[0]?.properties?.doorNo
          if (!doorNo) {
            return
          }
          router.navigate(`/bus-info/${doorNo}`)
        }}
      >
        <Layer
          id={`bus-circle-${code}`}
          type="circle"
          paint={{
            'circle-color': ['get', 'color'],
            'circle-pitch-alignment': 'map',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 14, 16, 16],
          }}
          layout={{ visibility: isLineHidden ? 'none' : 'visible' }}
          minzoom={minZoom}
          afterId="buses-layer"
        />

        <Layer
          type="symbol"
          layout={{
            'icon-allow-overlap': true,
            'icon-image': iconImage,
            'icon-pitch-alignment': 'map',
            'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.25, 16, 0.3],
            visibility: isLineHidden ? 'none' : 'visible',
          }}
          paint={{
            'icon-color-transition': { duration: 0 },
            'icon-opacity-transition': { duration: 0 },
          }}
          afterId={`bus-circle-${code}`}
          minzoom={minZoom}
        />
      </GeoJSONSource>
    </>
  )
}

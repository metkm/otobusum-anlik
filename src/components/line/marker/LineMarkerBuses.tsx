import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLines, useLineBuses, useLineRoutes, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerBuses = () => {
  const defaultBg = useCSSVariable('--ui-bg')

  const { code } = useLine()
  const { routeCode } = useLineRoutes()
  const { query: lineBusesQuery, buses } = useLineBuses()

  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const lines = useLines()
  const theme = useLineTheme()

  if (!lineBusesQuery.data)
    return

  const backgroundWithColor = theme?.backgroundWithColor({ variant: 'solid' })
  const iconSource = Lucide.getImageSourceSync('bus-front', 20, backgroundWithColor?.color)

  const iconImage = `bus-${code}`
  const images: Record<string, ImageEntry> = {}

  images[iconImage] = iconSource.uri

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
            'circle-radius': 16,
            'circle-color': backgroundWithColor?.backgroundColor ?? defaultBg as string,
            'circle-pitch-alignment': 'map',
          }}
          layout={{ visibility: isLineHidden ? 'none' : 'visible' }}
          layerIndex={30_000}
          minzoom={minZoom}
          // afterId={`stops-${code}`}
        />

        <Layer
          type="symbol"
          layout={{
            'icon-image': iconImage,
            'icon-size': 0.3,
            'visibility': isLineHidden ? 'none' : 'visible',
            'icon-pitch-alignment': 'map',
          }}
          paint={{
            'icon-opacity-transition': { duration: 0 },
            'icon-color-transition': { duration: 0 },
          }}
          layerIndex={40_000}
          // afterId={`bus-circle-${code}`}
          minzoom={minZoom}
        />
      </GeoJSONSource>
    </>

  )
}

import { Images, Image, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent'
import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { LatLng } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { colors } from '@/constants/colors'
import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'

interface LineBusStopMarkersProps {
  lineCode: string
}

export const LineBusStopMarkers = ({ lineCode }: LineBusStopMarkersProps) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))

  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const { query } = useLineBusStops(routeCode)

  const stops = useMemo(
    () => {
      const results = query.data?.map(stop => ({
        ...stop,
        coordinates: {
          longitude: stop.x_coord,
          latitude: stop.y_coord,
        } as LatLng,
      }))

      return results || []
    },
    [query.data],
  )

  const handlePress = (event: OnPressEvent) => {
    const feature = event.features.at(0)
    if (!feature) return

    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: feature.id,
      },
    })
  }

  const backgroundStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('onPrimary') || colors.primary,
    }),
    [getSchemeColorHex],
  )

  const borderStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      borderColor: getSchemeColorHex('outlineVariant'),
    }),
    [getSchemeColorHex],
  )

  return (
    <>
      <Images>
        <Image name={`bus-stop-${lineCode}`}>
          <View style={[styles.busStop, borderStyle, backgroundStyle]} />
        </Image>
      </Images>

      <ShapeSource
        id={`stop-markers-shape-source-${lineCode}`}
        shape={{
          type: 'FeatureCollection',
          features: stops.map(stop => ({
            type: 'Feature',
            id: stop.stop_code,
            properties: {
              stop,
            },
            geometry: {
              type: 'Point',
              coordinates: [stop.x_coord, stop.y_coord],
            },
          })),
        }}
        onPress={handlePress}
      >
        <SymbolLayer
          id="bus-stops-symbol-layer"
          style={{ iconImage: `bus-stop-${lineCode}` }}
          // belowLayerID={getAnnotationsLayerID('PointAnnotations')}
        />
      </ShapeSource>
    </>
  )
}

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)

const styles = StyleSheet.create({
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

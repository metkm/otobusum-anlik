import { PointAnnotation } from '@maplibre/maplibre-react-native'
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

  const handlePress = (event: GeoJSON.Feature) => {
    if (!event.properties) return

    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: event.properties.id,
      },
    })
  }

  const backgroundStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('primary') || colors.primary,
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
      {stops.map(stop => (
        <PointAnnotation
          key={stop.id}
          id={stop.stop_code.toString()}
          coordinate={[stop.x_coord, stop.y_coord]}
          onSelected={handlePress}

        >
          <View key={stop.stop_code} style={[styles.busStop, borderStyle, backgroundStyle]} />
        </PointAnnotation>
      ))}
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
    backgroundColor: 'red',
  },
})

import { getLineBusStopLocations } from '@/api/getLineBusStopLocations'
import { useFilters } from '@/stores/filters'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { useQuery } from '@tanstack/react-query'
import { useMap } from '@/hooks/useMap'
import { memo, useEffect } from 'react'

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Callout, LatLng, Marker } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'
import { UiText } from '../ui/UiText'
import { getRouteDirection } from '@/utils/getRouteDirection'

interface Props {
  code: string
}

export const LineBusStopMarkers = memo(function BusStopMarkersItem(props: Props) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))

  const map = useMap()
  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme)

  const query = useQuery({
    queryKey: [`${props.code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(props.code),
    staleTime: 60_000 * 30,
  })

  useEffect(() => {
    if (!query.data || query.data.length < 1) {
      return
    }

    const locs: LatLng[] = query.data?.map(stop => ({
      latitude: parseFloat(stop.yKoordinati),
      longitude: parseFloat(stop.xKoordinati),
    }))

    map.current?.fitToCoordinates(locs, {
      edgePadding: {
        top: 20,
        bottom: 200,
        left: 20,
        right: 20,
      },
    })
  }, [query.data, map])

  if (!query.data) {
    return null
  }

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const route = selectedRoute || `${props.code}_G_D0`
  const direction = route ? getRouteDirection(route) : undefined
  const busStops = direction ? query.data.filter(stop => stop.yon === direction) : query.data

  const backgroundColor = getSchemeColorHex('primary')

  const busStopStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('outlineVariant'),
  }

  return (
    <>
      {busStops.map(stop => (
        <Marker
          key={`${stop.xKoordinati}-${stop.yKoordinati}-${stop.yon}-${stop.siraNo}`}
          coordinate={{
            latitude: parseFloat(stop.yKoordinati),
            longitude: parseFloat(stop.xKoordinati),
          }}
          tracksInfoWindowChanges={false}
          tracksViewChanges={false}
        >
          <View style={[styles.busStop, busStopStyle, { backgroundColor }]} />

          <Callout tooltip>
            <View style={[styles.calloutContainer, calloutContainerBackground]}>
              <UiText style={{ textAlign: 'center' }}>
                {stop.durakKodu}
                {' '}
                -
                {stop.durakAdi}
              </UiText>
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  busStop: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 1000,
  },
  calloutContainer: {
    width: 250,
    padding: 8,
    borderRadius: 8,
  },
})

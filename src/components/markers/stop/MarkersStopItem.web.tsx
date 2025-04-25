import { AdvancedMarker, AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps'
import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { MarkersFiltersZoom } from '../filters/MarkersFiltersZoom'

import { BusStop } from '@/types/bus'

interface StopMarkersItemProps {
  lineCode: string
  stop: BusStop
}

export const MarkersStopItem = ({ lineCode, stop }: StopMarkersItemProps) => {
  const { schemeColor } = useTheme(lineCode)

  const handleOnPress = () => {
    if (!stop) return

    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: stop.stop_code,
      },
    })
  }

  const backgroundStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: schemeColor.onPrimary || schemeColor.primary,
    }),
    [schemeColor.onPrimary, schemeColor.primary],
  )

  const borderStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      borderColor: schemeColor.primary,
    }),
    [schemeColor.primary],
  )

  return (
    <MarkersFiltersZoom limit={12}>
      <AdvancedMarker
        position={{
          lng: stop.x_coord,
          lat: stop.y_coord,
        }}
        onClick={handleOnPress}
        anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      >
        <View style={[styles.busStop, borderStyle, backgroundStyle]} />
      </AdvancedMarker>
    </MarkersFiltersZoom>
  )
}

export const MarkersStopItemMemoized = memo(MarkersStopItem)

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

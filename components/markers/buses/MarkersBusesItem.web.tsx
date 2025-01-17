import Ionicons from '@react-native-vector-icons/ionicons'
import { AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { MarkersCallout } from '../callout/MarkersCallout.web'

import { MarkersBusesItemCallout } from './MarkersBusesItemCallout'

import { BusLocation } from '@/api/getLineBusLocations'
import { colors } from '@/constants/colors'
import { useLinesStore, getTheme } from '@/stores/lines'

interface MarkersBusesItemProps {
  location: BusLocation
  lineCode: string
}

export const MarkersBusesItem = ({ location, lineCode }: MarkersBusesItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  return (
    <MarkersCallout
      markerProps={{
        position: {
          lng: location.lng,
          lat: location.lat,
        },
        anchorPoint: AdvancedMarkerAnchorPoint.CENTER,
      }}
      calloutProps={{
        children: <MarkersBusesItemCallout busLocation={location} lineCode={lineCode} />,
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </MarkersCallout>
  )
}

export const MarkersBusesItemMemoized = memo(MarkersBusesItem)

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
  calloutContainer: {
    backgroundColor: colors.dark.surfaceContainer,
    padding: 8,
    width: 250,
    borderRadius: 8,
  },
})

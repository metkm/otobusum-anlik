import Ionicons from '@react-native-vector-icons/ionicons'
import { AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { MarkersCallout } from '../../callout/MarkersCallout.web'

import { MarkersLineBusesItemCallout } from './MarkersLineBusesItemCallout'

import { BusLocation } from '@/api/getLineBusLocations'

interface MarkersBusesItemProps {
  location: BusLocation
  lineCode: string
}

export const MarkerLinesBusesItem = ({ location, lineCode }: MarkersBusesItemProps) => {
  const { schemeColor } = useTheme(lineCode)

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
        children: <MarkersLineBusesItemCallout busLocation={location} lineCode={lineCode} />,
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: schemeColor.primaryContainer }]}>
        <Ionicons name="bus" color={schemeColor.onPrimaryContainer} />
      </View>
    </MarkersCallout>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
})

import { ViewAnnotation, type ViewAnnotationRef } from '@maplibre/maplibre-react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import { memo, useRef } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'

import { useTheme } from '@/hooks/useTheme'

import { MarkersCallout } from '../../callout/MarkersCallout'

// import { MarkersBusesItemCallout } from './MarkersLineBusesItemCallout'

import { BusLocation } from '@/api/getLineBusLocations'

const ANNOTATION_SIZE = 40

interface MarkersBusesItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  location: BusLocation
  lineCode: string
}

export const MarkersLineBusesItem = ({ location, lineCode }: MarkersBusesItemProps) => {
  const { schemeColor } = useTheme(lineCode)

  return (
    <ViewAnnotation lngLat={[location.lng, location.lat]}>
      <View style={[styles.iconContainer, { backgroundColor: schemeColor.primaryContainer }]}>
        <Ionicons name="bus" color={schemeColor.onPrimaryContainer} />
      </View>
    </ViewAnnotation>

  // <MarkersCallout
  //   calloutProps={{
  //     children: <MarkersBusesItemCallout busLocation={location} lineCode={lineCode} />,
  //   }}
  //   markerProps={{
  //     coordinate: {
  //       latitude: location.lat,
  //       longitude: location.lng,
  //     },
  //     tracksInfoWindowChanges: false,
  //     tracksViewChanges: false,
  //     anchor: { x: 0.5, y: 0.5 },
  //     zIndex: 2,
  //   }}
  // >
  //   <View style={[styles.iconContainer, { backgroundColor: schemeColor.primaryContainer }]}>
  //     <Ionicons name="bus" color={schemeColor.onPrimaryContainer} />
  //   </View>
  // </MarkersCallout>
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

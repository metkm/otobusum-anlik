import Ionicons from '@react-native-vector-icons/ionicons'
import { readAsStringAsync } from 'expo-file-system'
import { memo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'
import { captureRef } from 'react-native-view-shot'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { MarkersCallout } from '../callout/MarkersCallout'

import { MarkersBusesItemMemoized } from './MarkersBusesItem'
import { MarkersBusesItemCallout } from './MarkersBusesItemCallout'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface Props {
  lineCode: string
}

export const MarkersBuses = (props: Props) => {
  const [content, setContent] = useState('')

  const { query } = useLine(props.lineCode)
  const { schemeColor } = useTheme(props.lineCode)

  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))
  const locations = query.data?.filter(loc => loc.route_code === routeCode) || []

  const handleCapture = async (uri: string) => {
    let content = await readAsStringAsync(uri, { encoding: 'base64' })
    content = `data:image/png;base64,${content}`
    setContent(content)
  }

  return (
    <>
      {/* {locations.map(location => (
        <MarkersCallout
          key={`${location.bus_id}-${location.route_code}-${location.lat}-${location.lng}`}
          calloutProps={{
            children: <MarkersBusesItemCallout busLocation={location} lineCode={props.lineCode} />,
          }}
          markerProps={{
            coordinate: {
              latitude: location.lat,
              longitude: location.lng,
            },
            tracksInfoWindowChanges: false,
            tracksViewChanges: false,
            anchor: { x: 0.5, y: 0.5 },
            zIndex: 2,
            image: { uri: content, width: 14, height: 14 },
          }}
        />
      ))} */}

      <View
        ref={(ref) => {
          if (!ref) return
          captureRef(ref).then(handleCapture)
        }}
        style={styles.iconContainer}
      >
        <Ionicons
          name="bus"
          color={schemeColor.onPrimaryContainer}
          size={14}
          style={{
            padding: 4,
            height: 18,
            width: 18,
            backgroundColor: schemeColor.primaryContainer,
          }}
        />
      </View>
    </>
  )
}

export const MarkersBusesMemoized = memo(MarkersBuses)

const styles = StyleSheet.create({
  iconContainer: {
    width: 14,
    height: 14,
    position: 'absolute',
    padding: 14,
    overflow: 'hidden',

    // borderRadius: 999,
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 8,
    // width: 14,
    // height: 14,
    // backgroundColor: 'red',
  },
})

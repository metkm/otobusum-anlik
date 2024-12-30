import Ionicons from '@react-native-vector-icons/ionicons'
import { memo } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { MarkerLazyCallout } from '../MarkerLazyCallout'

import { BusLocation } from '@/api/getLineBusLocations'
import { colors } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface LineBusMarkersItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = ({ location, lineCode }: LineBusMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)
  const { query: { dataUpdatedAt } } = useLine(lineCode)

  const textColor = getSchemeColorHex('onPrimaryContainer')
  const backgroundColor = getSchemeColorHex('primaryContainer')

  const dynamicCalloutContainer: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
    fontWeight: 'bold',
  }

  return (
    <MarkerLazyCallout
      calloutProps={{
        children: (
          <View style={[styles.calloutContainer, dynamicCalloutContainer]}>
            {location.route_code && (
              <UiText style={textStyle}>
                {location.route_code}
              </UiText>
            )}

            <UiText style={textStyle}>
              {i18n.t('doorNo')}
              {': '}
              {location.bus_id}
            </UiText>
            <UiText style={textStyle}>
              {i18n.t('lastUpdate')}
              {': '}
              {new Date(dataUpdatedAt).toLocaleTimeString()}
            </UiText>
          </View>
        ),
      }}
      markerProps={{
        coordinate: {
          latitude: location.lat,
          longitude: location.lng,
        },
        tracksInfoWindowChanges: false,
        tracksViewChanges: false,
        anchor: { x: 0.5, y: 0.5 },
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View>
    </MarkerLazyCallout>
  )
}

export const LineBusMarkersItemMemoized = memo(LineBusMarkersItem)

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

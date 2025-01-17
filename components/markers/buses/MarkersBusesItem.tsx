import Ionicons from '@react-native-vector-icons/ionicons'
import { Callout, PointAnnotation } from '@rnmapbox/maps'
import { useState } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { MapMarkerProps } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { BusLocation } from '@/api/getLineBusLocations'
import { colors } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface LineBusMarkersItemProps extends Omit<MapMarkerProps, 'coordinate'> {
  bus: BusLocation
  lineCode: string
}

export const MarkersBusesItem = ({ bus, lineCode }: LineBusMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const [renderCallout, setRenderCallout] = useState(false)

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { query } = useLine(lineCode)

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
    <PointAnnotation
      id={`bus-marker-${bus.bus_id}`}
      coordinate={[bus.lng, bus.lat]}
      onSelected={() => setRenderCallout(true)}
      style={{ zIndex: 999 }}
    >
      <Ionicons
        name="bus"
        color={textColor}
        size={16}
        style={[styles.iconContainer, { backgroundColor }]}
      />

      {renderCallout
        ? (
            <Callout ref={call => call?._renderCustomCallout()} title="deneme callout">
              <View style={[styles.calloutContainer, dynamicCalloutContainer]}>
                {bus.route_code && (
                  <UiText style={textStyle}>
                    {bus.route_code}
                  </UiText>
                )}

                <UiText style={textStyle}>
                  {i18n.t('doorNo')}
                  {': '}
                  {bus.bus_id}
                </UiText>
                <UiText style={textStyle}>
                  {i18n.t('lastUpdate')}
                  {': '}
                  {new Date(query.dataUpdatedAt).toLocaleTimeString()}
                </UiText>
              </View>
            </Callout>
          )
        : <></>}
    </PointAnnotation>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 28,
    height: 28,
    backgroundColor: 'red',
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

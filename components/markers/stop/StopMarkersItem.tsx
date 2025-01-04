import { PointAnnotation } from '@rnmapbox/maps'
import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import { StyleProp, ViewStyle, TextStyle, View, StyleSheet } from 'react-native'
import { LatLng, MapMarkerProps, Marker } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { colors } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { BusStop } from '@/types/bus'

interface LineBusStopMarkersItemPropsBase extends Omit<MapMarkerProps, 'coordinate'> {
  lineCode?: string
  stop?: BusStop
  coordinate?: LatLng
  viewStyle?: ViewStyle
}

interface PointProps extends LineBusStopMarkersItemPropsBase {
  type: 'point'
  stop: BusStop
  label?: string
  coordinate?: LatLng
}

interface ClusterPoints extends LineBusStopMarkersItemPropsBase {
  type: 'cluster'
  stop?: BusStop
  label: string
  coordinate: LatLng
}

type LineBusStopMarkersItemProps = PointProps | ClusterPoints

export const LineBusStopMarkersItem = ({
  stop,
  lineCode,
  viewStyle,
  label,
  coordinate,
  type,
  ...props
}: LineBusStopMarkersItemProps) => {
  const lineTheme = useLinesStore(useShallow(() => lineCode ? getTheme(lineCode) : undefined))
  const { getSchemeColorHex } = useTheme(lineTheme)

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

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('primary'),
    }),
    [getSchemeColorHex],
  )

  const handleOnPress = () => {
    if (!stop) return

    router.navigate({
      pathname: '/(tabs)',
      params: {
        stopId: stop.stop_code,
      },
    })
  }

  // const coords: LatLng
  //   = type === 'cluster'
  //     ? coordinate
  //     : {
  //         latitude: stop?.y_coord,
  //         longitude: stop?.x_coord,
  //       }

  return (
  // <Marker
  //   coordinate={coords}
  //   tracksInfoWindowChanges={false}
  //   tracksViewChanges={false}
  //   onPress={handleOnPress}
  //   anchor={{ x: 0.5, y: 0.5 }}
  //   zIndex={1}
  //   {...props}
  // >
  //   <View style={[styles.busStop, borderStyle, backgroundStyle, viewStyle]}>
  //     {label && (
  //       <UiText style={textStyle} size="sm" info>
  //         {label}
  //       </UiText>
  //     )}
  //   </View>
  // </Marker>

    <PointAnnotation
      id={`${stop!.x_coord}, ${stop!.y_coord}`}
      coordinate={[stop!.x_coord, stop!.y_coord]}
    >
      <View style={[styles.busStop, borderStyle, backgroundStyle, viewStyle]}>
        {label && (
          <UiText style={textStyle} size="sm" info>
            {label}
          </UiText>
        )}
      </View>

      {/* <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name="bus" color={textColor} />
      </View> */}
    </PointAnnotation>
  )
}

export const LineBusStopMarkersItemMemoized = memo(LineBusStopMarkersItem)

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

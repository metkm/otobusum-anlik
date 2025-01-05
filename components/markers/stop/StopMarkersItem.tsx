import { PointAnnotation } from '@rnmapbox/maps'
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position'
import { router } from 'expo-router'
import { ComponentProps, memo, useMemo } from 'react'
import { StyleProp, ViewStyle, TextStyle, View, StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { colors } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { BusStop } from '@/types/bus'

type PointAnnotationProps = ComponentProps<typeof PointAnnotation>

interface LineBusStopMarkersItemPropsBase extends Omit<PointAnnotationProps, 'id' | 'coordinate' | 'children'> {
  lineCode?: string
  stop?: BusStop
  coordinate?: Position
  viewStyle?: ViewStyle
}

interface PointProps extends LineBusStopMarkersItemPropsBase {
  type: 'point'
  stop: BusStop
  label?: string
  coordinate?: Position
}

interface ClusterPoints extends LineBusStopMarkersItemPropsBase {
  type: 'cluster'
  stop?: BusStop
  label: string
  coordinate: Position
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

  if (!stop) {
    return null
  }

  return (
    <PointAnnotation
      id={`${stop.x_coord}, ${stop.y_coord}`}
      coordinate={[stop.x_coord, stop.y_coord]}
      onSelected={handleOnPress}
      {...props}
    >
      <View style={[styles.busStop, borderStyle, backgroundStyle, viewStyle]}>
        {label && (
          <UiText style={textStyle} size="sm" info>
            {label}
          </UiText>
        )}
      </View>
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

import Ionicons from '@react-native-vector-icons/ionicons'
import { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LatLng, Marker, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { MarkersInView } from './MarkersInView'

import { useFiltersStore } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'
import { radiansFromToLatLng } from '@/utils/angleFromCoordinate'

interface RouteLineProps {
  lineCode: string
}

export const RouteLine = ({ lineCode }: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { query, getRouteFromCode } = useRoutes(lineCode)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const route = getRouteFromCode()

  const transformed: LatLng[] = useMemo(
    () =>
      route?.route_path?.map(path => ({
        latitude: path.lat,
        longitude: path.lng,
      })) || [],
    [route],
  )

  const arrows = useMemo(() => {
    const chunkSize = transformed.length / (transformed.length / 8)
    const arrows: { coordinates: LatLng, angle: number }[] = []

    for (let index = 0; index < transformed.length; index += chunkSize) {
      const chunk = transformed.slice(index, index + chunkSize)
      const first = chunk.at(0)

      if (!first) continue

      let totalX = 0
      let totalY = 0

      for (let index = 1; index < chunk.length; index++) {
        const chunkItem = chunk[index]
        if (!chunkItem) continue

        const [x, y] = radiansFromToLatLng(first, chunkItem)

        totalX += x
        totalY += y
      }

      const result = Math.atan2(totalY, totalX)
      let degrees = (result * 180 / Math.PI + 360) % 360

      // not sure why we need this
      if (selectedCity === 'istanbul') {
        degrees = 360 - degrees
      }

      arrows.push({
        coordinates: first,
        angle: degrees,
      })
    }

    return arrows
  }, [transformed, selectedCity])

  if (query.isPending || !route) return

  const arrowBackground: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 14,
    height: 14,
  }

  return (
    <>
      <Polyline
        coordinates={transformed}
        strokeWidth={6}
        strokeColor={getSchemeColorHex('primary')}
      />

      <MarkersInView
        zoomLimit={14}
        data={arrows}
        renderItem={item => (
          <Marker
            key={`${item.coordinates.latitude}-${item.coordinates.longitude}-${route.route_code}`}
            coordinate={item.coordinates}
            tracksViewChanges={false}
            tracksInfoWindowChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={1}
          >
            <View style={arrowBackground}>
              <Ionicons
                name="arrow-up"
                size={10}
                style={{
                  transform: [
                    {
                      rotate: `${item.angle}deg`,
                    },
                  ],
                }}
              />
            </View>
          </Marker>
        )}
      />
    </>
  )
}

import { useMemo } from 'react'
import { LatLng } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'

import { MarkersLineArrows } from './arrows/MarkersLineArrows'
import { MarkersLinePolyline } from './polyline/MarkersLinePolyline'

import { useFiltersStore } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'
import { radiansFromToLatLng } from '@/utils/angleFromCoordinate'

interface RouteLineProps {
  lineCode: string
}

const ARROW_STEP = 16

export const MarkersLineRouteLine = ({ lineCode }: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { query, getRouteFromCode } = useRoutes(lineCode)

  const route = getRouteFromCode()

  const coordinates: LatLng[] = useMemo(
    () =>
      route?.route_path?.map(path => ({
        latitude: path.lat,
        longitude: path.lng,
      })) || [],
    [route],
  )

  const arrows = useMemo(() => {
    const arrowCoordinates: { coordinates: LatLng, angle: number }[] = []

    for (let index = 0; index < coordinates.length; index += ARROW_STEP) {
      const from = coordinates.at(index)
      const to = coordinates.at(index + ARROW_STEP)

      if (!from || !to) continue

      const [x, y] = radiansFromToLatLng(from, to)
      let brng = Math.atan2(y, x)

      if (selectedCity === 'istanbul') {
        brng = (2 * Math.PI) - brng
      }

      const arrowCoordinate = coordinates.at(index)
      if (!arrowCoordinate) continue

      arrowCoordinates.push({
        angle: brng,
        coordinates: arrowCoordinate,
      })
    }

    return arrowCoordinates
  }, [coordinates, selectedCity])

  if (query.isPending || !route) return

  return (
    <>
      <MarkersLinePolyline
        lineCode={lineCode}
      />

      <MarkersLineArrows
        arrows={arrows}
        lineTheme={lineTheme}
      />
    </>
  )
}

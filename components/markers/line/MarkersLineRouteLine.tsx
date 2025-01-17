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

export const MarkersLineRouteLine = ({ lineCode }: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { query, getRouteFromCode } = useRoutes(lineCode)

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
    const chunkSize = transformed.length / (transformed.length / 20)
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

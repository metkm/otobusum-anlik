import { ShapeSource, LineLayer } from '@rnmapbox/maps'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { useFiltersStore } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'

interface RouteLineProps {
  lineCode: string
}

export const MarkersLineRouteLine = ({ lineCode }: RouteLineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

  useFiltersStore(useShallow(state => state.selectedCity))

  const { query, getRouteFromCode } = useRoutes(lineCode)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const route = getRouteFromCode()

  const transformed: any[] = useMemo(
    () => route?.route_path?.map(path => [path.lng, path.lat]) || [],
    [route],
  )

  if (query.isPending || !route) return

  return (
    <ShapeSource
      id={`line-shape-source-${lineCode}`}
      shape={{
        type: 'LineString',
        coordinates: transformed,
      }}
    >
      <LineLayer
        id={`line-layer-${lineCode}`}
        style={{
          lineColor: getSchemeColorHex('primary'),
          lineWidth: 3,
        }}
        layerIndex={50}
      />
    </ShapeSource>
  )
}

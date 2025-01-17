import { useMemo } from 'react'
import { LatLng, Polyline } from 'react-native-maps'
import { useShallow } from 'zustand/react/shallow'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { useLinesStore, getTheme } from '@/stores/lines'

interface PolylineProps {
  lineCode: string
}

export const MarkersLinePolyline = ({ lineCode }: PolylineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const { getRouteFromCode } = useRoutes(lineCode)
  const route = getRouteFromCode()

  const transformed: LatLng[] = useMemo(
    () =>
      route?.route_path?.map(path => ({
        latitude: path.lat,
        longitude: path.lng,
      })) || [],
    [route],
  )

  return (
    <Polyline
      coordinates={transformed}
      strokeWidth={6}
      strokeColor={getSchemeColorHex('primary')}
    />
  )
}

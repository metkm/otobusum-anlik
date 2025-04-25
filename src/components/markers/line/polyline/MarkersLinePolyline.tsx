import { useMemo } from 'react'
import { LatLng, Polyline } from 'react-native-maps'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

interface PolylineProps {
  lineCode: string
}

export const MarkersLinePolyline = ({ lineCode }: PolylineProps) => {
  const { schemeColor } = useTheme(lineCode)

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
      strokeColor={schemeColor.primary}
    />
  )
}

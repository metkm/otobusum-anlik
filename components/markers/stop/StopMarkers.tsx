import { memo, useMemo } from 'react'
import { LatLng } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useRoutes } from '@/hooks/queries/useRoutes'

import { MarkersInView } from '../MarkersInView'

import { LineBusStopMarkersItemMemoized } from './StopMarkersItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'

interface Props {
  lineCode: string
}

export const LineBusStopMarkers = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))

  const { getRouteFromCode } = useRoutes(props.lineCode)
  const { query } = useLineBusStops(routeCode)

  const route = getRouteFromCode()

  const stops = useMemo(
    () => {
      const results = query.data?.map(stop => ({
        ...stop,
        coordinates: {
          longitude: stop.x_coord,
          latitude: stop.y_coord,
        } as LatLng,
      }))

      return results || []
    },
    [query.data],
  )

  return (
    <>
      {stops.map(stop => (
        <LineBusStopMarkersItemMemoized
          key={`${stop.x_coord}-${stop.y_coord}-${props.lineCode}-${stop.stop_code}`}
          type="point"
          stop={stop}
          lineCode={props.lineCode}
        />
      ))}
    </>
  )

  // return (
  //   <MarkersInView
  //     zoomLimit={route?.route_path ? 13 : 0}
  //     data={stops}
  //     renderItem={item => (
  //       <LineBusStopMarkersItemMemoized
  //         type="point"
  //         key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
  //         stop={item}
  //         lineCode={props.lineCode}
  //       />
  //     )}
  //   />
  // )
}

export const LineBusStopMarkersMemoized = memo(LineBusStopMarkers)

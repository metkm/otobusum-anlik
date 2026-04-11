import { useMemo } from 'react'
import { Platform } from 'react-native'
import { LatLng } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { MarkersFiltersInView } from '../../filters/MarkersFiltersInView'
import { MarkersFiltersZoomMemoized } from '../../filters/MarkersFiltersZoom'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { MarkersLineStopsItem } from './MarkersLineStopsItem'

interface Props {
  lineCode: string
}

export const MarkersLineStops = (props: Props) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))
  const { query } = useLineBusStops(routeCode)

  const stops = useMemo(() => {
    const results = query.data?.map(stop => ({
      ...stop,
      coordinates: {
        longitude: stop.x_coord,
        latitude: stop.y_coord,
      } as LatLng,
    }))

    return results || []
  }, [query.data])

  if (Platform.OS === 'web') {
    return (
      <>
        {stops.map(item => (
          <MarkersLineStopsItem
            type="point"
            key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
            stop={item}
            lineCode={props.lineCode}
          />
        ))}
      </>
    )
  }

  return (
    <MarkersFiltersInView
      data={stops}
      renderItem={item => (
        <MarkersFiltersZoomMemoized
          key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
          limit={13}
        >
          <MarkersLineStopsItem type="point" stop={item} lineCode={props.lineCode} />
        </MarkersFiltersZoomMemoized>
      )}
    >
    </MarkersFiltersInView>
  )
}

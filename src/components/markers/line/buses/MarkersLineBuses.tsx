import { Layer, ViewAnnotation } from '@maplibre/maplibre-react-native'
import { memo } from 'react'
import { View, Image } from 'react-native'

import { useLine } from '@/hooks/queries/useLine'

// import { MarkersBusesItemMemoized } from './MarkersBusesItem'

import { MarkersLineBusesItem } from './MarkersLineBusesItem'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface MarkersBussedProps {
  lineCode: string
}

export const MarkersLineBuses = ({ lineCode }: MarkersBussedProps) => {
  const { query } = useLine(lineCode)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))

  const filtered = query.data?.filter(loc => loc.route_code === routeCode) || []

  return (
    <>
      {filtered?.map(loc => (
        // <ViewAnnotation lngLat={[loc.lat, loc.lng]} key={loc.bus_id}>
        //   <View>
        //     <Image
        //       source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        //       style={{ width: 32, height: 32 }}
        //       onLoad={() => viewAnnotationRef.current?.refresh()}
        //       fadeDuration={0}
        //     />
        //   </View>
        // </ViewAnnotation>

        <MarkersLineBusesItem
          key={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
          location={loc}
          lineCode={lineCode}
        />
      ))}
    </>
  )
}

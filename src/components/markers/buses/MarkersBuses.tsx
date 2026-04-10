import { ViewAnnotation } from '@maplibre/maplibre-react-native'
import { memo } from 'react'
import { View, Image } from 'react-native'

import { useLine } from '@/hooks/queries/useLine'

// import { MarkersBusesItemMemoized } from './MarkersBusesItem'

import { MarkersBusesItemMemoized } from './MarkersBusesItem'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface Props {
  code: string
}

export const MarkersBuses = (props: Props) => {
  const { query } = useLine(props.code)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))

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

        <MarkersBusesItemMemoized
          key={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
          location={loc}
          lineCode={props.code}
        />
      ))}
    </>
  )
}

export const MarkersBusesMemoized = memo(MarkersBuses)

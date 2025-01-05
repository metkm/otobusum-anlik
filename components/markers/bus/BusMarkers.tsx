import { useLine } from '@/hooks/queries/useLine'

import { LineBusMarkersItemMemoized } from './BusMarkersItem'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface Props {
  code: string
}

export const LineBusMarkers = (props: Props) => {
  const { query } = useLine(props.code)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))

  const busses = query.data?.filter(loc => loc.route_code === routeCode) || []

  return (
    <>
      {busses.map(bus => (
        <LineBusMarkersItemMemoized
          key={`${bus.bus_id}-${bus.route_code}-${bus.lat}-${bus.lng}`}
          bus={bus}
          lineCode={props.code}
        />
      ))}
    </>
  )
}

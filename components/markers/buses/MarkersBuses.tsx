import { memo } from 'react'

import { useLine } from '@/hooks/queries/useLine'

import { MarkersBusesItem } from './MarkersBusesItem'

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
        <MarkersBusesItem
          key={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
          bus={loc}
          lineCode={props.code}
        />
      ))}
    </>
  )
}

export const MarkersBusesMemoized = memo(MarkersBuses)

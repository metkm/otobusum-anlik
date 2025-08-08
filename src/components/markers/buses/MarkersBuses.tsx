import { PointAnnotation, MarkerView } from '@maplibre/maplibre-react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { MarkersBusesItemMemoized } from './MarkersBusesItem'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface Props {
  lineCode: string
}

export const MarkersBuses = (props: Props) => {
  const { query } = useLine(props.lineCode)
  const { schemeColor } = useTheme(props.lineCode)

  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))

  const filtered = query.data?.filter(loc => loc.route_code === routeCode) || []

  return (
    <>
      {filtered?.map(loc => (
        <MarkerView
          key={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
          id={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
          coordinate={[loc.lng, loc.lat]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="bus"
              color={schemeColor.onPrimaryContainer}
              size={14}
              style={[styles.iconContainer, { backgroundColor: schemeColor.primaryContainer }]}
            />
          </View>
        </MarkerView>

        // <MarkersBusesItemMemoized
        //   key={`${loc.bus_id}-${loc.route_code}-${loc.lat}-${loc.lng}`}
        //   location={loc}
        //   lineCode={props.code}
        // />
      ))}
    </>
  )
}

export const MarkersBusesMemoized = memo(MarkersBuses)

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
})

import { PointAnnotation, MarkerView, ShapeSource, SymbolLayer, Images } from '@maplibre/maplibre-react-native'
import { memo, useMemo } from 'react'
import { Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { LatLng } from 'react-native-maps'

import { UiText } from '@/components/ui/UiText'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { MarkersFiltersInView } from '../filters/MarkersFiltersInView'
import { MarkersFiltersZoomMemoized } from '../filters/MarkersFiltersZoom'

import { MarkersStopItemMemoized } from './MarkersStopItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { useMiscStore } from '@/stores/misc'

interface Props {
  lineCode: string
}

export const MarkersStop = (props: Props) => {
  const { schemeColor } = useTheme(props.lineCode)
  const invisibleLines = useMiscStore(state => state.invisibleLines)

  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.lineCode))
  const { query } = useLineBusStops(routeCode)

  const stopStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: schemeColor.primary,
      borderColor: schemeColor.primaryContainer,
    }),
    [schemeColor],
  )

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: schemeColor.onPrimary,
      lineHeight: 10,
    }),
    [schemeColor],
  )

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
          <MarkersStopItemMemoized
            type="point"
            key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
            stop={item}
            lineCode={props.lineCode}
          />
        ))}
      </>
    )
  }

  const features = invisibleLines.includes(props.lineCode)
    ? []
    : stops.map(stop => ({
      type: 'Feature',
      id: stop.stop_code,
      geometry: {
        type: 'Point',
        coordinates: [stop.coordinates.longitude, stop.coordinates.latitude],
      },
      properties: {},
    })) satisfies GeoJSON.FeatureCollection['features']

  return (
    <ShapeSource
      id="shape-source"
      key={props.lineCode}
      shape={{
        type: 'FeatureCollection',
        features,
      }}
    >
      <SymbolLayer
        id="stop-symbol-layer"
        style={{
          iconImage: require('@/assets/bus.png'),
          iconAllowOverlap: true,
        }}
      />
    </ShapeSource>
  )

  // return (
  //   <>
  //     {stops.map(stop => (
  //       <MarkerView
  //         id={`${stop.x_coord}-${stop.y_coord}-${props.lineCode}-${stop.stop_code}`}
  //         key={`${stop.x_coord}-${stop.y_coord}-${props.lineCode}-${stop.stop_code}`}
  //         coordinate={[stop.coordinates.longitude, stop.coordinates.latitude]}
  //       >
  //         <View style={[styles.busStop, stopStyle]} />
  //       </MarkerView>
  //     ))}
  //   </>
  // )

  // return (
  //   <>
  //     {stops.map(item => (
  //       <MarkersStopItemMemoized
  //         key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
  //         type="point"
  //         stop={item}
  //         lineCode={props.lineCode}
  //       />
  //     ))}
  //   </>

  // <MarkersFiltersInView
  //   data={stops}
  //   renderItem={item => (
  //     <MarkersStopItemMemoized
  //       key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
  //       type="point"
  //       stop={item}
  //       lineCode={props.lineCode}
  //     />
  //   )}
  // >
  // </MarkersFiltersInView>
}

export const MarkersStopMemoized = memo(MarkersStop)

const styles = StyleSheet.create({
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

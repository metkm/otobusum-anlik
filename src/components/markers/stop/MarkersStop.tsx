import { readAsStringAsync } from 'expo-file-system/legacy'
import { memo, useMemo, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { LatLng, Marker } from 'react-native-maps'
import { captureRef } from 'react-native-view-shot'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { MarkersStopItemMemoized } from './MarkersStopItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { useMiscStore } from '@/stores/misc'

interface Props {
  lineCode: string
}

export const MarkersStop = (props: Props) => {
  const [content, setContent] = useState('')
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

  const stops = useMemo(() => {
    const results = query.data?.map(stop => ({
      ...stop,
      coordinates: {
        longitude: stop.x_coord,
        latitude: stop.y_coord,
      } satisfies LatLng,
    }))

    return results || []
  }, [query.data])

  if (Platform.OS === 'web') {
    return (
      <>
        {stops.map(item => (
          <MarkersStopItemMemoized
            key={`${item.x_coord}-${item.y_coord}-${props.lineCode}-${item.stop_code}`}
            stop={item}
            lineCode={props.lineCode}
          />
        ))}
      </>
    )
  }

  const handleCapture = async (uri: string) => {
    let content = await readAsStringAsync(uri, { encoding: 'base64' })
    content = `data:image/png;base64,${content}`
    setContent(content)
  }

  return (
    <>
      {
        !invisibleLines.includes(props.lineCode)
          ? content
            ? stops.map(stop => (
                <Marker
                  key={stop.stop_code}
                  coordinate={stop.coordinates}
                  image={{ uri: content, width: 14, height: 14 }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  tracksViewChanges={false}
                  tracksInfoWindowChanges={false}
                />
              ))
            : undefined
          : undefined
      }

      <View
        ref={(ref) => {
          if (!ref) return
          captureRef(ref).then(handleCapture)
        }}
        style={[styles.busStop, stopStyle]}
      />
    </>
  )
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

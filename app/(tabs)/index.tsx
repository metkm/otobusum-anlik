import { MapState } from '@rnmapbox/maps'
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { LinesMomoizedFr } from '@/components/lines/Lines'
import { TheMap, TheMapRef } from '@/components/map/Map'
import { MarkersLine } from '@/components/markers/line/MarkersLine'
import { TheMapButtons } from '@/components/TheMapButtons'
import { TheStopInfo } from '@/components/TheStopInfo'

import { getNECoordinates, getSWCoordinates, MapContext } from '@/hooks/contexts/useMap'
import { SheetContext, sheetContextValues } from '@/hooks/contexts/useSheetModal'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const camera = useRef<CameraRef>(null)

  useEffect(() => {
    const unsub = useLinesStore.subscribe(
      state => state.lines,
      async (state, prevState) => {
        const city = useFiltersStore.getState().selectedCity
        const newStateCity = state[city]
        const oldStateCity = prevState[city]
        if (newStateCity.length < oldStateCity.length) return

        const newCode = newStateCity.at(-1)
        if (!newCode) return

        const routeCode = getSelectedRouteCode(newCode)
        const queryKey = [`stop-locations`, routeCode]

        const busStops = await queryClient.ensureQueryData<
          Awaited<ReturnType<typeof getLineBusStops>>
        >({
          queryKey,
          queryFn: () => getLineBusStops(routeCode),
        })

        const coords = busStops.map(stop => ([stop.x_coord, stop.y_coord])) as [number, number][]
        const ne = getNECoordinates(coords)
        const sw = getSWCoordinates(coords)

        camera.current?.fitBounds(ne, sw, [250, 20], 500)
      },
    )

    return unsub
  }, [])

  const sheetContext: sheetContextValues = {
    height: useSharedValue(0),
    index: useSharedValue(-1),
  }

  const handleOnMapLoaded = () => {
    SplashScreen.hideAsync()
  }

  const handleMapIdle = (state: MapState) => {
    useSettingsStore.setState(() => ({ mapState: state }))
  }

  return (
    <View style={styles.container}>
      <MapContext.Provider value={{ camera }}>
        <SheetContext.Provider value={sheetContext}>
          <TheMap
            cameraRef={camera}
            onMapIdle={handleMapIdle}
            onDidFinishLoadingMap={handleOnMapLoaded}
            deselectAnnotationOnTap
          >
            <MarkersLine />
          </TheMap>

          <TheMapButtons />

          <View style={styles.linesContainer}>
            <LinesMomoizedFr />
          </View>

          <TheStopInfo cRef={camera} />
        </SheetContext.Provider>
      </MapContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default HomeScreen
